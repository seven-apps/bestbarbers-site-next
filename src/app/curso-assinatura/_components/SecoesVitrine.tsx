import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, PlayCircle } from "lucide-react";
import { Checklist } from "@/components/clube-v2/Checklist";
import {
  AULAS,
  CAMINHO_AREA,
  MOSTRAR_CONTA_DO_ANO,
  NOME_DO_CURSO,
  ROTULOS_DO_PLANO,
  TEXTOS_VITRINE,
} from "@/content/curso-assinatura";
import { minutosTotais } from "@/lib/curso";
import { BotaoAmarelo, COR, ThumbAula, TituloSecao, rotuloDaAula } from "./Primitivos";
import { VideoBoasVindas } from "./VideoBoasVindas";

const T = TEXTOS_VITRINE;

/** Barra fixa no padrão da /clube: logo, "já sou aluno" e o botão que leva ao formulário. */
export function NavbarCurso({ onCta }: { onCta: () => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/95 backdrop-blur-md border-b border-white/5">
      <div className="container-custom flex justify-between items-center min-h-[70px] md:h-[80px] py-3 md:py-4">
        <Link href="/" aria-label="BestBarbers">
          <Image src="/images/Logo-BestBarbers-branco_1.webp" alt="BestBarbers" width={140} height={32} className="w-[110px] md:w-[140px] h-auto" priority />
        </Link>
        <div className="flex items-center gap-1.5 md:gap-3 ml-3">
          {/* <a> comum: a área do aluno é página nova, sem os rastreadores desta (contrato §3). */}
          <a
            href={CAMINHO_AREA}
            className="inline-flex items-center min-h-[44px] whitespace-nowrap border border-white/20 text-white/80 px-3 md:px-5 py-2 rounded-full text-[11px] md:text-xs font-semibold hover:border-white/40 hover:text-white transition-colors"
          >
            {T.navbar.jaSouAluno}
          </a>
          <button
            type="button"
            onClick={onCta}
            className="inline-flex items-center min-h-[44px] gap-1 whitespace-nowrap px-3.5 md:px-6 py-2 rounded-full text-[11px] md:text-xs font-bold shadow-[0_2px_10px_rgba(255,175,2,0.3)] active:scale-[0.98] transition-transform"
            style={{ backgroundColor: COR.amarelo, color: COR.escuro }}
          >
            <span className="md:hidden">{T.navbar.botaoCelular}</span>
            <span className="hidden md:inline">{T.navbar.botao}</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </nav>
  );
}

/** "Continuar de onde parei": quem já tem o link guardado neste aparelho (contrato §2.3). */
export function ContinuarCurso({ tom = "escuro" }: { tom?: "claro" | "escuro" }) {
  return (
    <div
      className={`w-full rounded-2xl px-4 py-3.5 flex flex-col sm:flex-row items-center gap-3 justify-between border ${
        tom === "escuro" ? "bg-white/5 border-white/10 text-white" : "bg-[#fff8e6] border-[#ffaf02]/40 text-[#1e1e1e]"
      }`}
    >
      <p className="text-[14px] font-semibold text-center sm:text-left">{T.continuar.frase}</p>
      <a
        href={CAMINHO_AREA}
        className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-full text-[13px] font-extrabold whitespace-nowrap"
        style={{ backgroundColor: COR.amarelo, color: COR.escuro }}
      >
        <PlayCircle className="w-4 h-4" />
        {T.continuar.botao}
      </a>
    </div>
  );
}

/**
 * Herói: celular primeiro (título, uma frase, três destaques e o botão). No computador, ao lado,
 * a prévia do curso: o "player" da aula 1 e a lista das 6 aulas, para a página ter cara de curso.
 */
export function HeroiCurso({ onCta, temLink }: { onCta: () => void; temLink: boolean }) {
  const total = minutosTotais(AULAS.map((a) => a.duracao));
  const destaques = [T.heroi.destaqueDuracao(total), ...T.heroi.destaques];
  return (
    <section className="relative overflow-hidden pt-28 md:pt-36 pb-12 md:pb-20" style={{ backgroundColor: COR.escuro }}>
      <div
        aria-hidden
        className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full opacity-[0.12] pointer-events-none"
        style={{ background: "radial-gradient(circle, #ffaf02 0%, transparent 70%)", filter: "blur(40px)" }}
      />
      <div className="container-custom relative">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
          <div className="w-full lg:w-[52%] flex flex-col items-center lg:items-start gap-5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#ffaf02]/40 bg-[#ffaf02]/10 text-[12px] font-bold uppercase tracking-wide" style={{ color: COR.amarelo }}>
              {NOME_DO_CURSO}
            </span>
            <h1 className="text-[28px] md:text-[40px] lg:text-[42px] font-extrabold leading-[1.15] text-white text-center lg:text-left text-balance">
              {T.heroi.titulo} <span style={{ color: COR.amarelo }}>{T.heroi.destaque}</span>
            </h1>
            <p className="text-base md:text-lg font-medium leading-snug text-white/80 text-center lg:text-left max-w-xl">{T.heroi.frase}</p>
            {/* Celular: o vídeo logo depois da frase. No desktop, ele fica no cartão da direita. */}
            <div className="w-full max-w-xl lg:hidden">
              <VideoBoasVindas />
            </div>
            <Checklist itens={destaques} tom="escuro" />
            <BotaoAmarelo onClick={onCta}>
              {T.heroi.botao}
              <ArrowRight className="w-4 h-4" />
            </BotaoAmarelo>
            {temLink ? <ContinuarCurso /> : null}
          </div>

          <div className="hidden lg:block w-full lg:w-[48%]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
              <VideoBoasVindas />
              <ul className="mt-4 space-y-1.5">
                {AULAS.map((aula) => (
                  <li key={aula.numero} className="flex items-center gap-3 rounded-xl px-3 py-2 bg-white/[0.03]">
                    <span className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[12px] font-black" style={{ backgroundColor: COR.amarelo, color: COR.escuro }}>
                      {aula.numero}
                    </span>
                    <span className="text-[13px] font-semibold text-white/85 truncate">{aula.titulo}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** As 6 aulas em cartões: thumb borrada, título, uma linha do que ensina e duração. */
export function AulasCurso({ onCta }: { onCta: () => void }) {
  return (
    <section id="aulas" className="bg-white py-14 md:py-20">
      <div className="container-custom flex flex-col items-center gap-8 md:gap-12">
        <TituloSecao titulo={T.aulas.titulo} destaque={T.aulas.destaque} />
        {/* Celular: linha compacta (thumb à esquerda), para as 6 caberem em pouca rolagem. Do sm para cima, cartão. */}
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-6 w-full">
          {AULAS.map((aula) => (
            <li
              key={aula.numero}
              className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden flex flex-row sm:flex-col items-start gap-3 sm:gap-0 p-3 sm:p-0"
            >
              <div className="w-[38%] shrink-0 sm:w-full sm:p-3 sm:pb-0">
                <ThumbAula aula={aula} />
              </div>
              <div className="min-w-0 sm:p-5 flex flex-col gap-1 sm:gap-1.5">
                <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wide" style={{ color: COR.dourado }}>
                  {rotuloDaAula(aula, T.aulas.rotuloAula)}
                </p>
                <h3 className="text-[15px] sm:text-[17px] md:text-lg font-bold leading-snug" style={{ color: COR.escuro }}>
                  {aula.titulo}
                </h3>
                <p className="text-[13px] sm:text-[14px] leading-snug text-[#4a4a4a]">{aula.resumo}</p>
              </div>
            </li>
          ))}
        </ol>
        <BotaoAmarelo onClick={onCta}>
          {T.aulas.botao}
          <ArrowRight className="w-4 h-4" />
        </BotaoAmarelo>
      </div>
    </section>
  );
}

/**
 * O que a pessoa leva: a lista do 03 e, ao lado, o esqueleto do plano montado (só os títulos dos
 * blocos, sem número nenhum: o número é o da barbearia de cada um).
 */
export function LevaCurso() {
  return (
    <section className="bg-gray-50 py-14 md:py-20">
      <div className="container-custom flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-5">
          <TituloSecao titulo={T.leva.titulo} destaque={T.leva.destaque} alinhar="esquerda" />
          <p className="text-base md:text-lg font-medium leading-snug text-[#3a3a3a]">{T.leva.frase}</p>
          <Checklist itens={T.leva.itens} />
        </div>
        {/* Só no computador: no celular o esqueleto repetiria a lista logo acima. */}
        <div className="hidden lg:block w-full lg:w-1/2" aria-hidden>
          <div className="mx-auto max-w-md rounded-3xl bg-white border border-black/[0.06] shadow-[0_24px_60px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #ebad04, #f5c842, #ebad04)" }} />
            <div className="p-5 md:p-6 space-y-3">
              {Object.entries(ROTULOS_DO_PLANO.blocos)
                .filter(([chave]) => MOSTRAR_CONTA_DO_ANO || chave !== "contaDoAno")
                .map(([, titulo]) => (
                <div key={titulo} className="rounded-xl border border-black/[0.06] bg-gray-50 px-4 py-3">
                  <p className="text-[12px] font-bold uppercase tracking-wide" style={{ color: COR.dourado }}>
                    {titulo}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 shrink-0" style={{ color: COR.dourado }} strokeWidth={3} />
                    <span className="h-2 rounded-full bg-black/10 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
