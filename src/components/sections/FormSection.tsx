"use client";

import { useLeadForm } from "@/hooks";

interface FormSectionProps {
  title?: string;
  description?: string;
  ctaText?: string;
}

export function FormSection({
  title = "Garanta já sua oferta exclusiva para ter o app da sua barbearia",
  description = "Você pode continuar no improviso, ou pode dar o próximo passo e ter seu app, sua marca e sua receita recorrente.\n\nO BestBarbers faz isso rápido, simples e sem custo absurdo.",
  ctaText = "GARANTIR MINHA OFERTA",
}: FormSectionProps) {
  // Hook principal que gerencia todo o formulário
  const {
    formData,
    isSubmitting,
    submitError,
    handleInputChange,
    handleSubmit,
  } = useLeadForm({
    onError: (error) => {
      console.error("Erro ao enviar formulário:", error);
      alert("Erro ao enviar formulário. Tente novamente.");
    },
  });

  return (
    <section
      id="form-section"
      className="bg-[#181b20] px-6 py-8 md:px-12 md:py-12 lg:px-24 lg:py-20"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="font-extrabold text-[32px] leading-[40px] tracking-[-0.96px] text-white mb-5 md:text-[40px] md:leading-[48px] lg:text-[48px] lg:leading-[56px] lg:tracking-[-1.44px]">
          {title.split("oferta exclusiva").map((part, i) =>
            i === 0 ? (
              <span key={i}>
                {part}
                <span className="text-[#ebad04]">oferta exclusiva</span>
              </span>
            ) : (
              part
            )
          )}
        </h2>

        <p className="font-medium text-[16px] leading-[24px] tracking-[-0.16px] text-white mb-5 md:text-[18px] md:leading-[28px] lg:mb-8 whitespace-pre-line">
          {description}
        </p>

        {/* Exibição de erro */}
        {submitError && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm font-medium">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome da Barbearia */}
          <div className="space-y-1">
            <label className="block font-medium text-[14px] leading-[20px] tracking-[-0.14px] text-white">
              Nome da Barbearia
            </label>
            <input
              type="text"
              name="barbershopName"
              value={formData.barbershopName}
              onChange={handleInputChange}
              placeholder="Digite o nome da sua barbearia"
              required
              className="w-full bg-[#20242a] border-2 border-[#ebad04] rounded-[8px] px-4 py-4 text-white placeholder-[#aeb0b2] font-medium text-[14px] leading-[20px] tracking-[-0.14px] focus:outline-none focus:border-[#ebad04] transition-colors"
            />
          </div>

          {/* Nome do Dono */}
          <div className="space-y-1">
            <label className="block font-medium text-[14px] leading-[20px] tracking-[-0.14px] text-white">
              Nome do Dono da barbearia
            </label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleInputChange}
              placeholder="Digite o nome do dono da barbearia"
              required
              className="w-full bg-[#20242a] border-2 border-[#ebad04] rounded-[8px] px-4 py-4 text-white placeholder-[#aeb0b2] font-medium text-[14px] leading-[20px] tracking-[-0.14px] focus:outline-none focus:border-[#ebad04] transition-colors"
            />
          </div>

          {/* WhatsApp */}
          <div className="space-y-1">
            <label className="block font-medium text-[14px] leading-[20px] tracking-[-0.14px] text-white">
              WhatsApp do Dono da barbearia
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              placeholder="Celular - whatsapp do dono da barbearia"
              required
              className="w-full bg-[#20242a] border-2 border-[#ebad04] rounded-[8px] px-4 py-4 text-white placeholder-[#aeb0b2] font-medium text-[14px] leading-[20px] tracking-[-0.14px] focus:outline-none focus:border-[#ebad04] transition-colors"
            />
          </div>

          {/* Faturamento */}
          <div className="space-y-1">
            <label className="block font-medium text-[14px] leading-[20px] tracking-[-0.14px] text-white">
              Faturamento médio mensal (R$)
            </label>
            <input
              type="text"
              name="monthlyRevenue"
              value={formData.monthlyRevenue}
              onChange={handleInputChange}
              placeholder="Quanto sua barbearia fatura por mês"
              required
              className="w-full bg-[#20242a] border-2 border-[#ebad04] rounded-[8px] px-4 py-4 text-white placeholder-[#aeb0b2] font-medium text-[14px] leading-[20px] tracking-[-0.14px] focus:outline-none focus:border-[#ebad04] transition-colors"
            />
          </div>

          {/* Colaboradores */}
          <div className="space-y-1">
            <label className="block font-medium text-[14px] leading-[20px] tracking-[-0.14px] text-white">
              Número de colaboradores
            </label>
            <input
              type="number"
              name="employeeCount"
              value={formData.employeeCount}
              onChange={handleInputChange}
              placeholder="Quantos colaboradores tem na barbearia"
              required
              className="w-full bg-[#20242a] border-2 border-[#ebad04] rounded-[8px] px-4 py-4 text-white placeholder-[#aeb0b2] font-medium text-[14px] leading-[20px] tracking-[-0.14px] focus:outline-none focus:border-[#ebad04] transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#ebad04] text-[#181b20] font-extrabold text-[16px] leading-[24px] tracking-[-0.48px] px-2 py-4 rounded-[54px] hover:bg-[#d19d03] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isSubmitting ? "ENVIANDO..." : ctaText}
          </button>
        </form>
      </div>
    </section>
  );
}
