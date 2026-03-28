"use client";

import { useLeadForm } from "@/hooks/useLeadForm";
import { usePhoneMask } from "@/hooks/usePhoneMask";
import Image from "next/image";

export default function LeadMachineV7() {
  const { formData, isSubmitting, submitted, submitError, handleInputChange, handleSubmit } =
    useLeadForm({ redirectToWhatsApp: true });
  const { applyPhoneMask } = usePhoneMask();

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#0C1120] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Redirecionando para o WhatsApp...
          </h1>
          <p className="text-gray-400 text-sm">
            Se não abrir automaticamente,{" "}
            <a
              href={`https://wa.me/5531990613861?text=${encodeURIComponent(
                "Olá! Vi o caso dos 353 assinantes e quero saber o potencial da minha barbearia."
              )}`}
              className="text-[#FFAF02] underline"
            >
              clique aqui
            </a>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0C1120] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/images/logo-white.svg"
            alt="BestBarbers"
            width={180}
            height={40}
            priority
          />
        </div>

        {/* Case Real — B-2 Pattern */}
        <div className="text-center space-y-3">
          <div className="inline-block bg-[#FFAF02]/10 border border-[#FFAF02]/30 rounded-full px-4 py-1">
            <span className="text-[#FFAF02] text-xs font-semibold tracking-wide uppercase">
              Caso Real — Embu das Artes/SP
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            <span className="text-[#FFAF02]">353</span> assinantes.
            <br />4 cadeiras.
            <br />
            <span className="text-[#FFAF02]">R$31.690</span>/mês.
          </h1>

          <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
            Era R$15.892. Mesmo ponto. Mesma equipe.
            Montou clube de assinaturas com BestBarbers. <strong className="text-white">Dobrou.</strong>
          </p>
        </div>

        {/* Preço — pré-filtro */}
        <div className="text-center bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-gray-300 text-sm">
            A partir de{" "}
            <span className="text-white font-bold text-lg">R$299/mês</span>
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Sem taxa de implantação · 1.200+ barbearias
          </p>
        </div>

        {/* Formulário — só WhatsApp */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="whatsapp" className="block text-gray-300 text-sm font-medium mb-1.5">
              Seu WhatsApp
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              inputMode="numeric"
              required
              placeholder="(31) 99999-9999"
              value={formData.whatsapp}
              onChange={(e) => {
                const masked = applyPhoneMask(e.target.value);
                handleInputChange({
                  ...e,
                  target: { ...e.target, name: "whatsapp", value: masked },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-[#FFAF02]/50 focus:border-[#FFAF02]/50 transition"
            />
          </div>

          {submitError && (
            <p className="text-red-400 text-sm text-center">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#FFAF02] hover:bg-[#E5A002] disabled:opacity-50 rounded-xl text-[#0C1120] font-bold text-lg transition-colors"
          >
            {isSubmitting ? "Enviando..." : "Falar com especialista →"}
          </button>

          <p className="text-gray-500 text-xs text-center">
            Ao enviar, você será redirecionado para o WhatsApp do nosso especialista.
          </p>
        </form>

        {/* Trust */}
        <div className="flex items-center justify-center gap-4 text-gray-500 text-xs">
          <span>🔒 Dados seguros</span>
          <span>·</span>
          <span>⚡ Resposta em minutos</span>
        </div>
      </div>
    </main>
  );
}
