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
  Thermometer,
  ListOrdered,
  MessageSquareText,
  Ruler,
  Users2,
  Layers,
  Undo2,
  ArrowRight,
} from "lucide-react";

// LP de captura fria do guia "Como subir o preço da assinatura sem perder assinante".
// Molde: /assinante-por-indicacao (que clonou a /do-zero-a-assinatura) — mesma estrutura
// de seções, mesma moldura visual, strings e ícones trocados. A página molde converte
// 28,6% de visita em lead: ela é o gabarito, não um ponto de partida.
//
// FONTE DA COPY (20/Out/2026):
//   bestbarbers-ai/docs/operacional/ebook-subir-preco-assinatura.md  (guia entregue, 12 capítulos)
//   bestbarbers-ai/docs/operacional/campanha-subir-preco-assinatura-brief.md  (§1 e §2)
// — a CONTINUAÇÃO do Assinatura do Zero: termômetro · ocupação · régua · sinais · reajuste
// gradual · reajuste brusco · ordem (avulso antes) · equipe · aviso ao assinante · segundo
// plano · cancelamento com resgate · erros e mês a mês. O guia é ENSINO de método.
//
// VETOS DE VOCABULÁRIO (brief §1, red-team — valem na página inteira):
//   · a palavra "ebook" é BANIDA: guia / material / passo a passo / método.
//   · nunca "CAC" — "custo por cliente novo", e só dentro do corpo do guia, não aqui.
//   · nunca "toque" para mensagem — sempre "primeira mensagem" / "mensagem".
//   · nunca "ilimitado" como promessa — a régua da casa é dias de utilização.
//   · a multa do assinante ausente NÃO entra nem no guia nem na copy.
//   · nada de genealogia do método (curso, mentor, aluno, marca de origem): ele é ensinado
//     na voz da BestBarbers, sem contar de onde veio.
//   · os números do método (172 assinantes a R$ 79,90, 18 meses parado, avulso +25%, 19
//     cancelamentos pro empate) são a "barbearia de exemplo" do guia — NUNCA dado auditado
//     nosso nem promessa de resultado.
//   · zero preço de plano da BestBarbers, zero nome de cliente/parceiro/concorrente.
//
// NÚMEROS DE PROVA (gate `src/lib/numeros-mortos.test.ts`, régua do OS):
//   · ficam de FORA, mesmo constando no brief §2: "47,96% das barbearias com sistema rodam
//     clube" (literal proibido pelo gate — agregado interno marcado [VERIFICAR]) e "R$128,37
//     líquidos por assinante-mês" (família declarada morta: é receita média por assinante,
//     nunca "líquido/no bolso"). Prova macro aqui é só os agregados oficiais + 1 case auditável.
//   · o case de BH usa os números VIVOS de knowledge/dominio/cases-clube.json (bb#12612,
//     crivel, sem bloqueio): R$ 2.724 → R$ 13.719/mês em 18 meses. O brief trazia um
//     recorte anterior do mesmo case (R$ 9,8 mil em 14 meses) — a fonte auditável vence.
//
// ATENÇÃO À PRÓXIMA SESSÃO: o brief §2 traz, para a /obrigado, a frase "já está a caminho
// do seu WhatsApp e e-mail". Ela é FALSA — não existe executor de envio de isca por
// WhatsApp nem por e-mail. A entrega é o download na /obrigado, e é só isso que a página
// e o formulário prometem. O campo "já roda clube?" pedido pelo brief JÁ existe no form
// canônico (pergunta 7, clubStatus) — nenhum campo novo foi adicionado.

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
    icon: Thermometer,
    title: "O termômetro",
    body: "O número que diz se o seu clube está na zona verde, de alerta ou vermelha — e por que ele sozinho não decide nada sem olhar o sábado.",
  },
  {
    icon: ListOrdered,
    title: "A ordem do reajuste",
    body: "O que sobe primeiro, de quanto em quanto tempo, e o degrau que a base nem sente.",
  },
  {
    icon: MessageSquareText,
    title: "A conversa",
    body: "A frase pronta pra equipe e as duas mensagens prontas pro assinante — pra reajuste não virar cancelamento.",
  },
];

// --- Seção: como funciona — prévia dos capítulos, na ordem em que o reajuste acontece ---
// Seis blocos cobrindo os 12 capítulos do guia (ebook-subir-preco-assinatura.md). Cada
// corpo é o "em 3 linhas" do capítulo, sem número que vire promessa.
const CAPITULOS = [
  {
    n: "1",
    icon: Thermometer,
    title: "O termômetro",
    body: "Assinantes ativos por barbeiro e quantos cabem em cada cadeira. O número que diz em que zona o clube está — e que só acende junto com o sábado sem vaga pro avulso.",
  },
  {
    n: "2",
    icon: Ruler,
    title: "A régua e os sinais",
    body: "Quanto o preço acompanha a ocupação, e os quatro sinais de que chegou a hora. Um mês bom de vendas não é sinal de reajuste: é um mês bom.",
  },
  {
    n: "3",
    icon: ListOrdered,
    title: "A ordem do reajuste",
    body: "O avulso sobe antes da assinatura, nunca o contrário. Depois, o degrau gradual que a base nem sente — ou o reajuste brusco, quando o clube saturou de verdade.",
  },
  {
    n: "4",
    icon: Users2,
    title: "A equipe e o aviso ao assinante",
    body: "A frase que explica o reajuste pro time sem ninguém entrar em pânico, e a mensagem por escrito, com 30 dias de aviso, que vai pra base inteira.",
  },
  {
    n: "5",
    icon: Layers,
    title: "O segundo plano",
    body: "O assinante que o primeiro plano nunca pegaria: o cliente que corta a cada 40 dias. Um plano nos bastidores, cadastrado antes do aviso, pronto pro “está caro”.",
  },
  {
    n: "6",
    icon: Undo2,
    title: "O cancelamento com resgate",
    body: "Nunca deixar cancelar sem perguntar o motivo — e a resposta certa pra cada um. Fecha com os erros que derrubam o reajuste e o mês a mês pra conferir se a base segurou.",
  },
];

export default function SubirPrecoAssinaturaPage() {
  const { trackCustomEvent } = useMetaPixel();
  const [showStickyCta, setShowStickyCta] = useState(false);

  // ViewContent no load (visibilidade de topo de funil no Events Manager).
  // A chave `isca` repete o id do mapa (src/lib/iscas.ts) pra cortar as iscas no
  // Events Manager sem depender de parsear o content_name.
  useEffect(() => {
    trackCustomEvent("ViewContent", {
      content_name: "LP Subir Preço da Assinatura - Guia Reajuste",
      content_category: "landing_page",
      isca: "subir-preco-assinatura",
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
                Seu clube lotou?{" "}
                <span style={{ color: AMBER }}>
                  Isso quer dizer que já está na hora de reajustar o seu preço.
                </span>
              </h1>

              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                Guia gratuito:{" "}
                <strong className="text-white">Como subir o preço da assinatura sem perder assinante</strong>.
                O termômetro que diz a hora, a ordem do reajuste, a frase pra equipe e a mensagem pro
                assinante — passo a passo, sem perder a base.
              </p>

              {/* prova rápida inline */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
                  {NUMEROS_OFICIAIS.barbearias.texto} {NUMEROS_OFICIAIS.barbearias.rotulo}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: AMBER }} />
                  Pra quem já roda clube há meses
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

      {/* 2. ESPELHO DA DOR — a mensalidade parada, o avulso que subiu e o sábado sem horário
          (abertura do guia + capítulo 5). */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-white leading-tight mb-6"
              style={{ fontFamily: "var(--font-vollkorn)", fontWeight: 800, fontSize: "clamp(26px, 4vw, 40px)" }}
            >
              A mensalidade parada há 18 meses.{" "}
              <span style={{ color: AMBER }}>O avulso já subiu 25%.</span>
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-5">
              O sábado não tem mais horário pra quem não assina, a equipe reclama da agenda, e você adia o
              reajuste com medo de perder quem já está dentro. Enquanto isso, o assinante faz a conta sozinho
              toda vez que paga: o clube ficou mais barato na cabeça dele sem você baixar um centavo.
            </p>
            {/*
              A conta é ILUSTRAÇÃO, e o enquadramento é obrigatório (brief §1): é a "barbearia
              de exemplo" do guia (capítulo 5), nunca dado auditado da nossa base nem promessa
              de resultado.
            */}
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              Faça a conta com a barbearia de exemplo do guia: 172 assinantes a R$ 79,90. Dez reais a mais são
              R$ 1.720 por mês. Pra ficar no zero a zero, 19 teriam que cancelar. Dez reais não fazem 19 pessoas
              cancelarem um clube que roda há 18 meses. Quanto está parado na sua mesa?
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
            Doze capítulos, na ordem em que o reajuste acontece — medir, decidir, subir, avisar e segurar a
            base. Com a frase pra equipe e as mensagens pro assinante prontas pra copiar e adaptar.
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
            E ainda: quantos assinantes cabem em cada cadeira, a régua de preço pela ocupação, os sinais de que
            chegou a hora, o segundo plano, o cancelamento com resgate, os erros que derrubam o reajuste e o
            checklist do reajuste em ordem.
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
              financeiro, clube de assinatura e a relação com o cliente no mesmo lugar. E são{" "}
              {NUMEROS_OFICIAIS.assinantes.texto} {NUMEROS_OFICIAIS.assinantes.rotulo}.
            </p>
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              Uma barbearia de 4 cadeiras em Belo Horizonte saiu de R$ 2,7 mil pra R$ 13,7 mil por mês em
              assinaturas em 18 meses. Este guia reúne, na linguagem de quem está na cadeira, a hora e o jeito
              certo de reajustar sem perder quem já assina. Material gratuito, direto ao ponto.
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
            Do termômetro{" "}
            <span style={{ color: AMBER }}>à mensagem pro assinante</span>
          </h2>
          <p className="text-white/55 text-center mb-12 max-w-2xl mx-auto">
            O guia segue a ordem em que o reajuste acontece de verdade. Pular etapa é o que transforma um
            aumento de dez reais numa fila de cancelamento.
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

          {/*
            Regra de veracidade: o que o app faz de verdade no reajuste (guia, "No BestBarbers"
            dos capítulos 5 e 12) — alterar o valor do plano sem cancelar e recriar a assinatura
            de quem já está dentro, receita recorrente antes × depois, quem assinou e cancelou
            com data, atendimentos por profissional no relatório por período. Preço da BestBarbers
            não aparece em lugar nenhum desta página (trava da campanha).
          */}
          <p className="text-white/40 text-xs text-center mt-8 max-w-xl mx-auto">
            Dentro do app, o reajuste é trocar o valor do plano no dia marcado, sem cancelar e recriar a
            assinatura de ninguém. O que o sistema não faz é decidir o preço por você: essa conta é o guia que
            ensina.
          </p>
        </div>
      </section>

      {/* 6. O FILTRO HONESTO + GUIAS VIZINHOS — ocupa a seção que no molde é "não é pra todo
          mundo". Aqui o filtro é "já roda clube?": quem ainda não montou vai pro Assinatura do
          Zero (este guia é a continuação dele), e quem quer encher o clube com cliente novo vai
          pro Assinante por Indicação. Desqualifica antes do form e protege o CPQ. */}
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
              Ele começa onde o{" "}
              <Link href="/do-zero-a-assinatura" className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white">
                Assinatura do Zero
              </Link>{" "}
              termina: no clube que já roda há meses e lotou. Se a sua barbearia ainda não tem clube, comece
              por lá — é o guia que ensina a montar.
            </p>
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              E se o que você quer é encher o clube com cliente novo sem gastar com anúncio, o caminho é o{" "}
              <Link href="/assinante-por-indicacao" className="text-white underline underline-offset-4 decoration-white/40 hover:decoration-white">
                Assinante por Indicação
              </Link>
              . Este aqui é pra quem já tem a base e precisa reajustar sem perdê-la.
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
              Pegue o guia e meça o seu clube{" "}
              <span style={{ color: AMBER }}>ainda hoje</span>
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed mb-8">
              Grátis, 12 capítulos, com a frase pra equipe, as mensagens pro assinante e o checklist do
              reajuste. O download do PDF abre na tela seguinte.
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
          Ao enviar seus dados, você autoriza a BestBarbers a entrar em contato sobre o guia Como subir o preço
          da assinatura sem perder assinante e suas soluções, conforme a Lei Geral de Proteção de Dados (LGPD).
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
