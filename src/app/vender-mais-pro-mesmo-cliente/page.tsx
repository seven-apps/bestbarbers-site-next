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
  ListOrdered,
  Table2,
  Scissors,
  Gift,
  Tag,
  Clock,
  BarChart3,
  ArrowRight,
} from "lucide-react";

// LP de captura fria do guia "Como vender mais pro mesmo cliente na sua barbearia" (#17).
// Molde: /subir-preco-assinatura (mesma estrutura de seções, mesma moldura, strings e ícones trocados).
//
// FONTE DA COPY (20/Out/2026):
//   bestbarbers-ai/docs/operacional/ebook-vender-mais-pro-mesmo-cliente.md  (guia entregue, 12 capítulos, 30 páginas)
//   bestbarbers-ai/docs/operacional/campanha-vender-mais-pro-mesmo-cliente-brief.md  (§1 e §2)
// Ticket na mesma cadeira: atendidos por vendidos · esteira · extra por encaixe · grátis até pegar o jeito ·
// virada de preço · cardápio · preço mínimo · agenda elástica · oferta nos 10% finais · escada premium ·
// produto · quadro por barbeiro.
//
// VETOS (brief §1): nunca "ebook" · nunca "CAC" · nunca "toque" · nunca "ilimitado" · nada de curso, mentor
// ou marca de origem · nenhum nome real de aluno, barbeiro, barbearia ou cidade · nenhuma marca de produto ·
// números do método são "barbearia de exemplo" / "o que a gente vê no mercado", nunca dado auditado nosso ·
// zero preço de plano da BestBarbers, zero nome de cliente/parceiro/concorrente.
// Hero POSITIVO (decisão do André, 20/Out/26): anuncia a oferta; a headline do brief vira o espelho da dor.
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
    title: "A conta que ninguém faz",
    body: "Atendidos divididos por vendidos, por barbeiro — e por que o problema quase nunca é venda, é oferta. A meta é oferecer a 100%.",
  },
  {
    icon: ListOrdered,
    title: "A ordem certa de lançar extra",
    body: "Por encaixe, de graça até pegar o jeito, um por trimestre, com preço calculado pelo custo real — nunca no sentimento nem no concorrente.",
  },
  {
    icon: Table2,
    title: "O quadro que fecha o mês",
    body: "A ficha por barbeiro que transforma o método em rotina, mês após mês, e o lançamento trimestral do próximo extra.",
  },
];

// --- Seção: como funciona — prévia dos capítulos, na ordem em que o reajuste acontece ---
// Seis blocos cobrindo os 12 capítulos do guia (ebook-subir-preco-assinatura.md). Cada
// corpo é o "em 3 linhas" do capítulo, sem número que vire promessa.
const CAPITULOS = [
  {
    n: "1",
    icon: Calculator,
    title: "A conta e a esteira",
    body: "Atendimentos divididos por produtos vendidos: na barbearia de exemplo, 1 em 13. O gargalo é oferta, não conversão. E a esteira em que o cliente nunca recebe a mesma oferta duas vezes.",
  },
  {
    n: "2",
    icon: Scissors,
    title: "O extra não se agenda",
    body: "Sobrancelha, hidratação e depilação entram por encaixe, dentro do horário do corte. No instante em que você marca horário pra sobrancelha, um horário de corte virou um de R$ 15.",
  },
  {
    n: "3",
    icon: Gift,
    title: "Grátis até pegar o jeito, depois a virada",
    body: "Serviço novo entra de graça na primeira vez, numa janela de 1 a 2 meses, só pra quem já pediria. Depois, uma frase vira pago — e cobrar dignifica o trabalho.",
  },
  {
    n: "4",
    icon: Tag,
    title: "O cardápio e o preço mínimo",
    body: "Oito extras, uma linha cada: tempo, custo, preço de referência, encaixe ou bloco. O preço sai do custo real vezes 1,30, nunca da cabeça nem do concorrente.",
  },
  {
    n: "5",
    icon: Clock,
    title: "A agenda elástica e a oferta no fim",
    body: "O químico longo fatiado em blocos, com a cadeira livre nas janelas. E a oferta só nos 10% finais do corte: primeiro a necessidade, depois o problema nomeado, por último a proposta.",
  },
  {
    n: "6",
    icon: BarChart3,
    title: "A escada premium, o produto e o quadro",
    body: "Um degrau que qualquer barbeiro vende e um caro que só dois fazem. Produto é serviço que continua em casa. E o quadro por barbeiro que fecha o mês e lança o próximo extra.",
  },
];

export default function VenderMaisMesmoClientePage() {
  const { trackCustomEvent } = useMetaPixel();
  const [showStickyCta, setShowStickyCta] = useState(false);

  // ViewContent no load (visibilidade de topo de funil no Events Manager).
  // A chave `isca` repete o id do mapa (src/lib/iscas.ts) pra cortar as iscas no
  // Events Manager sem depender de parsear o content_name.
  useEffect(() => {
    trackCustomEvent("ViewContent", {
      content_name: "LP Vender Mais pro Mesmo Cliente - Guia Ticket",
      content_category: "landing_page",
      isca: "vender-mais-pro-mesmo-cliente",
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
                Badge no formato do canon: FORMATO GRÁTIS · ESFORÇO. "12 capítulos" é o
                método inteiro do guia (Capítulo 1 ao 12) — não é número de páginas nem
                promessa de tempo de leitura.
              */}
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wide mb-6"
                style={{ background: "rgba(235,173,4,0.1)", borderColor: "rgba(235,173,4,0.35)", color: AMBER }}
              >
                GUIA GRATUITO · 12 CAPÍTULOS
              </span>

              <h1
                className="text-white leading-[1.08] mb-5"
                style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(30px, 5vw, 52px)" }}
              >
                Agenda cheia e caixa que não acompanha?{" "}
                <span style={{ color: AMBER }}>
                  O dinheiro está no cliente que já senta na sua cadeira.
                </span>
              </h1>

              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Guia gratuito:{" "}
                <strong className="text-white">Como vender mais pro mesmo cliente na sua barbearia</strong>.
                A métrica que ninguém mede, a ordem certa de lançar extra, o preço pelo custo real e o quadro por
                barbeiro — 12 capítulos, sem cliente novo e sem anúncio.
              </p>

              {/* prova rápida inline */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
                  {NUMEROS_OFICIAIS.barbearias.texto} {NUMEROS_OFICIAIS.barbearias.rotulo}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
                  Pra quem tem equipe e agenda rodando
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
              1.008 clientes passaram pela sua cadeira este mês.{" "}
              <span style={{ color: AMBER }}>78 compraram algo além do corte.</span>
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-5">
              A conta é simples e ninguém faz: atendidos divididos por vendidos. Na barbearia de exemplo do guia, 1 em
              13. Não é falta de cliente — é falta de pergunta. O barbeiro não ofereceu, e o cliente que já paga
              saiu sem saber que existia um extra.
            </p>
            {/* Conta da "barbearia de exemplo" do guia — ilustração, nunca dado auditado nem promessa. */}
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              O que a gente vê no mercado: a mesma agenda chega a 1 em 7, e os melhores períodos a 1 em 4. O
              barbeiro que vendia 2 produtos por mês passa a 15 depois de aprender a oferecer. Nenhum cliente novo,
              nenhum real de anúncio: só a pergunta certa, no minuto certo do corte.
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
            Doze capítulos, na ordem em que o ticket sobe na mesma cadeira — medir, lançar um extra por vez,
            precificar pelo custo e acompanhar pelo quadro.
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
            E ainda: a esteira em que o cliente nunca para de comprar, a virada de preço, a agenda elástica do químico,
            a oferta nos 10% finais do corte, a escada premium, o produto que continua em casa e o lançamento
            trimestral.
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
              financeiro, clube de assinatura e comissão por profissional no mesmo lugar. E são{" "}
              {NUMEROS_OFICIAIS.assinantes.texto} {NUMEROS_OFICIAIS.assinantes.rotulo}.
            </p>
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              Uma barbearia de 4 cadeiras em Belo Horizonte saiu de R$ 2,7 mil pra R$ 13,7 mil por mês em
              assinaturas em 18 meses só reorganizando a oferta pra base que já tinha. Este guia reúne, na
              linguagem de quem está na cadeira, a métrica e a ordem que fazem isso acontecer. Material gratuito,
              direto ao ponto.
            </p>
          </div>
        </div>
      </section>

      {/* 5. COMO FUNCIONA — prévia dos capítulos, na ordem do reajuste */}
      <section className="py-16 md:py-24 border-t border-white/5" style={{ background: "#0c0c10" }}>
        <div className="container-custom">
          <h2
            className="text-white text-center leading-tight mb-3"
            style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(26px, 4vw, 40px)" }}
          >
            Da conta{" "}
            <span style={{ color: AMBER }}>ao quadro por barbeiro</span>
          </h2>
          <p className="text-white/55 text-center mb-12 max-w-2xl mx-auto">
            O guia segue a ordem em que o ticket sobe de verdade. Lançar cinco extras no mesmo mês é o jeito mais
            rápido de não vender nenhum.
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
            Dentro do app, o relatório de atendimentos por profissional e a comissão por serviço alimentam a conta de
            atendidos por vendidos. O que o sistema não faz é oferecer pelo barbeiro: essa pergunta é o guia que
            ensina.
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
              Ele é pra quem já tem cliente e agenda rodando — o método é sobre quem já senta na cadeira. Se a sua
              agenda está vazia, o problema é outro, e este guia não resolve. Se você quer faturar mais com a mesma
              base pelo clube, o{" "}
              <Link href="/do-zero-a-assinatura" className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white">
                Assinatura do Zero
              </Link>{" "}
              é o outro caminho.
            </p>
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              E se o seu clube já lotou e o preço está parado, o próximo passo é o{" "}
              <Link href="/subir-preco-assinatura" className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white">
                Como subir o preço da assinatura sem perder assinante
              </Link>
              . Este aqui é pra vender mais pra quem já está dentro, com ou sem clube.
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
              Pegue o guia e faça a conta{" "}
              <span style={{ color: AMBER }}>do seu mês passado</span>
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed mb-8">
              Grátis, 12 capítulos, com o cardápio de extras, a conta do preço mínimo e o quadro por barbeiro.
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
          Ao enviar seus dados, você autoriza a BestBarbers a entrar em contato sobre o guia Como vender mais pro mesmo cliente na sua barbearia e suas soluções, conforme a Lei Geral de Proteção de Dados (LGPD).
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
