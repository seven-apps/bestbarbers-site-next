"use client";

import { usePloomesAPI } from "@/hooks/usePloomesAPI";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { usePhoneMask } from "@/hooks/usePhoneMask";
import { useWhatsAppRedirect } from "@/hooks/useWhatsAppRedirect";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";

/**
 * Hero dinâmico por utm_content (Wave 4 — match perfeito ad ↔ LP).
 * Cada parceiro/criativo tem seu próprio título+subtítulo+stats com case real.
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
 * V8 — Mini Form (2-step capture)
 *
 * Step 1: Só WhatsApp → salva no Ploomes imediatamente (lead capturado!)
 * Step 2: Nome, barbearia, colaboradores, faturamento → update no Ploomes → redirect WhatsApp
 */
const PLOOMES_API_KEY = 'B59785E2FC60B0D69BFE51222FE4516699B00F0F97420BBA48E25F648510FB55245A64F7CDB0C89E438AC6C0C56D973F73F99DB7FEF93422E040A2B8816B323B';
const PLOOMES_BASE_URL = 'https://api2.ploomes.com';

interface PloomesPatch {
  Name?: string;
  Title?: string;
  OtherProperties?: Array<{ FieldKey: string; StringValue: string }>;
}

export default function V8MiniFormPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [contactId, setContactId] = useState<number | null>(null);

  // Form data
  const [whatsapp, setWhatsapp] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [barbershopName, setBarbershopName] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");

  const ploomes = usePloomesAPI();
  const { trackLead, trackCompleteRegistration, trackCustomEvent } = useMetaPixel();
  const { applyPhoneMask } = usePhoneMask();
  const { redirectToWhatsApp } = useWhatsAppRedirect();
  const router = useRouter();

  // F4 — Hero dinâmico por utm_content
  const hero = useMemo(() => {
    if (typeof window === "undefined") return DEFAULT_HERO;
    const utmContent = (new URLSearchParams(window.location.search).get("utm_content") || "").toLowerCase();
    return DYNAMIC_HEROS[utmContent] || DEFAULT_HERO;
  }, []);

  // F6 — CAPI server-side (dual stack with Pixel)
  const capiTrack = useCallback(async (
    eventName: "Lead" | "CompleteRegistration" | "QualifiedLead",
    eventId: string,
    data: { phone?: string; email?: string; firstName?: string; lastName?: string }
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
      }).catch(() => {}); // Non-blocking — Pixel client-side é primário
    } catch { /* swallow */ }
  }, []);

  useEffect(() => {
    setMounted(true);
    trackCustomEvent("ViewContent", {
      content_name: "v8-mini-form",
      content_category: "lead-capture",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Step 1: Salvar só o WhatsApp + dedup check (F3) ───
  const handleStep1 = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = whatsapp.replace(/\D/g, "");
    if (phone.length < 10) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // F3 — Dedup: check Ploomes antes de criar (evita 11% lost por dup)
      const exists = await ploomes.checkPhoneExists(phone);
      if (exists) {
        // Lead já está em contato — redirect cordial sem queimar SDR de novo
        setError("Vimos que já estamos em contato com este WhatsApp! Em alguns minutos um dos nossos especialistas vai te chamar.");
        setIsSubmitting(false);
        // Track como QualifiedLead retorno (não Lead novo)
        await trackCustomEvent("Contact", { content_name: "v8-dup-detected", content_category: "lead-recapture" });
        return;
      }

      const response = await ploomes.createContact({
        barbershopName: "—",
        ownerName: "—",
        whatsapp: phone,
        employeeCount: "—",
        monthlyRevenue: "",
      });

      const createdId = response?.value?.[0]?.Id;
      if (createdId) setContactId(createdId);

      const eventId = `v8-step1-${createdId || phone}-${Date.now()}`;
      await trackLead({
        content_name: "v8-mini-form-step1",
        content_category: "lead-capture",
      });
      // F6 — CAPI server-side (dedup com pixel via eventId comum)
      void capiTrack("Lead", eventId, { phone });

      setStep(2);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar.";
      if (msg.includes("duplicado") || msg.includes("agendado")) {
        setStep(2);
      } else {
        setError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [whatsapp, ploomes, trackLead, trackCustomEvent, capiTrack]);

  // ─── Step 2: Filtro ICP (F4) + Atualizar contato + deal, redirect WhatsApp ──
  const handleStep2 = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // F4 — Gate ICP: faturamento < R$3K não vai para SDR (não tem orçamento para nosso plano R$299+)
    // Em vez disso: redirect para LP nutrição com conteúdo educacional
    if (monthlyRevenue === "ate-3k") {
      // Tag o contato como nurture (não bloqueia SDR, mas avisa que veio do gate)
      try {
        if (contactId) {
          await fetch(`${PLOOMES_BASE_URL}/Contacts(${contactId})`, {
            method: "PATCH",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "user-key": PLOOMES_API_KEY,
            },
            body: JSON.stringify({
              OtherProperties: [
                {
                  FieldKey: "contact_0748BA26-23E6-41CA-8C7A-A3568B28AC75",
                  StringValue: "ate-3k",
                },
              ],
            }),
          });
        }
      } catch { /* non-blocking */ }
      // Track como evento separado para Meta entender que esse perfil não converte
      await trackCustomEvent("ViewContent", {
        content_name: "v8-icp-gate-nurture",
        content_category: "lead-nurture",
      });
      router.push("/v8-nutricao");
      return;
    }

    try {
      if (contactId) {
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'user-key': PLOOMES_API_KEY,
        };

        // 1. PATCH contato
        const contactPatch: PloomesPatch = {};
        if (barbershopName) contactPatch.Name = barbershopName;
        contactPatch.OtherProperties = [
          ...(ownerName ? [{
            FieldKey: "contact_DA6F2406-FE50-4EFC-BBB5-A3463435B427",
            StringValue: ownerName,
          }] : []),
          ...(employeeCount ? [{
            FieldKey: "contact_51143832-6126-4F8F-9453-D6EEFFE2A352",
            StringValue: employeeCount,
          }] : []),
          ...(monthlyRevenue ? [{
            FieldKey: "contact_0748BA26-23E6-41CA-8C7A-A3568B28AC75",
            StringValue: monthlyRevenue,
          }] : []),
        ];

        await fetch(`${PLOOMES_BASE_URL}/Contacts(${contactId})`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(contactPatch),
        });

        // 2. Buscar e atualizar deal
        try {
          const dealFilter = encodeURIComponent(`ContactId eq ${contactId}`);
          const dealResp = await fetch(
            `${PLOOMES_BASE_URL}/Deals?$filter=${dealFilter}&$top=1&$orderby=CreateDate desc&$select=Id,Title`,
            { headers }
          );
          if (dealResp.ok) {
            const dealData: { value?: Array<{ Id: number }> } = await dealResp.json();
            const dealId = dealData?.value?.[0]?.Id;
            if (dealId) {
              const dealPatch: PloomesPatch = {};
              if (barbershopName) dealPatch.Title = barbershopName;
              dealPatch.OtherProperties = [
                ...(monthlyRevenue ? [{
                  FieldKey: "deal_1AE384B9-A46A-4935-B751-67FEB42B0054",
                  StringValue: monthlyRevenue,
                }] : []),
                ...(employeeCount ? [{
                  FieldKey: "deal_A48BFA65-1923-469D-8B33-51C759A06F04",
                  StringValue: employeeCount,
                }] : []),
              ];
              await fetch(`${PLOOMES_BASE_URL}/Deals(${dealId})`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(dealPatch),
              });
            }
          }
        } catch {
          // Non-blocking
        }
      }

      const eventId = `v8-step2-${contactId || Date.now()}`;
      await trackCompleteRegistration({
        content_name: "v8-mini-form-step2",
        content_category: "lead-capture",
        barbershop_name: barbershopName,
        employee_count: employeeCount,
      });
      // F6 — CAPI server-side QualifiedLead (passou no gate ICP)
      void capiTrack("QualifiedLead", eventId, {
        firstName: ownerName?.split(" ")[0],
        lastName: ownerName?.split(" ").slice(1).join(" "),
      });

      // Redirect para WhatsApp após salvar
      redirectToWhatsApp();
    } catch {
      // Mesmo se falhar, redirect para WhatsApp (telefone já salvo no step 1)
      redirectToWhatsApp();
    } finally {
      setIsSubmitting(false);
    }
  }, [contactId, ownerName, barbershopName, employeeCount, monthlyRevenue, trackCompleteRegistration, trackCustomEvent, redirectToWhatsApp, router, capiTrack]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#0C1120] flex flex-col items-center justify-center p-4">
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

        {/* ═══ Step 1: Só WhatsApp ═══ */}
        {step === 1 && (
          <>
            <div className="text-center mb-8">
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

            <div className="flex justify-center gap-6 mb-8 text-center">
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

            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Qual seu WhatsApp?
                </label>
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
                  autoFocus
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
                {isSubmitting ? "Salvando..." : "Quero saber mais →"}
              </button>

              <p className="text-gray-600 text-xs text-center">
                Sem spam. Seus dados estão seguros.
              </p>
            </form>
          </>
        )}

        {/* ═══ Step 2: Dados complementares ═══ */}
        {step === 2 && (
          <>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 mb-6 text-center">
              <p className="text-green-400 text-sm font-medium">
                ✓ WhatsApp salvo! Complete seus dados para agilizar o atendimento.
              </p>
            </div>

            <form onSubmit={handleStep2} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Seu nome</label>
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#0f1015] border border-[#2a2d35] rounded-xl
                    text-white placeholder-gray-600 focus:border-[#FFAF02] focus:outline-none
                    transition-all duration-200"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">Nome da barbearia</label>
                <input
                  type="text"
                  placeholder="Nome da sua barbearia"
                  value={barbershopName}
                  onChange={(e) => setBarbershopName(e.target.value)}
                  className="w-full px-4 py-3.5 bg-[#0f1015] border border-[#2a2d35] rounded-xl
                    text-white placeholder-gray-600 focus:border-[#FFAF02] focus:outline-none
                    transition-all duration-200"
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

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-[#029912] to-[#02ab15]
                  text-white font-bold rounded-xl
                  shadow-[0_8px_40px_rgba(2,171,21,0.4)]
                  hover:scale-[1.02]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200"
              >
                {isSubmitting ? "Salvando..." : "Enviar"}
              </button>

              <button
                type="button"
                onClick={() => redirectToWhatsApp()}
                className="w-full py-2 text-gray-500 text-sm hover:text-gray-300 transition-colors"
              >
                Pular por agora
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
