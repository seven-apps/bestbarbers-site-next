/**
 * PROJETO DO CLUBE — a copy comum da família e a resolução da peça.
 *
 * Fonte de TUDO que está aqui: cap. 13 (`13-ESTRUTURA-DE-LANDING-PAGES.md`) e o JSON
 * normalizado das 34 peças aprovadas. Nenhuma frase deste arquivo foi escrita por um
 * agente — as que não são literais do capítulo estão marcadas com `// MICRO-STRING`
 * e listadas no `01-ENTREGA.md` para o comercial revisar (estatuto P11 da §8).
 *
 * SEM `"use client"`, e isso é load-bearing: os quatro `page.tsx` são server
 * components e leem `PC_ABERTURAS` dentro de `metadata` e chamam `pecaDaRota()` no
 * servidor. Num módulo marcado como client, todo export vira client reference e a
 * chamada quebra em runtime — não em compilação.
 */
import { PC_PECAS } from "./pc-pecas";
import { PC_ARTEFATOS } from "./pc-artefatos";
import type {
  PcAbertura,
  PcFaqItem,
  PcOpcaoSeletor,
  PcPeca,
  PcPecaId,
  PcPonteId,
  PcSituacao,
} from "./pc.types";

/* ───────────────────────────────────────────────────────────────────────────
   ABERTURAS POR SITUAÇÃO — literal do cap. 13 (§«Copy de abertura»).
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * A abertura `geral` do JSON aprovado não traz `identificacao`, `linkSecundario`
 * nem `exemplo` (ela é a porta de quem não declarou situação — não há o que
 * identificar). O tipo `PcAbertura` exige `string` nos três, então aqui eles vão
 * como string VAZIA, nunca com texto inventado: `PcHeroi` já testa
 * `abertura.identificacao ? … : null` e `linkSecundario?.trim()` antes de pintar.
 */
export const PC_ABERTURAS: Record<PcSituacao, PcAbertura> = {
  geral: {
    identificacao: "",
    titulo: "Veja seu clube funcionando com as regras da sua barbearia.",
    apoio:
      "Já tem um clube, quer trocar de sistema ou está preparando uma abertura? Conheça o funcionamento da BestBarbers e converse com o time sobre regras, comissão e implantação.",
    botao: "Montar meu projeto com o time.",
    linkSecundario: "",
    exemplo: "",
  },
  manual: {
    identificacao: "Para quem já vende planos e controla o clube manualmente.",
    titulo: "Seu clube cresceu. O controle ainda está no caderno?",
    apoio:
      "Veja como organizar as regras de uso, a cobrança e a comissão com a BestBarbers. Vamos avaliar o que precisa mudar na sua operação e como colocar o clube no sistema com assistência na implantação.",
    botao: "Montar meu projeto com o time.",
    linkSecundario: "Ver como o clube funciona.",
    exemplo:
      "Hoje, como você confere quem pode usar o plano e o que precisa ser cobrado? Na conversa, vamos olhar sua regra atual e mostrar o que pode ser configurado no sistema. O que depender de ajuste ou de trabalho manual fica explícito.",
  },
  migracao: {
    identificacao: "Para quem tem clube e está avaliando trocar de sistema.",
    titulo: "Antes de trocar o sistema do clube, desenhe a transição.",
    apoio:
      "Vamos olhar regras, vencimentos, comissão e recebimento para avaliar a mudança. Você entende o que pode ser migrado, o que precisa ser refeito e quais cuidados entram na implantação.",
    botao: "Avaliar a migração do meu clube.",
    linkSecundario: "Entender como funciona.",
    exemplo:
      "Trocar o sistema exige mais do que importar uma lista. Precisamos conferir a situação das cobranças, as regras dos planos e as limitações técnicas. Não prometemos transferir cartões, manter todos os assinantes nem concluir uma migração antes dessa avaliação.",
  },
  abertura: {
    identificacao: "Para quem está preparando uma barbearia com equipe.",
    titulo:
      "Vai abrir a barbearia? Desenhe o clube antes de começar a vender planos.",
    apoio:
      "Organize regras, comissão, cobrança e orientação da equipe para a abertura. Vamos avaliar sua data, o que já está definido e o que precisa estar pronto para implantar o clube.",
    // O botão principal do herói vem da peça (L031, «Planejar o clube da
    // inauguração») e leva à DEMONSTRAÇÃO; este leva ao FORMULÁRIO. Enquanto os
    // dois diziam «planejar o clube da …», eram sinônimos na tela e a página
    // perdia a porta da demonstração — o visitante escolhia entre duas portas
    // iguais. As outras três situações já separam ver × falar com o time.
    botao: "Montar a abertura com o time.",
    linkSecundario: "Ver o funcionamento do clube.",
    exemplo:
      "O projeto considera sua equipe prevista e seu calendário. A data de abertura ajuda a organizar a implantação; não é uma promessa automática de entrega nessa data.",
  },
};

/* ───────────────────────────────────────────────────────────────────────────
   O QUE A PÁGINA PERGUNTA — o mesmo formulário, a pergunta da situação.
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * Título do passo 1 do formulário. Os CAMPOS não mudam (faturamento, sistema
 * atual, situação do clube e número de profissionais alimentam o score e são os
 * quatro de sempre) — muda só o que a página diz estar perguntando.
 *
 * Existe porque «Como está seu clube hoje?» ia para as quatro situações,
 * inclusive `abertura`, onde por definição não há clube para descrever. Quem
 * chega de um anúncio de pré-abertura era recebido com uma pergunta sobre uma
 * operação que ele ainda não tem.
 */
export const PC_ROTULO_CONTEXTO: Record<PcSituacao, string> = {
  geral: "Como está seu clube hoje?",
  manual: "Como está seu clube hoje?",
  migracao: "Como seu clube funciona hoje?",
  abertura: "Como você está planejando o clube?",
};

/**
 * Primeira frase da ponte «Como segue a conversa». O restante é igual para
 * todos — o que muda é o que a pessoa tem para contar quando o time ligar.
 * `PC_BLOCOS.pontes.como_segue.texto` continua sendo a composição da variante
 * `geral`, para quem consome a ponte sem saber a situação.
 */
export const PC_COMO_SEGUE_PRIMEIRA_FRASE: Record<PcSituacao, string> = {
  geral: "Você conta como está seu clube e o que quer resolver.",
  manual: "Você conta como está seu clube e o que quer resolver.",
  migracao:
    "Você conta como seu clube funciona hoje e o que precisa continuar funcionando depois da troca.",
  abertura:
    "Você conta como imagina o clube e o que ainda precisa decidir antes de vender o primeiro plano.",
};

/** O que vem depois da primeira frase, igual nas quatro situações. */
export const PC_COMO_SEGUE_RESTANTE =
  "O time confirma a necessidade e apresenta o investimento completo antes de combinar a demonstração. " +
  "A implantação, quando contratada, segue as entregas e responsabilidades descritas na proposta.";

/** A ponte «como segue» já montada para a situação de quem lê. */
export function comoSegueDaSituacao(situacao: PcSituacao): string {
  return `${PC_COMO_SEGUE_PRIMEIRA_FRASE[situacao]} ${PC_COMO_SEGUE_RESTANTE}`;
}

/* ───────────────────────────────────────────────────────────────────────────
   SELETOR DE SITUAÇÃO — rótulos literais do cap. 13 (`aberturas.geral.seletor`).
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * `clubStatus` é a string LITERAL de `CLUBE_OPCOES` (`src/lib/lead-score.ts`) que
 * pré-preenche a pergunta 7 do formulário. Valor fora daquela tabela faz
 * `calcularScoreV2` devolver `null`, o score chega VAZIO ao Ploomes e o
 * `QualifiedLead` não dispara — por isso as strings estão copiadas caractere a
 * caractere, e o `PcFormulario` ainda confere contra `CLUBE_OPCOES` antes de aplicar.
 *
 * «Vou abrir uma unidade» e «Quero começar» caem na MESMA opção de propósito:
 * `CLUBE_OPCOES` distingue ter/não ter clube, não abrir/não abrir barbearia. Quem
 * separa os dois é a ROTA (`/abertura`) e o nome do anúncio, não o formulário.
 */
export const PC_SELETOR: readonly PcOpcaoSeletor[] = [
  {
    valor: "manual",
    rotulo: "Controlo manualmente",
    clubStatus: "Já tenho o clube, mas gerencio manualmente",
  },
  {
    valor: "migracao",
    rotulo: "Quero trocar de sistema",
    clubStatus: "Já tenho o clube, integrado no meu sistema de gestão",
  },
  {
    valor: "abertura",
    rotulo: "Vou abrir uma unidade",
    clubStatus: "Ainda não tenho, mas tenho muito interesse em implementar",
  },
  {
    valor: "geral",
    rotulo: "Quero começar",
    clubStatus: "Ainda não tenho, mas tenho muito interesse em implementar",
  },
];

/**
 * Pré-preenchimento da pergunta 7 pela ROTA (antes de qualquer clique no seletor).
 *
 * `geral` é string VAZIA de propósito: quem chega pela entrada geral não declarou
 * nada, e carimbar uma resposta por ele contaminaria o campo que mais pesa no score.
 * Ele responde — ou clica numa opção do seletor, e aí a resposta é dele.
 */
export const PC_CLUB_STATUS_POR_SITUACAO: Record<PcSituacao, string> = {
  geral: "",
  manual: "Já tenho o clube, mas gerencio manualmente",
  migracao: "Já tenho o clube, integrado no meu sistema de gestão",
  abertura: "Ainda não tenho, mas tenho muito interesse em implementar",
};

/* ───────────────────────────────────────────────────────────────────────────
   BLOCOS COMUNS — literais do cap. 13 e do JSON `blocosComuns`.
   ─────────────────────────────────────────────────────────────────────────── */

export interface PcBlocoTexto {
  titulo: string;
  texto: string;
}

export interface PcBlocos {
  /** «Investimento e condições» — 100/100 ocorrências no acervo. */
  condicoes: PcBlocoTexto;
  formularioPadrao: PcBlocoTexto;
  formularioCurto: PcBlocoTexto;
  /** Rótulo do botão final do formulário (34/100). */
  botaoContato: string;
  /** As três pontes possíveis entre o argumento e o pedido de contato. */
  pontes: Record<PcPonteId, PcBlocoTexto>;
  demonstracao: PcBlocoTexto & { botao: string };
  conversaEntrega: PcBlocoTexto;
  comoFunciona: PcBlocoTexto & { passos: readonly string[] };
  /** A expressão de preço pública, com a nota de escopo. Valor fechado nunca aparece. */
  notaPreco: string;
  microcopyEnvio: string;
  obrigado: { titulo: string; apoio: string; botao: string };
}

export const PC_BLOCOS: PcBlocos = {
  condicoes: {
    titulo: "Investimento e condições",
    texto:
      "A partir de R$299. O valor depende dos módulos e do serviço contratado. Mensalidade, taxas, recebimento, contrato e condições de cancelamento são apresentados antes do agendamento. O preço inicial não significa que tudo esteja incluído.",
  },
  formularioPadrao: {
    titulo: "Conte o que você quer organizar",
    texto:
      "Como está seu clube hoje? O que está mais difícil ou o que falta para começar? Informe seu nome e um telefone para o retorno solicitado. E-mail é opcional. Ao enviar, você pede contato comercial; não contrata o serviço nem confirma um horário.",
  },
  formularioCurto: {
    titulo: "Conte o que você quer organizar",
    texto:
      "Quer conferir o seu caso com o time? Conte como está seu clube e qual dúvida quer resolver. Informe seu nome e telefone para o retorno solicitado. E-mail é opcional. O envio pede contato comercial; não contrata o serviço nem confirma horário.",
  },
  botaoContato: "Quero conversar sobre meu clube",
  pontes: {
    veja_primeiro: {
      titulo: "Veja primeiro. Converse sobre sua barbearia depois.",
      texto:
        "A demonstração desta página é aberta. Veja o funcionamento e, se quiser conferir a regra da sua barbearia com o time, peça contato abaixo. Antes de agendar essa conversa, você recebe as condições e o investimento completo.",
    },
    como_segue: {
      titulo: "Como segue a conversa",
      // Montado da mesma fonte que as outras situações usam, para que o texto
      // genérico e o personalizado nunca divirjam por edição em um só lugar.
      texto: comoSegueDaSituacao("geral"),
    },
    use_material: {
      titulo: "Use o material. Depois, decida seu próximo passo.",
      texto:
        "Você pode explorar este conteúdo sem deixar seus dados. Se quiser conhecer a BestBarbers para a sua barbearia, peça contato abaixo. O time esclarece a necessidade e apresenta as condições e o investimento completo antes de agendar uma conversa.",
    },
  },
  demonstracao: {
    // MICRO-STRING: rótulo da seção (o cap. 13 dá o resumo e o botão, não o título).
    titulo: "Demonstração aberta",
    texto:
      "Conheça a regra de uso, a adesão autorizada ao plano e a conferência da cobrança. Demonstração com dados fictícios.",
    botao: "Ver o clube funcionando",
  },
  conversaEntrega: {
    // MICRO-STRING: rótulo da seção. O cap. 13 nomeia o bloco «O que a conversa entrega».
    titulo: "O que a conversa entrega",
    texto:
      "Vamos olhar sua situação, demonstrar o funcionamento relevante para o seu clube e registrar o que precisa ser definido para implantar. Você recebe uma recomendação com escopo, investimento e próximo passo. Se houver uma limitação técnica ou comercial, ela entra na conversa antes da decisão.",
  },
  comoFunciona: {
    // MICRO-STRING: rótulo da seção. O cap. 13 nomeia o bloco «Como funciona».
    titulo: "Como funciona",
    texto:
      "Você conta o que está planejando. O time confirma sua necessidade e apresenta o investimento completo. Se fizer sentido seguir, combinamos uma conversa para desenhar a implantação. Depois da contratação, a assistência segue o escopo e os responsáveis definidos na proposta.",
    /**
     * Os quatro passos são as QUATRO FRASES do literal acima, na ordem, sem uma
     * palavra a mais nem a menos. §2.4: «4 passos derivados do literal Como funciona».
     */
    passos: [
      "Você conta o que está planejando.",
      "O time confirma sua necessidade e apresenta o investimento completo.",
      "Se fizer sentido seguir, combinamos uma conversa para desenhar a implantação.",
      "Depois da contratação, a assistência segue o escopo e os responsáveis definidos na proposta.",
    ],
  },
  notaPreco:
    "A partir de R$299. O investimento depende dos módulos e do escopo. Vamos apresentar mensalidade, eventuais custos de implantação, taxas e condições antes do agendamento.",
  microcopyEnvio:
    "Ao enviar, você pede contato da BestBarbers sobre este projeto. O envio não contrata o serviço nem confirma um horário.",
  obrigado: {
    titulo: "Recebemos seu pedido. Vamos olhar seu clube juntos.",
    apoio:
      "O próximo passo é confirmar sua situação e apresentar as condições da implantação.",
    botao: "Conversar com o time",
  },
};

/* ───────────────────────────────────────────────────────────────────────────
   FAQ GERAL — as perguntas propostas do cap. 13.
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * As SETE do capítulo entram inteiras aqui, inclusive as duas que hoje não podem ir
 * ao ar. Quem decide o que renderiza é `filtrarPerguntas()` (`_lib/perguntas.ts`),
 * pela tabela `PC_CONDICOES` — e não a ausência silenciosa de uma linha neste
 * arquivo. A diferença importa: no dia em que o comercial aprovar a regra de
 * fidelidade, é UM booleano que muda, e a pergunta volta com o texto que já foi
 * revisado, em vez de alguém ter que reescrevê-la de memória.
 *
 * - «Existe fidelidade ou garantia?» → bloqueada por `fidelidade_garantia: false`
 *   (o texto do capítulo é orientação editorial, não resposta ao visitante).
 * - «Vocês montam tudo por mim?» → tem a resposta TROCADA por uma conservadora
 *   enquanto `implantacao_assistida: false`, porque a do capítulo afirma o serviço.
 */
export const PC_FAQ_GERAL: readonly PcFaqItem[] = [
  {
    pergunta: "Já preciso ter um clube?",
    resposta:
      "Não. Podemos avaliar uma operação existente ou o que você está preparando. A conversa parte da sua situação e do que já está definido.",
    // Quem chega por `manual` ou `migracao` JÁ tem clube: a pergunta responde
    // uma dúvida que essa pessoa não tem, e gasta um acordeão do FAQ.
    situacoes: ["geral", "abertura"],
  },
  {
    pergunta: "Vocês montam tudo por mim?",
    resposta:
      "A implantação assistida segue o escopo combinado. A proposta informa o que a BestBarbers faz, o que sua equipe precisa fazer e quais entregas dependem de validação.",
  },
  {
    pergunta: "Posso migrar do meu sistema atual?",
    resposta:
      "Vamos avaliar as possibilidades e limitações da sua operação. Não prometemos transferência automática de cartões, assinantes ou histórico sem essa análise.",
    // Fora de `migracao` porque lá a página inteira responde isso — repetir no
    // FAQ faz a página parecer genérica justamente para quem ela foi escrita.
    // Fora de `abertura` porque não há sistema anterior de onde migrar.
    situacoes: ["geral", "manual"],
  },
  {
    pergunta: "Quanto vou investir?",
    resposta:
      "A partir de R$299, conforme módulos e condições. Antes de agendar, o time apresenta o investimento completo, incluindo o que se aplicar de implantação e taxas.",
  },
  {
    pergunta: "Quando recebo as cobranças?",
    resposta:
      "O recebimento segue as condições efetivas do meio de pagamento contratado. O time apresenta esse funcionamento e avalia o impacto no caixa; não prometemos antecipação como regra geral.",
  },
  {
    pergunta: "Existe fidelidade ou garantia?",
    resposta:
      "As condições vigentes estão explícitas na proposta e no contrato antes da contratação.",
  },
  {
    pergunta: "Vocês garantem faturamento ou adesão dos meus clientes?",
    resposta:
      "Não. O projeto ajuda a definir e implantar a operação. Resultado comercial depende também da oferta, da execução e da decisão dos seus clientes.",
  },
];

/* ───────────────────────────────────────────────────────────────────────────
   RESOLUÇÃO DA PEÇA — allow-list fechada, no servidor (§1.4).
   ─────────────────────────────────────────────────────────────────────────── */

/** Peça padrão de cada rota. Cai aqui sem token, sem match ou com peça de outra situação. */
export const PC_PECA_PADRAO: Record<PcSituacao, PcPecaId> = {
  geral: "L021",
  manual: "L001",
  migracao: "L011",
  abertura: "L031",
};

/**
 * A allow-list de §1.4. É ela — não a tabela de peças — que decide o que um
 * `utm_content` pode escolher. O param escolhe uma CHAVE de mapa fechado; nunca
 * entrega texto.
 */
export const PC_PECAS_DA_SITUACAO: Record<PcSituacao, readonly PcPecaId[]> = {
  geral: ["L021", "L022", "L023", "L025", "L028", "L029"],
  manual: ["L001", "L002", "L003", "L004", "L005", "L008"],
  migracao: ["L011", "L012", "L013", "L016"],
  abertura: ["L031"],
};

/** `ESTATICO-P2-MANUAL-L001-V1` → `L001`. Mesma forma que `_lib/personalizacao.ts` usa. */
const TOKEN_PECA = /(?:^|-)(L0\d{2})(?:-|$)/i;

/**
 * Resolve a composição da rota a partir do nome do anúncio que veio em `utm_content`.
 *
 * Ordem: extrai o token → confere na allow-list da SITUAÇÃO → devolve a peça. Qualquer
 * falha (sem token, id inexistente, peça de outra situação, macro `{{ad.name}}` não
 * expandida) cai na peça padrão. Nunca lança: uma rota de tráfego pago que explode por
 * causa de um parâmetro mal formado é pior do que uma rota que abre com a peça padrão.
 */
export function pecaDaRota(situacao: PcSituacao, utmContent: string): PcPeca {
  const padrao = PC_PECAS[PC_PECA_PADRAO[situacao]];
  const bruto = (utmContent ?? "").trim();
  if (!bruto || bruto.includes("{{")) return padrao;

  const achado = bruto.match(TOKEN_PECA)?.[1]?.toUpperCase() as PcPecaId | undefined;
  if (!achado) return padrao;

  const permitidas = PC_PECAS_DA_SITUACAO[situacao];
  if (!permitidas.includes(achado)) return padrao;

  return PC_PECAS[achado] ?? padrao;
}

/**
 * GUARDA V9 — a ponte que a página pode cumprir HOJE.
 *
 * A peça pode estar escrita com «Veja primeiro», mas prometer demonstração aberta
 * quando a única coisa no lugar é uma moldura tracejada de placeholder é prometer o
 * que a página não entrega. Enquanto o artefato exigido não tiver `status: "real"`,
 * a ponte cai para «Como segue a conversa», que é verdadeira em qualquer cenário.
 *
 * Peça sem artefato exigido (`null`) mantém a ponte escrita: ela não promete ver nada.
 */
export function ponteEfetiva(peca: PcPeca): PcPonteId {
  if (!peca.artefatoExigido) return peca.ponte;
  return PC_ARTEFATOS[peca.artefatoExigido]?.status === "real"
    ? peca.ponte
    : "como_segue";
}

/** Título e apoio do bloco de formulário, pela variante da peça. */
export function blocoDoFormulario(peca: PcPeca): PcBlocoTexto {
  return peca.formularioVariante === "curto"
    ? PC_BLOCOS.formularioCurto
    : PC_BLOCOS.formularioPadrao;
}
