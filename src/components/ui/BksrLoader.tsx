type BksrLoaderProps = {
  /** Accessible label for screen readers */
  label?: string;
  /** Icon size in pixels */
  size?: number;
  className?: string;
};

/**
 * Minimal line-art BKSR mark loader — same technique as classic stroke-draw
 * loading GIFs (stroke-dash draw → hold → reset), adapted to the four-diamond
 * brand mark (B / K / S / R) instead of an unrelated icon.
 */
export function BksrLoader({
  label = 'Loading',
  size = 72,
  className = '',
}: BksrLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={`inline-flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="bksr-loader-svg"
        aria-hidden
      >
        {/* Outer diamond guide */}
        <path
          className="bksr-loader-stroke bksr-loader-outer"
          d="M50 8 L92 50 L50 92 L8 50 Z"
          stroke="var(--bksr-navy)"
          strokeWidth="1.75"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Cross dividers */}
        <path
          className="bksr-loader-stroke bksr-loader-cross"
          d="M50 8 L50 92 M8 50 L92 50"
          stroke="var(--bksr-navy)"
          strokeWidth="1.35"
          strokeLinecap="round"
        />

        {/* Letter K (top) */}
        <text
          className="bksr-loader-letter bksr-loader-letter-k"
          x="50"
          y="28"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--bksr-navy)"
          fontFamily="var(--font-serif), Georgia, serif"
          fontSize="13"
          fontWeight="600"
        >
          K
        </text>

        {/* Letter B (left) */}
        <text
          className="bksr-loader-letter bksr-loader-letter-b"
          x="28"
          y="52"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--bksr-navy)"
          fontFamily="var(--font-serif), Georgia, serif"
          fontSize="13"
          fontWeight="600"
        >
          B
        </text>

        {/* Letter S (right) */}
        <text
          className="bksr-loader-letter bksr-loader-letter-s"
          x="72"
          y="52"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--bksr-navy)"
          fontFamily="var(--font-serif), Georgia, serif"
          fontSize="13"
          fontWeight="600"
        >
          S
        </text>

        {/* Accent circle + R (bottom) */}
        <circle
          className="bksr-loader-stroke bksr-loader-ring"
          cx="50"
          cy="72"
          r="9.5"
          stroke="var(--bksr-navy)"
          strokeWidth="1.5"
        />
        <text
          className="bksr-loader-letter bksr-loader-letter-r"
          x="50"
          y="73"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--bksr-red)"
          fontFamily="var(--font-serif), Georgia, serif"
          fontSize="12"
          fontWeight="700"
        >
          R
        </text>
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}
