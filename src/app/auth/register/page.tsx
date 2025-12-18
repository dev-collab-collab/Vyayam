"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import FormField from "@/components/FormField";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="container flex max-w-xl flex-col gap-6 py-12">
      <div>
        <p className="text-sm font-semibold uppercase text-blue-600">Create your account</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Join Vyayam Coach</h1>
        <p className="text-slate-600">Start tracking calories and get instant guidance.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow">
        <FormField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <FormField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          helpText="Minimum 8 characters"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-700 px-4 py-3 text-white hover:bg-blue-600 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  );
}
