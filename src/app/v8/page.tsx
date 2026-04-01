"use client";

import { usePloomesAPI } from "@/hooks/usePloomesAPI";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { usePhoneMask } from "@/hooks/usePhoneMask";
import { useWhatsAppRedirect } from "@/hooks/useWhatsAppRedirect";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";

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

  useEffect(() => {
    setMounted(true);
    trackCustomEvent("ViewContent", {
      content_name: "v8-mini-form",
      content_category: "lead-capture",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Step 1: Salvar só o WhatsApp ──────────────────────
  const handleStep1 = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const phone = whatsapp.replace(/\D/g, "");
    if (phone.length < 10) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await ploomes.createContact({
        barbershopName: "—",
        ownerName: "—",
        whatsapp: phone,
        employeeCount: "—",
        monthlyRevenue: "",
      });

      const createdId = response?.value?.[0]?.Id;
      if (createdId) setContactId(createdId);

      await trackLead({
        content_name: "v8-mini-form-step1",
        content_category: "lead-capture",
      });

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
  }, [whatsapp, ploomes, trackLead]);

  // ─── Step 2: Atualizar contato + deal, redirect WhatsApp ──
  const handleStep2 = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

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

      await trackCompleteRegistration({
        content_name: "v8-mini-form-step2",
        content_category: "lead-capture",
        barbershop_name: barbershopName,
        employee_count: employeeCount,
      });

      // Redirect para WhatsApp após salvar
      redirectToWhatsApp();
    } catch {
      // Mesmo se falhar, redirect para WhatsApp (telefone já salvo no step 1)
      redirectToWhatsApp();
    } finally {
      setIsSubmitting(false);
    }
  }, [contactId, ownerName, barbershopName, employeeCount, monthlyRevenue, trackCompleteRegistration, redirectToWhatsApp]);

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
              <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
                Descubra o potencial<br />da sua barbearia
              </h1>
              <p className="text-[#FFAF02] font-semibold text-lg mb-2">
                App próprio • Clube de Assinaturas • Gestão
              </p>
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
                    <option value="ate-5k">Até R$5K</option>
                    <option value="5k-15k">R$5K - R$15K</option>
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
