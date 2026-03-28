"use client";

import { useState, useCallback, useEffect } from "react";
import { useLeadForm } from "@/hooks";
import { Shield, ArrowRight, Loader2, Check } from "lucide-react";

interface MultiStepFormProps {
  ctaText?: string;
  formLocation?: "hero" | "bottom";
  prefilledChairs?: string;
  compact?: boolean;
}

export function MultiStepForm({
  ctaText = "VER MEU DIAGNOSTICO GRATUITO",
  formLocation = "hero",
  prefilledChairs,
  compact = false,
}: MultiStepFormProps) {
  const [step, setStep] = useState<1 | 2>(prefilledChairs ? 2 : 1);
  const [chairs, setChairs] = useState(prefilledChairs || "");

  const {
    formData,
    isSubmitting,
    submitted,
    submitError,
    handleInputChange,
    handleSubmit,
  } = useLeadForm({ redirectToWhatsApp: true });

  // Sync chairs to formData when moving to step 2
  const goToStep2 = useCallback(() => {
    if (!chairs || parseInt(chairs) < 1) return;
    // Trigger handleInputChange for employeeCount
    const syntheticEvent = {
      target: { name: "employeeCount", value: chairs },
    } as React.ChangeEvent<HTMLInputElement>;
    handleInputChange(syntheticEvent);
    setStep(2);
  }, [chairs, handleInputChange]);

  // Also sync prefilledChairs
  useEffect(() => {
    if (prefilledChairs) {
      const syntheticEvent = {
        target: { name: "employeeCount", value: prefilledChairs },
      } as React.ChangeEvent<HTMLInputElement>;
      handleInputChange(syntheticEvent);
    }
  }, [prefilledChairs, handleInputChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (step === 1) goToStep2();
      }
    },
    [step, goToStep2]
  );

  const padding = compact ? "p-4" : "p-5 md:p-6";
  const gap = compact ? "space-y-3" : "space-y-4";

  return (
    <div
      className={`bg-gradient-to-br from-[#1a1a1a]/80 to-[#1e1e1e]/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl md:rounded-3xl shadow-2xl ${padding}`}
    >
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div
          className={`w-2 h-2 rounded-full transition-colors ${
            step === 1 ? "bg-[#ffaf02]" : "bg-[#ffaf02]/40"
          }`}
        />
        <div
          className={`w-2 h-2 rounded-full transition-colors ${
            step === 2 ? "bg-[#ffaf02]" : "bg-white/20"
          }`}
        />
        <span className="text-gray-500 text-xs ml-2">
          Passo {step} de 2
        </span>
      </div>

      {step === 1 ? (
        /* STEP 1 — Engagement question: cadeiras */
        <div className={gap}>
          <label className="block text-white/90 text-sm font-semibold">
            Quantas cadeiras sua barbearia tem?
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={chairs}
            onChange={(e) => setChairs(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: 4"
            className="w-full bg-[#0f1015] border-2 border-[#2a2d35] rounded-xl px-5 py-4 text-white text-base placeholder:text-gray-500 focus:border-[#ffaf02] focus:bg-[#12141a] focus:outline-none focus:shadow-[0_0_0_4px_rgba(255,175,2,0.1)] transition-all"
            autoFocus={formLocation === "hero"}
          />
          <button
            type="button"
            onClick={goToStep2}
            disabled={!chairs || parseInt(chairs) < 1}
            className="w-full bg-gradient-to-r from-[#029912] to-[#02ab15] text-white font-extrabold text-[15px] md:text-base px-6 py-4 rounded-xl shadow-[0_8px_40px_rgba(2,171,21,0.4)] hover:shadow-[0_12px_50px_rgba(2,171,21,0.5)] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            PROXIMO
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* STEP 2 — Contact info */
        <form onSubmit={handleSubmit} className={gap}>
          {/* Chairs badge */}
          <div className="flex items-center gap-2 bg-[#ffaf02]/10 border border-[#ffaf02]/30 rounded-lg px-3 py-2">
            <Check className="w-3.5 h-3.5 text-[#ffaf02]" />
            <span className="text-[#ffaf02] text-xs font-bold">
              {chairs || formData.employeeCount} cadeiras
            </span>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="ml-auto text-gray-500 text-xs hover:text-white transition-colors"
            >
              alterar
            </button>
          </div>

          <div>
            <label className="block text-white/90 text-xs font-semibold mb-1.5">
              Nome da Barbearia
            </label>
            <input
              type="text"
              name="barbershopName"
              value={formData.barbershopName}
              onChange={handleInputChange}
              placeholder="Ex: Barbearia do Joao"
              required
              className="w-full bg-[#0f1015] border-2 border-[#2a2d35] rounded-xl px-5 py-3.5 text-white text-base placeholder:text-gray-500 focus:border-[#ffaf02] focus:bg-[#12141a] focus:outline-none focus:shadow-[0_0_0_4px_rgba(255,175,2,0.1)] transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-white/90 text-xs font-semibold mb-1.5">
              WhatsApp
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              placeholder="(11) 99999-9999"
              required
              className="w-full bg-[#0f1015] border-2 border-[#2a2d35] rounded-xl px-5 py-3.5 text-white text-base placeholder:text-gray-500 focus:border-[#ffaf02] focus:bg-[#12141a] focus:outline-none focus:shadow-[0_0_0_4px_rgba(255,175,2,0.1)] transition-all"
            />
          </div>

          {/* Error */}
          {submitError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
              {submitError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || submitted}
            className="w-full bg-gradient-to-r from-[#029912] to-[#02ab15] text-white font-extrabold text-[15px] md:text-base px-6 py-4 rounded-xl shadow-[0_8px_40px_rgba(2,171,21,0.4)] hover:shadow-[0_12px_50px_rgba(2,171,21,0.5)] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                ENVIANDO...
              </>
            ) : submitted ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                REDIRECIONANDO...
              </>
            ) : (
              <>
                {ctaText}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Trust */}
          <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs">
            <Shield className="w-3 h-3" />
            <span>Retorno em minutos. Sem compromisso.</span>
          </div>
        </form>
      )}
    </div>
  );
}
