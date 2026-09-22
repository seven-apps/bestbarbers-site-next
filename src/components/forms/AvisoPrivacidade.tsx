import Link from "next/link";

/**
 * Aviso sob o botão de envio — o mesmo texto em TODAS as portas.
 *
 * TEXTO PROVISÓRIO: o final ainda passa pelo jurídico. É por isso que ele mora numa
 * constante exportada e não copiado dentro de cada formulário — quando a revisão
 * voltar, muda-se UMA linha e as dez portas mudam juntas.
 */
export const TEXTO_AVISO_PRIVACIDADE =
  "Ao enviar, você autoriza a BestBarbers a falar com você por WhatsApp e e-mail.";

export const ROTA_POLITICA_PRIVACIDADE = "/politica-de-privacidade";

interface AvisoPrivacidadeProps {
  /** Cartão claro das LPs × fundo escuro (modal, /v4, /parceiros). */
  variante?: "claro" | "escuro";
  /**
   * Mostra só o link da Política, SEM a frase de autorização de contato.
   *
   * Existe por causa de formulário de VÁRIOS PASSOS: num passo que ainda não pede
   * contato, «Ao enviar, você autoriza a BestBarbers a falar com você» é falso — e,
   * no `/projeto-do-clube`, ficava a poucos pixels da frase que promete o oposto
   * («Preencher contexto não cria pedido comercial nem dispara contato»). Duas
   * frases que se desmentem na mesma tela custam confiança justamente onde ela é
   * pedida. O link da política continua à vista, que é a obrigação real onde o dado
   * é coletado; a autorização fica no passo onde existe o «enviar».
   *
   * Padrão `false`: nenhuma das dez portas que já usam este componente muda.
   */
  somenteLink?: boolean;
  className?: string;
}

export function AvisoPrivacidade({
  variante = "claro",
  somenteLink = false,
  className = "",
}: AvisoPrivacidadeProps) {
  const cor = variante === "claro" ? "rgba(30,30,30,0.6)" : "rgba(255,255,255,0.45)";

  if (somenteLink) {
    return (
      <p
        className={`text-center text-[11px] leading-[16px] mt-3 ${className}`}
        style={{ color: cor, fontFamily: "var(--font-montserrat)" }}
      >
        <Link
          href={ROTA_POLITICA_PRIVACIDADE}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
          style={{ color: "#ebad04" }}
        >
          Política de Privacidade
        </Link>
      </p>
    );
  }

  return (
    <p
      className={`text-center text-[11px] leading-[16px] mt-3 ${className}`}
      style={{ color: cor, fontFamily: "var(--font-montserrat)" }}
    >
      {TEXTO_AVISO_PRIVACIDADE}{" "}
      <Link
        href={ROTA_POLITICA_PRIVACIDADE}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2"
        style={{ color: "#ebad04" }}
      >
        Política de Privacidade
      </Link>
      .
    </p>
  );
}
