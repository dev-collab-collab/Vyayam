"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProfileCreatePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [gender, setGender] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [agePickerOpen, setAgePickerOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setEmail(data.user?.email || "");
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setFetchingUser(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (heightUnit === "cm" && heightCm) {
      const cm = parseFloat(heightCm);
      if (!isNaN(cm)) {
        const totalInches = cm / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        setHeightFeet(feet.toString());
        setHeightInches(inches.toString());
      }
    } else if (heightUnit === "ft" && (heightFeet || heightInches)) {
      const feet = parseFloat(heightFeet) || 0;
      const inches = parseFloat(heightInches) || 0;
      const totalCm = Math.round((feet * 12 + inches) * 2.54);
      setHeightCm(totalCm.toString());
    }
  }, [heightUnit, heightCm, heightFeet, heightInches]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!nickname.trim()) errors.nickname = "Nickname is required";
    if (!email.trim()) errors.email = "Email is required";
    if (!age || parseInt(age) < 15 || parseInt(age) > 65) {
      errors.age = "Age must be between 15 and 65";
    }

    const cmValue = parseFloat(heightCm);
    if (!heightCm || cmValue < 100 || cmValue > 250) {
      errors.height = "Height must be between 100 and 250 cm";
    }

    const wtInput = parseFloat(weight);
    const wtKg = weightUnit === "kg" ? wtInput : wtInput * 0.45359237;
    if (!weight || isNaN(wtInput) || wtKg < 30 || wtKg > 300) {
      errors.weight =
        weightUnit === "kg"
          ? "Weight must be between 30 and 300 kg"
          : "Weight must be between 66 and 660 lbs";
    }

    if (!gender) errors.gender = "Gender is required";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: nickname.trim(),
          email: email.trim(),
          age: parseInt(age),
          heightCm: parseFloat(heightCm),
          weightKg:
            weightUnit === "kg"
              ? parseFloat(weight)
              : parseFloat(weight) * 0.45359237,
          gender,
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create profile. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  const isFormValid =
    nickname.trim() &&
    email.trim() &&
    age &&
    heightCm &&
    weight &&
    gender;

  if (fetchingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FBFD]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#6E8BA5] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6B7C8F] text-base font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FBFD]">
      <div className="bg-[#F9FBFD] border-b border-[#E6ECF2]">
        <div className="mx-auto max-w-md px-6 py-6">
          <div className="flex justify-center">
            <Image
              src="/logos/vyayam_rest_of_the_app.png"
              alt="Vyayam"
              width={100}
              height={33}
              priority
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-md px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-[22px] font-semibold text-[#1F2A33] leading-7">Create your profile</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <form id="profileForm" onSubmit={onSubmit} className="space-y-5 pb-32">
          <div>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your nickname"
              className="w-full rounded-xl border border-[#E6ECF2] px-4 py-3 text-base bg-white text-[#1F2A33] placeholder:text-[#9AAEC1] focus:border-[#6E8BA5] focus:outline-none focus:ring-2 focus:ring-[#6E8BA5]/20 transition-all"
              required
            />
            {fieldErrors.nickname && (
              <p className="mt-2 text-xs text-red-600 font-medium">{fieldErrors.nickname}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              value={email}
              readOnly
              placeholder="Your email"
              className="w-full rounded-xl border border-[#E6ECF2] px-4 py-3 text-base bg-[#F9FBFD] text-[#6B7C8F] cursor-not-allowed"
            />
            {fieldErrors.email && (
              <p className="mt-2 text-xs text-red-600 font-medium">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            {!agePickerOpen ? (
              <div
                onClick={() => setAgePickerOpen(true)}
                className="w-full rounded-xl border border-[#E6ECF2] px-4 py-3 text-base bg-white text-[#1F2A33] cursor-pointer hover:border-[#6E8BA5] transition-all flex items-center justify-between"
              >
                <span className={age ? "font-medium" : "text-[#9AAEC1]"}>
                  {age ? `${age} years` : "Select your age"}
                </span>
                <svg className="w-5 h-5 text-[#6B7C8F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            ) : (
              <div className="space-y-3">
                <div 
                  className="relative h-40 overflow-hidden rounded-xl border border-[#E6ECF2] bg-white"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(249,251,253,0.9) 0%, transparent 20%, transparent 80%, rgba(249,251,253,0.9) 100%)'
                  }}
                >
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 border-y-2 border-[#6E8BA5]/20 pointer-events-none z-10"></div>
                  <div 
                    className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    onScroll={(e) => {
                      const scrollTop = e.currentTarget.scrollTop;
                      const itemHeight = 48;
                      const selectedIndex = Math.round(scrollTop / itemHeight);
                      const newAge = 15 + selectedIndex;
                      if (newAge >= 15 && newAge <= 65) {
                        setAge(newAge.toString());
                      }
                    }}
                  >
                    <div className="py-[88px]">
                      {Array.from({ length: 51 }, (_, i) => 15 + i).map((num) => (
                        <div
                          key={num}
                          className="h-12 flex items-center justify-center snap-start cursor-pointer"
                          onClick={() => {
                            setAge(num.toString());
                            setAgePickerOpen(false);
                          }}
                          id={`age-${num}`}
                        >
                          <span 
                            className={`text-xl font-medium transition-all ${
                              parseInt(age) === num 
                                ? 'text-[#1F2A33] scale-110 font-semibold' 
                                : 'text-[#9AAEC1]'
                            }`}
                          >
                            {num}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAgePickerOpen(false)}
                  className="w-full py-2 text-sm font-medium text-[#6E8BA5] hover:text-[#5d7690] transition-colors"
                >
                  Done
                </button>
              </div>
            )}
            {fieldErrors.age && (
              <p className="mt-2 text-xs text-red-600 font-medium">{fieldErrors.age}</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                {heightUnit === "cm" ? (
                  <input
                    type="number"
                    id="heightCm"
                    name="heightCm"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="Height (cm)"
                    min="100"
                    max="250"
                    step="0.1"
                    className="w-full rounded-xl border border-[#E6ECF2] px-4 py-3 text-base bg-white text-[#1F2A33] placeholder:text-[#9AAEC1] focus:border-[#6E8BA5] focus:outline-none focus:ring-2 focus:ring-[#6E8BA5]/20 transition-all"
                    required
                  />
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      id="heightFeet"
                      name="heightFeet"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(e.target.value)}
                      placeholder="Height (feet)"
                      min="3"
                      max="8"
                      className="w-1/2 rounded-xl border border-[#E6ECF2] px-4 py-3 text-base bg-white text-[#1F2A33] placeholder:text-[#9AAEC1] focus:border-[#6E8BA5] focus:outline-none focus:ring-2 focus:ring-[#6E8BA5]/20 transition-all"
                      required
                    />
                    <input
                      type="number"
                      id="heightInches"
                      name="heightInches"
                      value={heightInches}
                      onChange={(e) => setHeightInches(e.target.value)}
                      placeholder="Inches"
                      min="0"
                      max="11"
                      className="w-1/2 rounded-xl border border-[#E6ECF2] px-4 py-3 text-base bg-white text-[#1F2A33] placeholder:text-[#9AAEC1] focus:border-[#6E8BA5] focus:outline-none focus:ring-2 focus:ring-[#6E8BA5]/20 transition-all"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-sm font-medium transition-colors ${heightUnit === "cm" ? "text-[#1F2A33]" : "text-[#9AAEC1]"}`}>
                  cm
                </span>
                <button
                  type="button"
                  onClick={() => setHeightUnit(heightUnit === "cm" ? "ft" : "cm")}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    heightUnit === "ft" ? "bg-[#6E8BA5]" : "bg-[#E6ECF2]"
                  }`}
                  role="switch"
                  aria-checked={heightUnit === "ft"}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                      heightUnit === "ft" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium transition-colors ${heightUnit === "ft" ? "text-[#1F2A33]" : "text-[#9AAEC1]"}`}>
                  ft/in
                </span>
              </div>
            </div>
            {fieldErrors.height && (
              <p className="mt-2 text-xs text-red-600 font-medium">{fieldErrors.height}</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1">
                {weightUnit === "kg" ? (
                  <input
                    type="number"
                    id="weightKg"
                    name="weightKg"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Weight (kg)"
                    min="30"
                    max="300"
                    step="0.1"
                    className="w-full rounded-xl border border-[#E6ECF2] px-4 py-3 text-base bg-white text-[#1F2A33] placeholder:text-[#9AAEC1] focus:border-[#6E8BA5] focus:outline-none focus:ring-2 focus:ring-[#6E8BA5]/20 transition-all"
                    required
                  />
                ) : (
                  <input
                    type="number"
                    id="weightLbs"
                    name="weightLbs"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Weight (lbs)"
                    min="66"
                    max="660"
                    step="0.1"
                    className="w-full rounded-xl border border-[#E6ECF2] px-4 py-3 text-base bg-white text-[#1F2A33] placeholder:text-[#9AAEC1] focus:border-[#6E8BA5] focus:outline-none focus:ring-2 focus:ring-[#6E8BA5]/20 transition-all"
                    required
                  />
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-sm font-medium transition-colors ${weightUnit === "kg" ? "text-[#1F2A33]" : "text-[#9AAEC1]"}`}>
                  kg
                </span>
                <button
                  type="button"
                  onClick={() => setWeightUnit(weightUnit === "kg" ? "lbs" : "kg")}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    weightUnit === "lbs" ? "bg-[#6E8BA5]" : "bg-[#E6ECF2]"
                  }`}
                  role="switch"
                  aria-checked={weightUnit === "lbs"}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                      weightUnit === "lbs" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium transition-colors ${weightUnit === "lbs" ? "text-[#1F2A33]" : "text-[#9AAEC1]"}`}>
                  lbs
                </span>
              </div>
            </div>
            {fieldErrors.weight && (
              <p className="mt-2 text-xs text-red-600 font-medium">{fieldErrors.weight}</p>
            )}
          </div>

          <div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setGender("MALE")}
                className={`flex-1 rounded-xl px-4 py-3 text-base font-medium transition-all ${
                  gender === "MALE"
                    ? "bg-[#6E8BA5] text-white shadow-md"
                    : "bg-white text-[#6B7C8F] border border-[#E6ECF2] hover:border-[#6E8BA5]"
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender("FEMALE")}
                className={`flex-1 rounded-xl px-4 py-3 text-base font-medium transition-all ${
                  gender === "FEMALE"
                    ? "bg-[#6E8BA5] text-white shadow-md"
                    : "bg-white text-[#6B7C8F] border border-[#E6ECF2] hover:border-[#6E8BA5]"
                }`}
              >
                Female
              </button>
            </div>
            {fieldErrors.gender && (
              <p className="mt-2 text-xs text-red-600 font-medium">{fieldErrors.gender}</p>
            )}
          </div>
        </form>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-[#E6ECF2]">
        <div className="mx-auto max-w-md px-6 py-4">
          <button
            type="submit"
            form="profileForm"
            className={`w-full rounded-xl py-4 text-base font-semibold transition-all ${
              isFormValid && !loading
                ? "bg-[#6E8BA5] text-white hover:bg-[#5d7690] shadow-md"
                : "bg-[#D8E1EA] text-[#9AAEC1] cursor-not-allowed"
            }`}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating profile...
              </span>
            ) : (
              "Create profile"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
