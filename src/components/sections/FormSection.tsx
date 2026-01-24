"use client";

import { motion } from "framer-motion";
import { useLeadForm } from "@/hooks";
import { ArrowRight, Check, Sparkles } from "lucide-react";

interface FormSectionProps {
  title?: string;
  description?: string;
  ctaText?: string;
}

const inputVariants = {
  focus: {
    scale: 1.01,
    transition: { duration: 0.2 },
  },
};

const formFields = [
  { name: "barbershopName", label: "Nome da Barbearia", placeholder: "Digite o nome da sua barbearia", type: "text" },
  { name: "ownerName", label: "Nome do Dono da barbearia", placeholder: "Digite o nome do dono da barbearia", type: "text" },
  { name: "whatsapp", label: "WhatsApp do Dono da barbearia", placeholder: "Celular - whatsapp do dono da barbearia", type: "tel" },
  { name: "monthlyRevenue", label: "Faturamento médio mensal (R$)", placeholder: "Quanto sua barbearia fatura por mês", type: "text" },
  { name: "employeeCount", label: "Número de colaboradores", placeholder: "Quantos colaboradores tem na barbearia", type: "number" },
];

export function FormSection({
  title = "Garanta já sua oferta exclusiva para ter o app da sua barbearia",
  description = "Você pode continuar no improviso, ou pode dar o próximo passo e ter seu app, sua marca e sua receita recorrente.\n\nO BestBarbers faz isso rápido, simples e sem custo absurdo.",
  ctaText = "GARANTIR MINHA OFERTA",
}: FormSectionProps) {
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
      className="relative bg-[#121212] px-6 py-12 md:px-12 md:py-16 lg:px-24 lg:py-24 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#ffaf02]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#ffaf02]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffaf02]/10 rounded-full text-[#ffaf02] text-sm font-semibold border border-[#ffaf02]/20">
            <Sparkles className="w-4 h-4" />
            Oferta por tempo limitado
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-extrabold text-[28px] leading-[36px] md:text-[36px] md:leading-[44px] lg:text-[44px] lg:leading-[52px] tracking-tight text-white mb-6 text-center"
        >
          {title.split("oferta exclusiva").map((part, i) =>
            i === 0 ? (
              <span key={i}>
                {part}
                <span className="text-[#ffaf02]">oferta exclusiva</span>
              </span>
            ) : (
              part
            )
          )}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-medium text-[15px] leading-[24px] md:text-[17px] md:leading-[28px] text-gray-300 mb-8 text-center whitespace-pre-line max-w-xl mx-auto"
        >
          {description}
        </motion.p>


        {/* Error display */}
        {submitError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6"
          >
            <p className="text-red-400 text-sm font-medium text-center">{submitError}</p>
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {formFields.map((field, index) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
              className="space-y-2"
            >
              <label className="block font-medium text-[14px] leading-[20px] text-white/90">
                {field.label}
              </label>
              <motion.input
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleInputChange}
                placeholder={field.placeholder}
                required
                whileFocus="focus"
                variants={inputVariants}
                className="w-full bg-[#1a1d23] border-2 border-[#2a2d33] rounded-xl px-5 py-4 text-white placeholder-gray-500 font-medium text-[15px] leading-[20px] focus:outline-none focus:border-[#ffaf02] focus:bg-[#1e2127] transition-all duration-300 hover:border-[#3a3d43]"
              />
            </motion.div>
          ))}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="pt-4"
          >
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={isSubmitting ? {} : { scale: 1.02, y: -2 }}
              whileTap={isSubmitting ? {} : { scale: 0.98 }}
              className="w-full bg-[#ffaf02] text-[#121212] font-extrabold text-[16px] leading-[24px] px-6 py-5 rounded-full hover:bg-[#e69f00] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(255,175,2,0.3)] hover:shadow-[0_8px_30px_rgba(255,175,2,0.4)]"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-[#121212] border-t-transparent rounded-full"
                  />
                  ENVIANDO...
                </>
              ) : (
                <>
                  {ctaText}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Trust text */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="text-center text-gray-500 text-xs mt-4"
          >
            Seus dados estão seguros e não serão compartilhados
          </motion.p>
        </motion.form>
      </div>
    </section>
  );
}
