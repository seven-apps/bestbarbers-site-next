"use client";

/**
 * V9 — Quiz Consultor (5 perguntas + case similar + captura)
 *
 * Diferença do V8: filtra lead ANTES de virar lead. Quem completa 5 perguntas
 * tem commitment + revela ICP (porte, faturamento, dor, cidade, sistema atual).
 * Lead chega no SDR com contexto completo.
 *
 * Todos os cases/quotes são REAIS (memória:cases + fdo-quotes). No Invention.
 */

import { usePloomesAPI } from "@/hooks/usePloomesAPI";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { usePhoneMask } from "@/hooks/usePhoneMask";
import { useWhatsAppRedirect } from "@/hooks/useWhatsAppRedirect";
import Image from "next/image";
import { useEffect, useState, useCallback, useMemo } from "react";

const PLOOMES_API_KEY =
  "B59785E2FC60B0D69BFE51222FE4516699B00F0F97420BBA48E25F648510FB55245A64F7CDB0C89E438AC6C0C56D973F73F99DB7FEF93422E040A2B8816B323B";
const PLOOMES_BASE_URL = "https://api2.ploomes.com";

// ─── Cases reais (No Invention — source: memória do projeto) ────

interface CaseStudy {
  id: string;
  ownerName: string;
  barbershopName: string;
  city: string;
  headline: string;
  numbers: Array<{ label: string; value: string }>;
  angle: string;
}

const CASES: Record<string, CaseStudy> = {
  pirajussara: {
    id: "pirajussara",
    ownerName: "Barbearia com 4 cadeiras",
    barbershopName: "Grande SP",
    city: "Grande SP",
    headline: "R$15.892 → R$31.690/mês em 12 meses usando o BestBarbers.",
    numbers: [
      { label: "Cadeiras", value: "4" },
      { label: "Assinantes", value: "353" },
      { label: "Faturamento atual", value: "R$31.690/mês" },
    ],
    angle: "Recorrência via clube de assinaturas dentro do BestBarbers",
  },
  bagulho: {
    id: "bagulho",
    ownerName: "Barbearia single-unit",
    barbershopName: "Rio de Janeiro",
    city: "Rio de Janeiro / RJ",
    headline: "700+ assinantes em uma só unidade com o BestBarbers.",
    numbers: [
      { label: "Assinantes", value: "700+" },
      { label: "Tipo", value: "Single-unit" },
      { label: "Crescimento", value: "Nova unidade aberta" },
    ],
    angle: "Volume + gestão de fila no app BestBarbers",
  },
  rapha: {
    id: "rapha",
    ownerName: "Rede multi-unidade",
    barbershopName: "6 unidades",
    city: "Rede com 6 unidades",
    headline: "6 unidades. 1.000 assinantes. R$176K/mês do clube no BestBarbers.",
    numbers: [
      { label: "Unidades", value: "6" },
      { label: "Assinantes", value: "1.000" },
      { label: "Clube", value: "R$176K/mês" },
    ],
    angle: "Multi-unidade com gestão unificada no BestBarbers",
  },
  reizor: {
    id: "reizor",
    ownerName: "Barbearia autônoma",
    barbershopName: "1 cadeira",
    city: "Barbeiro solo",
    headline: "De R$14K para R$43.500/mês em menos de 1 ano com o BestBarbers (3x).",
    numbers: [
      { label: "Antes", value: "R$14K/mês" },
      { label: "Depois", value: "R$43.500/mês" },
      { label: "Tempo", value: "<1 ano" },
    ],
    angle: "Transformação rápida após implementar BestBarbers",
  },
};

// Mapping porte × dor → case mais relevante (respeita No Invention)
function pickCase(chairs: string, pain: string): CaseStudy {
  if (chairs === "7+" || chairs === "multi") return CASES.rapha!;
  if (chairs === "1") return CASES.reizor!;
  // 2-3 ou 4-6
  if (pain === "agenda-manual") return CASES.bagulho!;
  return CASES.pirajussara!;
}

// ─── Quiz questions ─────────────────────────────────────────────

interface Option {
  value: string;
  label: string;
  sub?: string;
}

const QUESTIONS: Array<{ key: string; title: string; options: Option[] }> = [
  {
    key: "chairs",
    title: "Quantas cadeiras sua barbearia tem?",
    options: [
      { value: "1", label: "1 cadeira", sub: "Sou autônomo / trabalho sozinho" },
      { value: "2-3", label: "2-3 cadeiras" },
      { value: "4-6", label: "4-6 cadeiras" },
      { value: "7+", label: "7+ cadeiras" },
      { value: "multi", label: "Tenho mais de uma unidade" },
    ],
  },
  {
    key: "revenue",
    title: "Qual seu faturamento mensal atual?",
    options: [
      { value: "ate-3k", label: "Até R$3 mil", sub: "Estou começando" },
      { value: "3k-6k", label: "R$3K - R$6K" },
      { value: "6k-15k", label: "R$6K - R$15K" },
      { value: "15k-30k", label: "R$15K - R$30K" },
      { value: "30k+", label: "R$30K ou mais" },
    ],
  },
  {
    key: "pain",
    title: "Qual sua maior dor hoje?",
    options: [
      { value: "retention", label: "Cliente não volta / pouca recorrência" },
      { value: "lucro", label: "Não sei quanto realmente lucro" },
      { value: "equipe", label: "Equipe vende pouco / não engaja" },
      { value: "agenda-manual", label: "Agenda manual / WhatsApp toma muito tempo" },
    ],
  },
];

export default function V9QuizPage() {
  const [step, setStep] = useState(0); // 0-2: quiz (chairs, revenue, pain). 3: result + captura.
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [whatsapp, setWhatsapp] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [barbershopName, setBarbershopName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setContactId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const ploomes = usePloomesAPI();
  const { trackLead, trackCustomEvent, trackCompleteRegistration } = useMetaPixel();
  const { applyPhoneMask } = usePhoneMask();
  const { redirectToWhatsApp } = useWhatsAppRedirect();

  useEffect(() => {
    setMounted(true);
    trackCustomEvent("ViewContent", {
      content_name: "v9-quiz",
      content_category: "quiz-lp",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chosenCase = useMemo(
    () => pickCase(answers.chairs || "2-3", answers.pain || "retention"),
    [answers.chairs, answers.pain],
  );

  const handleAnswer = useCallback(
    (value: string) => {
      const q = QUESTIONS[step];
      if (!q) return;
      const newAnswers = { ...answers, [q.key]: value };
      setAnswers(newAnswers);
      // ICP hard gate: pergunta de faturamento
      if (q.key === "revenue" && value === "ate-3k") {
        trackCustomEvent("ViewContent", {
          content_name: "v9-icp-gate-nurture",
          content_category: "lead-nurture",
        });
        window.location.href = "/v8-nutricao";
        return;
      }
      // Avança
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        setStep(QUESTIONS.length); // resultado
      }
    },
    [step, answers, trackCustomEvent],
  );

  // ─── Capture step ─────────────────────────────────────────────

  const handleCapture = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const phone = whatsapp.replace(/\D/g, "");
      if (phone.length < 10 || ownerName.trim().length < 2 || barbershopName.trim().length < 2) return;

      setIsSubmitting(true);
      setError(null);

      try {
        // F3 dedup check
        const exists = await ploomes.checkPhoneExists(phone);
        if (exists) {
          setError("Já estamos em contato com esse WhatsApp. Em breve um especialista te chamará.");
          setIsSubmitting(false);
          await trackCustomEvent("Contact", {
            content_name: "v9-dup-detected",
            content_category: "lead-recapture",
          });
          return;
        }

        // Cria contato com nome da barbearia real + dados do quiz
        const response = await ploomes.createContact({
          barbershopName: barbershopName.trim(),
          ownerName,
          whatsapp: phone,
          employeeCount: answers.chairs || "—",
          monthlyRevenue: answers.revenue || "",
        });

        const createdId = response?.value?.[0]?.Id;
        if (createdId) setContactId(createdId);

        // PATCH com tag dor do quiz
        if (createdId) {
          try {
            await fetch(`${PLOOMES_BASE_URL}/Contacts(${createdId})`, {
              method: "PATCH",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "user-key": PLOOMES_API_KEY,
              },
              body: JSON.stringify({
                OtherProperties: [
                  {
                    FieldKey: "contact_2D7EF0B1-E99E-414A-A7DA-4106F05DD4BB",
                    StringValue: `LP V9 Quiz | dor=${answers.pain || ""}`,
                  },
                ],
              }),
            });
          } catch {
            /* non-blocking */
          }
        }

        const eventId = `v9-quiz-${createdId || phone}-${Date.now()}`;
        await trackLead({
          content_name: "v9-quiz-complete",
          content_category: "quiz-lp",
        });
        await trackCompleteRegistration({
          content_name: "v9-quiz-qualified",
          content_category: "quiz-lp",
        });

        // CAPI server-side (dedup via eventId)
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_BBAI_API_URL || "https://ai.bestbarbers.app"}/api/meta-capi/track`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                eventName: "QualifiedLead",
                eventId,
                userData: {
                  phone,
                  firstName: ownerName.split(" ")[0],
                  lastName: ownerName.split(" ").slice(1).join(" "),
                  country: "br",
                },
                eventSourceUrl: window.location.href,
              }),
            },
          ).catch(() => {});
        } catch {
          /* swallow */
        }

        redirectToWhatsApp();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erro ao salvar.";
        setError(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [whatsapp, ownerName, barbershopName, answers, ploomes, trackLead, trackCompleteRegistration, trackCustomEvent, redirectToWhatsApp],
  );

  if (!mounted) return null;

  const totalSteps = QUESTIONS.length;
  const progress = step < totalSteps ? ((step + 1) / totalSteps) * 100 : 100;

  return (
    <main className="min-h-screen bg-[#0C1120] flex flex-col items-center p-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/Logo-BestBarbers-branco_1.webp"
            alt="BestBarbers"
            width={180}
            height={40}
            priority
          />
        </div>

        {/* Progress bar (só no quiz) */}
        {step < totalSteps && (
          <div className="mb-8">
            <div className="flex justify-between mb-2 text-xs text-gray-500">
              <span>Passo {step + 1} de {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-[#2a2d35] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FFAF02] to-[#ffc947] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* ═══ Quiz steps ═══ */}
        {step < totalSteps && QUESTIONS[step] && (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
              {QUESTIONS[step].title}
            </h1>

            <div className="space-y-3">
              {QUESTIONS[step].options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className="w-full text-left px-5 py-4 bg-[#0f1015] border border-[#2a2d35] rounded-xl
                    text-white hover:border-[#FFAF02] hover:bg-[#12141a]
                    transition-all duration-200 group"
                >
                  <div className="font-semibold">{opt.label}</div>
                  {opt.sub && <div className="text-gray-500 text-sm mt-0.5">{opt.sub}</div>}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ═══ Result + Capture ═══ */}
        {step >= totalSteps && (
          <>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 mb-6 text-center">
              <p className="text-green-400 text-sm font-medium">
                ✓ Encontramos uma barbearia parecida com a sua que mudou os resultados usando o BestBarbers:
              </p>
            </div>

            {/* Case card */}
            <div className="bg-gradient-to-br from-[#0f1015] to-[#1a1d2a] border-2 border-[#FFAF02]/30 rounded-xl p-6 mb-6">
              <p className="text-[#FFAF02] text-sm font-semibold mb-2">
                📍 {chosenCase.city}
              </p>
              <h2 className="text-white text-xl font-bold mb-4 leading-tight">
                {chosenCase.headline}
              </h2>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {chosenCase.numbers.map((n, i) => (
                  <div key={i} className="bg-[#0C1120] rounded-lg p-3 text-center">
                    <p className="text-[#FFAF02] font-bold text-lg leading-none">{n.value}</p>
                    <p className="text-gray-500 text-xs mt-1">{n.label}</p>
                  </div>
                ))}
              </div>

              <p className="text-gray-300 text-sm italic">
                Transformação conquistada com o BestBarbers — {chosenCase.ownerName}
              </p>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-white text-lg font-bold mb-2">
                Quer entender como eles chegaram nesses números com o BestBarbers?
              </h3>
              <p className="text-gray-400 text-sm">
                Deixa seus dados — um especialista te chama em breve no WhatsApp.
              </p>
            </div>

            <form onSubmit={handleCapture} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">
                  Seu nome
                </label>
                <input
                  type="text"
                  placeholder="Como te chamamos?"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-5 py-4 bg-[#0f1015] border-2 border-[#2a2d35] rounded-xl
                    text-white text-lg placeholder-gray-600
                    focus:border-[#FFAF02] focus:outline-none
                    transition-all duration-200"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">
                  Nome da sua barbearia
                </label>
                <input
                  type="text"
                  placeholder="Ex: Barbearia do Zé"
                  value={barbershopName}
                  onChange={(e) => setBarbershopName(e.target.value)}
                  className="w-full px-5 py-4 bg-[#0f1015] border-2 border-[#2a2d35] rounded-xl
                    text-white text-lg placeholder-gray-600
                    focus:border-[#FFAF02] focus:outline-none
                    transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">
                  Seu WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(applyPhoneMask(e.target.value))}
                  className="w-full px-5 py-4 bg-[#0f1015] border-2 border-[#2a2d35] rounded-xl
                    text-white text-lg placeholder-gray-600
                    focus:border-[#FFAF02] focus:outline-none
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
                  hover:scale-[1.02]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200"
              >
                {isSubmitting ? "Salvando..." : "Quero ver a proposta →"}
              </button>

              <p className="text-gray-600 text-xs text-center">
                1.200+ barbearias usam. Seus dados estão seguros.
              </p>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
