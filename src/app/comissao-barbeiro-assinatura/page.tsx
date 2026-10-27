"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { FooterSimple } from "@/components/sections/FooterSimple";
import { useMetaPixel } from "@/hooks";
import { paramsDaPaginaAtual } from "@/lib/tracking/porta";
import { NUMEROS_OFICIAIS } from "@/lib/numeros-oficiais";
import { GuiaForm } from "./_components/GuiaForm";
import {
  Calculator,
  PieChart,
  ClipboardCheck,
  Coins,
  Scale,
  CalendarClock,
  MessagesSquare,
  ArrowRight,
} from "lucide-react";

// LP de captura fria do guia "Como pagar a comissão do barbeiro na assinatura" (#20).
// Molde: /rodar-sem-voce (mesma estrutura de seções, mesma moldura, strings e ícones trocados).
//
// FONTE DA COPY (20/Out/2026):
//   bestbarbers-ai/docs/operacional/ebook-comissao-barbeiro-assinatura.md  (guia entregue, 8 capítulos, 22 páginas)
//   bestbarbers-ai/data/iscas/briefs/comissao-barbeiro-assinatura.run.json  (brief_md §1 e §2)
// O ciclo do pote: a conta por mês · o pote · as fichas · o fechamento com prova real · fora do pote ·
// o primeiro mês · a reunião das dúvidas · os erros que geram a briga.
//
// VETOS (brief §1): nunca "ebook" (guia / material / passo a passo / método) · nada de curso, mentor, aluno ou
// marca de origem · zero tema jurídico ou trabalhista · números do método são "barbearia de exemplo" / "o que a
// gente vê no mercado", nunca dado auditado nosso · zero preço de plano da BestBarbers, zero nome de
// cliente/parceiro/concorrente.
// Hero POSITIVO (decisão do André, 20/Out/26): anuncia a oferta; a headline do brief vira o espelho da dor.
// Feature real (confirmada pelo André em 20/Out/26): o % do pote e a pontuação de cada serviço ficam nas
// configurações do plano de assinatura; o rateio sai calculado no fechamento.
// Gate de números (src/lib/numeros-mortos.test.ts): prova = agregados oficiais + 1 case auditável (bb#12612).
// A entrega é o download na /obrigado — nada de "a caminho do seu WhatsApp e e-mail".

const AMBER = "#ebad04";

function scrollToForm() {
  document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// --- Seção: o que você vai receber (3 bullets) ---
// Os três do brief §2, na ordem dele. Oferta CONCRETA: cada card é uma coisa que o dono
// lê e sai sabendo fazer. Nenhum número do guia vira promessa de resultado aqui — o que
// a página promete é o MÉTODO, não o ganho.
const RECEBE = [
  {
    icon: Calculator,
    title: "A conta que o barbeiro já fez",
    body: "Por que o minuto cai no clube e o mês sobe: as duas contas lado a lado, prontas pra refazer com os números da sua barbearia e mostrar pra equipe.",
  },
  {
    icon: PieChart,
    title: "O pote e as fichas",
    body: "Como separar o pedaço da equipe do pedaço da casa e dar o peso certo a cada serviço do plano, sem um pezinho de 10 minutos valer um corte.",
  },
  {
    icon: ClipboardCheck,
    title: "O fechamento sem discussão",
    body: "O rateio do mês passo a passo, a prova real antes de pagar e o roteiro de 40 minutos pra apresentar o pote à equipe.",
  },
];

// --- Seção: como funciona — prévia dos capítulos, na ordem em que o pote nasce ---
// Seis blocos cobrindo os 8 capítulos do guia (ebook-comissao-barbeiro-assinatura.md). Cada
// corpo é o "em 3 linhas" do capítulo, sem número que vire promessa.
const CAPITULOS = [
  {
    n: "1",
    icon: Calculator,
    title: "A conta do barbeiro",
    body: "Por minuto o clube paga menos, e você diz isso primeiro. Por mês sobe, porque o mesmo cliente volta mais vezes. É essa conta que fecha a dúvida antes de ela virar briga.",
  },
  {
    n: "2",
    icon: PieChart,
    title: "O pote da equipe",
    body: "A receita do clube vira dois pedaços antes de qualquer corte: o da casa e o da equipe. O da equipe é dela, venha o assinante uma vez ou dez.",
  },
  {
    n: "3",
    icon: Coins,
    title: "As fichas de cada serviço",
    body: "Um atendimento não é um ponto. Cada serviço do plano vale os minutos da sua agenda padrão, não o tempo que o barbeiro levou.",
  },
  {
    n: "4",
    icon: Scale,
    title: "O fechamento e a prova real",
    body: "Quatro contas fecham o mês: o pote, as fichas de cada um, o valor da ficha e a fatia de cada barbeiro. Antes de pagar, a prova real.",
  },
  {
    n: "5",
    icon: CalendarClock,
    title: "Fora do pote e o primeiro mês",
    body: "Avulso, produto e extra têm régua própria, nunca misturada com o pote. E por que o pote nasce pequeno no lançamento: ninguém julga antes de três meses.",
  },
  {
    n: "6",
    icon: MessagesSquare,
    title: "A reunião e os erros",
    body: "Quarenta minutos com a equipe, números e não opinião, com as objeções de sempre já respondidas. E os dez erros que geram a briga no fechamento.",
  },
];

export default function ComissaoBarbeiroAssinaturaPage() {
  const { trackCustomEvent } = useMetaPixel();
  const [showStickyCta, setShowStickyCta] = useState(false);

  // ViewContent no load (visibilidade de topo de funil no Events Manager).
  // A chave `isca` repete o id do mapa (src/lib/iscas.ts) pra cortar as iscas no
  // Events Manager sem depender de parsear o content_name.
  useEffect(() => {
    trackCustomEvent("ViewContent", {
      content_name: "LP Comissão do Barbeiro na Assinatura - Guia Equipe",
      content_category: "landing_page",
      isca: "comissao-barbeiro-assinatura",
      // porta/tema/pagina ao lado do nome (src/lib/tracking/porta.ts) — nome intacto.
      ...paramsDaPaginaAtual(),
    });
  }, [trackCustomEvent]);

  // Sticky CTA mobile: aparece após o hero, some quando o form está visível.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const formEl = document.getElementById("guia-form-card");
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const r = formEl?.getBoundingClientRect();
        // Esconde o sticky enquanto QUALQUER parte do card do form estiver na tela
        // (evita 2 CTAs "Receber o guia grátis" simultâneos no mobile).
        const isFormVisible = r ? r.top < window.innerHeight && r.bottom > 0 : false;
        setShowStickyCta(window.scrollY > 700 && !isFormVisible);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main
      className="min-h-screen overflow-x-hidden max-w-[100vw] w-full"
      style={{ background: "#0a0a0a", fontFamily: "var(--font-montserrat), sans-serif" }}
    >
      <Navbar withoutCta />

      {/* 1. HERO + FORM — pt compensa o Navbar fixed (71px mobile / 80px desktop) + respiro */}
      <section id="form-section" className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24">
        {/* glow sutil */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div
            className="absolute top-[10%] left-[-10%] w-[55%] h-[55%] rounded-full opacity-[0.06]"
            style={{ background: `radial-gradient(circle, ${AMBER} 0%, transparent 70%)`, filter: "blur(110px)" }}
          />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Copy do hero */}
            <div className="text-center lg:text-left">
              {/*
                Badge no formato do canon: FORMATO GRÁTIS · ESFORÇO. "8 capítulos" é o
                método inteiro do guia (Capítulo 1 ao 8) — não é número de páginas nem
                promessa de tempo de leitura.
              */}
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wide mb-6"
                style={{ background: "rgba(235,173,4,0.1)", borderColor: "rgba(235,173,4,0.35)", color: AMBER }}
              >
                GUIA GRATUITO · 8 CAPÍTULOS
              </span>

              <h1
                className="text-white leading-[1.08] mb-5"
                style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(30px, 5vw, 52px)" }}
              >
                Tem clube e equipe na cadeira?{" "}
                <span style={{ color: AMBER }}>
                  Dá pra pagar a comissão da assinatura sem briga no fechamento.
                </span>
              </h1>

              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Guia gratuito:{" "}
                <strong className="text-white">Como pagar a comissão do barbeiro na assinatura</strong>.
                O pote da equipe, as fichas de cada serviço, o fechamento do mês com prova real e o roteiro da reunião
                com a equipe — 8 capítulos, com ficha pra preencher.
              </p>

              {/* prova rápida inline */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
                  {NUMEROS_OFICIAIS.barbearias.texto} {NUMEROS_OFICIAIS.barbearias.rotulo}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
                  Pra quem tem clube e equipe na cadeira
                </span>
              </div>
            </div>

            {/* Form */}
            <div id="guia-form-card" className="flex justify-center lg:justify-end">
              <GuiaForm />
            </div>
          </div>
        </div>
      </section>

      {/* 2. ESPELHO DA DOR — a headline do brief vira espelho; o hero anuncia a oferta (decisão do André, 20/Out/26). */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-white leading-tight mb-6"
              style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(26px, 4vw, 40px)" }}
            >
              Seu barbeiro faz a conta por minuto{" "}
              <span style={{ color: AMBER }}>e acha que ganha menos no clube.</span>
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-5">
              E ele não está errado: por minuto, o clube paga menos. O que ele nunca viu é a conta do mês fechada. Sem
              ela, cada fechamento vira discussão, a assinatura é dividida no feeling e ninguém confia na planilha.
            </p>
            {/* Conta da "barbearia de exemplo" do guia — ilustração, nunca dado auditado nem promessa. */}
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              A conta da barbearia de exemplo do guia: o minuto do barbeiro cai de R$ 1,25 pra R$ 0,94 no clube, e o
              mês dele sobe de R$ 3.750 pra R$ 5.470, porque o mesmo cliente volta mais vezes. Com o pote, as fichas e a
              prova real, essa conta fica na mesa no dia do fechamento.
            </p>
          </div>
        </div>
      </section>

      {/* 3. O QUE VOCÊ VAI RECEBER (3 bullets) */}
      <section className="py-16 md:py-24 border-t border-white/5" style={{ background: "#0c0c10" }}>
        <div className="container-custom">
          <h2
            className="text-white text-center leading-tight mb-3"
            style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(26px, 4vw, 40px)" }}
          >
            O que você vai receber no guia
          </h2>
          <p className="text-white/55 text-center mb-12 max-w-2xl mx-auto">
            Oito capítulos, na ordem em que o pote nasce na sua barbearia — com a tabela de fichas, o fechamento do
            mês e o roteiro da reunião prontos pra usar.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {RECEBE.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl p-7 border border-white/8 h-full"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(235,173,4,0.12)" }}
                >
                  <b.icon className="w-6 h-6" style={{ color: AMBER }} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2.5">{b.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>

          <p className="text-white/45 text-sm text-center mt-8 max-w-3xl mx-auto leading-relaxed">
            E ainda: o que fica fora do pote (avulso, produto e extra), o primeiro mês do pote, os dez erros que geram
            a briga no fechamento e o combinado por escrito.
          </p>
        </div>
      </section>

      {/* 4. PROVA — os agregados oficiais da marca, pelo SSOT (src/lib/numeros-oficiais.ts), e
          UM case auditável (bb#12612 em knowledge/dominio/cases-clube.json — crivel, sem
          bloqueio, anonimizado como "barbearia de 4 cadeiras em Belo Horizonte/MG").
          O predicado é parte do número: nunca "51.000 assinantes EM 1.200 barbearias". */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div
              className="inline-flex items-baseline gap-3 mb-6 px-6 py-3 rounded-2xl border"
              style={{ borderColor: "rgba(235,173,4,0.25)", background: "rgba(235,173,4,0.06)" }}
            >
              <span style={{ color: AMBER, fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(32px, 6vw, 52px)" }}>
                {NUMEROS_OFICIAIS.assinantes.texto}
              </span>
              <span className="text-white/70 text-sm md:text-base">
                {NUMEROS_OFICIAIS.assinantes.rotulo}
              </span>
            </div>
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-5">
              {NUMEROS_OFICIAIS.barbearias.texto} {NUMEROS_OFICIAIS.barbearias.rotulo} pra organizar agenda,
              financeiro, clube de assinatura e a comissão da equipe no mesmo lugar. E são{" "}
              {NUMEROS_OFICIAIS.assinantes.texto} {NUMEROS_OFICIAIS.assinantes.rotulo}.
            </p>
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              Uma barbearia de 4 cadeiras em Belo Horizonte saiu de R$ 2,7 mil pra R$ 13,7 mil por mês em
              assinaturas em 18 meses — com a equipe vendendo o clube. Este guia reúne, na linguagem de quem fecha a
              comissão todo mês, como dividir a assinatura entre os barbeiros sem briga. Material gratuito, direto ao
              ponto.
            </p>
          </div>
        </div>
      </section>

      {/* 5. COMO FUNCIONA — prévia dos capítulos, na ordem em que o pote nasce */}
      <section className="py-16 md:py-24 border-t border-white/5" style={{ background: "#0c0c10" }}>
        <div className="container-custom">
          <h2
            className="text-white text-center leading-tight mb-3"
            style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(26px, 4vw, 40px)" }}
          >
            Da conta do barbeiro{" "}
            <span style={{ color: AMBER }}>ao fechamento sem briga</span>
          </h2>
          <p className="text-white/55 text-center mb-12 max-w-2xl mx-auto">
            O guia segue a ordem em que o pote nasce: a conta, o desenho, o fechamento e a conversa com a equipe.
            Justo é o combinado, por escrito, cumprido.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {CAPITULOS.map((p) => (
              <div
                key={p.n}
                className="relative rounded-2xl p-7 border border-white/8 h-full"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <span
                  className="absolute top-5 right-6 opacity-20"
                  style={{ color: AMBER, fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "44px" }}
                >
                  {p.n}
                </span>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(235,173,4,0.12)" }}>
                  <p.icon className="w-6 h-6" style={{ color: AMBER }} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2.5">{p.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>

          {/* Regra de veracidade: só o que o app faz de verdade; zero preço da BestBarbers nesta página. */}
          <p className="text-white/40 text-xs text-center mt-8 max-w-xl mx-auto">
            Dentro do app, o percentual do pote e a pontuação de cada serviço ficam nas configurações do plano de
            assinatura, e o rateio sai calculado no fechamento. Combinar com a equipe, escrever e cumprir é com você:
            é disso que o guia trata.
          </p>
        </div>
      </section>

      {/* 6. O FILTRO HONESTO + GUIAS VIZINHOS — desqualifica antes do form e protege o CPQ. */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-white leading-tight mb-5"
              style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(24px, 3.5vw, 36px)" }}
            >
              Este guia{" "}
              <span style={{ color: AMBER }}>não é pra todo mundo</span>
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-5">
              Ele é pra quem tem clube de assinatura, ou está lançando, e equipe na cadeira — dois barbeiros ou mais.
              Sem equipe, não há pote pra dividir. Se a sua barbearia ainda não tem clube, comece pelo{" "}
              <Link href="/do-zero-a-assinatura" className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white">
                Assinatura do Zero
              </Link>
              : o capítulo da equipe tem a primeira versão desta conta.
            </p>
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              E se o clube já está cheio e o preço ficou pra trás, o caminho é o{" "}
              <Link href="/subir-preco-assinatura" className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white">
                Como subir o preço da assinatura
              </Link>
              . Este aqui é pra quem quer dividir a assinatura com a equipe sem briga.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FORM + CTA REPETIDO */}
      <section className="py-16 md:py-24 border-t border-white/5" style={{ background: "#0c0c10" }}>
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="text-white leading-tight mb-4"
              style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(26px, 4vw, 40px)" }}
            >
              Pegue o guia e feche o próximo mês{" "}
              <span style={{ color: AMBER }}>sem briga</span>
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed mb-8">
              Grátis, 8 capítulos, com a tabela de fichas, o fechamento do mês e o roteiro da reunião prontos.
              O download do PDF abre na tela seguinte.
            </p>
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-3 text-white font-extrabold text-[15px] md:text-[16px] px-8 py-5 rounded-full transition-all duration-300 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #029912, #02ab15)", boxShadow: "0 4px 14px 0 rgba(2,171,21,0.39)" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Receber o guia grátis
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 8. RODAPÉ + LGPD */}
      <FooterSimple />
      <div className="bg-[#0a0a0a] pb-10 px-4">
        <p className="text-white/35 text-[11px] leading-relaxed text-center max-w-2xl mx-auto">
          Ao enviar seus dados, você autoriza a BestBarbers a entrar em contato sobre o guia Como pagar a comissão do barbeiro na assinatura e suas soluções, conforme a Lei Geral de Proteção de Dados (LGPD).
          Seus dados não são compartilhados com terceiros e você pode pedir a remoção a qualquer momento.
        </p>
      </div>

      {/* Sticky CTA mobile */}
      {showStickyCta && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent pt-4 pb-4 px-4 animate-fade-in-up">
          <button
            onClick={scrollToForm}
            className="w-full text-white font-extrabold text-[14px] px-6 py-4 rounded-full active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #029912, #02ab15)", boxShadow: "0 10px 30px rgba(2,171,21,0.35)" }}
          >
            Receber o guia grátis
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </main>
  );
}
