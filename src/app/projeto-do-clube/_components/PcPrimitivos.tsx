import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/**
 * PROJETO DO CLUBE — primitivos compartilhados (B2).
 *
 * Por que existem: nove construtores escrevendo ao mesmo tempo produzem nove
 * vocabulários visuais se cada um montar seu próprio título e seu próprio botão.
 * Aqui há UM de cada. Quem precisar de algo que não está aqui usa as classes
 * `.pc-*` de `pc-tokens.css` — nunca cor nomeada do Tailwind (não pinta nesta
 * base) nem `rounded-2xl`/`3xl` (a escala está invertida).
 *
 * **Todos são server components.** Nenhum tem estado, nenhum toca `window`,
 * nenhum traz `"use client"` — então o arquivo também funciona dentro de uma
 * árvore cliente. O único cuidado: `PcBotao` com `onClick` só pode ser usado a
 * partir de um componente que já seja `"use client"`.
 *
 * Tailwind é permitido para LAYOUT (`flex`, `grid`, `gap`, `px-*`) via
 * `className`. Cor, raio, sombra, tipografia e duração vêm dos tokens.
 */

/* ═══════════════════════════════════════════════════════════════════════════
   ESTRUTURA
   ═══════════════════════════════════════════════════════════════════════════ */

export interface PcContainerProps {
  /** `padrao` = 1120px · `texto` = 62ch · `cheia` = sem teto. */
  medida?: "padrao" | "texto" | "cheia";
  como?: "div" | "section" | "article" | "header" | "footer";
  className?: string;
  children: ReactNode;
}

/** Miolo centralizado. Use quando a faixa não for um `PcSecao` inteiro. */
export function PcContainer({ medida = "padrao", como = "div", className, children }: PcContainerProps) {
  const Tag = como as "div";
  return (
    <Tag
      className={cn(
        "pc-medida",
        medida === "texto" && "pc-medida--texto",
        medida === "cheia" && "pc-medida--cheia",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TEXTO
   ═══════════════════════════════════════════════════════════════════════════ */

export interface PcTituloProps {
  /** Escala visual. O nível 1 existe UMA vez por página (o do herói). */
  nivel?: 1 | 2 | 3;
  /** Tag do HTML, quando a hierarquia semântica não bate com a escala visual. */
  como?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  id?: string;
  className?: string;
  children: ReactNode;
}

export function PcTitulo({ nivel = 2, como, id, className, children }: PcTituloProps) {
  const Tag = (como ?? (`h${nivel}` as const)) as "h2";
  return (
    <Tag id={id} className={cn("pc-titulo", `pc-titulo--${nivel}`, className)}>
      {children}
    </Tag>
  );
}

export interface PcSubtituloProps {
  como?: "p" | "div" | "span";
  className?: string;
  children: ReactNode;
}

/** A linha de apoio logo abaixo de um título. Uma por bloco. */
export function PcSubtitulo({ como = "p", className, children }: PcSubtituloProps) {
  const Tag = como as "p";
  return <Tag className={cn("pc-subtitulo", className)}>{children}</Tag>;
}

export interface PcTextoProps {
  como?: "p" | "div" | "span" | "li";
  tamanho?: "padrao" | "grande";
  tom?: "padrao" | "suave";
  className?: string;
  children: ReactNode;
}

export function PcTexto({
  como = "p",
  tamanho = "padrao",
  tom = "padrao",
  className,
  children,
}: PcTextoProps) {
  const Tag = como as "p";
  return (
    <Tag
      className={cn(
        "pc-texto",
        tamanho === "grande" && "pc-texto--grande",
        tom === "suave" && "pc-texto--suave",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export interface PcRotuloProps {
  como?: "span" | "p" | "div";
  className?: string;
  children: ReactNode;
}

/** O micro-rótulo em caixa alta que nomeia o bloco. Nunca é o título. */
export function PcRotulo({ como = "span", className, children }: PcRotuloProps) {
  const Tag = como as "span";
  return <Tag className={cn("pc-rotulo", className)}>{children}</Tag>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   OBJETOS
   ═══════════════════════════════════════════════════════════════════════════ */

export interface PcCartaoProps {
  /** `papel` é o cartão do ARTEFATO (o documento que o dono confere). */
  variante?: "papel" | "carvao" | "contorno";
  como?: "div" | "article" | "li" | "figure";
  id?: string;
  className?: string;
  children: ReactNode;
}

export function PcCartao({ variante = "carvao", como = "div", id, className, children }: PcCartaoProps) {
  const Tag = como as "div";
  return (
    <Tag id={id} className={cn("pc-cartao", `pc-cartao--${variante}`, className)}>
      {children}
    </Tag>
  );
}

export interface PcSeloProps {
  tom?: "ouro" | "acao" | "neutro";
  como?: "span" | "div" | "li";
  className?: string;
  children: ReactNode;
}

/** Etiqueta curta. Nunca use para urgência fabricada nem contagem regressiva. */
export function PcSelo({ tom = "ouro", como = "span", className, children }: PcSeloProps) {
  const Tag = como as "span";
  return (
    <Tag className={cn("pc-selo", tom !== "ouro" && `pc-selo--${tom}`, className)}>
      {children}
    </Tag>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AÇÃO
   ═══════════════════════════════════════════════════════════════════════════ */

export type PcBotaoVariante = "acao" | "ouro" | "fantasma" | "link";
export type PcBotaoTamanho = "md" | "g";

export interface PcBotaoAparencia {
  /** `acao` é a ÚNICA cor de conversão. Um por dobra, no máximo. */
  variante?: PcBotaoVariante;
  tamanho?: PcBotaoTamanho;
  /** Ocupa a linha inteira (padrão do mobile no formulário). */
  bloco?: boolean;
  className?: string;
}

/**
 * Monta a classe do botão sem renderizar nada.
 *
 * É o que se usa quando o elemento tem de ser outro — `next/link`, por exemplo,
 * em navegação interna (que, nesta família, passa obrigatoriamente pelo
 * `pc-link.ts` para preservar a query inteira):
 *
 *     <Link href={hrefCondicoes} className={pcClasseBotao({ variante: "ouro" })}>…</Link>
 */
export function pcClasseBotao({ variante = "acao", tamanho = "md", bloco, className }: PcBotaoAparencia = {}): string {
  return cn(
    "pc-botao",
    `pc-botao--${variante}`,
    tamanho === "g" && "pc-botao--g",
    bloco && "pc-botao--bloco",
    className,
  );
}

export type PcBotaoProps = PcBotaoAparencia & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Botão. M5 é só CSS: `:hover`, `:active` e `:focus-visible` cuidam da
 * micro-interação — é proibido embrulhar botão em componente de animação.
 *
 * `type="button"` é o padrão de propósito: dentro de um `<form>`, o padrão do
 * HTML é `submit`, e foi assim que já se enviou formulário sem querer aqui.
 */
export function PcBotao({ variante, tamanho, bloco, className, type = "button", ...resto }: PcBotaoProps) {
  return <button type={type} className={pcClasseBotao({ variante, tamanho, bloco, className })} {...resto} />;
}

export type PcBotaoLinkProps = PcBotaoAparencia & AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * Link com cara de botão. Para destino EXTERNO ou âncora na própria página
 * (`#pc-formulario`). Navegação interna entre rotas da família usa `next/link`
 * com `pcClasseBotao()`, para não perder a query da atribuição.
 */
export function PcBotaoLink({ variante, tamanho, bloco, className, ...resto }: PcBotaoLinkProps) {
  return <a className={pcClasseBotao({ variante, tamanho, bloco, className })} {...resto} />;
}
