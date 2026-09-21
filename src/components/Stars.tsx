/**
 * A read-only star row filled to a fraction, so 3.7 shows as three and seven tenths
 * rather than rounding to four. Two identical rows stacked; the top one is clipped.
 */
export function Stars({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(5, value));
  return (
    <span className="stars-static" role="img" aria-label={`${clamped.toFixed(1)} out of 5`}>
      <span className="stars-base" aria-hidden="true">★★★★★</span>
      <span className="stars-fill" style={{ width: `${(clamped / 5) * 100}%` }} aria-hidden="true">
        ★★★★★
      </span>
    </span>
  );
}
