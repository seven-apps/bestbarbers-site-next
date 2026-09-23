/**
 * AS TELAS DO SISTEMA que provam cada promessa das páginas `/clube/[peca]` — em HTML, não imagem.
 *
 * Por que HTML: no celular a captura de painel vira texto de 4 px; aqui a tela é desenhada para
 * ~300 px de largura, legível, pesa ~0 KB e ANIMA (a micro-história da promessa: o «Aguardando»
 * que vira «Pago», o cartão que recusa e o sistema que tenta de novo). O visual segue o app real
 * (cartões escuros, pílulas de status, dourado da marca); todos os dados são FICTÍCIOS, e a
 * legenda da prova diz isso.
 *
 * Contrato da animação (quem executa é `TelaAnimada.tsx`, uma vez, ao entrar na tela):
 *   data-anim="entra"  data-ordem="n"  → sobe e aparece, em cascata
 *   data-anim="troca"                  → filhos [data-antes] e [data-depois]: o «antes» sai, o «depois» entra
 *   data-anim="liga"                   → interruptor liga
 *   data-anim="pulso"                  → um pulso de escala
 *   data-anim="apaga"                  → esmaece para 35% (o que o filtro tira de foco)
 * O HTML do servidor é SEMPRE o estado final: sem JS, ou com `prefers-reduced-motion`, a tela já
 * está certa e nada se mexe.
 *
 * Travas: nenhum nome real de cliente, parceiro ou concorrente; nenhum número de tentativas da
 * retentativa; planos entre R$99,90 e R$139,90 (mediana real R$136 — exemplo barato ancora baixo).
 */
import type { ReactNode } from "react";
import type { TelaClubeId } from "@/content/clube-pecas";
import e from "./telas.module.css";

const Pilula = ({ tom, children }: { tom: "ok" | "alerta" | "erro" | "info" | "marca"; children: ReactNode }) => (
  <span className={`${e.pilula} ${e[`p_${tom}`]}`}>
    <i />
    {children}
  </span>
);

/** Status que troca durante a animação: SSR mostra o `depois`. */
const Troca = ({ antes, depois, ordem }: { antes: ReactNode; depois: ReactNode; ordem: number }) => (
  <span className={e.troca} data-anim="troca" data-ordem={ordem}>
    <span data-antes aria-hidden="true">{antes}</span>
    <span data-depois>{depois}</span>
  </span>
);

const Cabecalho = ({ titulo, sub }: { titulo: string; sub: string }) => (
  <>
    <div className={e.status}>
      <span>9:41</span>
      <span aria-hidden="true">●●● ▮</span>
    </div>
    <div className={e.cab}>
      <span className={e.icone} aria-hidden="true">BB</span>
      <div>
        <b>{titulo}</b>
        <small>{sub}</small>
      </div>
    </div>
  </>
);

const Linha = ({ nome, detalhe, fim, ordem, anim = "entra" }: { nome: string; detalhe: string; fim?: ReactNode; ordem?: number; anim?: string }) => (
  <div className={e.linha} data-anim={ordem !== undefined ? anim : undefined} data-ordem={ordem}>
    <div className={e.nome}>
      <b>{nome}</b>
      <span>{detalhe}</span>
    </div>
    {fim}
  </div>
);

const Secao = ({ children }: { children: ReactNode }) => <div className={e.secao}>{children}</div>;

const Interruptor = ({ ordem }: { ordem: number }) => (
  <span className={e.interruptor} data-anim="liga" data-ordem={ordem} aria-hidden="true">
    <i />
  </span>
);


/* Ícones do mockup do whitelabel (`MockupIcons`), em `currentColor` para seguir o tema. */
const Svg = ({ children, tam = 16 }: { children: ReactNode; tam?: number }) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const IconeLoja = () => <Svg><path d="M3 21V9L1 5H23L21 9V21H3Z" /><path d="M9 21V13H15V21" /><path d="M1 5L3 1H21L23 5" /></Svg>;
const IconePessoa = () => <Svg><circle cx="12" cy="7" r="4" /><path d="M4 21V19C4 16.8 5.8 15 8 15H16C18.2 15 20 16.8 20 19V21" /></Svg>;
const IconeTesoura = () => <Svg><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" /></Svg>;
const IconeCalendario = () => <Svg><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2V6M8 2V6M3 10H21" /></Svg>;
const IconeSeta = () => <Svg><path d="M9 18L15 12L9 6" /></Svg>;
const IconeAgendar = () => <Svg tam={18}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2V6M8 2V6M3 10H21" /><path d="M9 15L11 17L15 13" /></Svg>;
const IconeRelogio = () => <Svg tam={18}><circle cx="12" cy="12" r="9" /><path d="M12 7V12L15 15" /></Svg>;
const IconeFeed = () => <Svg tam={18}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></Svg>;
const IconePerfil = () => <Svg tam={18}><circle cx="12" cy="8" r="4" /><path d="M4 20C4 17 7.5 15 12 15C16.5 15 20 17 20 20" /></Svg>;

const TELAS: Record<TelaClubeId, () => ReactNode> = {
  "plano-regra": () => (
    <>
      <Cabecalho titulo="Plano do clube" sub="Barbearia Exemplo" />
      <div className={e.corpo}>
        <div className={e.campo}><small>Nome</small>Corte e Barba — Seg a Qua</div>
        <div className={e.duas}>
          <div className={e.campo}><small>Valor</small>R$ 119,90</div>
          <div className={e.campo}><small>Comissão</small>40%</div>
        </div>
        <div className={e.opcao}><span>Limite de utilização<small>4 usos no mês</small></span><Interruptor ordem={0} /></div>
        <div className={e.opcao}><span>Apenas dias específicos<small>o clube vale só nesses dias</small></span><Interruptor ordem={1} /></div>
        <div className={e.dias}>
          {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) =>
            i >= 1 && i <= 3 ? (
              <span key={i} className={e.diaOn} data-anim="entra" data-ordem={2 + i}>{d}</span>
            ) : (
              <span key={i}>{d}</span>
            ),
          )}
        </div>
        <div className={e.aviso} data-anim="entra" data-ordem={6}>Sexta e sábado: fora do plano</div>
      </div>
    </>
  ),

  "cobrancas-hoje": () => (
    <>
      <Cabecalho titulo="Clube de assinatura" sub="Barbearia Exemplo" />
      <Secao>Mensalidades cobradas hoje</Secao>
      <div className={e.lista}>
        {[["Bruno A.", "Corte e Barba"], ["Carlos M.", "Corte"], ["Eduardo P.", "Corte e Barba"], ["Gustavo L.", "Corte"], ["Henrique T.", "Corte e Barba"]].map(([n, p], i) => (
          <Linha key={n} nome={n} detalhe={`${p} · cartão`} fim={<Troca ordem={i} antes={<Pilula tom="info">Cobrando</Pilula>} depois={<Pilula tom="ok">Pago</Pilula>} />} />
        ))}
      </div>
      <div className={e.rodapeTela} data-anim="entra" data-ordem={6}>5 de 5 pagas no cartão · ninguém cobrado por mensagem</div>
    </>
  ),

  "calendario-dia1": () => {
    // Outubro de 2026 começa numa quinta-feira (grade começando na segunda).
    const vazios = 3;
    return (
      <>
        <Cabecalho titulo="Clube de assinatura" sub="Próximas cobranças" />
        <div className={e.mes}><span>‹</span><b>Outubro</b><span>›</span></div>
        <div className={e.grade}>
          {["S", "T", "Q", "Q", "S", "S", "D"].map((d, i) => <em key={i}>{d}</em>)}
          {Array.from({ length: vazios }, (_, i) => <span key={`v${i}`} />)}
          {Array.from({ length: 31 }, (_, i) =>
            i === 0 ? <span key={i} className={e.dia1} data-anim="pulso" data-ordem={0}>1</span> : <span key={i}>{i + 1}</span>,
          )}
        </div>
        <div className={e.cartaoOuro} data-anim="entra" data-ordem={2}>
          <span className={e.grande}>1</span>
          <div><b>Mensalidades cobradas</b><small>no cartão de cada assinante, sem mensagem</small></div>
        </div>
        <div className={e.rodapeTela} data-anim="entra" data-ordem={3}>Próximas cobranças: <b>todo dia 1 do mês</b></div>
      </>
    );
  },

  "trilha-recusa": () => (
    <>
      <Cabecalho titulo="Detalhes da assinatura" sub="Clube de assinatura" />
      <div className={e.lista}>
        <Linha nome="Diego F." detalhe="Plano Mensal · cartão" fim={<Pilula tom="alerta">Pendente</Pilula>} />
      </div>
      <div className={e.trilha}>
        <div data-anim="entra" data-ordem={0}><span className={`${e.marco} ${e.m_erro}`}>✕</span><p><b>O cartão recusou</b><small>a mensalidade do mês ficou pendente</small></p></div>
        <div data-anim="entra" data-ordem={2}><span className={`${e.marco} ${e.m_marca}`}>↻</span><p><b className={e.ouro}>Nova tentativa de cobrança</b><small>feita pelo sistema, sozinho</small></p></div>
        <div data-anim="entra" data-ordem={4}><span className={`${e.marco} ${e.m_alerta}`}>🔒︎</span><p><b>Agendamento bloqueado</b><small>enquanto a mensalidade estiver em atraso</small></p></div>
      </div>
    </>
  ),

  comissao: () => (
    <>
      <Cabecalho titulo="Comissões" sub="Setembro · por profissional" />
      <div className={e.cabTabela}><span>Profissional</span><span>Avulso</span><span>Assinatura</span></div>
      <div className={e.lista}>
        {[["Léo", "R$ 1.240", "R$ 980", "ok"], ["Caio", "R$ 1.105", "R$ 860", "ok"], ["Nando", "R$ 890", "R$ 610", "alerta"]].map(([n, a, s, st], i) => (
          <div key={n} className={e.tabela} data-anim="entra" data-ordem={i}>
            <b>{n}</b><span>{a}</span><span className={e.ouro}>{s}</span>
            <Pilula tom={st as "ok" | "alerta"}>{st === "ok" ? "Pago" : "Pendente"}</Pilula>
          </div>
        ))}
      </div>
      <div className={e.rodapeTela} data-anim="entra" data-ordem={4}>A comissão da assinatura sai em coluna própria</div>
    </>
  ),

  // App do CLIENTE com a marca da barbearia — fiel ao `AppMockup` da tela de configuração do
  // whitelabel (bestbarbers-web-cra, `feat/whitelabel-app-config`). As cores vêm de `--app-*`
  // (`lib/app-marca.ts`); logo e foto de fundo, de `--app-logo`/`--app-foto` (o simulador troca).
  "app-marca": () => (
    <div className={e.appCliente}>
      <div className={e.appFoto} aria-hidden="true" />
      <div className={e.appConteudo}>
        <div className={e.appStatus}>
          <span>9:41</span>
          <i aria-hidden="true" />
        </div>
        <div className={e.appTopo}>
          <span className={e.appLogo} aria-hidden="true"><b>B</b></span>
          <p className={e.appTitulo}>
            Agende <span>seu horário</span>
          </p>
          <p className={e.appSub}>Escolha os serviços que desejar</p>
        </div>
        <div className={e.appCards}>
          {(
            [
              [IconeLoja, "Barbearia Exemplo · Centro"],
              [IconePessoa, "Léo"],
              [IconeTesoura, "Corte e Barba"],
              [IconeCalendario, "15:10 · Quinta, 22 out"],
            ] as const
          ).map(([Icone, rotulo], i) => (
            <div key={rotulo} className={e.appCard} data-anim="entra" data-ordem={i}>
              <Icone />
              <span>{rotulo}</span>
              <IconeSeta />
            </div>
          ))}
          <div className={e.appAgendar} data-anim="entra" data-ordem={4}>Agendar</div>
        </div>
        <nav className={e.appNav} aria-hidden="true">
          {(
            [
              [IconeAgendar, "Agendar", true],
              [IconeRelogio, "Histórico", false],
              [IconeFeed, "Feed", false],
              [IconePerfil, "Perfil", false],
            ] as const
          ).map(([Icone, rotulo, ativo]) => (
            <span key={rotulo} className={ativo ? e.appNavAtivo : undefined}>
              <Icone />
              {rotulo}
            </span>
          ))}
          <i className={e.appHome} />
        </nav>
      </div>
    </div>
  ),

  "resumo-assinantes": () => (
    <>
      <Cabecalho titulo="Resumo de assinantes" sub="Clube de assinatura" />
      <div className={e.chips}>
        <span>Todos</span><span>Ativos</span>
        <Troca ordem={0} antes={<span className={e.chipOff}>Vencidos</span>} depois={<span className={e.chipOn}>Vencidos</span>} />
      </div>
      <div className={e.lista}>
        <Linha nome="Bruno A." detalhe="Corte e Barba · vence 03/10" fim={<Pilula tom="ok">Ativo</Pilula>} ordem={1} anim="apaga" />
        <Linha nome="Carlos M." detalhe="Corte · vence 08/10" fim={<Pilula tom="ok">Ativo</Pilula>} ordem={1} anim="apaga" />
        <Linha nome="Diego F." detalhe="Corte · venceu 12/09" fim={<Pilula tom="alerta">Vencido</Pilula>} />
        <Linha nome="Eduardo P." detalhe="Corte e Barba · vence 19/10" fim={<Pilula tom="ok">Ativo</Pilula>} ordem={1} anim="apaga" />
        <Linha nome="Gustavo L." detalhe="Corte · vence 23/10" fim={<Pilula tom="ok">Ativo</Pilula>} ordem={1} anim="apaga" />
      </div>
    </>
  ),

  "dois-sistemas": () => (
    <>
      <Cabecalho titulo="Agenda de hoje" sub="Agenda e assinaturas juntas" />
      <div className={e.lista}>
        {[["09:00", "Bruno A.", "Corte e Barba"], ["10:30", "Carlos M.", "Corte"], ["14:00", "Eduardo P.", "Corte e Barba"]].map(([h, n, p], i) => (
          <div key={n} className={e.agendaLinha} data-anim="entra" data-ordem={i}>
            <b className={e.ouro}>{h}</b>
            <div className={e.nome}><b>{n}</b><span>Assinante · {p}</span></div>
            <div className={e.colDir}><Pilula tom="ok">Em dia</Pilula><small>comissão calculada</small></div>
          </div>
        ))}
      </div>
      <div className={e.rodapeTela} data-anim="entra" data-ordem={4}>Quem cortou e quem pagou, no mesmo lugar</div>
    </>
  ),

  "agenda-bloqueio": () => (
    <>
      <Cabecalho titulo="Agendar horário" sub="Barbearia Exemplo · app do cliente" />
      <Secao>Sábado, 10 de outubro</Secao>
      <div className={e.horarios}>
        {["09:00", "09:40", "10:20", "11:00", "14:00", "15:30"].map((h) => (
          <span key={h} data-anim="apaga" data-ordem={1}>{h}</span>
        ))}
      </div>
      <div className={e.bloqueio} data-anim="entra" data-ordem={2}>
        <span className={`${e.marco} ${e.m_erro}`}>🔒︎</span>
        <p><b>Agendamento bloqueado</b><small>A mensalidade do seu clube está em atraso. Regularize para agendar.</small></p>
      </div>
    </>
  ),

  "previsao-mes": () => (
    <>
      <Cabecalho titulo="Previsão de faturas" sub="Setembro · por vencimento" />
      <div className={e.caixas}>
        <div data-anim="entra" data-ordem={0}><b className={e.verde}>R$ 11.470,90</b><small>82 pagas</small></div>
        <div data-anim="entra" data-ordem={1}><b className={e.laranja}>R$ 519,60</b><small>4 vencidas</small></div>
        <div data-anim="entra" data-ordem={2}><b className={e.azul}>R$ 1.199,00</b><small>9 aguardando</small></div>
      </div>
      <div className={e.lista}>
        <Linha nome="Bruno A." detalhe="vence 05/09" fim={<Pilula tom="ok">Pago</Pilula>} ordem={3} />
        <Linha nome="Diego F." detalhe="vence 05/09" fim={<Pilula tom="alerta">Vencida</Pilula>} ordem={4} />
        <Linha nome="Felipe A." detalhe="vence 28/09" fim={<Pilula tom="info">Aguardando</Pilula>} ordem={5} />
      </div>
    </>
  ),

  "jornada-assinante": () => (
    <>
      <Cabecalho titulo="Barbearia Exemplo" sub="App do cliente" />
      <div className={e.jornada}>
        <div data-anim="entra" data-ordem={0}><span className={`${e.marco} ${e.m_marca}`}>✓</span><p><b>Assinatura confirmada</b><small>Clube Corte e Barba · cartão cadastrado</small></p></div>
        <div data-anim="entra" data-ordem={2}><span className={`${e.marco} ${e.m_ok}`}>R$</span><p><b>Mensalidade paga</b><small>R$ 119,90 cobrados no cartão, automático</small></p></div>
        <div data-anim="entra" data-ordem={4}><span className={`${e.marco} ${e.m_ok}`}>✓</span><p><b>Horário confirmado</b><small>Sábado, 10:00 · com Léo</small></p></div>
      </div>
    </>
  ),
};

export const IDS_TELAS = Object.keys(TELAS) as TelaClubeId[];

/**
 * A tela dentro do aparelho (moldura do mockup do whitelabel, com a Dynamic Island).
 *
 * `app-marca` NÃO declara as variáveis `--app-*` aqui: variável declarada no próprio elemento
 * vence a herdada, e o `SimuladorApp` (que envolve a tela) nunca conseguiria trocar a cor. O tema
 * vem de fora — do simulador, já no HTML do servidor — e, sem ele, dos fallbacks do CSS.
 */
export function Tela({ id }: { id: TelaClubeId }) {
  return (
    <div className={e.aparelho}>
      <i className={e.ilha} aria-hidden="true" />
      <div className={e.tela}>{TELAS[id]()}</div>
    </div>
  );
}
