"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Info, Lock, Scissors, Store, UserRound } from "lucide-react";
import { SliderInput } from "./SliderInput";
import { AnimatedMoney } from "./AnimatedMoney";
import {
  AGENDA_OPCOES,
  DEFAULTS,
  LIMITES,
  brl,
  brl2,
  calcular,
  type CalcInputs,
} from "./calc";
import { METODO } from "./benchmarks";

interface TabelaSectionProps {
  onCtaClick?: () => void;
}

export function TabelaSection({ onCtaClick }: TabelaSectionProps) {
  const [inputs, setInputs] = useState<CalcInputs>({
    corteAvulso: DEFAULTS.corteAvulso,
    cadeiras: DEFAULTS.cadeiras,
    comissaoPct: DEFAULTS.comissaoPct,
    agenda: DEFAULTS.agenda,
  });

  const set = (key: keyof CalcInputs) => (value: number) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const result = useMemo(() => calcular(inputs), [inputs]);

  return (
    <section
      id="tabela"
      className="relative py-14 md:py-20 overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* Bokeh sutil */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-[15%] left-[-10%] w-[45%] h-[45%] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, #ebad04 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          {/* ── COLUNA 1 — Inputs ── */}
          <div
            className="rounded-3xl overflow-hidden flex flex-col"
            style={{ background: "#ffffff", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}
          >
            <div
              className="h-1.5 w-full"
              style={{ background: "linear-gradient(90deg, #ebad04, #f5c842, #ebad04)" }}
            />
            <div className="px-6 md:px-8 py-8 md:py-10 flex flex-col gap-7">
              <div>
                <h2
                  className="leading-tight mb-1"
                  style={{
                    fontFamily: "var(--font-vollkorn)",
                    fontWeight: 800,
                    fontSize: "clamp(22px, 3.5vw, 30px)",
                    color: "#1e1e1e",
                  }}
                >
                  Os números da sua barbearia
                </h2>
                <p
                  className="text-[13px] md:text-[14px]"
                  style={{ color: "#6b6b6b", fontFamily: "var(--font-montserrat)" }}
                >
                  Arraste os botões. O preço recomendado atualiza ao vivo.
                </p>
              </div>

              <SliderInput
                label="Valor do seu corte avulso"
                hint="É a base de tudo: o teto da mensalidade é o valor de 2 cortes."
                value={inputs.corteAvulso}
                min={LIMITES.corteAvulso.min}
                max={LIMITES.corteAvulso.max}
                step={LIMITES.corteAvulso.step}
                onChange={set("corteAvulso")}
                format={(v) => brl(v)}
              />

              <SliderInput
                label="Cadeiras / barbeiros"
                value={inputs.cadeiras}
                min={LIMITES.cadeiras.min}
                max={LIMITES.cadeiras.max}
                step={LIMITES.cadeiras.step}
                onChange={set("cadeiras")}
              />

              <SliderInput
                label="Comissão média do barbeiro"
                hint="Uma média para a projeção — na prática você pode ter percentuais diferentes por profissional."
                value={inputs.comissaoPct}
                min={LIMITES.comissaoPct.min}
                max={LIMITES.comissaoPct.max}
                step={LIMITES.comissaoPct.step}
                onChange={set("comissaoPct")}
                format={(v) => `${v}%`}
              />

              {/* Agenda — posição dentro da faixa saudável */}
              <div>
                <p
                  className="font-semibold text-[14px] md:text-[15px] mb-2"
                  style={{ color: "#1e1e1e", fontFamily: "var(--font-montserrat)" }}
                >
                  Como está a sua agenda hoje?
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {AGENDA_OPCOES.map((op) => {
                    const ativo = inputs.agenda === op.value;
                    return (
                      <button
                        key={op.value}
                        type="button"
                        onClick={() => setInputs((prev) => ({ ...prev, agenda: op.value }))}
                        className="rounded-xl px-2 py-2.5 text-[12px] md:text-[13px] font-bold transition-all duration-200"
                        style={{
                          background: ativo ? "rgba(235,173,4,0.16)" : "#f5f5f5",
                          border: `1.5px solid ${ativo ? "#ebad04" : "#e0e0e0"}`,
                          color: "#1e1e1e",
                          fontFamily: "var(--font-montserrat)",
                        }}
                      >
                        {op.label}
                      </button>
                    );
                  })}
                </div>
                <p
                  className="text-[11px] md:text-[12px] mt-1.5"
                  style={{ color: "#6b6b6b", fontFamily: "var(--font-montserrat)" }}
                >
                  {AGENDA_OPCOES.find((op) => op.value === inputs.agenda)?.hint}
                </p>
              </div>
            </div>
          </div>

          {/* ── COLUNA 2 — Resultado ao vivo ── */}
          <div
            className="rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: "linear-gradient(160deg, #141414 0%, #0a0a0a 100%)",
              border: "1px solid rgba(235,173,4,0.18)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            }}
          >
            <div className="px-6 md:px-8 py-8 md:py-10 flex flex-col gap-5 h-full">
              {/* 1. Mensalidade recomendada — o resultado-mãe */}
              <div
                className="rounded-2xl p-5 text-center"
                style={{
                  background: "linear-gradient(135deg, rgba(235,173,4,0.18), rgba(235,173,4,0.06))",
                  border: "1px solid rgba(235,173,4,0.4)",
                }}
              >
                <p
                  className="text-[12px] uppercase tracking-[0.12em] font-bold mb-1"
                  style={{ color: "#ebad04", fontFamily: "var(--font-montserrat)" }}
                >
                  Mensalidade recomendada do clube
                </p>
                <AnimatedMoney
                  value={result.mensalidade}
                  format={brl2}
                  className="block font-extrabold leading-none"
                  style={{
                    fontFamily: "var(--font-vollkorn)",
                    fontSize: "clamp(38px, 7vw, 56px)",
                    color: "#ebad04",
                  }}
                />
                <p
                  className="text-[12px] md:text-[13px] mt-2 leading-snug"
                  style={{ color: "#fafafa", opacity: 0.7, fontFamily: "var(--font-montserrat)" }}
                >
                  Faixa saudável: <strong>{brl2(result.faixaMin)}</strong> a{" "}
                  <strong>{brl2(result.faixaMax)}</strong> · teto da Regra dos 2 Cortes:{" "}
                  {brl(result.teto)} (2 × {brl(inputs.corteAvulso)})
                </p>
              </div>

              {/* 2. Margem da barbearia */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "rgba(2,171,21,0.08)", border: "1px solid rgba(2,171,21,0.3)" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Store className="w-4 h-4" style={{ color: "#22c55e" }} />
                  <p
                    className="text-[12px] uppercase tracking-[0.12em] font-bold"
                    style={{ color: "#22c55e", fontFamily: "var(--font-montserrat)" }}
                  >
                    Margem da barbearia
                  </p>
                </div>
                <div className="flex items-end gap-2 flex-wrap">
                  <AnimatedMoney
                    value={result.margemAssinante}
                    format={brl2}
                    className="font-extrabold leading-none"
                    style={{
                      fontFamily: "var(--font-vollkorn)",
                      fontSize: "clamp(26px, 4.5vw, 38px)",
                      color: "#ffffff",
                    }}
                  />
                  <span
                    className="text-[13px] font-semibold mb-0.5"
                    style={{ color: "#fafafa", opacity: 0.6, fontFamily: "var(--font-montserrat)" }}
                  >
                    por assinante/mês
                  </span>
                </div>
                <p
                  className="text-[12px] mt-2 leading-snug"
                  style={{ color: "#fafafa", opacity: 0.6, fontFamily: "var(--font-montserrat)" }}
                >
                  Com a agenda de clube cheia ({result.carteiraTotal.toLocaleString("pt-BR")}{" "}
                  assinantes em {inputs.cadeiras}{" "}
                  {inputs.cadeiras === 1 ? "cadeira" : "cadeiras"}*):{" "}
                  <strong style={{ color: "#22c55e" }}>{brl(result.margemMensal)}/mês</strong> de
                  margem, dentro de {brl(result.receitaRecorrente)} de receita recorrente.
                </p>
              </div>

              {/* 3. Ganho real do barbeiro */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <UserRound className="w-4 h-4" style={{ color: "#ebad04" }} />
                  <p
                    className="text-[12px] uppercase tracking-[0.12em] font-bold"
                    style={{ color: "#fafafa", opacity: 0.85, fontFamily: "var(--font-montserrat)" }}
                  >
                    Ganho real do barbeiro
                  </p>
                </div>
                <div className="flex items-end gap-2 flex-wrap">
                  <AnimatedMoney
                    value={result.ganhoBarbeiroMes}
                    className="font-extrabold leading-none"
                    style={{
                      fontFamily: "var(--font-vollkorn)",
                      fontSize: "clamp(26px, 4.5vw, 38px)",
                      color: "#ffffff",
                    }}
                  />
                  <span
                    className="text-[13px] font-semibold mb-0.5"
                    style={{ color: "#fafafa", opacity: 0.6, fontFamily: "var(--font-montserrat)" }}
                  >
                    /mês só de clube, com a carteira dele cheia*
                  </span>
                </div>
                <p
                  className="text-[12px] mt-2 leading-snug"
                  style={{ color: "#fafafa", opacity: 0.6, fontFamily: "var(--font-montserrat)" }}
                >
                  {brl2(result.ganhoBarbeiroAssinante)} por assinante/mês ({inputs.comissaoPct}% de{" "}
                  {brl2(result.mensalidade)}). O assinante volta de {METODO.frequenciaMin} a{" "}
                  {METODO.frequenciaMax} vezes por mês (referência de mercado) — a conta certa é o
                  mês cheio, não o minuto de cada corte.
                </p>
              </div>

              {/* Alerta do preço chutado */}
              <div className="flex items-start gap-2 px-1">
                <Scissors className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#f87171" }} />
                <p
                  className="text-[11px] md:text-[12px] leading-snug"
                  style={{ color: "#fafafa", opacity: 0.55, fontFamily: "var(--font-montserrat)" }}
                >
                  Preço chutado para baixo espreme a comissão — e a equipe joga contra o clube.
                  Abaixo de {brl2(result.faixaMin)} a conta deixa de fechar para o seu barbeiro.
                </p>
              </div>

              {/* CTA */}
              <div className="mt-auto">
                <button
                  type="button"
                  onClick={onCtaClick}
                  className="w-full text-white font-extrabold text-[15px] md:text-[16px] px-6 py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #029912, #02ab15)",
                    boxShadow: "0 4px 14px 0 rgba(2,171,21,0.39)",
                    fontFamily: "var(--font-montserrat)",
                  }}
                >
                  QUERO MONTAR MEU CLUBE COM ESSE PREÇO
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p
                  className="flex items-center justify-center gap-1.5 text-[11px] mt-3"
                  style={{ color: "#fafafa", opacity: 0.5, fontFamily: "var(--font-montserrat)" }}
                >
                  <Lock className="w-3 h-3" />
                  Um especialista monta o clube com você — grátis, no seu WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Premissas transparentes — REGRA DE VERACIDADE */}
        <div
          className="max-w-6xl mx-auto mt-5 rounded-2xl px-5 py-4"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#ebad04" }} />
            <p
              className="text-[11px] md:text-[12px] leading-relaxed"
              style={{ color: "#fafafa", opacity: 0.65, fontFamily: "var(--font-montserrat)" }}
            >
              <strong style={{ color: "#fafafa", opacity: 0.85 }}>Como calculamos:</strong> a
              mensalidade parte da <strong>Regra dos 2 Cortes</strong> (teto = 2 × seu corte
              avulso), com o lançamento um pouco abaixo do teto para converter também o cliente que
              corta a cada 20 ou 30 dias — a posição na faixa acompanha a sua agenda. Margem e
              ganho do barbeiro saem direto da comissão que você informou. *A projeção de
              &ldquo;agenda cheia&rdquo; usa uma <strong>referência do método</strong>, não um dado
              da sua operação: de{" "}
              {METODO.assinantesPorBarbeiroMin} a {METODO.assinantesPorBarbeiroMax} assinantes
              lotam a agenda de um barbeiro; usamos {METODO.assinantesPorBarbeiroRef} por cadeira.
              É um ponto de partida — a decisão final do preço é sua.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
