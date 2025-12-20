"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";

type Slide = { src: string; title: string };

type GoalCardProps = {
  title: string;
  bullets: string[];
  icon: ReactNode;
};

const colors = {
  bg: "#F9FBFD",
  surface: "#FFFFFF",
  primary: "#6E8BA5",
  textDark: "#1F2A33",
  textMuted: "#6B7C8F",
  border: "#E6ECF2",
  borderDashed: "#B8C7D6",
  inactiveIcon: "#9AAEC1",
  dotInactive: "#D8E1EA",
};

export default function DashboardPage() {
  const slides: Slide[] = useMemo(
    () => [
      { src: "/Carousel/carousel-feed-1.png", title: "Protein timing is key for\nmuscle growth" },
      { src: "/Carousel/carousel-feed-2.png", title: "Muscle is built\nduring recovery" },
    ],
    []
  );

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  const current = slides[active] ?? slides[0];

  return (
    <main
      style={{
        width: "100%",
        maxWidth: 390,
        minHeight: "100vh",
        background: colors.bg,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 12,
        paddingRight: 16,
        paddingBottom: 20,
        paddingLeft: 16,
        gap: 16,
      }}
    >
      <div style={{ width: 72, height: 72, display: "grid", placeItems: "center" }}>
        <img
          src="/logos/vyayam_rest_of_the_app.png"
          alt="Vyayam"
          style={{ width: 72, height: 72, objectFit: "contain" }}
        />
      </div>

      <section
        style={{
          width: "100%",
          maxWidth: 358,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: "100%",
            minWidth: 340,
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 12,
            background: colors.surface,
            borderRadius: 16,
            border: `1px solid ${colors.border}`,
            boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 12,
              background: colors.border,
              overflow: "hidden",
            }}
            aria-label="Image"
          >
            {current?.src ? (
              <img
                src={current.src}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", background: colors.border }} />
            )}
          </div>
        </div>

        <div
          style={{
            width: 80,
            height: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {slides.map((_, idx) => (
            <span
              key={idx}
              style={{
                width: 6,
                height: 6,
                borderRadius: "999px",
                background: idx === active ? colors.primary : colors.dotInactive,
                display: "inline-block",
              }}
            />
          ))}
        </div>
      </section>

      <h1
        style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 600,
          lineHeight: "28px",
          color: colors.textDark,
          textAlign: "center",
        }}
      >
        Select your goal
      </h1>

      <section
        style={{
          width: "100%",
          maxWidth: 358,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <GoalCard
          title="Lose Weight"
          bullets={["Burn Fat", "Calorie Deficit"]}
          icon={
            <img
              src="/app_elements/lose_weight_image.png"
              alt="Lose Weight"
              style={{ width: 72, height: 48, objectFit: "contain", display: "block" }}
            />
          }
        />
        <GoalCard
          title="Gain Muscle"
          bullets={["Build Strength", "Muscle Gain"]}
          icon={
            <img
              src="/app_elements/gain_muscle_image.png"
              alt="Gain Muscle"
              style={{ width: 72, height: 48, objectFit: "contain", display: "block" }}
            />
          }
        />
      </section>

      <button
        type="button"
        style={{
          width: 220,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          paddingTop: 10,
          paddingRight: 16,
          paddingBottom: 10,
          paddingLeft: 16,
          borderRadius: 14,
          border: `2px dashed ${colors.borderDashed}`,
          background: "transparent",
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: "999px",
            background: colors.border,
            display: "grid",
            placeItems: "center",
            color: colors.primary,
            fontSize: 18,
            fontWeight: 600,
            lineHeight: "18px",
          }}
        >
          +
        </span>
        <span style={{ color: colors.textDark, fontSize: 16, fontWeight: 500, lineHeight: "20px" }}>Add Goal</span>
      </button>

      <nav
        aria-label="Bottom navigation"
        style={{
          width: "100%",
          maxWidth: 358,
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 10,
          paddingRight: 22,
          paddingBottom: 10,
          paddingLeft: 22,
          background: colors.surface,
          borderTop: `1px solid ${colors.border}`,
          marginTop: "auto",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5z" fill={colors.textDark} />
          </svg>
          <span style={{ fontSize: 12, fontWeight: 500, lineHeight: "16px", color: colors.textDark }}>Dashboard</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="4" y="12" width="3" height="8" fill={colors.inactiveIcon} />
            <rect x="10.5" y="9" width="3" height="11" fill={colors.inactiveIcon} />
            <rect x="17" y="6" width="3" height="14" fill={colors.inactiveIcon} />
          </svg>
          <span style={{ fontSize: 12, fontWeight: 500, lineHeight: "16px", color: colors.inactiveIcon }}>Goal Progress</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="4" fill={colors.inactiveIcon} />
            <path d="M4 21c1.5-5 14.5-5 16 0" fill={colors.inactiveIcon} />
          </svg>
          <span style={{ fontSize: 12, fontWeight: 500, lineHeight: "16px", color: colors.inactiveIcon }}>Profile</span>
        </div>
      </nav>
    </main>
  );
}

function GoalCard({ title, bullets, icon }: GoalCardProps) {
  return (
    <div
      style={{
        width: 173,
        height: 180,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        paddingTop: 16,
        paddingRight: 14,
        paddingBottom: 14,
        paddingLeft: 14,
        background: colors.surface,
        borderRadius: 18,
        border: `1px solid ${colors.border}`,
      }}
    >
      {icon}
      <div style={{ fontSize: 16, fontWeight: 600, lineHeight: "20px", color: colors.textDark }}>{title}</div>
      <div style={{ width: 140, height: 1, background: colors.border }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, width: "100%" }}>
        {bullets.map((text) => (
          <div key={text} style={{ fontSize: 13, fontWeight: 400, lineHeight: "18px", color: colors.textMuted }}>
            › {text}
          </div>
        ))}
      </div>
    </div>
  );
}
