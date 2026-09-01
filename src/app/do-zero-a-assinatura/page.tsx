"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { FooterSimple } from "@/components/sections/FooterSimple";
import { useMetaPixel } from "@/hooks";
import { GuiaForm } from "./_components/GuiaForm";
import {
  Calculator,
  Users2,
  AlertTriangle,
  CreditCard,
  Percent,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";

// LP de captura fria do guia "Assinatura do Zero". Molde: /cadeira-cheia — mesma
// estrutura de seções, mesma moldura visual, strings trocadas.
//
// FONTE DA COPY (01/Set/2026): bestbarbers-ai/docs/operacional/ebook-assinatura-do-zero-guia.md
// — 8 capítulos destilados dos 12 episódios da 1ª temporada do podcast: (1) o que é e o
// que não é · (2) como o dinheiro muda de forma · (3) o desenho do plano · (4) o preço ·
// (5) a equipe · (6) a venda · (7) os riscos que derrubam o clube · (8) o que esperar,
// mês a mês. O guia é ENSINO, não diagnóstico.
//
// ATENÇÃO À PRÓXIMA SESSÃO: o markdown `ebook-do-zero-a-assinatura.md` (e a versão
// `-curto`) é o produto ANTERIOR, REPROVADO pelo André em 01/Set — prometia a "ficha de
// seis linhas" que diz "quantos assinantes cabem na sua barbearia". Nada dessa promessa
// pode voltar pra esta página: o guia entregue não tem ficha nenhuma, e quem baixa
// esperando o diagnóstico recebe outra coisa.

const AMBER = "#ebad04";

function scrollToForm() {
  document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// --- Seção: o que você vai receber (3 bullets) ---
// Oferta CONCRETA: cada card é um capítulo que o dono lê e sai sabendo fazer. Nenhum
// número de exemplo do guia vira promessa de resultado aqui (todos são "a conta do
// episódio", com barbearia hipotética) — o que a LP promete é o MÉTODO, não o ganho.
const RECEBE = [
  {
    icon: Calculator,
    title: "O preço, com conta e não com chute",
    body: "A regra dos dois cortes te dá o teto da mensalidade em uma linha. Os cinco dados da capacidade — profissionais, dias, horas, tempo de serviço e ocupação — dizem onde parar dentro desse teto e quantos horários vagos você tem pra preencher. Inclui a sequência de reajuste: avulso primeiro, assinatura só de três a cinco meses depois.",
  },
  {
    icon: Users2,
    title: "A conversa com a equipe, com a conta pronta",
    body: "No dia do anúncio alguém vai dizer que vai ganhar menos. O guia traz a conta que responde — ganho por mês, não por corte — e a regra do pote pra dividir a comissão do clube por fichas de serviço, sem planilha paralela e sem briga.",
  },
  {
    icon: AlertTriangle,
    title: "Os 12 erros que derrubam o clube",
    body: "Cada um com o que custa e o que fazer no lugar: lançar com preço de três cortes, abrir com plano limitado, pedir aprovação da equipe, tirar as travas da agenda, o dono entrar no clube como barbeiro. Clube quase nunca morre de cliente ou de concorrência — morre de decisão do dono.",
  },
];

// --- Seção: como funciona dentro do app, 3 passos ---
// Sai da contracapa do guia (data/iscas/ebooks.json → assinatura-do-zero): cobrança
// recorrente com bloqueio automático de inadimplente, comissão fechada sem planilha e o
// quadro da manhã já montado no painel. Nada além disso.
const PASSOS = [
  {
    n: "1",
    icon: CreditCard,
    title: "A mensalidade entra sozinha",
    body: "Você desenha o plano com os dias de utilização e os serviços que entram; o cliente cadastra o cartão pelo celular ali na cadeira e a cobrança recorre todo mês. Quem fica em atraso é bloqueado automaticamente — você não precisa cobrar conhecido na porta.",
  },
  {
    n: "2",
    icon: Percent,
    title: "A comissão fecha sem planilha",
    body: "Você define o percentual de cada profissional e a regra do assinante uma vez. No fechamento do mês a comissão sai calculada do jeito que você combinou com o time — a regra do pote do Capítulo 5 rodando sozinha.",
  },
  {
    n: "3",
    icon: LayoutDashboard,
    title: "O quadro da manhã já montado",
    body: "Receita separada entre avulso e recorrente, assinaturas novas, cancelamentos, inadimplentes, ocupação da agenda e produção por barbeiro. São os números que o Capítulo 7 manda olhar um minuto por dia, no painel.",
  },
];

export default function DoZeroAAssinaturaPage() {
  const { trackCustomEvent } = useMetaPixel();
  const [showStickyCta, setShowStickyCta] = useState(false);

  // ViewContent no load (visibilidade de topo de funil no Events Manager).
  // A chave `isca` repete o id do mapa (src/lib/iscas.ts) pra cortar as iscas no
  // Events Manager sem depender de parsear o content_name. O id (e a rota) seguem
  // `do-zero-a-assinatura` de propósito: trocar o slug quebraria a série histórica e
  // os links já distribuídos. O que mudou foi o PRODUTO entregue e o nome exibido.
  useEffect(() => {
    trackCustomEvent("ViewContent", {
      content_name: "LP Assinatura do Zero - Guia Clube",
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
              {/*
                Badge no formato do canon: FORMATO GRÁTIS · ESFORÇO. "20 minutos" é a
                palavra do próprio guia (primeira linha do Capítulo 1) e a contagem real
                do texto bate: 3.769 palavras em 12 páginas. Não prometer 5 nem 10.
              */}
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wide mb-6"
                style={{ background: "rgba(235,173,4,0.1)", borderColor: "rgba(235,173,4,0.35)", color: AMBER }}
              >
                Guia grátis · 8 capítulos + checklist
              </span>

              <h1
                className="text-white leading-[1.08] mb-5"
                style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(30px, 5vw, 52px)" }}
              >
                O passo a passo pra montar o clube da sua barbearia{" "}
                <span style={{ color: AMBER }}>na ordem certa.</span>
              </h1>

              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                <strong className="text-white">Assinatura do Zero</strong> é um guia rápido, de graça —
                20 minutos de leitura: como desenhar o plano, quanto cobrar, o que dizer pra equipe antes de
                anunciar, como vender na cadeira, os 12 erros que derrubam o clube e o que esperar do mês 1
                ao mês 12. Fecha com um <strong className="text-white">checklist de 13 caixas</strong>.
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

      {/* 2. ESPELHO DA DOR — a tese do Capítulo 1 (clube é arquitetura) + o medo do
          Capítulo 2 ("ele vem todo dia e me quebra") respondido na mesma seção. */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-white leading-tight mb-6"
              style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(26px, 4vw, 40px)" }}
            >
              Clube não é desconto.{" "}
              <span style={{ color: AMBER }}>Clube é arquitetura.</span>
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              “Paga R$ 70 e leva 2 cortes” não é clube — é promoção com nome bonito, e reduz o seu ticket.
              Clube é o contrário: redesenha como o dinheiro entra na barbearia. O mecanismo tem nome, o sim
              repetido. O avulso pede um sim novo a cada visita, e cada sim novo é uma chance de dizer não: ele
              adia, some por 45 dias e às vezes volta já cortado em outro lugar. O assinante decide uma vez —
              compromete o cartão e a cabeça. E não, ele não vem todo dia te quebrar: você não acelera o cabelo
              do cliente. O que decide se o clube fica de pé é a ordem em que você monta.
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
            Oito capítulos, um por página, na ordem — a ordem é o método. Vinte minutos de uma vez, ou um
            capítulo por dia.
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
            E ainda: o calendário de pré-venda de 30 dias, o script de três frases que o barbeiro diz no fim do
            corte, os sete números do quadro da manhã e o mês a mês do primeiro ano — do mês 1 (preparar) ao
            mês 7-12 (escalar), com o gatilho pra avançar em cada etapa.
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
              Os dois números entram COMO NO GUIA (Cap. 8): "1.200+ barbearias e 51.000+
              assinantes ativos" — dois fatos oficiais somados por "e", nunca um dentro do
              outro. A redação anterior ("51.000 assinantes EM mais de 1.200 barbearias")
              afirmava que todas as 1.200 têm clube, o que é falso e não é um número que a
              gente possa publicar. Prova macro = só os 4 oficiais
              [[feedback_numeros_oficiais_marca]].
            */}
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              São mais de 51.000 assinantes de clube e mais de 1.200 barbearias rodando na BestBarbers hoje — a
              plataforma que junta agenda, financeiro e clube no mesmo lugar. Este guia é a nossa primeira
              temporada de podcast destilada: 12 episódios sobre clube de assinatura viraram 8 capítulos, na
              ordem em que as coisas precisam acontecer. Material gratuito, direto ao ponto.
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
            E dentro do app, a parte que{" "}
            <span style={{ color: AMBER }}>não pode falhar nenhum mês</span>
          </h2>
          <p className="text-white/55 text-center mb-12 max-w-2xl mx-auto">
            Cobrar todo mundo, bloquear quem ficou em atraso, fechar a comissão certa e medir o clube todo dia:
            é o que ninguém aguenta fazer na mão e o que o app tira das suas costas.
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
            Preço SEMPRE com o "a partir de" (restrição do CEO): nunca "R$ 299/mês" seco.
            E a ressalva é literal do guia (págs. 9 e 12) — o sistema não decide por você.
          */}
          <p className="text-white/40 text-xs text-center mt-8 max-w-xl mx-auto">
            A partir de R$ 299/mês, sem taxa de implantação. O que o sistema não faz é decidir por você: a
            régua, o preço e a conversa continuam sendo trabalho de dono.
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
              De onde vem o guia
            </h2>
            {/*
              A autoria é a prova mais forte que a página tem: o guia é a 1ª temporada do
              podcast destilada, não observação da base. Dizer "a gente vê clube nascer e
              minguar" flerta com dado de permanência da base, que é vetado em copy pública
              [[feedback_copy_cases_vetados]] — e joga fora a prova real.
            */}
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              A BestBarbers é a plataforma que ajuda mais de 1.200 barbearias a organizar agenda, financeiro,
              clube de assinaturas e a relação com o cliente — tudo no mesmo lugar. Este guia não foi escrito do
              zero: são os 12 episódios da primeira temporada do nosso podcast, sobre clube de assinatura,
              condensados em 8 capítulos curtos. Cada capítulo diz de qual episódio ele veio, se você quiser
              ouvir a conversa inteira.
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
              Pegue o guia e monte o clube{" "}
              <span style={{ color: AMBER }}>na ordem certa</span>
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed mb-8">
              Grátis, 8 capítulos, 20 minutos de leitura. O download do PDF abre na tela seguinte.
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
          Ao enviar seus dados, você autoriza a BestBarbers a entrar em contato sobre o guia Assinatura do Zero
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
