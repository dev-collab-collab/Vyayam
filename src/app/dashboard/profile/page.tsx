"use client";

import { useEffect, useState } from "react";
import FormField from "@/components/FormField";

type GoalType = "LOSE_FAT" | "GAIN_MUSCLE";

export default function ProfilePage() {
  const [age, setAge] = useState<number>(30);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [goalType, setGoalType] = useState<GoalType>("LOSE_FAT");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setAge(data.age);
        setWeightKg(data.weightKg);
        setGoalType(data.goalType);
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ age, weightKg, goalType }),
    });
    if (res.ok) {
      setMessage("Profile saved!");
    } else {
      setMessage("Unable to save profile");
    }
  };

  if (loading) return <div className="container py-10">Loading profile...</div>;

  return (
    <div className="container max-w-2xl space-y-6 py-10">
      <div>
        <p className="text-sm uppercase text-blue-600">Profile</p>
        <h1 className="text-3xl font-bold text-slate-900">Your body data</h1>
        <p className="text-slate-600">Update these values to keep the guidance accurate.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow">
        <FormField label="Age (years)" type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} required />
        <FormField
          label="Weight (kg)"
          type="number"
          step="0.1"
          value={weightKg}
          onChange={(e) => setWeightKg(Number(e.target.value))}
          required
        />
        <label className="block text-sm font-medium text-slate-700">
          <span className="mb-1 block">Goal</span>
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none"
            value={goalType}
            onChange={(e) => setGoalType(e.target.value as GoalType)}
          >
            <option value="LOSE_FAT">Lose fat</option>
            <option value="GAIN_MUSCLE">Gain muscle</option>
          </select>
        </label>
        <button type="submit" className="rounded-lg bg-blue-700 px-4 py-3 text-white hover:bg-blue-600">
          Save profile
        </button>
        {message && <p className="text-sm text-green-600">{message}</p>}
      </form>
    </div>
  );
}
