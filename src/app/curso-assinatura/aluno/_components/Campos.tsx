"use client";

import { useId, type ReactNode } from "react";
import { TEXTOS_FICHA } from "@/content/curso-assinatura";

/**
 * Campos da ficha (cartão branco sobre a área escura). Fonte de 16 px nos campos: abaixo disso o
 * Safari do iPhone dá zoom ao tocar. Erro sempre embaixo do campo, com o texto do contrato da tela.
 */

const BASE_CAMPO =
  "w-full rounded-xl px-4 py-3 font-medium text-[16px] outline-none border-[1.5px] bg-[#f5f5f5] text-[#1e1e1e] placeholder:text-[#9a9a9a] focus:border-[#ebad04] focus:shadow-[0_0_0_3px_rgba(235,173,4,0.15)] transition-all";

export function classeDoCampo(erro: boolean): string {
  return `${BASE_CAMPO} ${erro ? "border-red-400" : "border-[#e0e0e0]"}`;
}

export function Rotulo({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block font-semibold text-[14px] leading-snug text-[#1e1e1e]">
      {children}
    </label>
  );
}

export function Ajuda({ children }: { children: ReactNode }) {
  return <p className="text-[13px] leading-snug text-[#6b6b6b]">{children}</p>;
}

export function ErroDoCampo({ visivel, id }: { visivel: boolean; id?: string }) {
  if (!visivel) return null;
  return (
    <p id={id} className="text-[13px] font-medium text-red-600">
      {TEXTOS_FICHA.campoInvalido}
    </p>
  );
}

/** Campo de número com a unidade ao lado ("R$", "dias", "%"). Texto livre: a ficha lê "94,90". */
export function CampoNumero({
  rotulo,
  unidade,
  exemplo,
  ajuda,
  valor,
  onChange,
  erro = false,
  decimal = true,
  rotuloOculto = false,
}: {
  rotulo: string;
  unidade?: string;
  exemplo?: string;
  ajuda?: string;
  valor: string;
  onChange: (v: string) => void;
  erro?: boolean;
  decimal?: boolean;
  rotuloOculto?: boolean;
}) {
  const id = useId();
  const unidadeNaFrente = unidade === "R$";
  return (
    <div className="space-y-1.5">
      {rotuloOculto ? null : <Rotulo htmlFor={id}>{rotulo}</Rotulo>}
      <div className="relative">
        {unidade && unidadeNaFrente ? (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-semibold text-[#6b6b6b] pointer-events-none">{unidade}</span>
        ) : null}
        <input
          id={id}
          type="text"
          inputMode={decimal ? "decimal" : "numeric"}
          aria-label={rotuloOculto ? rotulo : undefined}
          aria-invalid={erro || undefined}
          value={valor}
          placeholder={exemplo}
          onChange={(e) => onChange(e.target.value)}
          className={`${classeDoCampo(erro)} ${unidade && unidadeNaFrente ? "pl-12" : ""} ${unidade && !unidadeNaFrente ? "pr-16" : ""}`}
        />
        {unidade && !unidadeNaFrente ? (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-[#6b6b6b] pointer-events-none">{unidade}</span>
        ) : null}
      </div>
      {ajuda ? <Ajuda>{ajuda}</Ajuda> : null}
      <ErroDoCampo visivel={erro} />
    </div>
  );
}

export function CampoTexto({
  rotulo,
  exemplo,
  valor,
  onChange,
  erro = false,
  max,
  rotuloOculto = false,
}: {
  rotulo: string;
  exemplo?: string;
  valor: string;
  onChange: (v: string) => void;
  erro?: boolean;
  max: number;
  rotuloOculto?: boolean;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      {rotuloOculto ? null : <Rotulo htmlFor={id}>{rotulo}</Rotulo>}
      <input
        id={id}
        type="text"
        maxLength={max}
        aria-label={rotuloOculto ? rotulo : undefined}
        aria-invalid={erro || undefined}
        value={valor}
        placeholder={exemplo}
        onChange={(e) => onChange(e.target.value)}
        className={classeDoCampo(erro)}
      />
      <ErroDoCampo visivel={erro} />
    </div>
  );
}

export function CampoData({
  rotulo,
  ajuda,
  valor,
  onChange,
  min,
  max,
  erro = false,
  mensagemErro,
}: {
  rotulo: string;
  ajuda?: string;
  valor: string;
  onChange: (v: string) => void;
  min: string;
  max: string;
  erro?: boolean;
  mensagemErro?: string;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <Rotulo htmlFor={id}>{rotulo}</Rotulo>
      <input
        id={id}
        type="date"
        min={min}
        max={max}
        aria-invalid={erro || undefined}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className={`${classeDoCampo(erro)} min-h-[48px]`}
      />
      {ajuda ? <Ajuda>{ajuda}</Ajuda> : null}
      {erro ? <p className="text-[13px] font-medium text-red-600">{mensagemErro ?? TEXTOS_FICHA.campoInvalido}</p> : null}
    </div>
  );
}

/** Escolha única em botões (o mesmo seletor da tabela de precificação). Tocar de novo desmarca. */
export function Escolha<V extends string>({
  rotulo,
  ajuda,
  opcoes,
  valor,
  onChange,
  colunas = 1,
}: {
  rotulo: string;
  ajuda?: string;
  opcoes: ReadonlyArray<{ valor: V; rotulo: string }>;
  valor: V | "";
  onChange: (v: V | "") => void;
  colunas?: 1 | 2 | 3;
}) {
  const id = useId();
  const grade = colunas === 3 ? "grid-cols-3" : colunas === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1";
  return (
    <fieldset className="space-y-2" aria-describedby={ajuda ? `${id}-ajuda` : undefined}>
      <legend className="block font-semibold text-[14px] leading-snug text-[#1e1e1e] mb-2">{rotulo}</legend>
      <div className={`grid ${grade} gap-2`}>
        {opcoes.map((op) => {
          const ativo = valor === op.valor;
          return (
            <button
              key={op.valor}
              type="button"
              role="radio"
              aria-checked={ativo}
              onClick={() => onChange(ativo ? "" : op.valor)}
              className="min-h-[44px] rounded-xl px-3 py-2.5 text-[14px] font-semibold text-left transition-all border-[1.5px]"
              style={{
                background: ativo ? "rgba(235,173,4,0.16)" : "#f5f5f5",
                borderColor: ativo ? "#ebad04" : "#e0e0e0",
                color: "#1e1e1e",
              }}
            >
              {op.rotulo}
            </button>
          );
        })}
      </div>
      {ajuda ? (
        <p id={`${id}-ajuda`} className="text-[13px] leading-snug text-[#6b6b6b]">
          {ajuda}
        </p>
      ) : null}
    </fieldset>
  );
}

export function Marcar({ rotulo, marcado, onChange }: { rotulo: string; marcado: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2.5 min-h-[44px] cursor-pointer text-[14px] font-semibold text-[#1e1e1e]">
      <input type="checkbox" checked={marcado} onChange={(e) => onChange(e.target.checked)} className="w-5 h-5 accent-[#ebad04]" />
      {rotulo}
    </label>
  );
}
