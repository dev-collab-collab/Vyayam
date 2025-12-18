"use client";

import { useEffect, useState } from "react";
import FormField from "@/components/FormField";

interface LogEntry {
  id?: string;
  date: string;
  calories: number;
}

export default function CaloriesPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [calories, setCalories] = useState<number>(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const loadLogs = async () => {
    const to = today;
    const from = new Date();
    from.setDate(from.getDate() - 13);
    const fromStr = from.toISOString().slice(0, 10);
    const res = await fetch(`/api/calories?from=${fromStr}&to=${to}`);
    if (res.ok) {
      const data = await res.json();
      setLogs(data.logs);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/calories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, calories }),
    });
    if (res.ok) {
      setMessage("Saved");
      loadLogs();
    } else {
      setMessage("Unable to save log");
    }
  };

  return (
    <div className="container space-y-6 py-10">
      <div>
        <p className="text-sm uppercase text-blue-600">Calories</p>
        <h1 className="text-3xl font-bold text-slate-900">Log your intake</h1>
        <p className="text-slate-600">Add or edit any date. The dashboard uses the last 7 days for the rolling average.</p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-3 md:items-end">
        <FormField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <FormField
          label="Calories"
          type="number"
          value={calories}
          onChange={(e) => setCalories(Number(e.target.value))}
          required
        />
        <button type="submit" className="rounded-lg bg-blue-700 px-4 py-3 text-white hover:bg-blue-600">
          Save / Update
        </button>
        {message && <p className="text-sm text-green-600 md:col-span-3">{message}</p>}
      </form>

      <div className="rounded-xl bg-white p-4 shadow">
        <h2 className="mb-3 text-sm font-semibold uppercase text-slate-500">Last 14 days</h2>
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
      </div>
    </div>
  );
}
