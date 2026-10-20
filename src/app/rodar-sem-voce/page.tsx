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
  UserCheck,
  ClipboardList,
  Wallet,
  DoorOpen,
  BookOpenCheck,
  Target,
  CalendarCheck,
  UserMinus,
  ArrowRight,
} from "lucide-react";

// LP de captura fria do guia "Passo a passo pra sua barbearia rodar sem você" (#16).
// Molde: /subir-preco-assinatura (mesma estrutura de seções, mesma moldura, strings e ícones trocados).
//
// FONTE DA COPY (20/Out/2026):
//   bestbarbers-ai/docs/operacional/ebook-barbearia-rodar-sem-voce.md  (guia entregue, 12 capítulos, 28 páginas)
//   bestbarbers-ai/docs/operacional/campanha-barbearia-rodar-sem-voce-brief.md  (§1 e §2)
// O ciclo inteiro da equipe: perfil · triagem · entrevista em dupla · quatro portas · 30 dias de POP ·
// motivação · meta e bônus · a equipe e o clube · piso · reunião trimestral · a nota que decide · saída.
//
// VETOS (brief §1): nunca "ebook" (guia / material / passo a passo / método) · nunca "CAC" · nunca "toque" ·
// nunca "ilimitado" · nada de curso, mentor, aluno ou marca de origem · zero sondagem de vida pessoal do
// candidato · números do método são "barbearia de exemplo" / "o que a gente vê no mercado", nunca dado
// auditado nosso · zero preço de plano da BestBarbers, zero nome de cliente/parceiro/concorrente.
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
    icon: UserCheck,
    title: "O filtro antes da vaga",
    body: "A ficha de perfil com 3 a 5 características inegociáveis, nunca 10, e o formulário que roda toda semana — pra você nunca mais contratar por desespero com a cadeira vazia.",
  },
  {
    icon: DoorOpen,
    title: "O processo de 4 etapas",
    body: "Você, a equipe, um cliente desconhecido e o candidato aprovam antes do primeiro dia. Uma porta por semana, um mês inteiro — e a saída no mês 3 cai.",
  },
  {
    icon: Wallet,
    title: "A régua que paga e cobra",
    body: "Meta em degraus com a conta do lucro por produto, a reunião trimestral com dados e a nota que decide promoção ou desligamento.",
  },
];

// --- Seção: como funciona — prévia dos capítulos, na ordem em que o reajuste acontece ---
// Seis blocos cobrindo os 12 capítulos do guia (ebook-subir-preco-assinatura.md). Cada
// corpo é o "em 3 linhas" do capítulo, sem número que vire promessa.
const CAPITULOS = [
  {
    n: "1",
    icon: ClipboardList,
    title: "O perfil e a triagem",
    body: "Antes de abrir vaga, as características que, faltando uma, a pessoa não entra. Depois, o formulário que filtra antes da entrevista — currículo por WhatsApp é fila de desespero.",
  },
  {
    n: "2",
    icon: DoorOpen,
    title: "A entrevista e as quatro portas",
    body: "Dez a quinze minutos, em dupla, zero pergunta de sim ou não. Depois, as quatro portas: você, a equipe, um cliente desconhecido na cadeira e o candidato sabendo da parte chata.",
  },
  {
    n: "3",
    icon: BookOpenCheck,
    title: "Os 30 dias de POP",
    body: "O jeito da casa escrito: recepção e cadeira atendem igual, com ou sem você. Ler junto, demonstrar, repetir até 80% e acompanhar por 20 a 30 dias.",
  },
  {
    n: "4",
    icon: Target,
    title: "O que move cada um, meta e bônus",
    body: "Ambição, reconhecimento ou competição — cada pessoa se move por um. A meta de produto em quatro degraus, com bônus pago no trimestre e a conta do lucro feita antes de prometer um real.",
  },
  {
    n: "5",
    icon: CalendarCheck,
    title: "A equipe no clube, o piso e a reunião",
    body: "A dúvida do clube respondida por mês, não por corte. O piso que segura o barbeiro novo nos três primeiros meses. A reunião trimestral em dez blocos, sempre na mesma ordem.",
  },
  {
    n: "6",
    icon: UserMinus,
    title: "A nota que decide e a saída certa",
    body: "A avaliação que diz quem sobe e quem sai. A maçã podre, a demissão feita no processo e não no calor — e o checklist da casa que roda sem você.",
  },
];

export default function RodarSemVocePage() {
  const { trackCustomEvent } = useMetaPixel();
  const [showStickyCta, setShowStickyCta] = useState(false);

  // ViewContent no load (visibilidade de topo de funil no Events Manager).
  // A chave `isca` repete o id do mapa (src/lib/iscas.ts) pra cortar as iscas no
  // Events Manager sem depender de parsear o content_name.
  useEffect(() => {
    trackCustomEvent("ViewContent", {
      content_name: "LP Rodar Sem Você - Guia Equipe",
      content_category: "landing_page",
      isca: "barbearia-rodar-sem-voce",
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
                Sua equipe depende de você pra tudo?{" "}
                <span style={{ color: AMBER }}>
                  Dá pra ela rodar sem você, com processo.
                </span>
              </h1>

              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                Guia gratuito:{" "}
                <strong className="text-white">Passo a passo pra sua barbearia rodar sem você</strong>.
                O perfil que filtra antes da vaga, a contratação em 4 etapas, a meta que paga sem estourar o caixa e a
                saída sem drama — 12 capítulos, com ficha pra preencher.
              </p>

              {/* prova rápida inline */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
                  {NUMEROS_OFICIAIS.barbearias.texto} {NUMEROS_OFICIAIS.barbearias.rotulo}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
                  Pra quem já tem equipe na cadeira
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
              Você contrata por pena, paga sem critério{" "}
              <span style={{ color: AMBER }}>e demite no calor.</span>
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-5">
              E paga isso toda vez que a cadeira fica 30 dias vazia até achar substituto: no treino jogado fora, no
              cliente que caiu com o barbeiro errado e não voltou, e na próxima vaga, no mês 3. Enquanto isso, você
              vira o gerente de briga da própria casa.
            </p>
            {/* Conta da "barbearia de exemplo" do guia — ilustração, nunca dado auditado nem promessa. */}
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              A conta da barbearia de exemplo do guia: o barbeiro contratado com pressa sai no mês 3, e a cadeira fica
              parada 30 dias. Com processo, a vaga abre com formulário rodando, a contratação passa por quatro
              portas e o novo entra com 30 dias de POP. A diferença não é sorte: é ordem.
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
            Doze capítulos, na ordem em que a pessoa entra, fica e, quando precisa, sai — com a ficha de perfil, o
            roteiro da entrevista e a reunião trimestral prontos pra usar.
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
            E ainda: a entrevista em dupla, o que move cada colaborador, a equipe dentro do clube, o piso garantido
            nos primeiros meses, a reunião trimestral em dez blocos e o checklist da casa que roda sem você.
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
              financeiro, clube de assinatura e a relação com a equipe no mesmo lugar. E são{" "}
              {NUMEROS_OFICIAIS.assinantes.texto} {NUMEROS_OFICIAIS.assinantes.rotulo}.
            </p>
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              Uma barbearia de 4 cadeiras em Belo Horizonte saiu de R$ 2,7 mil pra R$ 13,7 mil por mês em
              assinaturas em 18 meses — com a equipe vendendo o clube. Este guia reúne, na linguagem de quem está na
              cadeira, o passo a passo de quem parou de ser o gerente de briga da própria casa. Material gratuito,
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
            Do perfil{" "}
            <span style={{ color: AMBER }}>à saída sem drama</span>
          </h2>
          <p className="text-white/55 text-center mb-12 max-w-2xl mx-auto">
            O guia segue a ordem em que a pessoa entra na sua casa. Pular etapa é o que transforma uma contratação
            num problema trabalhista seis meses depois.
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
            Dentro do app, a comissão por profissional e o relatório de atendimentos por período sustentam a meta e a
            reunião trimestral. O que o sistema não faz é contratar e treinar por você: esse processo é o guia que
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
              Ele é pra quem já tem equipe na cadeira — dois barbeiros ou mais. Sem equipe, não há quem contratar,
              treinar ou cobrar. Se a sua barbearia ainda não tem clube, comece pelo{" "}
              <Link href="/do-zero-a-assinatura" className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white">
                Assinatura do Zero
              </Link>
              : o capítulo da equipe no clube continua o que ele ensina.
            </p>
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              E se o que você quer é encher a agenda com cliente novo sem gastar com anúncio, o caminho é o{" "}
              <Link href="/assinante-por-indicacao" className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white">
                Assinante por Indicação
              </Link>
              . Este aqui é pra quem quer a casa rodando sem depender de você.
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
              Pegue o guia e abra a próxima vaga{" "}
              <span style={{ color: AMBER }}>com processo</span>
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed mb-8">
              Grátis, 12 capítulos, com a ficha de perfil, o roteiro da entrevista e a reunião trimestral prontos.
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
          Ao enviar seus dados, você autoriza a BestBarbers a entrar em contato sobre o guia Passo a passo pra sua barbearia rodar sem você e suas soluções, conforme a Lei Geral de Proteção de Dados (LGPD).
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
