/**
 * CONTROLE — a oferta ATUAL da BestBarbers («o produto»), saneada.
 *
 * O que esta página é: a página de produto como ela É hoje (app próprio, sistema,
 * demonstração), escrita do zero contra as features reais, para servir de base de
 * comparação contra a abordagem nova («projeto do clube»). Mesmo formulário, mesmo
 * rastreio, mesma qualidade de construção — o que muda é a MENSAGEM.
 *
 * O que esta página NÃO é: uma cópia da /v12. Nada daqui foi copiado de lá. O que
 * saiu da oferta atual e por quê está registrado em
 * bestbarbers-ai/docs/operacional/plano-v3-maquina-vendas/paginas-projeto-clube/
 * CONTROLE-SANEAMENTO-V12.md — sem esse registro a comparação fica cega.
 *
 * REGRAS QUE ESTE ARQUIVO CUMPRE (nenhuma é opinião):
 * - Preço público só «a partir de R$299», sempre colado ao bloco literal de condições.
 * - Zero nome de cliente, parceiro ou concorrente — em texto, `alt` ou nome de arquivo.
 * - Zero promessa de prazo de resultado, zero «sem fidelidade», zero «cancele quando quiser».
 * - Zero feature inexistente. Toda linha de módulo abaixo tem página própria no site
 *   (/app-proprio-barbearia, /agendamento-online, /clube-de-assinaturas,
 *   /gestao-comissoes-barbeiro, /gestao-financeira-barbearia, /nota-fiscal-barbearia,
 *   /totem-autoatendimento) — é feature publicada, não promessa.
 * - Números da plataforma entram com a ressalva de que são da plataforma, não resultado
 *   prometido para a barbearia de quem lê.
 */

import type { PcPaginaConfig, PcPeca } from "../pc.types";

/**
 * `source` do dataLayer. DIVERGE de propósito do `lp_projeto_controle` previsto em
 * §1.1 da arquitetura: lá o `/controle` era um slot A/A (a MESMA página da entrada
 * geral com outro rótulo, para medir piso de ruído). Esta página é outra coisa — é a
 * oferta atual saneada, um braço B de mensagem. Rotular um braço B com a string do
 * slot A/A corromperia exatamente a leitura que o André quer fazer.
 */
export const CONTROLE_SOURCE = "lp_controle_produto";

/**
 * Rótulo que vira `originDesc` no Ploomes (`[Projeto-Clube]Controle-Produto`) quando a
 * visita chega sem UTM. É por ele que a leitura separa este braço do «projeto do clube»
 * sem criar origem nova — origem nova apagaria o funil da leitura diária (40210173 está
 * hardcoded em 11 leitores; ver §1.5 da arquitetura).
 */
export const CONTROLE_ROTULO = "Controle-Produto";

/**
 * A peça sintética do controle. O tipo `PcPecaId` é `L${string}`; «LCTRL» diz a verdade
 * (não é nenhuma das 34 do acervo) em vez de se disfarçar de L021.
 * `ponte: "como_segue"` porque a demonstração aberta ainda é placeholder (guarda V9):
 * não se promete «veja primeiro» entregando formulário.
 */
export const CONTROLE_PECA: PcPeca = {
  id: "LCTRL",
  conceito: "Oferta atual saneada — o produto",
  situacao: "geral",
  etapa: "Topo",
  titulo: "Seu app, com a sua marca. E o sistema que roda a barbearia por trás dele.",
  apoio:
    "Agenda online, clube de assinaturas com cobrança no cartão, comissão por profissional e nota fiscal de serviço — no mesmo lugar.",
  botaoPrincipal: "Quero conhecer o sistema",
  exemploTitulo: "Do agendamento à nota, no mesmo lugar",
  exemploTexto:
    "O cliente marca pelo app com a sua marca, o atendimento entra no caixa com a comissão do profissional, a mensalidade do assinante é cobrada no cartão na data do plano e a nota de serviço é emitida com a configuração já feita.",
  faqPergunta: "O que está incluído na mensalidade?",
  faqResposta:
    "Depende dos módulos e do serviço contratado. A mensalidade começa em R$299 e a composição completa — módulos, taxas e recebimento — é apresentada pelo time antes de agendar qualquer conversa. O preço inicial não significa que tudo esteja incluído.",
  ponte: "como_segue",
  formularioVariante: "padrao",
  botaoContato: "Quero falar sobre a minha barbearia",
  artefatoExigido: null,
};

export const CONTROLE_CONFIG: PcPaginaConfig = {
  situacao: "geral",
  rota: "/projeto-do-clube/controle",
  source: CONTROLE_SOURCE,
  rotulo: CONTROLE_ROTULO,
  peca: CONTROLE_PECA,
};

/** Rótulo curto acima do título. Sem superlativo: «a maior do Brasil» não tem fonte auditável. */
export const CONTROLE_SOBRETITULO = "O sistema da BestBarbers";

/**
 * Nota de preço do herói. O valor NUNCA aparece sozinho — o bloco literal de condições
 * fica na mesma página e o link leva à página de condições.
 */
export const CONTROLE_NOTA_PRECO =
  "A partir de R$299. As condições completas estão logo abaixo.";

/**
 * Bloco de condições — TEXTO LITERAL da biblioteca de copy aprovada
 * (biblioteca-copy/LANDING-PAGES.md, seção «Investimento e condições», idêntico nas 100
 * peças). Não reescrever: é o texto que o comercial aprovou para expressar preço.
 */
export const CONTROLE_CONDICOES = {
  titulo: "Investimento e condições",
  texto:
    "A partir de R$299. O valor depende dos módulos e do serviço contratado. Mensalidade, taxas, recebimento, contrato e condições de cancelamento são apresentados antes do agendamento. O preço inicial não significa que tudo esteja incluído.",
  link: "Ver investimento e condições",
} as const;

/** Formulário — títulos LITERAIS da biblioteca («Conte o que você quer organizar»). */
export const CONTROLE_FORMULARIO = {
  titulo: "Conte o que você quer organizar",
  apoio:
    "Quer conferir o seu caso com o time? Conte como está seu clube e qual dúvida quer resolver. Informe seu nome e telefone para o retorno solicitado. E-mail é opcional. O envio pede contato comercial; não contrata o serviço nem confirma horário.",
  /**
   * Vazio de propósito: o controle não declara situação por rota (é a entrada geral do
   * produto), então quem responde a pergunta 7 é a própria pessoa. §5.1 da arquitetura.
   */
  clubStatusInicial: "",
} as const;

/**
 * NÚMEROS DA PLATAFORMA — os quatro oficiais, os mesmos que o site já publica.
 * A ressalva ao lado não é enfeite: o acervo proíbe transferir resultado de terceiro
 * («Nenhum resultado financeiro ou caso de terceiros transferido para a BestBarbers»).
 */
export interface ControleNumero {
  valor: number;
  prefixo?: string;
  sufixo?: string;
  rotulo: string;
  apoio: string;
}

export const CONTROLE_NUMEROS: ControleNumero[] = [
  { valor: 1200, sufixo: "+", rotulo: "Barbearias", apoio: "usando o sistema" },
  { valor: 51000, sufixo: "+", rotulo: "Assinantes", apoio: "de clube na plataforma" },
  { valor: 5, prefixo: "R$ ", sufixo: " mi+", rotulo: "Processados", apoio: "por mês na plataforma" },
  { valor: 6, sufixo: " mi+", rotulo: "Agendamentos", apoio: "por mês na plataforma" },
];

export const CONTROLE_NUMEROS_RESSALVA =
  "Números da plataforma inteira. São o tamanho da operação que você contrata, não um resultado prometido para a sua barbearia.";

/**
 * MÓDULOS — cada um existe, tem página própria publicada no site e está em produção.
 * A ordem segue o caminho do dinheiro: quem marca, quem atende, quem paga, quem recebe.
 */
export interface ControleModulo {
  id: string;
  nome: string;
  texto: string;
  /** Página pública que prova que o módulo existe — fica no código, não na tela. */
  provaEm: string;
}

export const CONTROLE_MODULOS: ControleModulo[] = [
  {
    id: "app",
    nome: "App próprio com a sua marca",
    texto:
      "Um aplicativo publicado na App Store e na Play Store com a marca da sua barbearia. Seu cliente abre o app e vê só a sua barbearia dentro dele.",
    provaEm: "/app-proprio-barbearia",
  },
  {
    id: "agenda",
    nome: "Agendamento online",
    texto:
      "Link e app abertos 24 horas, com lembrete automático. O horário entra na agenda sem depender de alguém responder o WhatsApp.",
    provaEm: "/agendamento-online",
  },
  {
    id: "clube",
    nome: "Clube de assinaturas",
    texto:
      "Planos com cobrança recorrente no cartão. O cliente autoriza a assinatura na adesão e a cobrança segue o plano contratado.",
    provaEm: "/clube-de-assinaturas",
  },
  {
    id: "comissao",
    nome: "Comissão por profissional",
    texto:
      "Percentual ou valor fixo, por serviço e por profissional. O relatório mostra quanto cada um tem a receber no fechamento.",
    provaEm: "/gestao-comissoes-barbeiro",
  },
  {
    id: "financeiro",
    nome: "Financeiro da barbearia",
    texto:
      "Fluxo de caixa, formas de pagamento e relatórios gerenciais do que entrou e do que saiu, por unidade.",
    provaEm: "/gestao-financeira-barbearia",
  },
  {
    id: "nfse",
    nome: "Nota fiscal de serviço (NFS-e)",
    texto:
      "Emissão da nota depois do atendimento, com a configuração fiscal feita uma vez. Depende das informações do seu município e do seu regime.",
    provaEm: "/nota-fiscal-barbearia",
  },
  {
    id: "totem",
    nome: "Totem de autoatendimento",
    texto:
      "Check-in, comanda e pagamento feitos pelo próprio cliente, sem fila no caixa.",
    provaEm: "/totem-autoatendimento",
  },
];

export const CONTROLE_MODULOS_TITULO = "O que entra no sistema";
export const CONTROLE_MODULOS_APOIO =
  "Sete módulos que já existem no produto, nenhum é promessa futura. O que faz parte do seu contrato depende dos módulos e do serviço contratado — é isso que a conversa com o time define.";

/**
 * MECANISMO — a sequência real do produto, quatro passos. É o que a animação mostra.
 * A ressalva do passo da cobrança é a mesma do acervo: pagamento pode falhar, e a
 * demonstração honesta mostra onde a pendência aparece.
 */
export interface ControlePassoMecanismo {
  rotulo: string;
  texto: string;
}

export const CONTROLE_MECANISMO = {
  titulo: "Do agendamento à nota, no mesmo lugar",
  apoio:
    "Não são sete programas conversando. É um caminho só, e ele começa no cliente marcando o horário.",
  legenda: "Telas ilustrativas, com dados fictícios.",
  ressalva:
    "Pagamento pode falhar. Quando falha, a pendência aparece na tela para a sua equipe tratar — o sistema não esconde a cobrança que não entrou.",
  botaoRepetir: "Ver de novo",
  botaoPausar: "Pausar",
  botaoRetomar: "Continuar",
  passos: [
    {
      rotulo: "1 · O cliente marca",
      texto: "Ele abre o app com a sua marca, escolhe o profissional e o horário entra na agenda.",
    },
    {
      rotulo: "2 · O atendimento entra no caixa",
      texto: "O serviço é registrado e a comissão do profissional é calculada na hora.",
    },
    {
      rotulo: "3 · A assinatura é cobrada",
      texto: "Se ele é assinante, a mensalidade do clube é cobrada no cartão na data do plano.",
    },
    {
      rotulo: "4 · A nota é emitida",
      texto: "A NFS-e do serviço sai com a configuração fiscal que foi feita uma vez.",
    },
  ] as ControlePassoMecanismo[],
} as const;

/**
 * FAQ — saneado. Sem a pergunta de fidelidade/garantia/cancelamento (V10 e pendência P1
 * da arquitetura: sem comercial + financeiro, publicar resposta aqui repete o erro que
 * está no ar na /v12). Sem número sem fonte, sem caso de terceiro, sem prazo.
 */
export interface ControleFaqItem {
  pergunta: string;
  resposta: string;
}

export const CONTROLE_FAQ: ControleFaqItem[] = [
  {
    pergunta: "O que está incluído na mensalidade?",
    resposta:
      "Depende dos módulos e do serviço contratado. A mensalidade começa em R$299 e a composição completa — módulos, taxas e recebimento — é apresentada pelo time antes de agendar qualquer conversa. O preço inicial não significa que tudo esteja incluído.",
  },
  {
    pergunta: "O aplicativo é mesmo da minha barbearia?",
    resposta:
      "É. O app é publicado na App Store e na Play Store com a marca da sua barbearia, e o seu cliente vê só a sua barbearia dentro dele.",
  },
  {
    pergunta: "Como funciona a cobrança do clube?",
    resposta:
      "O cliente autoriza a assinatura no cartão no momento da adesão e a cobrança segue o plano contratado. Pagamentos podem falhar; quando isso acontece, a pendência aparece para a sua equipe tratar.",
  },
  {
    pergunta: "Meus clientes atuais entram automaticamente no clube?",
    resposta:
      "Não. A adesão e a autorização precisam ser feitas conforme o processo confirmado para o seu caso.",
  },
  {
    pergunta: "A nota fiscal sai sozinha?",
    resposta:
      "A emissão acontece depois do atendimento, com a configuração fiscal feita uma vez. O que essa configuração exige depende das informações do seu município e do seu regime tributário.",
  },
  {
    pergunta: "Já uso outro sistema. Dá para migrar?",
    resposta:
      "Dá. O que muda de um caso para outro é o que existe hoje para levar: cadastro de clientes, planos ativos e histórico de atendimento. O time confere o seu caso antes de combinar qualquer coisa.",
  },
  {
    pergunta: "Funciona para barbearia pequena?",
    resposta:
      "O sistema roda com uma cadeira e roda com várias unidades. O que muda são os módulos que fazem sentido no seu caso — e é isso que a conversa serve para definir.",
  },
];

export const CONTROLE_FAQ_TITULO = "Perguntas que chegam antes da conversa";

/** Ponte antes do formulário — «Como segue a conversa» (guarda V9). */
export const CONTROLE_PONTE = {
  titulo: "Como segue a conversa",
  texto:
    "Você conta como está a sua barbearia hoje e qual dúvida quer resolver. O time confere o seu caso, apresenta as condições e o investimento completo e só então combina um horário. O envio do formulário pede contato comercial; não contrata o serviço nem confirma horário.",
} as const;

/** CTA fixo do mobile. */
export const CONTROLE_CTA_FIXO = "Quero conhecer o sistema";
