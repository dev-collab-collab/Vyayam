"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    // For now, this will send OTP request
    // You'll need to update the API endpoint to handle OTP flow
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      router.push("/");
      return;
    }
    const data = await res.json().catch(() => null);
    setError(data?.message || "Failed to send OTP.");
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
            />
            {error && <p className="error-text">{error}</p>}
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
