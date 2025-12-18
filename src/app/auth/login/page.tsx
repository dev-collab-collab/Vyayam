"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, remember }),
    });
    if (res.ok) {
      router.push("/");
      return;
    }
    const data = await res.json().catch(() => null);
    setError(data?.message || "Invalid credentials.");
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/vyayam_app_logo.png" alt="Vyayam logo" height={80} width={80} />
          <span>VYAYAM</span>
        </div>

        <h1 className="auth-title">Log in</h1>
        <p className="auth-subtitle">Jump back into your plan.</p>

        <form onSubmit={onSubmit} className="auth-form">
          <label className="auth-label" htmlFor="email">
            Email / username
          </label>
          <input
            id="email"
            className="auth-input"
            type="text"
            placeholder="qa"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="helper" style={{ marginTop: "-6px", marginBottom: "12px" }}>
            Use valid credentials.
          </p>

          <label className="auth-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className="auth-row">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Signing in..." : "Log in"}
          </button>

          <div className="auth-links">
            <a href="#">Forgot password?</a>
            <span>
              Do not have an account? <a href="#">Create one</a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
