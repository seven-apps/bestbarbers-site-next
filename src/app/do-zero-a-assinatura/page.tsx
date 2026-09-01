"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { FooterSimple } from "@/components/sections/FooterSimple";
import { useMetaPixel } from "@/hooks";
import { GuiaForm } from "./_components/GuiaForm";
import {
  ClipboardList,
  MessageSquareText,
  CalendarCheck,
  SlidersHorizontal,
  Smartphone,
  RefreshCcw,
  ArrowRight,
} from "lucide-react";

// LP de captura fria do guia "Do Zero à Assinatura". Molde: /cadeira-cheia — mesma
// estrutura de seções, mesma moldura visual, strings trocadas. Toda a copy abaixo sai
// do conteúdo do guia (bestbarbers-ai/docs/operacional/ebook-do-zero-a-assinatura.md):
// a Ficha da Cadeira Vaga (Cap. 1), as 3 frases da cadeira (Cap. 2), a régua de uso e
// as 3 travas (Cap. 4), o Quadro da Manhã (Cap. 7) e a Autópsia (Cap. 5).

const AMBER = "#ebad04";

function scrollToForm() {
  document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// --- Seção: o que você vai receber (3 bullets) ---
// Cada card é um bloco que o dono PREENCHE no guia — oferta concreta, não diagnóstico.
const RECEBE = [
  {
    icon: ClipboardList,
    title: "A ficha que te dá o seu número",
    body: "São seis linhas: cinco você responde de cabeça, uma pede meia hora com o caderno aberto. No fim você tem escrito quantos assinantes cabem na sua agenda hoje e quanto isso põe no dia 1º.",
  },
  {
    icon: MessageSquareText,
    title: "As três frases da cadeira",
    body: "O que o barbeiro fala no fim do corte, com a capa ainda no pescoço do cliente: a pergunta, o número na mesa e o fechamento. Ele decora e adapta pro jeito dele — não precisa virar vendedor.",
  },
  {
    icon: CalendarCheck,
    title: "A régua de uso do seu plano",
    body: "Quais dias de utilização o plano dá, o que entra, o que não entra e as três travas escritas antes do primeiro assinante entrar. É o que responde ao “e se ele vier toda semana?”.",
  },
];

// --- Seção: como funciona dentro do app, 3 passos ---
// Sai da contracapa do guia (data/iscas/ebooks.json → do-zero-a-assinatura), que é o
// que o produto de fato faz: planos por dias de uso, assinatura pelo app e cobrança
// recorrente. Nada além disso.
const PASSOS = [
  {
    n: "1",
    icon: SlidersHorizontal,
    title: "Você desenha o plano",
    body: "No painel você configura os dias de utilização de cada plano, o preço e os serviços que entram. A régua é sua — o sistema só aplica igual pra todo assinante, todo mês.",
  },
  {
    n: "2",
    icon: Smartphone,
    title: "O cliente assina pelo celular",
    body: "A conversa que começou na cadeira fecha no app: ele escolhe o plano e cadastra o cartão ali mesmo, antes de levantar. Entre o “quero” e o “está feito” não entra papel nem fila.",
  },
  {
    n: "3",
    icon: RefreshCcw,
    title: "A mensalidade entra sozinha",
    body: "A cobrança recorre todo mês e o pagamento fica acompanhado no painel — você descobre quem não pagou no dia, não no fechamento.",
  },
];

export default function DoZeroAAssinaturaPage() {
  const { trackCustomEvent } = useMetaPixel();
  const [showStickyCta, setShowStickyCta] = useState(false);

  // ViewContent no load (visibilidade de topo de funil no Events Manager).
  // A chave `isca` repete o id do mapa (src/lib/iscas.ts) pra cortar as iscas no
  // Events Manager sem depender de parsear o content_name.
  useEffect(() => {
    trackCustomEvent("ViewContent", {
      content_name: "LP Do Zero à Assinatura - Guia Clube",
      content_category: "landing_page",
      isca: "do-zero-a-assinatura",
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
                Guia grátis · Método Do Zero à Assinatura
              </span>

              <h1
                className="text-white leading-[1.08] mb-5"
                style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(30px, 5vw, 52px)" }}
              >
                O horário que ficou vazio ontem já diz{" "}
                <span style={{ color: AMBER }}>quantos assinantes cabem na sua barbearia.</span>
              </h1>

              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                O guia grátis <strong className="text-white">Do Zero à Assinatura</strong> traz a ficha de seis
                linhas que te entrega esse número hoje — e o que faz ele acontecer: as frases que o barbeiro fala
                na cadeira, a régua de uso do plano e os cinco números que você olha toda manhã.
              </p>

              {/* prova rápida inline */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
                  +1.200 barbearias usam a BestBarbers
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
                  Pra quem nunca cobrou e pra quem já cobra no caderno
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
              Você não precisa de mais gente.{" "}
              <span style={{ color: AMBER }}>Precisa que a mesma gente volte mais vezes.</span>
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              Pra lotar a agenda no avulso, cada horário cheio é um nome novo — ou um antigo que resolveu voltar
              naquele dia. Por isso o mês inteiro depende de quem lembra de aparecer, e a quarta de manhã continua
              com buraco. Com assinante, a mesma pessoa volta mais de uma vez dentro do mesmo mês, e o dinheiro
              entra no dia 1º. Só que “quantos assinantes eu quero?” é a pergunta errada: a sua meta não é um
              número bonito, é o número que cabe na sua agenda. E ele já existe hoje, antes de você vender
              qualquer coisa — está escrito nos horários que ficaram vazios ontem.
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
            Não é um livro pra ler. É um livro pra preencher — à caneta, com os números da sua casa.
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
            E ainda: a conta que você mostra pro barbeiro antes de anunciar o clube, os cinco números que você
            olha toda manhã em dois minutos e — se você já tentou um clube e viu a turma minguar — a autópsia que
            mostra do que ele morreu, antes de você abrir a segunda vez.
          </p>
        </div>
      </section>

      {/* 4. PROVA — o número público de assinantes de clube na plataforma */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div
              className="inline-flex items-baseline gap-3 mb-6 px-6 py-3 rounded-2xl border"
              style={{ borderColor: "rgba(235,173,4,0.25)", background: "rgba(235,173,4,0.06)" }}
            >
              <span style={{ color: AMBER, fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(32px, 6vw, 52px)" }}>
                +51.000
              </span>
              <span className="text-white/70 text-sm md:text-base">assinantes de clube na BestBarbers</span>
            </div>
            {/*
              Os dois números entram COMO NO GUIA (Cap. 4): "são 51.000+ assinantes de clube e 1.200+
              barbearias rodando na plataforma hoje" — dois fatos oficiais somados por "e", nunca um
              dentro do outro. A redação anterior ("51.000 assinantes EM mais de 1.200 barbearias")
              afirmava que todas as 1.200 têm clube, o que é falso e não é um número que a gente possa
              publicar. Prova macro = só os 4 oficiais [[feedback_numeros_oficiais_marca]].
            */}
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              São mais de 51.000 assinantes de clube e mais de 1.200 barbearias rodando na BestBarbers hoje — a
              plataforma que junta agenda, financeiro e clube no mesmo lugar. Este guia é o método no papel: a
              conta que dimensiona a carteira, as frases que fecham na cadeira e a régua que segura o clube de pé
              depois que a primeira turma entra. Material gratuito, direto ao ponto.
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
            E dentro do app, a{" "}
            <span style={{ color: AMBER }}>régua roda sozinha</span>
          </h2>
          <p className="text-white/55 text-center mb-12 max-w-2xl mx-auto">
            O guia funciona no caderno. O que ninguém aguenta fazer na mão — aplicar a mesma régua em cada
            assinante, todo mês, sem falhar um — é o que o app tira das suas costas.
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
            O que continua seu: decidir qual régua vale, quem o seu time convida na cadeira e até onde a carteira
            cresce. Sistema nenhum vende assinatura por você.
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
            {/*
              "no quarto mês" saiu daqui. O 4º mês existe no guia como a LINHA DE UMA FICHA — a Autópsia
              do Capítulo 5 pergunta "quantos sobraram no 4º mês?" —, e ali ele é a data de uma conta que
              o dono faz sobre a PRÓPRIA carteira. Dito na voz da casa ("o que a gente aprendeu vendo…"),
              o mesmo número vira estatística de permanência da base BestBarbers, que é exatamente o tipo
              de dado vetado em copy pública [[feedback_copy_cases_vetados]]. A frase abaixo mantém a
              observação sem cravar prazo.
            */}
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              A BestBarbers é a plataforma que ajuda mais de 1.200 barbearias a organizar agenda, financeiro,
              clube de assinaturas e a relação com o cliente — tudo no mesmo lugar. Este guia é o que a gente
              aprendeu vendo clube nascer, encher e, às vezes, minguar: o que separa a carteira que fica de pé
              da que esvazia depois que a novidade passa.
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
              Pegue a ficha e escreva{" "}
              <span style={{ color: AMBER }}>o seu número</span>
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed mb-8">
              Grátis, direto ao ponto e pronto pra preencher hoje. O download do PDF abre na tela seguinte.
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
          Ao enviar seus dados, você autoriza a BestBarbers a entrar em contato sobre o guia Do Zero à Assinatura
          e suas soluções, conforme a Lei Geral de Proteção de Dados (LGPD). Seus dados não são compartilhados
          com terceiros e você pode pedir a remoção a qualquer momento.
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
