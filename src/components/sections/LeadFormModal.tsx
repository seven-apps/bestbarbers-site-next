"use client";

import { useEffect, useCallback } from "react";
import { useLeadForm } from "@/hooks";
import { X, ArrowRight, Shield } from "lucide-react";

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Descrição de origem para tracking no Ploomes (ex: "[Site]BT-Header") */
  originDesc?: string;
}

const formFields = [
  { name: "barbershopName", label: "Nome da Barbearia", placeholder: "Nome da Barbearia", type: "text" },
  { name: "ownerName", label: "Nome do Dono da barbearia", placeholder: "Nome do Dono da barbearia", type: "text" },
  { name: "whatsapp", label: "WhatsApp do Dono da barbearia", placeholder: "Celular (WhatsApp) do Dono da barbearia", type: "tel" },
  { name: "monthlyRevenue", label: "Faturamento médio mensal (R$)", placeholder: "Quanto sua barbearia vende em média por mês", type: "text" },
  { name: "employeeCount", label: "Número de colaboradores", placeholder: "Quantos colaboradores tem na sua barbearia", type: "number" },
];

const SITE_ORIGIN_ID = 40210426;

export function LeadFormModal({ isOpen, onClose, originDesc }: LeadFormModalProps) {
  const {
    formData,
    isSubmitting,
    submitted,
    submitError,
    handleInputChange,
    handleSubmit,
    resetForm,
  } = useLeadForm({
    onError: (error) => {
      console.error("Erro ao enviar formulário:", error);
    },
    originId: SITE_ORIGIN_ID,
    originDesc: originDesc || "[Site]Modal",
  });

  // Fecha modal com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Reset form quando fechar
  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  // Clique no overlay fecha
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) handleClose();
    },
    [handleClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#121212] rounded-2xl md:rounded-3xl border border-gray-800/50 shadow-2xl animate-scale-in">
        {/* Botao fechar */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="p-6 md:p-8">
          {/* Titulo */}
          <h2 className="font-extrabold text-[22px] leading-[30px] md:text-[28px] md:leading-[36px] text-white text-center mb-2">
            Tenha um{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaf02] to-[#ffc233]">
              Aplicativo Próprio Personalizado
            </span>
            {" "}da sua barbearia!
          </h2>

          {/* Subtitulo */}
          <p className="text-gray-400 text-sm md:text-base text-center mb-6">
            Preencha o formulário abaixo e receba uma oferta exclusiva.
          </p>

          {/* Erro */}
          {submitError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-5">
              <p className="text-red-400 text-sm font-medium text-center">{submitError}</p>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {formFields.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <label className="block font-semibold text-[13px] md:text-[14px] text-white/90">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  required
                  className="w-full bg-[#1a1d25] border-2 border-[#2a2d35] rounded-xl px-4 py-3.5 text-white placeholder-gray-500 font-medium text-[14px] md:text-[15px] focus:outline-none focus:border-[#ffaf02] focus:shadow-[0_0_0_4px_rgba(255,175,2,0.1)] transition-all duration-300 hover:border-[#3a3d45]"
                />
              </div>
            ))}

            {/* Botao submit */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting || submitted}
                className="w-full bg-[#ffaf02] text-[#121212] font-extrabold text-[14px] md:text-[15px] px-6 py-4 rounded-full hover:bg-[#e69f00] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(255,175,2,0.3)] hover:shadow-[0_8px_30px_rgba(255,175,2,0.4)] hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                    ENVIANDO...
                  </>
                ) : submitted ? (
                  <>
                    REDIRECIONANDO...
                    <div className="w-5 h-5 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                  </>
                ) : (
                  <>
                    QUERO UM APP PERSONALIZADO!
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-gray-500 text-xs flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Seus dados estão seguros e não serão compartilhados
            </p>
          </form>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
