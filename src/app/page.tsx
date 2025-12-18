"use client";

import { useMemo, useState } from "react";

type Unit = "kg" | "lb";
type TimeMode = "duration" | "date";
type Screen = "goal" | "plan";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("goal");
  const [unit, setUnit] = useState<Unit>("kg");
  const [timeMode, setTimeMode] = useState<TimeMode>("duration");
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [durationValue, setDurationValue] = useState("");
  const [durationUnit, setDurationUnit] = useState<"weeks" | "months">("weeks");
  const [targetDate, setTargetDate] = useState("");

  const parsedCurrentWeight = useMemo(() => {
    const value = parseFloat(currentWeight);
    return Number.isFinite(value) && value > 0 ? value : null;
  }, [currentWeight]);

  const parsedTargetWeight = useMemo(() => {
    const value = parseFloat(targetWeight);
    return Number.isFinite(value) && value > 0 ? value : null;
  }, [targetWeight]);

  const weeks = useMemo(() => {
    if (timeMode === "duration") {
      const value = parseFloat(durationValue);
      if (!Number.isFinite(value) || value <= 0) return null;
      return durationUnit === "weeks" ? value : value * 4;
    }

    if (!targetDate) return null;
    const target = new Date(targetDate);
    const today = new Date();
    const diffMs = target.getTime() - today.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays <= 1) return null;
    return diffDays / 7;
  }, [durationUnit, durationValue, targetDate, timeMode]);

  const weightsValid =
    parsedCurrentWeight !== null &&
    parsedTargetWeight !== null &&
    parsedTargetWeight < parsedCurrentWeight;

  const hasTime = weeks !== null && weeks > 1;
  const canSave = weightsValid && hasTime;
  const totalLoss = weightsValid ? parsedCurrentWeight! - parsedTargetWeight! : null;
  const weeklyRate = canSave && totalLoss !== null && weeks ? totalLoss / weeks : null;

  const dailyCalories = useMemo(() => {
    if (!weeklyRate || weeklyRate <= 0) return null;
    const base = 2000;
    const steps = weeklyRate / 0.25;
    const deficit = Math.min(steps * 300, 900);
    const estimate = Math.max(base - deficit, 1200);
    return Math.round(estimate);
  }, [weeklyRate]);

  const paceWarning = useMemo(() => {
    if (!weeklyRate) return "";
    if (weeklyRate < 0.25) return "This is a very gentle pace; great for long-term consistency.";
    if (weeklyRate <= 1) return "This is a typical healthy rate for fat loss.";
    return "This looks aggressive. Consider a longer timeframe for safety.";
  }, [weeklyRate]);

  const pillClass = useMemo(() => {
    if (!weeklyRate) return "";
    if (weeklyRate < 0.25) return "pill-gentle";
    if (weeklyRate <= 1) return "pill-normal";
    return "pill-aggressive";
  }, [weeklyRate]);

  const summaryText = canSave && weeklyRate && weeks
    ? `You want to go from ${parsedCurrentWeight} ${unit} to ${parsedTargetWeight} ${unit} in about ${weeks.toFixed(
        1
      )} weeks. That is roughly ${weeklyRate.toFixed(2)} ${unit} per week.`
    : "Fill in your weights and timeframe to see your weekly rate.";

  const helperText =
    parsedCurrentWeight && parsedTargetWeight && parsedTargetWeight >= parsedCurrentWeight
      ? "For fat loss, target weight must be less than current weight."
      : "For fat loss, target weight should be lower than current weight.";

  const summaryWarning = canSave ? paceWarning : "";

  const handleSaveGoal = () => {
    if (!canSave) return;
    setScreen("plan");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-logo">
          <img src="/vyayam_app_logo.png" alt="Vyayam logo" />
        </div>
        <nav className="app-nav">
          <button
            className={`nav-link ${screen === "goal" ? "active" : ""}`}
            onClick={() => setScreen("goal")}
            type="button"
          >
            Goal
          </button>
          <button
            className={`nav-link ${screen === "plan" ? "active" : ""}`}
            onClick={() => setScreen("plan")}
            type="button"
          >
            Plan
          </button>
        </nav>
      </header>

      <main className="app-main">
        <section className={`screen ${screen === "goal" ? "active" : ""}`} id="goalScreen">
          <header className="screen-header">
            <h1>Set your fat-loss goal</h1>
            <p>We will use this to guide your weekly targets and calorie plan.</p>
          </header>

          <section className="card">
            <h2>Weight</h2>

            <label className="field">
              <span className="field-label">Current weight</span>
              <div className="field-row">
                <input
                  type="number"
                  placeholder="82"
                  inputMode="decimal"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                />
                <div className="unit-toggle">
                  <button
                    type="button"
                    className={`unit-btn ${unit === "kg" ? "active" : ""}`}
                    onClick={() => setUnit("kg")}
                  >
                    kg
                  </button>
                  <button
                    type="button"
                    className={`unit-btn ${unit === "lb" ? "active" : ""}`}
                    onClick={() => setUnit("lb")}
                  >
                    lb
                  </button>
                </div>
              </div>
            </label>

            <label className="field">
              <span className="field-label">Target weight</span>
              <div className="field-row">
                <input
                  type="number"
                  placeholder="72"
                  inputMode="decimal"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                />
                <div className="unit-toggle">
                  <button type="button" className="unit-btn active" disabled>
                    kg
                  </button>
                  <button type="button" className="unit-btn" disabled>
                    lb
                  </button>
                </div>
              </div>
            </label>

            <p className={`helper ${!weightsValid && parsedTargetWeight && parsedCurrentWeight ? "error" : ""}`}>
              {helperText}
            </p>
          </section>

          <section className="card">
            <h2>When do you want to reach this goal?</h2>

            <div className="segmented">
              <button
                type="button"
                className={`seg-btn ${timeMode === "duration" ? "active" : ""}`}
                onClick={() => setTimeMode("duration")}
              >
                By duration
              </button>
              <button
                type="button"
                className={`seg-btn ${timeMode === "date" ? "active" : ""}`}
                onClick={() => setTimeMode("date")}
              >
                By date
              </button>
            </div>

            {timeMode === "duration" ? (
              <div id="durationBlock">
                <label className="field">
                  <span className="field-label">Duration</span>
                  <div className="field-row">
                    <input
                      type="number"
                      placeholder="16"
                      inputMode="numeric"
                      value={durationValue}
                      onChange={(e) => setDurationValue(e.target.value)}
                    />
                    <select value={durationUnit} onChange={(e) => setDurationUnit(e.target.value as "weeks" | "months")}>
                      <option value="weeks">weeks</option>
                      <option value="months">months</option>
                    </select>
                  </div>
                </label>
              </div>
            ) : (
              <div id="dateBlock">
                <label className="field">
                  <span className="field-label">Target date</span>
                  <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
                </label>
              </div>
            )}
          </section>

          <section className="card">
            <h2>Summary</h2>
            <p className="summary-main">{summaryText}</p>
            {summaryWarning && <p className="summary-warning">{summaryWarning}</p>}
          </section>

          <footer className="screen-footer">
            <button className="btn-primary" onClick={handleSaveGoal} disabled={!canSave} type="button">
              Save goal &amp; view plan
            </button>
            <button className="btn-ghost" type="button" onClick={() => setScreen("plan")}>
              Skip for now
            </button>
          </footer>
        </section>

        <section className={`screen ${screen === "plan" ? "active" : ""}`} id="planScreen">
          <header className="screen-header">
            <h1>Calories &amp; weekly plan</h1>
            <p>Here is a placeholder plan based on your goal. You can fine-tune it later.</p>
          </header>

          <section className="card">
            <h2>Daily calorie target</h2>
            <div className="plan-highlight">
              <div>
                <p className="plan-number">{dailyCalories ?? "— — —"}</p>
                <p className="plan-caption">calories per day</p>
              </div>
              <div className={`plan-pill ${pillClass}`}>
                Goal: <span>{weeklyRate ? `${weeklyRate.toFixed(2)} ${unit}/week` : "—"}</span>
              </div>
            </div>
            <p className="helper">
              This is a placeholder estimation using a simple rule. In the real app, we will personalize it using your age,
              height, sex, and activity level.
            </p>
          </section>

          <section className="card">
            <h2>Weekly breakdown</h2>
            <ul className="week-list">
              <li className="week-row">
                <div>
                  <p className="week-title">Check-in day</p>
                  <p className="week-sub">Weigh yourself once a week, same time of day.</p>
                </div>
                <span className="week-tag">Every Sunday</span>
              </li>
              <li className="week-row">
                <div>
                  <p className="week-title">Workout target</p>
                  <p className="week-sub">Aim for 3-4 sessions per week (strength + cardio).</p>
                </div>
                <span className="week-tag">3-4x / week</span>
              </li>
              <li className="week-row">
                <div>
                  <p className="week-title">Flex meals</p>
                  <p className="week-sub">Keep 1-2 flexible meals per week to stay consistent.</p>
                </div>
                <span className="week-tag">1-2 meals</span>
              </li>
            </ul>
          </section>

          <section className="card">
            <h2>Progress preview</h2>
            <p className="helper">
              A simple progress graph will live here, showing your weight trend vs. target. For now, imagine a smooth line
              gliding down like a polite roller coaster.
            </p>
            <div className="graph-placeholder">
              <span>Graph placeholder</span>
            </div>
          </section>

          <footer className="screen-footer">
            <button className="btn-ghost" type="button" onClick={() => setScreen("goal")}>
              Back to goal
            </button>
            <button className="btn-primary" type="button">
              Looks good
            </button>
          </footer>
        </section>
      </main>
    </div>
  );
}
