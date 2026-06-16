"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Info, TrendingUp, TrendingDown, Lock } from "lucide-react";
import { SliderInput } from "./SliderInput";
import { AnimatedMoney } from "./AnimatedMoney";
import {
  calcular,
  DEFAULTS,
  LIMITES,
  PROVA,
  brl,
  type CalcInputs,
} from "./calc";

interface CalculadoraSectionProps {
  onCtaClick?: () => void;
}

export function CalculadoraSection({ onCtaClick }: CalculadoraSectionProps) {
  const [inputs, setInputs] = useState<CalcInputs>({
    cadeiras: DEFAULTS.cadeiras,
    clientesMes: DEFAULTS.clientesMes,
    ticketAvulso: DEFAULTS.ticketAvulso,
    recorrenciaAtualPct: DEFAULTS.recorrenciaAtualPct,
    conversaoClubePct: DEFAULTS.conversaoClubePct,
  });

  const set = (key: keyof CalcInputs) => (value: number) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const result = useMemo(() => calcular(inputs), [inputs]);

  return (
    <section
      id="calculadora"
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
                  Ajuste para o seu cenário. O cálculo atualiza ao vivo.
                </p>
              </div>

              <SliderInput
                label="Cadeiras / barbeiros"
                value={inputs.cadeiras}
                min={LIMITES.cadeiras.min}
                max={LIMITES.cadeiras.max}
                step={LIMITES.cadeiras.step}
                onChange={set("cadeiras")}
              />

              <SliderInput
                label="Clientes atendidos por mês"
                value={inputs.clientesMes}
                min={LIMITES.clientesMes.min}
                max={LIMITES.clientesMes.max}
                step={LIMITES.clientesMes.step}
                onChange={set("clientesMes")}
              />

              <SliderInput
                label="Ticket médio por corte (avulso)"
                value={inputs.ticketAvulso}
                min={LIMITES.ticketAvulso.min}
                max={LIMITES.ticketAvulso.max}
                step={LIMITES.ticketAvulso.step}
                onChange={set("ticketAvulso")}
                format={(v) => brl(v)}
              />

              <SliderInput
                label="Clientes que voltam todo mês hoje"
                hint="Sua recorrência atual estimada — quanto menor, maior o dinheiro deixado na mesa."
                value={inputs.recorrenciaAtualPct}
                min={LIMITES.recorrenciaAtualPct.min}
                max={LIMITES.recorrenciaAtualPct.max}
                step={LIMITES.recorrenciaAtualPct.step}
                onChange={set("recorrenciaAtualPct")}
                format={(v) => `${v}%`}
              />

              <SliderInput
                label="Clientes que virariam assinantes"
                hint={`Projeção: fração que entraria no clube a ${brl(PROVA.ticketAssinante)}/mês.`}
                value={inputs.conversaoClubePct}
                min={LIMITES.conversaoClubePct.min}
                max={LIMITES.conversaoClubePct.max}
                step={LIMITES.conversaoClubePct.step}
                onChange={set("conversaoClubePct")}
                format={(v) => `${v}%`}
              />
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
            <div className="px-6 md:px-8 py-8 md:py-10 flex flex-col gap-6 h-full">
              {/* Faturamento atual */}
              <div>
                <p
                  className="text-[12px] uppercase tracking-[0.15em] font-bold mb-1"
                  style={{ color: "#fafafa", opacity: 0.55, fontFamily: "var(--font-montserrat)" }}
                >
                  Faturamento atual estimado
                </p>
                <AnimatedMoney
                  value={result.faturamentoAtual}
                  className="block font-extrabold leading-none"
                  style={{
                    fontFamily: "var(--font-vollkorn)",
                    fontSize: "clamp(30px, 5vw, 42px)",
                    color: "#ffffff",
                  }}
                />
                <p
                  className="text-[12px] mt-1"
                  style={{ color: "#fafafa", opacity: 0.45, fontFamily: "var(--font-montserrat)" }}
                >
                  {inputs.clientesMes.toLocaleString("pt-BR")} clientes × {brl(inputs.ticketAvulso)}
                </p>
              </div>

              {/* Prejuízo invisível — destaque vermelho */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="w-4 h-4" style={{ color: "#f87171" }} />
                  <p
                    className="text-[12px] uppercase tracking-[0.12em] font-bold"
                    style={{ color: "#f87171", fontFamily: "var(--font-montserrat)" }}
                  >
                    Prejuízo invisível por mês
                  </p>
                </div>
                <AnimatedMoney
                  value={result.prejuizoInvisivel}
                  className="block font-extrabold leading-none"
                  style={{
                    fontFamily: "var(--font-vollkorn)",
                    fontSize: "clamp(30px, 5.5vw, 46px)",
                    color: "#f87171",
                  }}
                />
                <p
                  className="text-[12px] mt-2 leading-snug"
                  style={{ color: "#fafafa", opacity: 0.6, fontFamily: "var(--font-montserrat)" }}
                >
                  Assumindo que {result.clientesSemRecorrencia.toLocaleString("pt-BR")} clientes
                  ({100 - inputs.recorrenciaAtualPct}%) não voltam de forma previsível — a receita
                  recorrente que cada um geraria como assinante deixa de existir.
                </p>
              </div>

              {/* Projeção com clube */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "rgba(2,171,21,0.08)", border: "1px solid rgba(2,171,21,0.3)" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4" style={{ color: "#22c55e" }} />
                  <p
                    className="text-[12px] uppercase tracking-[0.12em] font-bold"
                    style={{ color: "#22c55e", fontFamily: "var(--font-montserrat)" }}
                  >
                    Faturamento projetado com clube
                  </p>
                </div>
                <div className="flex items-end gap-3 flex-wrap">
                  <AnimatedMoney
                    value={result.faturamentoComClube}
                    className="font-extrabold leading-none"
                    style={{
                      fontFamily: "var(--font-vollkorn)",
                      fontSize: "clamp(30px, 5.5vw, 46px)",
                      color: "#ffffff",
                    }}
                  />
                  {result.multiplicador >= 1.05 && (
                    <span
                      className="font-extrabold text-[14px] px-2.5 py-1 rounded-lg mb-1"
                      style={{
                        background: "#22c55e",
                        color: "#0a0a0a",
                        fontFamily: "var(--font-montserrat)",
                      }}
                    >
                      {result.multiplicador.toLocaleString("pt-BR", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}x
                    </span>
                  )}
                </div>
                <p
                  className="text-[12px] mt-2 leading-snug"
                  style={{ color: "#fafafa", opacity: 0.6, fontFamily: "var(--font-montserrat)" }}
                >
                  {result.assinantesProjetados.toLocaleString("pt-BR")} assinantes × {brl(PROVA.ticketAssinante)}/mês
                  + os atendimentos avulsos restantes.
                </p>
              </div>

              {/* GAP — o que está na mesa */}
              <div className="mt-auto">
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
                    Você está deixando na mesa
                  </p>
                  <AnimatedMoney
                    value={result.gapMensal}
                    className="block font-extrabold leading-none"
                    style={{
                      fontFamily: "var(--font-vollkorn)",
                      fontSize: "clamp(34px, 6vw, 52px)",
                      color: "#ebad04",
                    }}
                  />
                  <p
                    className="text-[13px] mt-1 font-semibold"
                    style={{ color: "#ffffff", fontFamily: "var(--font-montserrat)" }}
                  >
                    por mês · {brl(result.gapAnual)} por ano
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onCtaClick}
                  className="w-full mt-5 text-white font-extrabold text-[15px] md:text-[16px] px-6 py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #029912, #02ab15)",
                    boxShadow: "0 4px 14px 0 rgba(2,171,21,0.39)",
                    fontFamily: "var(--font-montserrat)",
                  }}
                >
                  QUERO RECUPERAR ISSO
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p
                  className="flex items-center justify-center gap-1.5 text-[11px] mt-3"
                  style={{ color: "#fafafa", opacity: 0.5, fontFamily: "var(--font-montserrat)" }}
                >
                  <Lock className="w-3 h-3" />
                  Receba o plano de recuperação personalizado no seu WhatsApp.
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
              <strong style={{ color: "#fafafa", opacity: 0.85 }}>Como calculamos:</strong>{" "}
              esta é uma <strong>projeção</strong>, não um dado ao vivo da sua base. Usamos os números
              que você informou acima e premissas de cases reais da BestBarbers: ticket médio de{" "}
              <strong>{brl(PROVA.ticketAssinante)}/mês</strong> por assinante e média de{" "}
              <strong>{PROVA.visitasAssinanteMes.toLocaleString("pt-BR")} visitas/mês</strong> (o assinante
              não vem todo dia — ele paga todo mês). Estimativa baseada em{" "}
              <strong>{PROVA.assinantesAtivos.toLocaleString("pt-BR")} assinantes</strong> em{" "}
              <strong>{PROVA.barbearias.toLocaleString("pt-BR")} barbearias</strong>. Ajuste os sliders
              para refletir o seu cenário.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
