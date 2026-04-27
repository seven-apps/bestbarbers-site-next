"use client";

import { usePloomesAPI } from "@/hooks/usePloomesAPI";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { usePhoneMask } from "@/hooks/usePhoneMask";
import { useWhatsAppRedirect } from "@/hooks/useWhatsAppRedirect";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";

/**
 * Hero dinâmico por utm_content (Wave 4).
 * Cada parceiro/criativo tem case real (No Invention) com BestBarbers explícito.
 */
const DYNAMIC_HEROS: Record<string, { title: string; subtitle: string; partnerNote?: string }> = {
  "mil-353": {
    title: "353 assinantes\nem 1 cadeira",
    subtitle: "Como uma barbearia transformou faturamento em recorrência com o BestBarbers",
    partnerNote: "4 cadeiras, R$15.892 → R$31.690/mês",
  },
  "mil-prej": {
    title: "R$1,95 de prejuízo\npor cada corte",
    subtitle: "A matemática que mostra quanto você perde sem sistema de gestão",
  },
  "kaiq-700": {
    title: "700+ assinantes\nem uma única unidade",
    subtitle: "Barbearia single-unit no Rio escalou com BestBarbers",
  },
  "js-40k": {
    title: "40 mil agendamentos\ncom app próprio",
    subtitle: "Barbearia em BH gerencia automaticamente com o BestBarbers",
  },
  "du-01": {
    title: "Cobrança automática\ndivisor de águas",
    subtitle: "De cobrar cliente na mão para assinatura automática via BestBarbers",
  },
  "dg-01": {
    title: "Suporte que\nacompanha você",
    subtitle: "Qualquer dúvida tem acompanhamento. Recomendado por donos de barbearia",
  },
  "ec-01": {
    title: "Cliente paga\ndentro do app",
    subtitle: "Pagamento, troca de cartão, tudo automatizado no BestBarbers",
  },
  "mk-01": {
    title: "Aumentou faturamento,\nficou mais profissional",
    subtitle: "Clube de assinaturas gerenciado pelo BestBarbers",
  },
  "sp-01": {
    title: "Indicadores na mão\n+ app personalizado",
    subtitle: "Dados e whitelabel exclusivo da sua marca com BestBarbers",
  },
};

const DEFAULT_HERO = {
  title: "Descubra o potencial\nda sua barbearia",
  subtitle: "App próprio • Clube de Assinaturas • Gestão",
  partnerNote: undefined as string | undefined,
};

/**
 * V8 — Single-step form (Wave 4 atualizado em 2026-04-15).
 *
 * Filtragem ANTES do submit: lead preenche TODOS os campos antes de virar lead.
 * Aumenta commitment → reduz volume mas eleva qualidade (alinhado a SDR único).
 *
 * Mantém:
 *   - F3 Dedup Ploomes (checkPhoneExists)
 *   - F4 Gate ICP (ate-3k → /v8-nutricao, sem virar lead)
 *   - F6 CAPI dual stack (Pixel + server-side)
 *   - Hero dinâmico por utm_content
 */
export default function V8MiniFormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Form state
  const [whatsapp, setWhatsapp] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [barbershopName, setBarbershopName] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");

  const ploomes = usePloomesAPI();
  const { trackLead, trackCustomEvent } = useMetaPixel();
  const { applyPhoneMask } = usePhoneMask();
  const { redirectToWhatsApp } = useWhatsAppRedirect();
  const router = useRouter();

  // Hero dinâmico por utm_content
  const hero = useMemo(() => {
    if (typeof window === "undefined") return DEFAULT_HERO;
    const utmContent = (new URLSearchParams(window.location.search).get("utm_content") || "").toLowerCase();
    return DYNAMIC_HEROS[utmContent] || DEFAULT_HERO;
  }, []);

  // CAPI server-side (dual stack com Pixel)
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
          eventName,
          eventId,
          userData: { ...data, country: "br" },
          eventSourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      }).catch(() => {});
    } catch { /* swallow */ }
  }, []);

  useEffect(() => {
    setMounted(true);
    trackCustomEvent("ViewContent", {
      content_name: "v8-single-form",
      content_category: "lead-capture",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Submit único (todos campos obrigatórios) ─────────────────
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const phone = whatsapp.replace(/\D/g, "");
    if (phone.length < 10) { setError("WhatsApp inválido."); return; }
    if (ownerName.trim().length < 2) { setError("Preencha seu nome."); return; }
    if (barbershopName.trim().length < 2) { setError("Preencha o nome da barbearia."); return; }
    if (!employeeCount) { setError("Selecione o número de colaboradores."); return; }
    if (!monthlyRevenue) { setError("Selecione o faturamento mensal."); return; }

    setIsSubmitting(true);
    setError(null);

    try {
      // F3 — Dedup Ploomes
      const exists = await ploomes.checkPhoneExists(phone);
      if (exists) {
        setError("Vimos que já estamos em contato com este WhatsApp! Em alguns minutos um dos nossos especialistas vai te chamar.");
        setIsSubmitting(false);
        await trackCustomEvent("Contact", { content_name: "v8-dup-detected", content_category: "lead-recapture" });
        return;
      }

      // F4 — Gate ICP duro: faturamento <R$3K vai pra nutrição (não vira lead)
      if (monthlyRevenue === "ate-3k") {
        await trackCustomEvent("ViewContent", {
          content_name: "v8-icp-gate-nurture",
          content_category: "lead-nurture",
        });
        router.push("/v8-nutricao");
        return;
      }

      // Lead qualificado (passou no gate ICP) — cria com TODOS os dados de uma vez
      const response = await ploomes.createContact({
        barbershopName: barbershopName.trim(),
        ownerName: ownerName.trim(),
        whatsapp: phone,
        employeeCount,
        monthlyRevenue,
      });

      const createdId = response?.value?.[0]?.Id;

      // Único eventId compartilhado entre Pixel client e CAPI server (deduplicação Meta)
      const eventId = `v8-submit-${createdId || phone}-${Date.now()}`;

      // 1 evento "Lead" — Pixel + CAPI com MESMO eventId = Meta consolida em 1
      await trackLead({
        content_name: "v8-single-form",
        content_category: "lead-capture",
        barbershop_name: barbershopName,
        employee_count: employeeCount,
      }, eventId);
      void capiTrack("Lead", eventId, {
        phone,
        firstName: ownerName.split(" ")[0],
        lastName: ownerName.split(" ").slice(1).join(" "),
      });

      // Redirect WhatsApp
      redirectToWhatsApp();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [whatsapp, ownerName, barbershopName, employeeCount, monthlyRevenue, ploomes, trackLead, trackCustomEvent, redirectToWhatsApp, router, capiTrack]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#0C1120] flex flex-col items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/Logo-BestBarbers-branco_1.webp"
            alt="BestBarbers"
            width={200}
            height={45}
            priority
          />
        </div>

        {/* Hero */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-3 leading-tight whitespace-pre-line">
            {hero.title}
          </h1>
          <p className="text-[#FFAF02] font-semibold text-lg mb-2">
            {hero.subtitle}
          </p>
          {hero.partnerNote && (
            <p className="text-gray-300 text-sm italic mb-1">{hero.partnerNote}</p>
          )}
          <p className="text-gray-400 text-sm">
            1.200+ barbearias &bull; A partir de R$299/mês
          </p>
        </div>

        {/* Trust stats */}
        <div className="flex justify-center gap-6 mb-6 text-center">
          <div>
            <p className="text-[#FFAF02] font-bold text-xl">51K+</p>
            <p className="text-gray-500 text-xs">assinantes</p>
          </div>
          <div className="w-px bg-[#2a2d35]" />
          <div>
            <p className="text-[#FFAF02] font-bold text-xl">6M+</p>
            <p className="text-gray-500 text-xs">agendamentos</p>
          </div>
          <div className="w-px bg-[#2a2d35]" />
          <div>
            <p className="text-[#FFAF02] font-bold text-xl">R$5M+</p>
            <p className="text-gray-500 text-xs">processados/mês</p>
          </div>
        </div>

        {/* Form único — todos campos obrigatórios */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">Seu nome</label>
            <input
              type="text"
              placeholder="Como te chamamos?"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#0f1015] border border-[#2a2d35] rounded-xl
                text-white placeholder-gray-600 focus:border-[#FFAF02] focus:outline-none
                transition-all duration-200"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">Nome da barbearia</label>
            <input
              type="text"
              placeholder="Ex: Barbearia do Zé"
              value={barbershopName}
              onChange={(e) => setBarbershopName(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#0f1015] border border-[#2a2d35] rounded-xl
                text-white placeholder-gray-600 focus:border-[#FFAF02] focus:outline-none
                transition-all duration-200"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Colaboradores</label>
              <select
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#0f1015] border border-[#2a2d35] rounded-xl
                  text-white focus:border-[#FFAF02] focus:outline-none appearance-none
                  transition-all duration-200"
                required
              >
                <option value="">Selecione</option>
                <option value="1">1 (só eu)</option>
                <option value="2-3">2-3</option>
                <option value="4-6">4-6</option>
                <option value="7-10">7-10</option>
                <option value="10+">10+</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Faturamento/mês</label>
              <select
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(e.target.value)}
                className="w-full px-4 py-3.5 bg-[#0f1015] border border-[#2a2d35] rounded-xl
                  text-white focus:border-[#FFAF02] focus:outline-none appearance-none
                  transition-all duration-200"
                required
              >
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
              className="w-full px-5 py-4 bg-[#0f1015] border-2 border-[#2a2d35] rounded-xl
                text-white text-lg placeholder-gray-600
                focus:border-[#FFAF02] focus:bg-[#12141a] focus:outline-none
                focus:shadow-[0_0_0_4px_rgba(255,175,2,0.1)]
                transition-all duration-200"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-[#029912] to-[#02ab15]
              text-white font-bold text-lg rounded-xl
              shadow-[0_8px_40px_rgba(2,171,21,0.4)]
              hover:shadow-[0_8px_50px_rgba(2,171,21,0.6)]
              hover:scale-[1.02]
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200"
          >
            {isSubmitting ? "Enviando..." : "Quero ver a proposta →"}
          </button>

          <p className="text-gray-600 text-xs text-center">
            Sem spam. Em breve um especialista te chama no WhatsApp.
          </p>
        </form>
      </div>
    </main>
  );
}
