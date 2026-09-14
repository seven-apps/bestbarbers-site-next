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
  className?: string;
}

export function AvisoPrivacidade({ variante = "claro", className = "" }: AvisoPrivacidadeProps) {
  const cor = variante === "claro" ? "rgba(30,30,30,0.6)" : "rgba(255,255,255,0.45)";

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
