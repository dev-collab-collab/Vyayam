"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import FormField from "@/components/FormField";
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
  const [gender, setGender] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);

  // Fetch authenticated user's email
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

  // Convert height between units
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
    } else if (heightUnit === "ft" && heightFeet) {
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
    if (!age || parseInt(age) < 16 || parseInt(age) > 90) {
      errors.age = "Age must be between 16 and 90";
    }
    
    const cmValue = parseFloat(heightCm);
    if (!heightCm || cmValue < 100 || cmValue > 250) {
      errors.height = "Height must be between 100 and 250 cm";
    }

    const wtValue = parseFloat(weight);
    if (!weight || wtValue < 30 || wtValue > 300) {
      errors.weight = "Weight must be between 30 and 300 kg";
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
          weightKg: parseFloat(weight),
          gender: gender,
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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-md">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Image
            src="/logos/vyayam_rest_of_the_app.png"
            alt="Vyayam"
            width={120}
            height={40}
            priority
          />
        </div>

        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Create your profile</h1>
          <p className="mt-2 text-slate-600">This helps us personalize your experience.</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
          {/* Nickname */}
          <div>
            <FormField
              label="Nickname *"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your nickname"
              required
            />
            {fieldErrors.nickname && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.nickname}</p>
            )}
          </div>

          {/* Email (read-only) */}
          <div>
            <FormField
              label="Email *"
              type="email"
              value={email}
              readOnly
              className="bg-slate-50"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          {/* Age */}
          <div>
            <FormField
              label="Age *"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Years"
              min="16"
              max="90"
              required
            />
            {fieldErrors.age && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.age}</p>
            )}
          </div>

          {/* Height with unit toggle */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Height *
            </label>
            <div className="mb-2 flex gap-2">
              <button
                type="button"
                onClick={() => setHeightUnit("cm")}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                  heightUnit === "cm"
                    ? "bg-blue-700 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                cm
              </button>
              <button
                type="button"
                onClick={() => setHeightUnit("ft")}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                  heightUnit === "ft"
                    ? "bg-blue-700 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                ft/in
              </button>
            </div>

            {heightUnit === "cm" ? (
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="cm"
                min="100"
                max="250"
                step="0.1"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none"
                required
              />
            ) : (
              <div className="flex gap-2">
                <input
                  type="number"
                  value={heightFeet}
                  onChange={(e) => setHeightFeet(e.target.value)}
                  placeholder="Feet"
                  min="3"
                  max="8"
                  className="w-1/2 rounded-lg border border-slate-300 px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none"
                  required
                />
                <input
                  type="number"
                  value={heightInches}
                  onChange={(e) => setHeightInches(e.target.value)}
                  placeholder="Inches"
                  min="0"
                  max="11"
                  className="w-1/2 rounded-lg border border-slate-300 px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}
            {fieldErrors.height && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.height}</p>
            )}
          </div>

          {/* Weight */}
          <div>
            <FormField
              label="Weight *"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="kg"
              min="30"
              max="300"
              step="0.1"
              required
            />
            {fieldErrors.weight && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.weight}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Gender *
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGender("MALE")}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                  gender === "MALE"
                    ? "bg-blue-700 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender("FEMALE")}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
                  gender === "FEMALE"
                    ? "bg-blue-700 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Female
              </button>
            </div>
            {fieldErrors.gender && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.gender}</p>
            )}
          </div>

          {/* Form-level error */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-4 py-3 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!isFormValid || loading}
          >
            {loading ? "Creating profile..." : "Create profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
