"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (step === "email") {
      const normalized = email.trim().toLowerCase();
      if (!normalized) {
        setError("Enter your email to continue.");
        return;
      }
      if (normalized !== "qa@qa.com") {
        setError("Only qa@qa.com is enabled right now.");
        return;
      }
      setStep("otp");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    if (res.ok) {
      router.push("/");
      return;
    }
    const data = await res.json().catch(() => null);
    setError(data?.message || "Invalid code, please try again.");
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-stack">
        <div className="auth-logo">
          <img src="/vyayam_app_logo.png" alt="Vyayam" />
        </div>
        <div className="auth-card">
          <h1 className="auth-title">Log in or Sign up</h1>
          <form onSubmit={onSubmit} className="auth-form">
            <label className="sr-only" htmlFor="email">Email</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={step === "otp"}
            />
            {step === "otp" && (
              <input
                id="otp"
                className="auth-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="Enter the OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            )}
            {error && <p className="error-text">{error}</p>}
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? (step === "otp" ? "Verifying..." : "Sending...") : step === "otp" ? "Verify OTP" : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
