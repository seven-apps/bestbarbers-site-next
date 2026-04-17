"use client";

import { usePloomesAPI } from "@/hooks/usePloomesAPI";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { usePhoneMask } from "@/hooks/usePhoneMask";
import { useWhatsAppRedirect } from "@/hooks/useWhatsAppRedirect";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function V10Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);

  const [whatsapp, setWhatsapp] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [barbershopName, setBarbershopName] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const heroCtaRef = useRef<HTMLButtonElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  const ploomes = usePloomesAPI();
  const { trackLead, trackCompleteRegistration, trackCustomEvent } = useMetaPixel();
  const { applyPhoneMask } = usePhoneMask();
  const { redirectToWhatsApp } = useWhatsAppRedirect();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    trackCustomEvent("ViewContent", {
      content_name: "v10-static-lp",
      content_category: "lead-capture",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const heroCta = heroCtaRef.current;
    const formSection = formSectionRef.current;
    if (!heroCta) return;

    const heroObs = new IntersectionObserver(
      ([entry]) => {
        if (!formSection) {
          setShowStickyCta(!entry.isIntersecting);
          return;
        }
        const formRect = formSection.getBoundingClientRect();
        const formVisible = formRect.top < window.innerHeight && formRect.bottom > 0;
        setShowStickyCta(!entry.isIntersecting && !formVisible);
      },
      { threshold: 0 }
    );
    heroObs.observe(heroCta);

    const scrollHandler = () => {
      if (!formSection) return;
      const formRect = formSection.getBoundingClientRect();
      const formVisible = formRect.top < window.innerHeight && formRect.bottom > 0;
      const heroBtn = heroCtaRef.current;
      const heroVisible = heroBtn ? heroBtn.getBoundingClientRect().bottom > 0 : false;
      setShowStickyCta(!heroVisible && !formVisible);
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });

    return () => {
      heroObs.disconnect();
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const thresholds = [25, 50, 75, 100];
    const fired = new Set<number>();
    const handler = () => {
      const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      for (const t of thresholds) {
        if (pct >= t && !fired.has(t)) {
          fired.add(t);
          trackCustomEvent("ScrollDepth", { depth: t, page: "v10" });
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [mounted, trackCustomEvent]);

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const capiTrack = useCallback(async (
    eventName: "Lead" | "CompleteRegistration" | "QualifiedLead",
    eventId: string,
    data: { phone?: string; firstName?: string; lastName?: string }
  ) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BBAI_API_URL || "https://ai.bestbarbers.app"}/api/meta-capi/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName, eventId,
          userData: { ...data, country: "br" },
          eventSourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      }).catch(() => {});
    } catch { /* swallow */ }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = whatsapp.replace(/\D/g, "");
    if (phone.length < 10) { setError("WhatsApp inválido."); return; }
    if (ownerName.trim().length < 2) { setError("Preencha seu nome."); return; }
    if (barbershopName.trim().length < 2) { setError("Nome da barbearia."); return; }
    if (!employeeCount) { setError("Selecione as cadeiras."); return; }
    if (!monthlyRevenue) { setError("Selecione o faturamento."); return; }

    setIsSubmitting(true);
    setError(null);

    try {
      const exists = await ploomes.checkPhoneExists(phone);
      if (exists) {
        setError("Já estamos em contato com este WhatsApp! Em breve um especialista te chama.");
        setIsSubmitting(false);
        return;
      }

      if (monthlyRevenue === "ate-3k") {
        await trackCustomEvent("ViewContent", { content_name: "v10-icp-gate-nurture", content_category: "lead-nurture" });
        router.push("/v8-nutricao");
        return;
      }

      const response = await ploomes.createContact({
        barbershopName: barbershopName.trim(),
        ownerName: ownerName.trim(),
        whatsapp: phone,
        employeeCount,
        monthlyRevenue,
      });

      const createdId = response?.value?.[0]?.Id;
      const eventId = `v10-submit-${createdId || phone}-${Date.now()}`;

      await trackLead({ content_name: "v10-static-lp", content_category: "lead-capture", barbershop_name: barbershopName, employee_count: employeeCount });
      await trackCompleteRegistration({ content_name: "v10-complete", content_category: "lead-capture", barbershop_name: barbershopName, employee_count: employeeCount });
      void capiTrack("QualifiedLead", eventId, { phone, firstName: ownerName.split(" ")[0], lastName: ownerName.split(" ").slice(1).join(" ") });

      redirectToWhatsApp();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setIsSubmitting(false);
    }
  }, [whatsapp, ownerName, barbershopName, employeeCount, monthlyRevenue, ploomes, trackLead, trackCompleteRegistration, trackCustomEvent, redirectToWhatsApp, router, capiTrack]);

  if (!mounted) return null;

  const inputClass = "w-full px-4 py-3.5 bg-[#0f1015] border border-[#2a2d35] rounded-xl text-white placeholder-gray-600 focus:border-[#FFAF02] focus:outline-none transition-all duration-200";
  const selectClass = "w-full px-4 py-3.5 bg-[#0f1015] border border-[#2a2d35] rounded-xl text-white focus:border-[#FFAF02] focus:outline-none appearance-none transition-all duration-200";
  const ctaClass = "w-full py-4 bg-gradient-to-r from-[#029912] to-[#02ab15] text-white font-bold text-lg rounded-xl shadow-[0_8px_40px_rgba(2,171,21,0.4)] hover:shadow-[0_8px_50px_rgba(2,171,21,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200";

  return (
    <main className="min-h-screen bg-[#0C1120] text-white overflow-x-hidden">

      {/* ══════════════════════════════════════════════
          HERO — Impacto visual + número + mockup
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center px-5 py-12 overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#FFAF02]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-lg mx-auto relative z-10">
          <Image
            src="/images/Logo-BestBarbers-branco_1.webp"
            alt="BestBarbers"
            width={140}
            height={32}
            priority
            className="mb-8"
          />

          {/* Headline com tipografia dramática */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-3">
              Cliente BestBarbers
            </p>
            <h1 className="text-[2.75rem] sm:text-6xl font-extrabold leading-[1.05] tracking-tight">
              De{" "}
              <span className="text-[#FFAF02]">R$15 mil</span>
              <br />
              pra{" "}
              <span className="text-[#FFAF02]">R$31 mil.</span>
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-white/80 mt-3">
              Mesmas 4 cadeiras.
            </p>
            <p className="text-gray-500 text-base mt-2">
              353 assinantes depois, o dono saiu do operacional.
            </p>
          </div>

          {/* App mockup + stats */}
          <div className="flex items-end gap-5 mb-8">
            <div className="w-[130px] flex-shrink-0">
              <Image
                src="/images/imagens-mobile/Mockup-app-milenitos.png"
                alt="App personalizado — Barbearia Milenitos"
                width={260}
                height={520}
                className="w-full h-auto drop-shadow-[0_20px_60px_rgba(255,175,2,0.15)]"
                priority
              />
            </div>
            <div className="flex-1 space-y-3 pb-4">
              {[
                { n: "1.200+", l: "barbearias" },
                { n: "51K+", l: "assinantes ativos" },
                { n: "6M+", l: "agendamentos/mês" },
              ].map((s) => (
                <div key={s.l} className="flex items-baseline gap-2">
                  <span className="text-[#FFAF02] font-extrabold text-xl">{s.n}</span>
                  <span className="text-gray-500 text-xs">{s.l}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            ref={heroCtaRef}
            onClick={scrollToForm}
            className={ctaClass}
          >
            Quero ver minha proposta →
          </button>

          <p className="text-gray-600 text-xs text-center mt-3">
            Sem compromisso · Conversa de 15 min · Pelo WhatsApp
          </p>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-gray-600">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          RECONHECIMENTO — 3 cenas visuais da rotina
      ══════════════════════════════════════════════ */}
      <section className="px-5 py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C1120] via-[#0f1318] to-[#0C1120] pointer-events-none" />
        <div className="w-full max-w-lg mx-auto relative z-10">
          <p className="text-[#FFAF02] text-xs font-bold uppercase tracking-widest text-center mb-2">
            Se identifica?
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            Isso é a sua rotina?
          </h2>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-30px" }} variants={stagger} className="space-y-5">
            {/* WhatsApp card */}
            <motion.div variants={fadeUp} className="bg-[#1a1d25] rounded-2xl p-6 border border-[#2a2d35] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#25D366]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center">
                  <svg width="16" height="16" fill="#25D366" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.626-1.462A11.932 11.932 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.19-.587-5.935-1.608l-.425-.253-2.743.867.84-2.68-.278-.442A9.776 9.776 0 012.182 12c0-5.423 4.395-9.818 9.818-9.818S21.818 6.577 21.818 12s-4.395 9.818-9.818 9.818z"/></svg>
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Conversa real</span>
              </div>
              <div className="space-y-2 mb-4 pl-2">
                {[
                  { msg: "Tem horário?", sent: true },
                  { msg: "15h pode?", sent: false },
                  { msg: "Não dá.", sent: true },
                  { msg: "Deixa pra lá.", sent: true },
                ].map((m, i) => (
                  <div key={i} className={`flex ${m.sent ? "justify-start" : "justify-end"}`}>
                    <div className={`px-3.5 py-2 rounded-2xl text-sm max-w-[70%] ${
                      m.sent
                        ? "bg-[#25D366]/10 text-[#7ee89c] rounded-bl-md"
                        : "bg-[#2a2d35] text-gray-300 rounded-br-md"
                    }`}>
                      {m.msg}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-red-400 text-sm font-semibold flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-xs">✕</span>
                Cliente perdido.
              </p>
            </motion.div>

            {/* Caderninho card */}
            <motion.div variants={fadeUp} className="bg-[#1a1d25] rounded-2xl p-6 border border-[#2a2d35] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-sm">📒</div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Caderninho</span>
              </div>
              <div className="bg-[#12141a] rounded-xl p-4 mb-4 border border-[#1f2229] font-mono text-sm">
                <p className="text-gray-400">Comissão do João:</p>
                <p className="text-gray-300">Seg: 12 cortes &nbsp;✓</p>
                <p className="text-gray-300">Ter: 8 cortes &nbsp;&nbsp;✓</p>
                <p className="text-gray-300">Qua: <span className="text-yellow-400">15? ou 13?</span></p>
                <p className="text-gray-500 italic mt-1">Será que tá certo? 🤔</p>
              </div>
              <p className="text-red-400 text-sm font-semibold flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-xs">✕</span>
                Erro todo mês.
              </p>
            </motion.div>

            {/* Fim do mês card */}
            <motion.div variants={fadeUp} className="bg-[#1a1d25] rounded-2xl p-6 border border-[#2a2d35] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-sm">💰</div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fim do mês</span>
              </div>
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Faturou</span>
                  <span className="text-white font-semibold">R$18.000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Aluguel + equipe + produtos</span>
                  <span className="text-red-400">−R$16.500</span>
                </div>
                <div className="h-px bg-[#2a2d35] my-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Sobrou</span>
                  <span className="text-red-400 font-bold text-lg">R$1.500</span>
                </div>
              </div>
              <p className="text-red-400 text-sm font-semibold flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-xs">✕</span>
                Trabalhou o mês inteiro pra isso.
              </p>
            </motion.div>
          </motion.div>

          <p className="text-center text-gray-500 text-sm mt-10 leading-relaxed">
            Se você se viu em pelo menos uma dessas cenas,
            <br />
            <span className="text-white font-medium">a gente pode mudar isso.</span>
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          BEFORE/AFTER — Transformação visual
      ══════════════════════════════════════════════ */}
      <section className="px-5 py-16">
        <div className="w-full max-w-lg mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            E se fosse assim?
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {/* Header */}
            <div className="bg-red-900/20 border border-red-900/30 rounded-xl px-4 py-3 text-center">
              <p className="text-red-400 font-bold text-xs uppercase tracking-wider">❌ Antes</p>
            </div>
            <div className="bg-green-900/20 border border-green-900/30 rounded-xl px-4 py-3 text-center">
              <p className="text-green-400 font-bold text-xs uppercase tracking-wider">✅ Depois</p>
            </div>

            {[
              ["WhatsApp\npra tudo", "App próprio\nagenda 24h"],
              ["Caderninho\ne achismo", "Comissão\nautomática"],
              ["Cobrar\ncliente na mão", "Cobrança\nno cartão"],
              ["R$15 mil\nsem saber\npra onde vai", "R$31 mil\nsabendo\ncada centavo"],
            ].map(([before, after], i) => (
              <div key={i} className="contents">
                <div className="bg-red-950/20 border border-red-900/10 rounded-xl px-4 py-3.5">
                  <p className="text-red-300/70 text-sm whitespace-pre-line leading-relaxed">{before}</p>
                </div>
                <div className="bg-green-950/20 border border-green-900/10 rounded-xl px-4 py-3.5">
                  <p className="text-green-300 text-sm font-medium whitespace-pre-line leading-relaxed">{after}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center space-y-0.5">
            <p className="text-gray-500">Mesmas 4 cadeiras. Mesma equipe.</p>
            <p className="text-gray-500">O que mudou?</p>
            <p className="text-[#FFAF02] text-2xl font-extrabold mt-3">O sistema.</p>
          </div>

          {/* Mockup celular + notebook */}
          <div className="mt-10 flex justify-center">
            <Image
              src="/images/começando-agora-mockup-celular-e-notebook_1.webp"
              alt="Dashboard e app BestBarbers"
              width={500}
              height={350}
              className="w-full max-w-[400px] h-auto"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          O QUE FAZ — Produto real com mockups
      ══════════════════════════════════════════════ */}
      <section className="px-5 py-16 bg-[#0a0e18]">
        <div className="w-full max-w-lg mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-[#FFAF02] text-xs font-bold uppercase tracking-widest text-center mb-2">
              Tudo em um lugar
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl font-bold text-center mb-4">
              O que o BestBarbers faz por você
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-500 text-sm text-center mb-10">
              Veja o produto real, usado por mais de 1.200 barbearias.
            </motion.p>
          </motion.div>

          {/* App próprio — mockup real */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="bg-[#12151d] rounded-2xl p-6 border border-[#1f2229] mb-4">
            <div className="flex gap-5 items-center">
              <div className="w-[100px] flex-shrink-0">
                <Image src="/images/best-images-mockup/HOME-CLIENTE.webp" alt="App BestBarbers personalizado" width={200} height={400} className="w-full h-auto rounded-xl" />
              </div>
              <div className="flex-1">
                <p className="text-[#FFAF02] font-bold text-xs uppercase tracking-wider mb-1">App com SUA marca</p>
                <p className="text-white font-bold text-lg mb-1">Seu nome na App Store.</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Seu cliente baixa, agenda e paga. Tudo com a identidade da <span className="text-[#FFAF02]">SUA</span> barbearia.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Dashboard + gestão — mockup real */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="bg-[#12151d] rounded-2xl p-6 border border-[#1f2229] mb-4">
            <p className="text-[#FFAF02] font-bold text-xs uppercase tracking-wider mb-1">Gestão completa</p>
            <p className="text-white font-bold text-lg mb-3">Faturamento, comissão, clientes. Na palma da mão.</p>
            <Image src="/images/best-images-mockup/gerenciamento-de-assinaturas_1.webp" alt="Dashboard financeiro BestBarbers" width={500} height={350} className="w-full h-auto rounded-xl" />
            <p className="text-gray-500 text-xs mt-3 text-center">Dashboard financeiro real. Sem achismo.</p>
          </motion.div>

          {/* Duas features lado a lado */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="bg-[#12151d] rounded-2xl p-5 border border-[#1f2229]">
              <div className="w-12 h-12 rounded-xl bg-[#FFAF02]/10 flex items-center justify-center mb-3">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#FFAF02" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </div>
              <p className="text-white font-bold text-sm mb-1">Clube de assinatura</p>
              <p className="text-gray-500 text-xs leading-relaxed">Cobrança automática no cartão. <span className="text-[#FFAF02]">Sem calote.</span></p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="bg-[#12151d] rounded-2xl p-5 border border-[#1f2229]">
              <div className="w-12 h-12 rounded-xl bg-[#FFAF02]/10 flex items-center justify-center mb-3">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#FFAF02" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <p className="text-white font-bold text-sm mb-1">Agenda inteligente</p>
              <p className="text-gray-500 text-xs leading-relaxed">Cliente agenda sozinho, 24h. <span className="text-[#FFAF02]">Sem perder horário.</span></p>
            </motion.div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              A partir de <span className="text-[#FFAF02] font-bold text-lg">R$299</span><span className="text-gray-500">/mês</span>
            </p>
            <p className="text-gray-600 text-xs mt-1">Se paga com 3 clientes no clube.</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PROVA SOCIAL — Depoimentos + foto influenciadores
      ══════════════════════════════════════════════ */}
      <section className="px-5 py-16">
        <div className="w-full max-w-lg mx-auto">
          <p className="text-[#FFAF02] text-xs font-bold uppercase tracking-widest text-center mb-2">
            Quem usa, comprova
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Quem já usa, não volta atrás.
          </h2>

          {/* Influencer bar */}
          <div className="flex justify-center mb-10">
            <Image
              src="/images/hero-best-5-influencers.png"
              alt="Parceiros BestBarbers"
              width={400}
              height={100}
              className="w-full max-w-[320px] h-auto opacity-90"
            />
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-30px" }} variants={stagger} className="space-y-4">
            {[
              {
                quote: "R$34 mil pra receber nos próximos dias. Só de assinatura. Sem correr atrás de ninguém.",
                name: "Mileno Rocha",
                info: "3 barbearias — SP",
                photo: "/images/partners/mileno.png",
                metric: "R$34K/mês em assinaturas",
              },
              {
                quote: "700+ assinantes. Uma barbearia. Gestão é bagulho sério.",
                name: "Kaique Alves",
                info: "Bagulho Barbershop — SP",
                photo: "/images/partners/kaique.png",
                metric: "700+ assinantes, 1 unidade",
              },
              {
                quote: "6 unidades, 1.000 assinantes. O app com nossa marca mudou tudo.",
                name: "Rapha",
                info: "Barbearia do Rapha — MG",
                photo: "/images/partners/rapha.png",
                metric: "R$440K/mês faturamento total",
              },
            ].map((t) => (
              <motion.div key={t.name} variants={fadeUp} className="bg-[#1a1d25] rounded-2xl p-5 border border-[#2a2d35]">
                <div className="flex gap-1 text-[#FFAF02] text-xs mb-3">★★★★★</div>
                <p className="text-white text-[15px] leading-relaxed mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#FFAF02]/30 flex-shrink-0">
                    <Image src={t.photo} alt={t.name} width={48} height={48} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.info}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[#FFAF02] text-xs font-bold">{t.metric}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <button onClick={scrollToForm} className={`${ctaClass} mt-8`}>
            Quero ver minha proposta →
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          JUSTIFICATIVA — Math + Pratfall
      ══════════════════════════════════════════════ */}
      <section className="px-5 py-16 bg-[#0a0e18]">
        <div className="w-full max-w-lg mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
              Faça a conta.
            </h2>
            <p className="text-gray-500 text-sm text-center mb-10">
              Quanto sai do seu bolso todo mês sem você perceber?
            </p>
          </motion.div>

          {/* Quanto perde */}
          <div className="bg-red-950/30 border border-red-900/20 rounded-2xl p-6 mb-4">
            <p className="text-red-400 font-bold text-xs uppercase tracking-wider mb-5">
              Quanto você perde sem sistema
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Clientes que não voltam (sem controle)</span>
                <span className="text-red-400 font-bold">R$2.700/mês</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Horários vazios (agenda manual)</span>
                <span className="text-red-400 font-bold">R$1.800/mês</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Erro de comissão (caderninho)</span>
                <span className="text-red-400 font-bold">R$500/mês</span>
              </div>
              <div className="h-px bg-red-900/30" />
              <div className="flex justify-between items-center pt-2">
                <span className="text-white font-bold text-base">TOTAL PERDIDO</span>
                <div className="text-right">
                  <span className="text-red-400 font-extrabold text-3xl sm:text-4xl">R$5.000</span>
                  <p className="text-red-400/60 text-xs">por mês ❌</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quanto custa */}
          <div className="bg-green-950/30 border border-green-900/20 rounded-2xl p-6 mb-10">
            <p className="text-green-400 font-bold text-xs uppercase tracking-wider mb-2">
              App próprio + clube + gestão completa
            </p>
            <p className="text-white text-base mb-4 leading-relaxed">
              Quanto custa ter um <span className="text-[#FFAF02] font-bold">app próprio</span> da sua barbearia na App Store?
            </p>
            <div className="text-center py-2">
              <span className="text-green-400 text-5xl font-extrabold">R$299</span>
              <span className="text-green-400/50 text-lg">/mês</span>
            </div>
            <p className="text-center text-gray-500 text-xs mt-1 mb-3">
              Sem taxa de implantação. Sem fidelidade.
            </p>
            <p className="text-center text-gray-400 text-sm">
              Se paga com <span className="text-white font-bold">3 clientes</span> no clube.
            </p>
            <p className="text-center text-green-400 font-bold mt-1">
              O resto é lucro. ✅
            </p>
          </div>

          {/* Pratfall */}
          <div className="text-center px-4">
            <p className="text-gray-500 text-sm mb-2">
              Não somos o sistema mais barato.
            </p>
            <p className="text-white text-base leading-relaxed">
              Somos o <span className="text-[#FFAF02] font-bold">único</span> com app na{" "}
              <span className="text-[#FFAF02] font-bold">SUA</span> marca + clube com cobrança automática + gestão completa.
            </p>
            <p className="text-gray-600 text-sm mt-2">Tudo em um.</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA FINAL + FORMULÁRIO
      ══════════════════════════════════════════════ */}
      <section className="px-5 py-16" ref={formSectionRef} id="formulario">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
            Descubra o potencial da{" "}
            <span className="text-[#FFAF02]">SUA</span> barbearia.
          </h2>
          <p className="text-gray-500 text-sm text-center mb-8">
            Preencha em 30 segundos. Sem compromisso.
          </p>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 bg-[#12151d] p-6 rounded-2xl border border-[#1f2229]">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Seu nome</label>
              <input type="text" placeholder="Como te chamamos?" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className={inputClass} required />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Nome da barbearia</label>
              <input type="text" placeholder="Ex: Barbearia do Zé" value={barbershopName} onChange={(e) => setBarbershopName(e.target.value)} className={inputClass} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Cadeiras</label>
                <select value={employeeCount} onChange={(e) => setEmployeeCount(e.target.value)} className={selectClass} required>
                  <option value="">Selecione</option>
                  <option value="1">1 (só eu)</option>
                  <option value="2-3">2-3</option>
                  <option value="4-6">4-6</option>
                  <option value="7-10">7+</option>
                  <option value="10+">Multi-unidade</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Faturamento/mês</label>
                <select value={monthlyRevenue} onChange={(e) => setMonthlyRevenue(e.target.value)} className={selectClass} required>
                  <option value="">Selecione</option>
                  <option value="ate-3k">Até R$3K</option>
                  <option value="3k-6k">R$3K - R$6K</option>
                  <option value="6k-15k">R$6K - R$15K</option>
                  <option value="15k-30k">R$15K - R$30K</option>
                  <option value="30k+">R$30K+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Seu WhatsApp</label>
              <input
                type="tel"
                placeholder="(00) 00000-0000"
                value={whatsapp}
                onChange={(e) => setWhatsapp(applyPhoneMask(e.target.value))}
                className="w-full px-5 py-4 bg-[#0f1015] border-2 border-[#2a2d35] rounded-xl text-white text-lg placeholder-gray-600 focus:border-[#FFAF02] focus:bg-[#12141a] focus:outline-none focus:shadow-[0_0_0_4px_rgba(255,175,2,0.1)] transition-all duration-200"
                required
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button type="submit" disabled={isSubmitting} className={`${ctaClass} disabled:opacity-50 disabled:cursor-not-allowed`}>
              {isSubmitting ? "Enviando..." : "Quero ver minha proposta →"}
            </button>

            <div className="text-center space-y-1 pt-1">
              <p className="text-gray-500 text-xs flex items-center justify-center gap-1.5">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                Sem compromisso · Conversa de 15 min pelo WhatsApp
              </p>
              <p className="text-gray-600 text-xs">Resposta rápida. Sem enrolação.</p>
            </div>
          </form>

          <p className="text-center text-gray-600 text-sm mt-10">
            <span className="text-[#FFAF02] font-bold">1.200+</span> barbearias já escolheram.
            <br />
            <span className="text-gray-500">Quando é a sua vez?</span>
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STICKY CTA
      ══════════════════════════════════════════════ */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 p-3 bg-[#0C1120]/95 backdrop-blur-md border-t border-[#2a2d35] transition-all duration-300 ${
          showStickyCta ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <button
          onClick={scrollToForm}
          className="w-full max-w-md mx-auto block py-3.5 bg-gradient-to-r from-[#029912] to-[#02ab15] text-white font-bold text-base rounded-xl shadow-[0_4px_20px_rgba(2,171,21,0.4)] active:scale-[0.98] transition-all duration-200"
        >
          Quero ver minha proposta →
        </button>
      </div>
    </main>
  );
}
