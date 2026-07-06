"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Info, TrendingUp, TrendingDown, Lock } from "lucide-react";
import { SliderInput } from "./SliderInput";
import { AnimatedMoney } from "./AnimatedMoney";
import {
  calcular,
  DEFAULTS,
  LIMITES,
  brl,
  brl2,
  type CalcInputs,
} from "./calc";

interface CalculadoraSectionProps {
  onCtaClick?: () => void;
}

export function CalculadoraSection({ onCtaClick }: CalculadoraSectionProps) {
  const [inputs, setInputs] = useState<CalcInputs>({
    precoCorte: DEFAULTS.precoCorte,
    custoProduto: DEFAULTS.custoProduto,
    comissaoPct: DEFAULTS.comissaoPct,
    custoFixoMes: DEFAULTS.custoFixoMes,
    atendimentosMes: DEFAULTS.atendimentosMes,
  });

  const set = (key: keyof CalcInputs) => (value: number) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const result = useMemo(() => calcular(inputs), [inputs]);

  const ehPrejuizo = result.ehPrejuizo;
  // Cor de comando: verde quando sobra, vermelho/alarme quando falta.
  const cor = ehPrejuizo ? "#f87171" : "#22c55e";
  const corBg = ehPrejuizo ? "rgba(239,68,68,0.08)" : "rgba(2,171,21,0.08)";
  const corBorda = ehPrejuizo ? "rgba(239,68,68,0.28)" : "rgba(2,171,21,0.3)";

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
                  Os números do seu corte
                </h2>
                <p
                  className="text-[13px] md:text-[14px]"
                  style={{ color: "#6b6b6b", fontFamily: "var(--font-montserrat)" }}
                >
                  Coloca os seus números. A conta atualiza ao vivo.
                </p>
              </div>

              <SliderInput
                label="Preço que você cobra no corte"
                value={inputs.precoCorte}
                min={LIMITES.precoCorte.min}
                max={LIMITES.precoCorte.max}
                step={LIMITES.precoCorte.step}
                onChange={set("precoCorte")}
                format={(v) => brl(v)}
              />

              <SliderInput
                label="Produto gasto por corte"
                hint="Lâmina, gel, pó, toalha descartável… o que sai do estoque a cada corte."
                value={inputs.custoProduto}
                min={LIMITES.custoProduto.min}
                max={LIMITES.custoProduto.max}
                step={LIMITES.custoProduto.step}
                onChange={set("custoProduto")}
                format={(v) => brl(v)}
              />

              <SliderInput
                label="Comissão do barbeiro"
                hint="A fatia do corte que fica com quem executou o serviço."
                value={inputs.comissaoPct}
                min={LIMITES.comissaoPct.min}
                max={LIMITES.comissaoPct.max}
                step={LIMITES.comissaoPct.step}
                onChange={set("comissaoPct")}
                format={(v) => `${v}%`}
              />

              <SliderInput
                label="Custo fixo no mês"
                hint="Aluguel + luz + água + internet — tudo que você paga mesmo com a cadeira vazia."
                value={inputs.custoFixoMes}
                min={LIMITES.custoFixoMes.min}
                max={LIMITES.custoFixoMes.max}
                step={LIMITES.custoFixoMes.step}
                onChange={set("custoFixoMes")}
                format={(v) => brl(v)}
              />

              <SliderInput
                label="Atendimentos no mês"
                hint="Quanto mais cortes, mais diluído fica o custo fixo em cada um."
                value={inputs.atendimentosMes}
                min={LIMITES.atendimentosMes.min}
                max={LIMITES.atendimentosMes.max}
                step={LIMITES.atendimentosMes.step}
                onChange={set("atendimentosMes")}
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
              {/* HERÓI — lucro ou prejuízo por corte */}
              <div
                className="rounded-2xl p-5"
                style={{ background: corBg, border: `1px solid ${corBorda}` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {ehPrejuizo ? (
                    <TrendingDown className="w-4 h-4" style={{ color: cor }} />
                  ) : (
                    <TrendingUp className="w-4 h-4" style={{ color: cor }} />
                  )}
                  <p
                    className="text-[12px] uppercase tracking-[0.12em] font-bold"
                    style={{ color: cor, fontFamily: "var(--font-montserrat)" }}
                  >
                    {ehPrejuizo ? "Cada corte te custa" : "Cada corte te dá"}
                  </p>
                </div>
                <AnimatedMoney
                  value={Math.abs(result.lucroPorCorte)}
                  className="block font-extrabold leading-none"
                  style={{
                    fontFamily: "var(--font-vollkorn)",
                    fontSize: "clamp(36px, 6.5vw, 56px)",
                    color: cor,
                  }}
                />
                <p
                  className="text-[13px] mt-2 leading-snug font-semibold"
                  style={{ color: "#ffffff", fontFamily: "var(--font-montserrat)" }}
                >
                  {ehPrejuizo
                    ? "de prejuízo. Você está pagando pra trabalhar e nem sabe — sentou na graxa: errou no preço, na comissão ou no custo fixo."
                    : "de lucro limpo. É o que sobra DEPOIS de descontar produto, comissão e a fatia do aluguel."}
                </p>
                <p
                  className="text-[12px] mt-1"
                  style={{ color: "#fafafa", opacity: 0.5, fontFamily: "var(--font-montserrat)" }}
                >
                  Valor exato por corte: {brl2(result.lucroPorCorte)}
                </p>
              </div>

              {/* Breakdown — custo real e margem */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="rounded-2xl p-4"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <p
                    className="text-[11px] uppercase tracking-[0.12em] font-bold mb-1"
                    style={{ color: "#fafafa", opacity: 0.55, fontFamily: "var(--font-montserrat)" }}
                  >
                    Custo real do corte
                  </p>
                  <span
                    className="block font-extrabold leading-none"
                    style={{
                      fontFamily: "var(--font-vollkorn)",
                      fontSize: "clamp(22px, 3.5vw, 28px)",
                      color: "#ffffff",
                    }}
                  >
                    {brl2(result.custoRealCorte)}
                  </span>
                  <p
                    className="text-[11px] mt-1.5 leading-snug"
                    style={{ color: "#fafafa", opacity: 0.5, fontFamily: "var(--font-montserrat)" }}
                  >
                    {brl2(inputs.custoProduto)} produto + {brl2(result.comissaoValor)} comissão +{" "}
                    {brl2(result.custoFixoPorAtendimento)} de fixo
                  </p>
                </div>

                <div
                  className="rounded-2xl p-4"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <p
                    className="text-[11px] uppercase tracking-[0.12em] font-bold mb-1"
                    style={{ color: "#fafafa", opacity: 0.55, fontFamily: "var(--font-montserrat)" }}
                  >
                    Margem do corte
                  </p>
                  <span
                    className="block font-extrabold leading-none"
                    style={{
                      fontFamily: "var(--font-vollkorn)",
                      fontSize: "clamp(22px, 3.5vw, 28px)",
                      color: cor,
                    }}
                  >
                    {result.margemPct.toLocaleString("pt-BR", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                    %
                  </span>
                  <p
                    className="text-[11px] mt-1.5 leading-snug"
                    style={{ color: "#fafafa", opacity: 0.5, fontFamily: "var(--font-montserrat)" }}
                  >
                    do preço vira lucro. O resto é custo.
                  </p>
                </div>
              </div>

              {/* Resultado no mês — o número que fecha a conta */}
              <div className="mt-auto">
                <div
                  className="rounded-2xl p-5 text-center"
                  style={
                    ehPrejuizo
                      ? {
                          background: "linear-gradient(135deg, rgba(239,68,68,0.18), rgba(239,68,68,0.06))",
                          border: "1px solid rgba(239,68,68,0.4)",
                        }
                      : {
                          background: "linear-gradient(135deg, rgba(235,173,4,0.18), rgba(235,173,4,0.06))",
                          border: "1px solid rgba(235,173,4,0.4)",
                        }
                  }
                >
                  <p
                    className="text-[12px] uppercase tracking-[0.12em] font-bold mb-1"
                    style={{ color: ehPrejuizo ? "#f87171" : "#ebad04", fontFamily: "var(--font-montserrat)" }}
                  >
                    {ehPrejuizo ? "Prejuízo no fim do mês" : "Lucro no fim do mês"}
                  </p>
                  <AnimatedMoney
                    value={Math.abs(result.resultadoMes)}
                    className="block font-extrabold leading-none"
                    style={{
                      fontFamily: "var(--font-vollkorn)",
                      fontSize: "clamp(34px, 6vw, 52px)",
                      color: ehPrejuizo ? "#f87171" : "#ebad04",
                    }}
                  />
                  <p
                    className="text-[13px] mt-1 font-semibold"
                    style={{ color: "#ffffff", fontFamily: "var(--font-montserrat)" }}
                  >
                    {inputs.atendimentosMes.toLocaleString("pt-BR")} cortes × {brl2(result.lucroPorCorte)}
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
                  {ehPrejuizo ? "QUERO PARAR DE PERDER" : "QUERO ESSE NÚMERO NO AUTOMÁTICO"}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p
                  className="flex items-center justify-center gap-1.5 text-[11px] mt-3 text-center"
                  style={{ color: "#fafafa", opacity: 0.5, fontFamily: "var(--font-montserrat)" }}
                >
                  <Lock className="w-3 h-3 flex-shrink-0" />
                  Um especialista te mostra como manter esse número certo o mês inteiro.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Como calculamos — transparência total */}
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
              todos os números vêm de você — nada é inventado.{" "}
              <strong>custo real do corte = produto + comissão + fatia do custo fixo</strong>{" "}
              (o custo fixo do mês dividido pelos atendimentos). O{" "}
              <strong>lucro por corte</strong> é o preço menos esse custo real. Faturamento não é
              lucro: o corte só te dá dinheiro depois que você desconta tudo isso.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
