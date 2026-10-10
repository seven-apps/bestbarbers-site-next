import type { ReactNode } from "react";
import { Lock, Play } from "lucide-react";
import type { Aula } from "@/content/curso-assinatura";
import { minutosDaDuracao } from "@/lib/curso";

/** Cores da marca usadas no curso (as mesmas da /clube e da tabela de precificação). */
export const COR = {
  amarelo: "#ffaf02",
  dourado: "#ebad04",
  escuro: "#121212",
  preto: "#0a0a0a",
  texto: "#1e1e1e",
  cinza: "#6b6b6b",
} as const;

/**
 * Título de seção no padrão das páginas recentes (/clube v2): a primeira linha no tom do fundo e a
 * segunda, o destaque, em amarelo. `tom="escuro"` = texto branco sobre fundo escuro.
 */
export function TituloSecao({
  titulo,
  destaque,
  tom = "claro",
  alinhar = "centro",
  como: Tag = "h2",
}: {
  titulo: string;
  destaque?: string;
  tom?: "claro" | "escuro";
  alinhar?: "centro" | "esquerda";
  como?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={`text-2xl md:text-4xl font-bold leading-tight text-balance ${alinhar === "centro" ? "text-center" : "text-center md:text-left"}`}
      style={{ color: tom === "escuro" ? "#ffffff" : COR.escuro }}
    >
      <span className="block">{titulo}</span>
      {destaque ? (
        <span className="block mt-1" style={{ color: COR.amarelo }}>
          {destaque}
        </span>
      ) : null}
    </Tag>
  );
}

/** Botão principal amarelo (texto escuro), largura toda no celular. */
export function BotaoAmarelo({
  children,
  onClick,
  href,
  type = "button",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const classe = `inline-flex items-center justify-center gap-2 min-h-[48px] w-full sm:w-auto px-7 py-3.5 rounded-full font-extrabold text-[14px] md:text-[15px] leading-tight text-center transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(255,175,2,0.3)] hover:brightness-95 ${className}`;
  const estilo = { backgroundColor: COR.amarelo, color: COR.escuro };
  // `href` = <a> comum: a navegação entre a vitrine e a área é sempre uma página nova (contrato §3).
  if (href) {
    return (
      <a href={href} className={classe} style={estilo}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classe} style={estilo}>
      {children}
    </button>
  );
}

/**
 * Thumb da aula. Sem imagem (os vídeos ainda não foram gravados), um cartão desenhado com o número
 * da aula atrás de um desfoque. Com imagem, a própria thumb borrada. O borrado é o "cadeado" visual
 * da vitrine: a aula abre depois do cadastro.
 */
export function ThumbAula({ aula, borrada = true, icone = "cadeado" }: { aula: Aula; borrada?: boolean; icone?: "cadeado" | "play" }) {
  const Icone = icone === "cadeado" ? Lock : Play;
  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-[#121212]">
      {aula.thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={aula.thumb}
          alt=""
          aria-hidden
          className={`absolute inset-0 w-full h-full object-cover ${borrada ? "blur-[6px] scale-110" : ""}`}
          loading="lazy"
        />
      ) : (
        <div
          aria-hidden
          className={`absolute inset-0 flex items-center justify-center ${borrada ? "blur-[3px] scale-105" : ""}`}
          style={{
            background:
              "radial-gradient(circle at 25% 30%, rgba(255,175,2,0.35) 0%, transparent 55%), radial-gradient(circle at 80% 80%, rgba(235,173,4,0.18) 0%, transparent 50%), linear-gradient(135deg, #1b1b1b 0%, #0a0a0a 100%)",
          }}
        >
          <span className="font-black text-[44px] sm:text-[64px] md:text-[72px] leading-none tracking-tight text-white/25">{aula.numero}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-black/25" aria-hidden />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg"
          style={{ backgroundColor: COR.amarelo, color: COR.escuro }}
        >
          <Icone className={`w-4 h-4 sm:w-5 sm:h-5 ${icone === "play" ? "ml-0.5" : ""}`} strokeWidth={2.5} />
        </span>
      </div>
    </div>
  );
}

/** "Aula 3 · 6 min" (a duração some enquanto a constante estiver vazia). */
export function rotuloDaAula(aula: Aula, rotulo: (n: number) => string): string {
  const minutos = minutosDaDuracao(aula.duracao);
  return minutos ? `${rotulo(aula.numero)} · ${minutos}` : rotulo(aula.numero);
}
