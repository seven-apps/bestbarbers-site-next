"use client";

interface SliderInputProps {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  /** Como exibir o valor atual (ex.: prefixo R$ ou sufixo %). */
  format?: (value: number) => string;
}

export function SliderInput({
  label,
  hint,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: SliderInputProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const display = format ? format(value) : value.toLocaleString("pt-BR");

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2 gap-3">
        <label
          className="font-semibold text-[14px] md:text-[15px] leading-snug"
          style={{ color: "#1e1e1e", fontFamily: "var(--font-montserrat)" }}
        >
          {label}
        </label>
        <span
          className="font-extrabold text-[16px] md:text-[18px] whitespace-nowrap px-2.5 py-0.5 rounded-lg"
          style={{
            color: "#1e1e1e",
            background: "rgba(235,173,4,0.16)",
            fontFamily: "var(--font-vollkorn)",
          }}
        >
          {display}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="calc-slider w-full"
        style={{
          background: `linear-gradient(90deg, #ebad04 0%, #ebad04 ${pct}%, #e6e6e6 ${pct}%, #e6e6e6 100%)`,
        }}
        aria-label={label}
      />

      {hint && (
        <p
          className="text-[11px] md:text-[12px] mt-1.5"
          style={{ color: "#6b6b6b", fontFamily: "var(--font-montserrat)" }}
        >
          {hint}
        </p>
      )}

      <style jsx>{`
        .calc-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 9999px;
          outline: none;
          cursor: pointer;
        }
        .calc-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 9999px;
          background: #ffffff;
          border: 3px solid #ebad04;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .calc-slider::-webkit-slider-thumb:active {
          transform: scale(1.15);
        }
        .calc-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 9999px;
          background: #ffffff;
          border: 3px solid #ebad04;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
