"use client";

/**
 * PASSO 2 — CONTATO (perguntas 1 a 4).
 *
 * Ordem dos campos: dono · WhatsApp · e-mail · barbearia. O telefone em SEGUNDO
 * lugar não é estética: o `useLeadForm` dispara o dedup em background assim que
 * o número chega a 11 dígitos, e ele leva um round-trip até o Ploomes. Com o
 * telefone em segundo, esse round-trip acontece enquanto a pessoa preenche
 * e-mail e barbearia, e o clique encontra a resposta pronta. Telefone no fim =
 * botão em «VALIDANDO...» na cara de quem já quer enviar.
 *
 * O e-mail é o ÚNICO opcional dos oito campos, e é opcional de verdade: vazio
 * passa, formato torto só avisa. A regra mora em `@/lib/form-passo1` e é a
 * MESMA que o `useLeadForm` roda no submit — uma função só, para o aviso da
 * tela e o bloqueio do envio nunca discordarem.
 *
 * Validação em tempo real: cada campo é conferido no `blur` (nunca a cada
 * tecla, que acusa erro antes de a pessoa terminar de digitar) e o aviso some
 * na primeira tecla seguinte. Nada disso toca o envio — é tudo síncrono e
 * local; o caminho do submit continua sendo só o `handleSubmit` do hook.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from "react";
import type { FormData } from "@/hooks";
import { usePhoneMask } from "@/hooks";
import { MSG_EMAIL_INVALIDO, validarEmailOpcional } from "@/lib/form-passo1";
import estilos from "./PcFormulario.module.css";

/**
 * As mensagens das perguntas 1 a 4 estão ESCRITAS dentro do `useLeadForm`
 * (`validateForm`, linhas 146-162) — ao contrário das perguntas 5 a 8, que já
 * têm casa própria em `@/lib/qualificacao`. Como este bloco não pode editar o
 * hook, a única forma de pintar o campo certo de vermelho é comparar pela
 * string exata, igual ao que `errosDeQualificacao` faz com as outras quatro.
 *
 * Comparação EXATA, nunca `includes`: um `includes("Nome")` casaria com as duas
 * mensagens de nome ao mesmo tempo.
 *
 * PENDÊNCIA registrada para o dono do hook: mover estas quatro strings para
 * `@/lib/qualificacao` e importá-las dos dois lados. Enquanto isso não
 * acontece, mudar a mensagem no hook sem mudar aqui só faz o erro cair no bloco
 * geral — nunca quebra o formulário.
 */
const MSG_BARBEARIA = "Nome da barbearia é obrigatório";
const MSG_DONO = "Nome do dono é obrigatório";
const MSG_WHATSAPP_VAZIO = "WhatsApp é obrigatório";
const MSG_WHATSAPP_FORMATO = "WhatsApp deve ter formato válido";

type CampoContato = "ownerName" | "whatsapp" | "email" | "barbershopName";

/** Qual dos quatro campos o `submitError` acusa. Nenhum → erro geral. */
function campoDoErro(submitError: string | null | undefined): CampoContato | null {
  switch (submitError) {
    case MSG_DONO:
      return "ownerName";
    case MSG_WHATSAPP_VAZIO:
    case MSG_WHATSAPP_FORMATO:
      return "whatsapp";
    case MSG_EMAIL_INVALIDO:
      return "email";
    case MSG_BARBEARIA:
      return "barbershopName";
    default:
      return null;
  }
}

interface CampoSpec {
  nome: CampoContato;
  rotulo: string;
  ajuda?: string;
  tipo: "text" | "tel" | "email";
  placeholder: string;
  autoComplete: string;
  inputMode?: "text" | "tel" | "email";
  obrigatorio: boolean;
}

/**
 * Rótulos e ajudas vêm do cap. 13 («Nome e telefone com DDD, necessários para o
 * retorno solicitado» · «E-mail opcional, apenas para quem quiser receber o
 * resumo por esse canal»). O `barbershopName` é exigido pelo `validateForm` do
 * hook — por isso é obrigatório aqui, e não decorativo.
 */
const CAMPOS: readonly CampoSpec[] = [
  {
    nome: "ownerName",
    rotulo: "Nome do dono",
    tipo: "text",
    placeholder: "Ex: João Silva",
    autoComplete: "name",
    obrigatorio: true,
  },
  {
    nome: "whatsapp",
    rotulo: "WhatsApp com DDD",
    ajuda: "É por aqui que o time devolve o contato que você pediu.",
    tipo: "tel",
    placeholder: "(11) 99999-9999",
    autoComplete: "tel-national",
    inputMode: "tel",
    obrigatorio: true,
  },
  {
    nome: "email",
    rotulo: "Seu e-mail (opcional)",
    ajuda: "Apenas para quem quiser receber o resumo por esse canal.",
    tipo: "email",
    placeholder: "Ex: joao@email.com",
    autoComplete: "email",
    inputMode: "email",
    obrigatorio: false,
  },
  {
    nome: "barbershopName",
    rotulo: "Nome da barbearia",
    tipo: "text",
    placeholder: "Ex: Barbearia do João",
    autoComplete: "organization",
    obrigatorio: true,
  },
];

export interface PcPassoContatoProps {
  formData: FormData;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  /**
   * `handleSubmit` do hook. O botão principal é `type="submit"` e passa pelo
   * `<form>` (é o que faz a tecla Enter funcionar); esta prop existe para a
   * tentativa de recuperação depois de uma falha de backend — cap. 13: «Falha
   * conserva preenchimento e mostra tentativa de recuperação».
   */
  onSubmit: (e?: FormEvent | MouseEvent) => void;
  isSubmitting: boolean;
  submitted: boolean;
  isDedupChecking: boolean;
  submitError: string | null;
  /** `peca.botaoContato` — «Quero conversar sobre meu clube». */
  rotuloBotao: string;
  aoVoltar: () => void;
  /** Prefixo dos ids — mantém `label htmlFor` único se o bloco montar duas vezes. */
  idPrefixo: string;
  tituloId: string;
  animar?: boolean;
}

export function PcPassoContato({
  formData,
  onChange,
  onSubmit,
  isSubmitting,
  submitted,
  isDedupChecking,
  submitError,
  rotuloBotao,
  aoVoltar,
  idPrefixo,
  tituloId,
  animar = false,
}: PcPassoContatoProps) {
  const { isValidPhone } = usePhoneMask();
  const tituloRef = useRef<HTMLHeadingElement | null>(null);
  const refs = useRef<Partial<Record<CampoContato, HTMLInputElement | null>>>({});

  /** Campos que já perderam o foco uma vez — só eles mostram aviso. */
  const [tocados, setTocados] = useState<Partial<Record<CampoContato, boolean>>>({});

  const campoComErroDoSubmit = campoDoErro(submitError);

  // Entrada no passo: foco no título, para o leitor de tela anunciar a troca e
  // o teclado continuar de onde a pessoa está lendo.
  useEffect(() => {
    if (animar) tituloRef.current?.focus();
  }, [animar]);

  // Erro vindo do submit: leva a tela até o campo culpado. No mobile o botão
  // fica abaixo da dobra — sem isto, a pessoa clica, o erro aparece fora da
  // tela e o botão parece quebrado.
  useEffect(() => {
    if (!campoComErroDoSubmit) return;
    refs.current[campoComErroDoSubmit]?.focus();
  }, [campoComErroDoSubmit, submitError]);

  /** Validação local de um campo — a MESMA regra que o hook roda no submit. */
  const validar = useCallback(
    (campo: CampoContato): string | null => {
      switch (campo) {
        case "ownerName":
          return formData.ownerName.trim() ? null : MSG_DONO;
        case "barbershopName":
          return formData.barbershopName.trim() ? null : MSG_BARBEARIA;
        case "whatsapp":
          if (!formData.whatsapp.trim()) return MSG_WHATSAPP_VAZIO;
          return isValidPhone(formData.whatsapp) ? null : MSG_WHATSAPP_FORMATO;
        case "email":
          return validarEmailOpcional(formData.email);
        default:
          return null;
      }
    },
    [formData.ownerName, formData.barbershopName, formData.whatsapp, formData.email, isValidPhone],
  );

  const aoSair = (campo: CampoContato) => () => {
    setTocados((anteriores) => (anteriores[campo] ? anteriores : { ...anteriores, [campo]: true }));
  };

  const aoDigitar = (campo: CampoContato) => (e: ChangeEvent<HTMLInputElement>) => {
    // Primeira tecla depois do aviso: o campo volta a ser "não conferido" e o
    // vermelho sai da tela enquanto a pessoa corrige. (O `submitError` o próprio
    // `handleInputChange` do hook já limpa.)
    if (tocados[campo]) {
      setTocados((anteriores) => ({ ...anteriores, [campo]: false }));
    }
    onChange(e);
  };

  const enviando = isSubmitting || submitted || isDedupChecking;
  const erroGeral = submitError && !campoComErroDoSubmit ? submitError : null;

  const rotuloDoBotao = isSubmitting
    ? "Enviando…"
    : submitted
      ? "Recebemos seu contato"
      : isDedupChecking
        ? "Validando…"
        : rotuloBotao;

  return (
    <div className={`${estilos.passo} ${animar ? estilos.passoEntraAdiante : ""}`}>
      <h3 id={tituloId} ref={tituloRef} tabIndex={-1} className={estilos.passoTitulo}>
        Como podemos falar com você?
      </h3>

      <div className={estilos.campos}>
        {CAMPOS.map((campo) => {
          const id = `${idPrefixo}-${campo.nome}`;
          const idAjuda = campo.ajuda ? `${id}-ajuda` : undefined;
          const idErro = `${id}-erro`;

          // Erro do submit vence o local: é o que impediu o envio agora.
          const erro =
            campoComErroDoSubmit === campo.nome
              ? submitError
              : tocados[campo.nome]
                ? validar(campo.nome)
                : null;

          const valor = formData[campo.nome];
          const conferidoOk = Boolean(tocados[campo.nome]) && !erro && valor.trim() !== "";

          return (
            <div key={campo.nome} className={estilos.campo}>
              <label htmlFor={id} className={estilos.rotulo}>
                {campo.rotulo}
              </label>
              {campo.ajuda && (
                <p id={idAjuda} className={estilos.ajuda}>
                  {campo.ajuda}
                </p>
              )}
              <input
                id={id}
                // `name` é a chave do FormData do hook — mudar aqui desliga o campo.
                name={campo.nome}
                ref={(el) => {
                  refs.current[campo.nome] = el;
                }}
                type={campo.tipo}
                inputMode={campo.inputMode}
                autoComplete={campo.autoComplete}
                placeholder={campo.placeholder}
                value={valor}
                onChange={aoDigitar(campo.nome)}
                onBlur={aoSair(campo.nome)}
                required={campo.obrigatorio}
                aria-required={campo.obrigatorio || undefined}
                aria-invalid={erro ? true : undefined}
                aria-describedby={
                  [erro ? idErro : null, idAjuda ?? null].filter(Boolean).join(" ") || undefined
                }
                disabled={submitted}
                className={`${estilos.entrada} ${erro ? estilos.entradaErro : ""} ${
                  conferidoOk ? estilos.entradaOk : ""
                }`}
              />
              {/* Erro SEMPRE abaixo do campo, sem animação (M4). */}
              {erro && (
                <p id={idErro} className={estilos.erroCampo}>
                  {erro}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/*
        Erro que não é de campo: backend do recadastro fora, Ploomes fora,
        rede caída. Cap. 13: a falha conserva o preenchimento (ele vive no
        `useLeadForm`, nada é remontado) e mostra a tentativa de recuperação.
      */}
      {erroGeral && (
        <div className={estilos.erroGeral} role="alert">
          <p className={estilos.erroGeralTexto}>{erroGeral}</p>
          {!submitted && (
            <button
              type="button"
              className={estilos.erroGeralAcao}
              onClick={() => onSubmit()}
              disabled={enviando}
            >
              Tentar enviar de novo
            </button>
          )}
        </div>
      )}

      <div className={estilos.acoes}>
        <button
          type="submit"
          // Cliques repetidos não geram leads novos (cap. 13): o botão sai do ar
          // no primeiro clique e só volta se o envio falhar.
          disabled={enviando}
          aria-busy={isSubmitting || isDedupChecking || undefined}
          className={`${estilos.botaoAcao} ${isSubmitting ? estilos.botaoEnviando : ""}`}
        >
          {rotuloDoBotao}
        </button>

        <button
          type="button"
          onClick={aoVoltar}
          disabled={enviando}
          className={estilos.botaoVoltar}
        >
          ← Voltar e revisar o contexto
        </button>
      </div>
    </div>
  );
}
