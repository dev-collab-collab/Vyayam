"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";

type GoalType = "LOSE_FAT" | "GAIN_MUSCLE";

interface GuidancePayload {
  profile: { age: number; weightKg: number; goalType: GoalType } | null;
  guidance: {
    maintenanceCalories: number;
    targetCalories: number;
    averageIntake: number;
    status: "ON_TRACK" | "OFF_TRACK";
    recommendation: string;
    plan: string;
    projection: string;
    notes: string;
  } | null;
  logs: { date: string; calories: number }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<GuidancePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/guidance", { cache: "no-store" });
      if (!res.ok) {
        setError("Unable to load dashboard. Please update your profile.");
        setLoading(false);
        return;
      }
      const json = await res.json();
      setData(json);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="container py-10">Loading dashboard...</div>;
  if (error || !data) return <div className="container py-10 text-red-600">{error}</div>;

  const { profile, guidance, logs } = data;
  if (!profile || !guidance) {
    return <div className="container py-10">Please complete your profile to view guidance.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase text-blue-600">Dashboard</p>
          <h1 className="text-3xl font-bold text-slate-900">Your weekly guidance</h1>
          <p className="text-slate-600">Based on the last 7 days of calorie logs.</p>
        </div>
        <StatusBadge status={guidance.status} />
      </div>

      <div className="card-grid">
        <Card title="Maintenance estimate">
          <p className="text-2xl font-semibold text-slate-900">{guidance.maintenanceCalories} kcal</p>
          <p className="text-sm text-slate-600">Based on weight and age heuristic.</p>
        </Card>
        <Card title="Target calories">
          <p className="text-2xl font-semibold text-slate-900">{guidance.targetCalories} kcal</p>
          <p className="text-sm text-slate-600">Goal: {profile.goalType === "LOSE_FAT" ? "Lose fat" : "Gain muscle"}</p>
        </Card>
        <Card title="7-day average intake">
          <p className="text-2xl font-semibold text-slate-900">{guidance.averageIntake} kcal</p>
          <p className="text-sm text-slate-600">Logged days included; missing days counted as 0.</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Status & recommendation">
          <p className="text-lg font-semibold text-slate-900">{guidance.recommendation}</p>
          <p className="mt-2 text-sm text-slate-600">{guidance.plan}</p>
        </Card>
        <Card title="Projection">
          <p className="text-lg font-semibold text-slate-900">{guidance.projection}</p>
          <p className="mt-2 text-sm text-slate-600">{guidance.notes}</p>
        </Card>
      </div>

      <Card title="Last 14 days (calories)">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="p-2">Date</th>
                <th className="p-2">Calories</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.date} className="border-b border-slate-100">
                  <td className="p-2">{log.date}</td>
                  <td className="p-2 font-medium">{log.calories}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
