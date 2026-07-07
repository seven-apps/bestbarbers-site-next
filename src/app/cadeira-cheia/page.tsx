"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { FooterSimple } from "@/components/sections/FooterSimple";
import { useMetaPixel } from "@/hooks";
import { GuiaForm } from "./_components/GuiaForm";
import { Eye, MessageSquareText, MousePointerClick, ArrowRight, Search, Send } from "lucide-react";

const AMBER = "#ebad04";

function scrollToForm() {
  document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// --- Seção: o que você vai receber (3 bullets) ---
const RECEBE = [
  {
    icon: Eye,
    title: "Como enxergar quem sumiu",
    body: "O mapa simples pra saber quais clientes pararam de voltar e há quanto tempo — o ponto cego que quase toda barbearia tem.",
  },
  {
    icon: MessageSquareText,
    title: "O que dizer (e quando)",
    body: "As mensagens que reativam sem parecer promoção — pra quem enviar, em que ordem, e o timing que faz o cliente responder.",
  },
  {
    icon: MousePointerClick,
    title: "Como virar rotina sem trabalho braçal",
    body: "O app te mostra quem sumiu e você chama todo mundo de volta com 1 clique — sem planilha, sem caçar telefone.",
  },
];

// --- Seção: como funciona (1 clique), 3 passos ---
const PASSOS = [
  {
    n: "1",
    icon: Search,
    title: "Descubra quem parou de voltar",
    body: "O Relatório de Frequência mostra quem não aparece há 30, 60, 90 dias ou mais. Sem planilha, sem caçar telefone.",
  },
  {
    n: "2",
    icon: MessageSquareText,
    title: "Escreva a mensagem certa",
    body: "Um texto que reconhece a ausência e convida de volta — no seu tom, do jeito da sua casa. O guia entrega os modelos prontos.",
  },
  {
    n: "3",
    icon: Send,
    title: "Dispare pra lista toda com 1 clique",
    body: "Você seleciona a lista de sumidos e envia push e WhatsApp com 1 clique — grátis e sem limite de envios.",
  },
];

export default function CadeiraCheiaPage() {
  const { trackCustomEvent } = useMetaPixel();
  const [showStickyCta, setShowStickyCta] = useState(false);

  // ViewContent no load (visibilidade de topo de funil no Events Manager).
  useEffect(() => {
    trackCustomEvent("ViewContent", {
      content_name: "LP Cadeira Cheia - Guia Reativação",
      content_category: "landing_page",
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
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wide mb-6"
                style={{ background: "rgba(235,173,4,0.1)", borderColor: "rgba(235,173,4,0.35)", color: AMBER }}
              >
                Guia grátis · Método Cadeira Cheia
              </span>

              <h1
                className="text-white leading-[1.08] mb-5"
                style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(30px, 5vw, 52px)" }}
              >
                Você não perdeu o cliente.{" "}
                <span style={{ color: AMBER }}>Só não chamou ele de volta ainda.</span>
              </h1>

              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                O guia grátis <strong className="text-white">Cadeira Cheia</strong> traz o passo a passo pra encher
                a cadeira de novo — chamando de volta, com um clique seu, quem já foi seu freguês.
              </p>

              {/* prova rápida inline */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
                  +1.200 barbearias usam a BestBarbers
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
                  Material direto ao ponto
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

      {/* 2. ESPELHO DA DOR */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-white leading-tight mb-6"
              style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(26px, 4vw, 40px)" }}
            >
              Some 1 hoje. 2 semana que vem.{" "}
              <span style={{ color: AMBER }}>No fim do mês, é meia agenda vazia.</span>
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              Quando um cliente novo não chega, você sente na hora. Mas quando um antigo some, ninguém sente — a
              agenda roda com os outros e o buraco fica invisível. Ele não brigou, não avisou. Só parou de aparecer.
              E esse é o cliente mais barato que existe: você já pagou por ele uma vez, ele já conhece seu trabalho
              e já confiou na sua tesoura. Trazer de volta não custa mídia — custa método.
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
            Na linguagem de quem está na cadeira — sem enrolação, pronto pra usar hoje.
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
        </div>
      </section>

      {/* 4. PROVA +1.200 */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div
              className="inline-flex items-baseline gap-3 mb-6 px-6 py-3 rounded-2xl border"
              style={{ borderColor: "rgba(235,173,4,0.25)", background: "rgba(235,173,4,0.06)" }}
            >
              <span style={{ color: AMBER, fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(32px, 6vw, 52px)" }}>
                +1.200
              </span>
              <span className="text-white/70 text-sm md:text-base">barbearias na BestBarbers</span>
            </div>
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              Mais de 1.200 barbearias usam a BestBarbers para organizar agenda, financeiro e a relação com o
              cliente no mesmo lugar. Este guia reúne, na linguagem de quem está na cadeira, o que essas operações
              fazem pra não perder cliente por esquecimento. Material gratuito, direto ao ponto.
            </p>
          </div>
        </div>
      </section>

      {/* 5. COMO FUNCIONA (1 clique) */}
      <section className="py-16 md:py-24 border-t border-white/5" style={{ background: "#0c0c10" }}>
        <div className="container-custom">
          <h2
            className="text-white text-center leading-tight mb-3"
            style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(26px, 4vw, 40px)" }}
          >
            E dentro do app, vira rotina de{" "}
            <span style={{ color: AMBER }}>1 clique</span>
          </h2>
          <p className="text-white/55 text-center mb-12 max-w-2xl mx-auto">
            O guia funciona no papel. Com o app, o trabalho braçal some.
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

          <p className="text-white/40 text-xs text-center mt-8 max-w-xl mx-auto">
            O envio é manual: você escolhe a lista e dispara com 1 clique. Grátis, sem limite — e nada sai sem
            você mandar.
          </p>
        </div>
      </section>

      {/* 6. SOBRE A BESTBARBERS */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-white leading-tight mb-5"
              style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(24px, 3.5vw, 36px)" }}
            >
              Quem faz o guia
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              A BestBarbers é a plataforma que ajuda mais de 1.200 barbearias a organizar agenda, financeiro,
              clube de assinaturas e a relação com o cliente — tudo no mesmo lugar. Este guia é o que a gente
              aprendeu observando o que as melhores operações fazem pra não perder cliente por esquecimento.
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
              Pegue o passo a passo pra{" "}
              <span style={{ color: AMBER }}>reencher sua cadeira</span>
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed mb-8">
              Grátis, direto ao ponto e pronto pra usar hoje. Você recebe no WhatsApp e no e-mail.
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
          Ao enviar seus dados, você autoriza a BestBarbers a entrar em contato sobre o guia Cadeira Cheia e suas
          soluções, conforme a Lei Geral de Proteção de Dados (LGPD). Seus dados não são compartilhados com
          terceiros e você pode pedir a remoção a qualquer momento.
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
