"use client";

export default function StarRating({ value = 0, showValue = true, size = 16 }) {
  const clamped = Math.max(0, Math.min(5, Number(value) || 0));
  const rounded = Math.round(clamped * 2) / 2;
  const fillPercent = (rounded / 5) * 100;
  const stars = "★★★★★";

  return (
    <span
      className="inline-flex items-center gap-1"
      title={`${clamped.toFixed(1)} out of 5`}
      aria-label={`Rating: ${clamped.toFixed(1)} out of 5`}
    >
      <span
        className="relative inline-block leading-none"
        style={{ fontSize: `${size}px` }}
      >
        <span className="text-gray-300">{stars}</span>
        <span
          className="absolute left-0 top-0 overflow-hidden whitespace-nowrap text-yellow-500"
          style={{ width: `${fillPercent}%` }}
        >
          {stars}
        </span>
      </span>

      {showValue && (
        <span className="text-xs text-gray-600">{clamped.toFixed(1)}</span>
      )}
    </span>
  );
}
