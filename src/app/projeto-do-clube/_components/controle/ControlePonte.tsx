/**
 * PONTE — o que acontece depois que a pessoa envia o formulário.
 *
 * É a ponte «Como segue a conversa», a mesma guarda V9 da família: enquanto a
 * demonstração aberta for placeholder, a página NÃO promete «veja primeiro» para
 * depois entregar um formulário. Promessa que o ativo não cobre é mentira contratada.
 *
 * O texto também diz o que o envio NÃO é (não contrata serviço, não confirma horário),
 * porque é isso que separa pedido de contato de agendamento — e é essa distinção que
 * o comercial cobra na primeira ligação.
 */

import { PcRevelar } from "../PcRevelar";
import { CONTROLE_PECA, CONTROLE_PONTE } from "./controle-copy";
import estilos from "./controle.module.css";

interface ControlePonteProps {
  aoPedirContato: () => void;
}

export function ControlePonte({ aoPedirContato }: ControlePonteProps) {
  return (
    <section
      style={{
        background: "var(--pc-carvao)",
        paddingBlock: "var(--pc-secao-y)",
        paddingInline: "var(--pc-secao-x)",
      }}
    >
      <div className={estilos.envelope}>
        <PcRevelar className={estilos.ponte}>
          <h2 className={estilos.ponteTitulo}>{CONTROLE_PONTE.titulo}</h2>
          <p className={estilos.ponteTexto}>{CONTROLE_PONTE.texto}</p>
          <button type="button" className={estilos.botaoAcao} onClick={aoPedirContato}>
            {CONTROLE_PECA.botaoPrincipal}
          </button>
        </PcRevelar>
      </div>
    </section>
  );
}
