"use client";

import { useState, useCallback } from "react";
import { usePhoneMask } from "@/hooks/usePhoneMask";

const PLOOMES_API_KEY =
  "B59785E2FC60B0D69BFE51222FE4516699B00F0F97420BBA48E25F648510FB55245A64F7CDB0C89E438AC6C0C56D973F73F99DB7FEF93422E040A2B8816B323B";
const PLOOMES_BASE_URL = "https://api2.ploomes.com";
const ORIGIN_ID = 40210374; // Instagram - Orgânico

interface FormData {
  barbershopName: string;
  ownerName: string;
  whatsapp: string;
  originLead: string;
}

export default function FormAppPersonalizadoInstagram() {
  const { applyPhoneMask, isValidPhone } = usePhoneMask();

  const [formData, setFormData] = useState<FormData>({
    barbershopName: "",
    ownerName: "",
    whatsapp: "",
    originLead: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (name === "whatsapp") {
        setFormData((prev) => ({ ...prev, whatsapp: applyPhoneMask(value) }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      setError(null);
    },
    [applyPhoneMask]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.barbershopName.trim()) {
        setError("Nome da barbearia é obrigatório");
        return;
      }
      if (!formData.whatsapp.trim() || !isValidPhone(formData.whatsapp)) {
        setError("WhatsApp inválido");
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const body = {
          Name: formData.barbershopName,
          OriginId: ORIGIN_ID,
          Phones: [{ PhoneNumber: formData.whatsapp, TypeId: 2, CountryId: 0 }],
          OtherProperties: [
            {
              FieldKey: "contact_DA6F2406-FE50-4EFC-BBB5-A3463435B427",
              StringValue: formData.ownerName || formData.barbershopName,
            },
            {
              FieldKey: "contact_2D7EF0B1-E99E-414A-A7DA-4106F05DD4BB",
              StringValue: formData.originLead || "Instagram - Orgânico",
            },
          ],
        };

        const res = await fetch(`${PLOOMES_BASE_URL}/Contacts`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "user-key": PLOOMES_API_KEY,
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Erro ${res.status}: ${text}`);
        }

        setSubmitted(true);
        setFormData({ barbershopName: "", ownerName: "", whatsapp: "", originLead: "" });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao cadastrar lead");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, isValidPhone]
  );

  return (
    <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-[#1a1a1a] rounded-2xl p-8 shadow-2xl border border-gray-800/50">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-1 leading-tight">
          Cadastro de leads do Instagram
        </h1>
        <p className="text-xl md:text-2xl font-extrabold text-[#ffaf02] text-center mb-4">
          Aplicativo Personalizado
        </p>
        <p className="text-gray-400 text-sm text-center mb-8">
          Preencha o formulário abaixo e receba uma oferta exclusiva.
        </p>

        {submitted ? (
          <div className="text-center py-8">
            <div className="text-[#ffaf02] text-5xl mb-4">✓</div>
            <p className="text-white font-bold text-lg mb-2">Lead cadastrado com sucesso!</p>
            <p className="text-gray-400 text-sm mb-6">O contato foi criado no Ploomes.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-[#ffaf02] text-[#121212] font-extrabold px-8 py-3 rounded-full text-sm hover:bg-[#ffc233] transition-colors"
            >
              CADASTRAR NOVO LEAD
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: "barbershopName", label: "Nome da Barbearia", placeholder: "Nome da Barbearia", type: "text" },
              { name: "ownerName", label: "Nome do Dono da barbearia", placeholder: "Nome do Dono da barbearia", type: "text" },
              { name: "whatsapp", label: "WhatsApp do Dono da barbearia", placeholder: "Celular (WhatsApp) do Dono da barbearia", type: "tel" },
              { name: "originLead", label: "Origem do lead", placeholder: "Exemplo: Stories caixinha Andre assinatura", type: "text" },
            ].map((field) => (
              <div key={field.name} className="space-y-1.5">
                <label className="block text-white font-bold text-sm">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name as keyof FormData]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.name !== "originLead" && field.name !== "ownerName"}
                  className="w-full bg-[#121212] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ffaf02] transition-colors"
                />
              </div>
            ))}

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#ffaf02] text-[#121212] font-extrabold text-sm py-4 rounded-full hover:bg-[#ffc233] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? "CADASTRANDO..." : "QUERO UM APP PERSONALIZADO!"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
