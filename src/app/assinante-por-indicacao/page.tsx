"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { FooterSimple } from "@/components/sections/FooterSimple";
import { useMetaPixel } from "@/hooks";
import { paramsDaPaginaAtual } from "@/lib/tracking/porta";
import { NUMEROS_OFICIAIS } from "@/lib/numeros-oficiais";
import { GuiaForm } from "./_components/GuiaForm";
import {
  Quote,
  MessageSquareText,
  Calculator,
  CalendarCheck,
  Percent,
  UserRoundCheck,
  ArrowRight,
} from "lucide-react";

// LP de captura fria do guia "Assinante por Indicação". Molde: /do-zero-a-assinatura —
// mesma estrutura de seções, mesma moldura visual, strings e ícones trocados. A página
// molde converte 28,6% de visita em lead: ela é o gabarito, não um ponto de partida.
//
// FONTE DA COPY (24/Set/2026):
//   bestbarbers-ai/docs/operacional/ebook-assinante-por-indicacao.md  (guia entregue, v2)
//   bestbarbers-ai/docs/operacional/campanha-assinante-por-indicacao-brief.md  (§1 e §2)
// — 6 passos: o pedido na cadeira · a mensagem com prova · quem fecha a agenda · a
// cortesia com nome · a conta do convite · a ponte pro clube. O guia é ENSINO de método.
//
// VETOS DE VOCABULÁRIO (brief §1, red-team — valem na página inteira):
//   · a palavra "ebook" é BANIDA: guia / material / passo a passo / método.
//   · nunca "CAC", "CAC zero" ou "aquisição" — a expressão é "sem gastar com anúncio".
//   · nunca "toque" para mensagem — sempre "primeira mensagem".
//   · nada de genealogia do método ("nasceu no varejo", "adaptado de"): ele é ensinado
//     na voz da BestBarbers, sem contar de onde veio.
//   · os números do método (2 contatos por barbeiro por dia, 150 no mês) entram como
//     "o que a gente vê funcionar no mercado", NUNCA como dado auditado nosso.
//   · zero preço, zero nome de cliente/parceiro/concorrente, zero promessa de resultado.
//
// ATENÇÃO À PRÓXIMA SESSÃO: o brief §2 traz, para a /obrigado, a frase "já está a caminho
// do seu WhatsApp e e-mail". Ela é FALSA — não existe executor de envio de isca por
// WhatsApp nem por e-mail. A entrega é o download na /obrigado, e é só isso que a página
// e o formulário prometem. O brief §2 traz também um parágrafo de prova com número de
// caso e percentual interno; ficou fora: prova macro aqui é só os agregados oficiais.

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
    icon: Quote,
    title: "O pedido certo",
    body: "A frase exata que funciona na cadeira — e por que “me indica dois amigos” trava o barbeiro.",
  },
  {
    icon: MessageSquareText,
    title: "A mensagem que não parece golpe",
    body: "As mensagens prontas, mandadas do número do próprio barbeiro, com a prova que destrava a resposta.",
  },
  {
    icon: Calculator,
    title: "A conta que fecha",
    body: "Como saber se o programa está te custando menos que o cliente que você compra em anúncio — e o quadro pra acompanhar por barbeiro.",
  },
];

// --- Seção: como funciona dentro do app, 3 passos ---
// As TRÊS features reais confirmadas pelo André em 24/Set (brief, regra de veracidade):
// serviço com preço R$0, comissão por profissional (serviço zerado aceita comissão) e
// ficha do cliente / Relatório de Frequência. Nada além disso entra aqui.
const PASSOS = [
  {
    n: "1",
    icon: CalendarCheck,
    title: "Serviço com preço R$0",
    body: "A cortesia do convidado entra na agenda como serviço, com nome e horário — não como “encaixe”.",
  },
  {
    n: "2",
    icon: Percent,
    title: "Comissão por profissional",
    body: "O barbeiro que trouxe aparece no relatório de comissão, então o programa se paga sozinho no acerto.",
  },
  {
    n: "3",
    icon: UserRoundCheck,
    title: "Ficha do cliente e relatório de frequência",
    body: "Você vê quem voltou depois da cortesia — que é o número que diz se o convite virou cliente.",
  },
];

export default function AssinantePorIndicacaoPage() {
  const { trackCustomEvent } = useMetaPixel();
  const [showStickyCta, setShowStickyCta] = useState(false);

  // ViewContent no load (visibilidade de topo de funil no Events Manager).
  // A chave `isca` repete o id do mapa (src/lib/iscas.ts) pra cortar as iscas no
  // Events Manager sem depender de parsear o content_name.
  useEffect(() => {
    trackCustomEvent("ViewContent", {
      content_name: "LP Assinante por Indicação - Guia Indicação",
      content_category: "landing_page",
      isca: "assinante-por-indicacao",
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
            <div>
              {/*
                Badge no formato do canon: FORMATO GRÁTIS · ESFORÇO. "6 passos" é o
                método inteiro do guia (Passo 1 ao Passo 6) — não é número de páginas
                nem promessa de tempo de leitura.
              */}
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wide mb-6"
                style={{ background: "rgba(235,173,4,0.1)", borderColor: "rgba(235,173,4,0.35)", color: AMBER }}
              >
                GUIA GRATUITO · 6 PASSOS
              </span>

              <h1
                className="text-white leading-[1.08] mb-5"
                style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(30px, 5vw, 52px)" }}
              >
                Seus barbeiros já falam com 20, 30 clientes por dia.{" "}
                <span style={{ color: AMBER }}>
                  Quantos deles saem sabendo que podem trazer um amigo?
                </span>
              </h1>

              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                O guia grátis <strong className="text-white">Assinante por Indicação</strong> traz o passo a
                passo pra transformar a cadeira em canal de cliente novo — sem gastar com anúncio.
              </p>

              {/* prova rápida inline */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
                  {NUMEROS_OFICIAIS.barbearias.texto} {NUMEROS_OFICIAIS.barbearias.rotulo}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
                  Pra barbearia com barbeiro na cadeira
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

      {/* 2. ESPELHO DA DOR — a frase que todo dono diz, e a conta que mostra que ela é
          sorte com outro nome (abertura do guia). */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-white leading-tight mb-6"
              style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(26px, 4vw, 40px)" }}
            >
              “A maioria dos meus clientes vem por{" "}
              <span style={{ color: AMBER }}>indicação</span>”
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-5">
              Todo dono diz isso. Agora pergunte quantos vieram no mês passado, e de quem. Ninguém sabe. Isso
              não é indicação — é sorte com outro nome.
            </p>
            {/*
              A conta é ILUSTRAÇÃO, e o enquadramento é obrigatório (brief §1): os números
              do método entram como "o que a gente vê funcionar no mercado", nunca como
              dado auditado da nossa base nem como promessa de resultado.
            */}
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              Faça a conta com o que a gente vê funcionar no mercado: 2 contatos pedidos por barbeiro por dia,
              com 3 barbeiros e 25 dias de cadeira, são 150 contatos no mês. Sem gastar um real em anúncio.
              Quantos a sua equipe pede hoje?
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
            Seis passos, na ordem em que acontecem na cadeira — a ordem é o método. Com as mensagens prontas
            pra copiar, colar e adaptar com o nome da sua barbearia.
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
            E ainda: os seis passos na ordem — o pedido na cadeira, a mensagem, quem fecha a agenda, a cortesia
            com nome, a conta do convite e a ponte pro clube —, o combinado com a equipe e o checklist pra
            imprimir e marcar semana a semana.
          </p>
        </div>
      </section>

      {/* 4. PROVA — só os agregados oficiais da marca, pelo SSOT (src/lib/numeros-oficiais.ts).
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
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              {NUMEROS_OFICIAIS.barbearias.texto} {NUMEROS_OFICIAIS.barbearias.rotulo} pra organizar agenda,
              financeiro e clube no mesmo lugar. E são {NUMEROS_OFICIAIS.assinantes.texto}{" "}
              {NUMEROS_OFICIAIS.assinantes.rotulo}. Este guia é o método escrito na ordem em que as coisas
              acontecem na cadeira: o pedido, a mensagem, a agenda, a cortesia, a conta e a ponte pro clube.
              Material gratuito, direto ao ponto.
            </p>
          </div>
        </div>
      </section>

      {/* 5. COMO FUNCIONA (dentro do app) */}
      <section className="py-16 md:py-24 border-t border-white/5" style={{ background: "#0c0c10" }}>
        <div className="container-custom">
          <h2
            className="text-white text-center leading-tight mb-3"
            style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(26px, 4vw, 40px)" }}
          >
            O método vira{" "}
            <span style={{ color: AMBER }}>rotina dentro do app</span>
          </h2>
          <p className="text-white/55 text-center mb-12 max-w-2xl mx-auto">
            Registrar a cortesia, creditar o barbeiro que convidou e enxergar quem voltou: é o que ninguém
            aguenta fazer no caderno e o que o app tira das suas costas.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PASSOS.map((p) => (
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

          {/*
            Onde o molde põe a linha de preço, aqui entra a regra de veracidade do brief:
            o sistema registra, ele não pede. Preço não aparece em lugar nenhum desta
            página (trava da campanha) — nem "a partir de", nem valor de plano, nem taxa.
          */}
          <p className="text-white/40 text-xs text-center mt-8 max-w-xl mx-auto">
            O que o sistema não faz é pedir por você: o pedido na cadeira, a primeira mensagem e a ponte pro
            clube continuam sendo trabalho da equipe.
          </p>
        </div>
      </section>

      {/* 6. O FILTRO HONESTO — ocupa a seção que no molde é "De onde vem o guia". Aqui a
          origem do método não pode ser contada (veto de genealogia do brief §1), e o
          filtro do solo vale mais: ele desqualifica antes do form e protege o CPQ. */}
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
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              Se você corta sozinho, o método ainda não serve: sem equipe, não tem quem peça o contato nem quem
              receba o convidado. O guia é pra barbearia com barbeiro na cadeira.
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
              Pegue o guia e ponha a equipe{" "}
              <span style={{ color: AMBER }}>pra convidar</span>
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed mb-8">
              Grátis, 6 passos, com as mensagens prontas e o checklist. O download do PDF abre na tela seguinte.
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
          Ao enviar seus dados, você autoriza a BestBarbers a entrar em contato sobre o guia Assinante por
          Indicação e suas soluções, conforme a Lei Geral de Proteção de Dados (LGPD). Seus dados não são
          compartilhados com terceiros e você pode pedir a remoção a qualquer momento.
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
