"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type InsightItem = {
  imageSrc: string; // local (/images/...) OR remote (https://...)
  alt?: string;
  text: string;
};

export function InsightCarousel({
  items,
  intervalMs = 5000,
}: {
  items: InsightItem[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, intervalMs);

    return () => clearInterval(id);
  }, [items.length, intervalMs]);

  if (!items.length) return null;

  const current = items[index];

  return (
    <section className="w-full flex flex-col items-center" style={{ rowGap: 12 }}>
      {/* Card */}
      <div
        className="w-full flex items-center"
        style={{
          height: 120,
          borderRadius: 16,
          background: "var(--vy-surface)",
          border: "1px solid var(--vy-border)",
          boxShadow: "0 4px 12px var(--vy-shadow)",
          padding: 12,
          columnGap: 12,
        }}
      >
        {/* Image */}
        <div
          className="relative"
          style={{
            width: 96,
            height: 96,
            borderRadius: 12,
            overflow: "hidden",
            background: "var(--vy-border)",
            flexShrink: 0,
          }}
        >
          <Image
            src={current.imageSrc}
            alt={current.alt ?? "Insight image"}
            fill
            className="object-cover"
            sizes="96px"
            priority
          />
        </div>

        {/* Text */}
        <p
          className="flex-1"
          style={{
            color: "var(--vy-text-dark)",
            fontSize: 16,
            fontWeight: 500,
            lineHeight: "22px",
            whiteSpace: "pre-line",
          }}
        >
          {current.text}
        </p>

        {/* Chevron */}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M8 5l5 5-5 5"
            stroke="var(--vy-inactive)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Indicators */}
      <div className="flex items-center justify-center" style={{ columnGap: 8 }}>
        {items.map((_, i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: i === index ? "var(--vy-primary)" : "var(--vy-dot-inactive)",
              display: "inline-block",
            }}
          />
        ))}
      </div>
    </section>
  );
}
