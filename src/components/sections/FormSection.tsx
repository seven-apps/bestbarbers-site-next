"use client";

import { motion } from "framer-motion";
import { useLeadForm } from "@/hooks";
import { ArrowRight, Sparkles, Shield, Clock, Users } from "lucide-react";

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

const trustBadges = [
  { icon: Shield, text: "Dados seguros" },
  { icon: Clock, text: "Resposta em 24h" },
  { icon: Users, text: "+1000 barbearias" },
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
      className="relative bg-[#121212] px-6 py-14 md:px-12 md:py-20 lg:px-24 lg:py-28 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#ffaf02]/8 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#ffaf02]/8 rounded-full blur-[100px]" />
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,175,2,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,175,2,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px"
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <motion.span 
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(255,175,2,0.2)",
                "0 0 40px rgba(255,175,2,0.3)",
                "0 0 20px rgba(255,175,2,0.2)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#ffaf02]/15 to-[#ffc233]/15 rounded-full text-[#ffaf02] text-sm font-bold border border-[#ffaf02]/30"
          >
            <Sparkles className="w-4 h-4" />
            Oferta por tempo limitado
          </motion.span>
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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffaf02] to-[#ffc233]">oferta exclusiva</span>
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

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex justify-center gap-4 md:gap-8 mb-8"
        >
          {trustBadges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-1.5 text-gray-400"
            >
              <badge.icon className="w-4 h-4 text-[#ffaf02]" />
              <span className="text-xs font-medium">{badge.text}</span>
            </motion.div>
          ))}
        </motion.div>


        {/* Error display */}
        {submitError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm"
          >
            <p className="text-red-400 text-sm font-medium text-center">{submitError}</p>
          </motion.div>
        )}

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#1e1e1e]/80 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-gray-800/50 p-6 md:p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {formFields.map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                className="space-y-2"
              >
                <label className="block font-semibold text-[13px] md:text-[14px] leading-[20px] text-white/90">
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
                  className="w-full bg-[#0f1015] border-2 border-[#2a2d35] rounded-xl px-5 py-4 text-white placeholder-gray-500 font-medium text-[15px] leading-[20px] focus:outline-none focus:border-[#ffaf02] focus:bg-[#12141a] focus:shadow-[0_0_0_4px_rgba(255,175,2,0.1)] transition-all duration-300 hover:border-[#3a3d45]"
                />
              </motion.div>
            ))}

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="pt-4"
            >
              <motion.div
                animate={!isSubmitting ? { 
                  boxShadow: [
                    "0 0 0 0 rgba(255,175,2,0)",
                    "0 0 0 8px rgba(255,175,2,0.15)",
                    "0 0 0 16px rgba(255,175,2,0)"
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="rounded-full"
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={isSubmitting ? {} : { scale: 1.02, y: -2 }}
                  whileTap={isSubmitting ? {} : { scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#ffaf02] to-[#ffc233] text-[#121212] font-extrabold text-[15px] md:text-[16px] leading-[24px] px-6 py-5 rounded-full hover:from-[#e69f00] hover:to-[#ffaf02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_8px_40px_rgba(255,175,2,0.35)] hover:shadow-[0_12px_50px_rgba(255,175,2,0.45)]"
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
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Trust text */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-center text-gray-500 text-xs mt-4 flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              Seus dados estão seguros e não serão compartilhados
            </motion.p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
