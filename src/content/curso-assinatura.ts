/**
 * CURSO DE ASSINATURA — constantes e textos da vitrine (`/curso-assinatura`) e da área do aluno
 * (`/curso-assinatura/aluno`).
 *
 * Fontes (no bestbarbers-ai, `docs/operacional/marketing-vendas-out26/curso-assinatura/`):
 *   - `01-estrutura-da-campanha.md` — a estrutura DECIDIDA pelo André em 06/Out/26;
 *   - `02-contrato-tecnico.md` — o contrato entre este site e o OS (rotas, campos, limites);
 *   - `03-textos-pagina-e-emails.md` — os textos propostos.
 *
 * ⚠️ TODO TEXTO DESTE ARQUIVO É PROPOSTA PENDENTE DE APROVAÇÃO DO ANDRÉ. Nada vai ao ar sem o GO.
 * Onde o texto não veio do 03 (estados da tela que o 03 não cobre), o comentário diz "texto novo".
 * Onde o contrato mandou ajustar o 03 (§15 do 02), o comentário diz o quê.
 *
 * Regras de copy aplicadas: sujeito explícito, frases curtas, "assinatura" ao falar com o dono
 * ("clube de assinaturas" só no botão de migração já aprovado), nenhum nome de cliente, parceiro
 * ou concorrente, nenhum preço do BestBarbers, nenhuma promessa de resultado em número, nenhuma
 * objeção que o leitor não trouxe.
 *
 * Arquivo sem `@/` e sem React: o `node --test` carrega direto.
 */

/** Marca de revisão: enquanto `true`, nenhum texto daqui foi aprovado. */
export const TEXTOS_PENDENTES_DE_APROVACAO = true;

/** Nome do curso, decidido pelo André em 06/Out/26. Trocar o nome = trocar só esta constante. */
export const NOME_DO_CURSO = "Assinatura na Prática";

/**
 * Vira o `bb_lp_version` do card (regra do slug em `lib/lead-attribution.ts`) e o caminho das
 * duas páginas. FIXAR ANTES DO 1º LEAD, qualquer que seja o nome: trocar depois quebra a série
 * no CRM e a reconciliação do OS, que procura cards com `bb_lp_version = curso-assinatura`.
 */
export const SLUG_CURSO = "curso-assinatura";
export const CAMINHO_VITRINE = `/${SLUG_CURSO}`;
export const CAMINHO_AREA = `/${SLUG_CURSO}/aluno`;

/** A área do aluno não carrega GTM, pixel nem a pergunta do dono (contrato §3). */
export function ehAreaDoAluno(pathname: string): boolean {
  return pathname === CAMINHO_AREA || pathname.startsWith(`${CAMINHO_AREA}/`);
}

/**
 * Id da origem "Curso de assinatura" no Ploomes (bloco D da estrutura). `null` enquanto a origem
 * não existe: vale a UTM e, sem UTM, o padrão do site (40210426), como no modal.
 */
export const ORIGEM_PLOOMES_CURSO: number | null = 120004129;
/** Descrição da campanha no tráfego sem UTM. Estável: não muda quando o nome do curso mudar. */
export const ORIGEM_DESC_CURSO = "LP - Curso de assinatura";
/** `source` do `useLeadForm` (relatórios da BBAI e `lp_version` do dataLayer). */
export const SOURCE_CURSO = "lp_curso_assinatura";

/**
 * PENDENTE (decisão 1 do 02 §15 e decisão 2 do 03): e-mail obrigatório só nesta página. É a
 * recomendação dos dois documentos, porque o link do curso e os 6 e-mails dependem dele.
 * `false` volta ao e-mail opcional do resto do site; o contrato funciona nos dois casos.
 */
export const EMAIL_OBRIGATORIO_NO_CURSO = true;

/** PENDENTE (decisão 7 do 03): a conta do ano na tela do plano montado. `false` tira o bloco. */
export const MOSTRAR_CONTA_DO_ANO = true;

/**
 * Link público só da aula 5, para a equipe (decisão 6 do 03; fora do contrato). Vazio = a caixa
 * "Mande a aula 5 para a sua equipe" não aparece, e o dono passa a aula na reunião pelo link dele.
 */
export const LINK_PUBLICO_AULA_5 = "";

// ─── As 6 aulas ─────────────────────────────────────────────────────────────────────────────

export type NumeroAula = 1 | 2 | 3 | 4 | 5 | 6;
export const NUMEROS_AULA: ReadonlyArray<NumeroAula> = [1, 2, 3, 4, 5, 6];

export interface Aula {
  numero: NumeroAula;
  /** Igual nos dois repositórios (o OS guarda o mesmo em `lib/curso/aulas.ts`). */
  titulo: string;
  /** Uma linha do que a aula ensina (cartão da vitrine). */
  resumo: string;
  /**
   * "m:ss". ESTIMATIVA de `gravacao/aula-N.md` até a edição; trocar pela duração REAL do vídeo
   * editado, aqui e no OS. Vazia = a vitrine não mostra a duração. Nenhum texto escreve duração
   * fixa: todos leem esta constante.
   */
  duracao: string;
  /** Id do vídeo NÃO LISTADO no YouTube, com "Permitir incorporação" ligado. Vazio = "em breve". */
  youtubeId: string;
  /** Caminho da thumb em `public/` (aparece borrada na vitrine). `null` = cartão desenhado. */
  thumb: string | null;
}

export const AULAS: ReadonlyArray<Aula> = [
  {
    numero: 1,
    titulo: "Quanto cobrar: os dois erros de preço",
    resumo: "O teto do preço da sua assinatura e os dois erros que derrubam um plano.",
    duracao: "5:44",
    youtubeId: "N2WZWuGYV0A",
    thumb: null,
  },
  {
    numero: 2,
    titulo: "Cobrar sem correr atrás de ninguém",
    resumo: "A mensalidade cobrada no cartão todo mês, e o cliente com pagamento atrasado sem conseguir agendar.",
    duracao: "5:03",
    youtubeId: "HwOGJsgmlwM",
    thumb: null,
  },
  {
    numero: 3,
    titulo: "Monte o seu plano",
    resumo: "O preço exato pela sua agenda, o que entra no plano e o plano cadastrado no BestBarbers.",
    duracao: "5:39",
    youtubeId: "",
    thumb: null,
  },
  {
    numero: 4,
    titulo: "Como pagar o barbeiro na assinatura",
    resumo: "A regra que paga cada barbeiro pelos serviços que ele fez, com a conta feita na tela.",
    duracao: "5:57",
    youtubeId: "",
    thumb: null,
  },
  {
    numero: 5,
    titulo: "A aula para a sua equipe",
    resumo: "Uma aula para passar na reunião com a equipe: como o barbeiro recebe e como vende na cadeira.",
    duracao: "5:22",
    youtubeId: "",
    thumb: null,
  },
  {
    numero: 6,
    titulo: "Lançar, migrar e acompanhar",
    resumo: "O lançamento em 4 passos, a passagem do Pix para o cartão e os números para olhar todo mês.",
    duracao: "5:40",
    youtubeId: "",
    thumb: null,
  },
];

/**
 * Vídeo de boas-vindas, no herói da vitrine. Não é aula: não tem ficha nem progresso. Vídeo NÃO
 * LISTADO no YouTube, com incorporação liberada (conferido em 09/Out/26, com as aulas 1 e 2).
 */
export const VIDEO_BOAS_VINDAS = { youtubeId: "x6MTIWRLQ4Q", duracao: "1:22" } as const;

// ─── Vitrine (03 §2) ────────────────────────────────────────────────────────────────────────

export const TEXTOS_VITRINE = {
  seo: {
    titulo: `${NOME_DO_CURSO}: como montar a assinatura da sua barbearia | BestBarbers`,
    descricao:
      "6 aulas curtas, a partir do que as barbearias clientes do BestBarbers já aplicam: quanto cobrar, como cobrar todo mês, como pagar o barbeiro e como lançar a assinatura na sua barbearia.",
  },
  navbar: {
    botao: "QUERO ASSISTIR ÀS AULAS",
    botaoCelular: "Assistir às aulas",
    // Texto novo: o "já sou aluno" do contrato (§4.5) leva à área, que pede o link se preciso.
    jaSouAluno: "Já sou aluno",
  },
  heroi: {
    titulo: "Como montar a assinatura da sua barbearia",
    destaque: "em 6 aulas curtas",
    frase:
      "O André Rangel, dono do BestBarbers, ensina quanto cobrar, como pagar o barbeiro e como lançar a assinatura, a partir do que as barbearias clientes do BestBarbers já aplicam no dia a dia.",
    /** A duração total sai da soma das constantes (`null` se faltar alguma). */
    destaqueDuracao: (minutosTotais: number | null) =>
      minutosTotais === null ? "6 aulas curtas" : `6 aulas curtas, cerca de ${minutosTotais} minutos no total`,
    destaques: [
      "Uma ficha embaixo de cada aula, para anotar os números da sua barbearia",
      "No fim, o seu plano de assinatura montado numa tela só",
    ],
    botao: "QUERO ASSISTIR ÀS AULAS",
    /** Texto novo (09/Out/26): o selo do vídeo de boas-vindas e o rótulo do botão de play. */
    video: "Boas-vindas ao curso",
  },
  aulas: {
    titulo: "As 6 aulas",
    destaque: "na ordem em que você monta a assinatura",
    rotuloAula: (n: number) => `Aula ${n}`,
    botao: "QUERO ASSISTIR ÀS AULAS",
  },
  leva: {
    titulo: "No fim do curso,",
    destaque: "o seu plano de assinatura está montado",
    frase: "Cada aula termina com uma ficha curta. As respostas da ficha montam o seu plano:",
    itens: [
      "O teto do preço, pelo preço do seu corte",
      "O preço de cada plano e o que entra em cada um",
      "A comissão da equipe e os pontos de cada serviço",
      "A data da reunião com a equipe",
      "A data do lançamento e o tamanho do primeiro lote",
    ],
  },
  formulario: {
    titulo: "Preencha o formulário",
    destaque: "e assista às 6 aulas agora",
    frase: "O acesso abre nesta tela, logo depois do cadastro. O link do curso também chega no seu e-mail.",
    campos: {
      nome: { rotulo: "Seu nome", exemplo: "Ex: João Silva" },
      whatsapp: { rotulo: "Seu WhatsApp", exemplo: "(11) 99999-9999" },
      email: {
        rotulo: EMAIL_OBRIGATORIO_NO_CURSO ? "Seu e-mail (o link do curso chega nele)" : "Seu e-mail (opcional, o link do curso chega nele)",
        exemplo: "Ex: joao@email.com",
      },
      barbearia: { rotulo: "Nome da sua barbearia", exemplo: "Ex: Barbearia do João" },
    },
    botao: "QUERO ASSISTIR ÀS AULAS",
    enviando: "Liberando o seu acesso…",
    erro: "Não foi possível enviar agora. Confira os dados e tente de novo.",
    // Texto do contrato (§2.3): a inscrição falhou depois do cadastro feito.
    falhaInscricao: "Seu cadastro foi feito. O seu acesso chega por e-mail em alguns minutos.",
  },
  // Texto novo (contrato §2.3): quem já tem o link guardado neste aparelho.
  continuar: {
    frase: "Você já começou o curso neste aparelho.",
    botao: "CONTINUAR DE ONDE PAREI",
  },
} as const;

// ─── Área do aluno (03 §3) ──────────────────────────────────────────────────────────────────

export const TEXTOS_AREA = {
  seo: { titulo: `${NOME_DO_CURSO} · Área do aluno` },
  // Texto novo: estados da tela que o 03 não cobre.
  carregando: "Abrindo o seu curso…",
  erroRede: {
    titulo: "O curso não abriu agora",
    texto: "Confira a internet e tente de novo.",
    botao: "TENTAR DE NOVO",
  },
  primeiraEntrada: {
    titulo: (primeiroNome: string) => (primeiroNome ? `Seu acesso está liberado, ${primeiroNome}.` : "Seu acesso está liberado."),
    texto: "Este link é só seu. Com ele, você volta para a aula em que parou.",
    // Ajuste do contrato (§15): o e-mail sai pelo cron, minutos depois. "Foi" virou "chega".
    textoEmail: (email: string) => `O link também chega no seu e-mail, ${email}.`,
    botao: "COMEÇAR PELA AULA 1",
  },
  topo: {
    assistidas: (n: number) => `Você assistiu ${n} de 6 aulas`,
    fichas: (m: number) => `Ficha: ${m} de 6 respondidas`,
    verPlano: "VER O MEU PLANO",
  },
  lista: {
    // Texto novo: título da lista de aulas.
    titulo: "As 6 aulas",
    item: (n: number) => `Aula ${n}`,
  },
  selos: {
    assistida: "Assistida",
    emAndamento: "Em andamento",
    fichaRespondida: "Ficha respondida",
  },
  aula: {
    // Texto novo: cabeçalho da aula aberta.
    cabecalho: (n: number) => `Aula ${n} de 6`,
    semVideo: (n: number) => `A aula ${n} entra aqui em breve.`,
    videoComErro: "O vídeo não carregou. Atualize a página para tentar de novo.",
  },
  botoes: {
    proxima: (tituloProxima: string) => `PRÓXIMA AULA: ${tituloProxima}`,
    verPlano: "VER O MEU PLANO MONTADO",
    sinal: "QUERO ASSINATURA NA MINHA BARBEARIA",
    sinalMigracao: "QUERO MIGRAR MEU CLUBE DE ASSINATURAS",
    // Texto novo: no lugar do botão de sinal, depois que a pessoa já pediu (03 §3.8, fecho com sinal).
    sinalFeito: "Um especialista do BestBarbers vai te chamar no WhatsApp.",
  },
  avisoFichaEmBranco: {
    texto: (n: number) => `A ficha da aula ${n} ficou em branco. A ficha monta o seu plano no fim do curso.`,
    responder: "RESPONDER A FICHA",
    seguir: (proxima: number) => `SEGUIR PARA A AULA ${proxima}`,
  },
  sinal: {
    janela: {
      titulo: "Em que data você quer começar?",
      texto:
        "Um especialista do BestBarbers vai te chamar no WhatsApp. O especialista monta o plano com os números da sua ficha e mostra tudo funcionando para a sua barbearia.",
      // Texto novo: rótulo do campo de data da janela.
      campo: "Data em que você quer começar",
      naoSei: "Ainda não sei a data",
      botao: "CONFIRMAR",
      // Texto novo: erros da janela.
      erroData: "Escolha uma data a partir de hoje ou marque “Ainda não sei a data”.",
      erroEnvio: "O pedido não foi enviado. Confira a internet e toque em confirmar de novo.",
    },
    confirmacao: {
      titulo: (primeiroNome: string) => (primeiroNome ? `Pronto, ${primeiroNome}.` : "Pronto."),
      whatsapp: (whatsapp: string) =>
        whatsapp ? `Um especialista do BestBarbers vai te chamar no WhatsApp ${whatsapp}.` : "Um especialista do BestBarbers vai te chamar no WhatsApp.",
      /** Sai quando a ficha está toda em branco. */
      ficha: "O especialista já recebe a sua ficha. A conversa começa pelos números da sua barbearia.",
      aulas: "As aulas continuam liberadas no seu link.",
      botao: "VOLTAR PARA AS AULAS",
    },
  },
  bonus: {
    titulo: "Bônus: lembretes e dúvidas no WhatsApp",
    texto: "Receba no WhatsApp o lembrete da próxima aula. E mande por lá as suas dúvidas sobre assinatura.",
    botao: "QUERO OS LEMBRETES NO WHATSAPP",
    /**
     * Mensagem pronta (a pessoa escreve primeiro). O código `(aluno <codigo>)` é acrescentado pelo
     * código (`linkBonusLucas`) — é o sufixo que o contrato fixa (§12) no lugar do `(cód. {dealId})`
     * do 03 v1. O Lucas reconhece pela frase "lembretes das aulas" e pelo sufixo. Não escreva o
     * código aqui.
     */
    mensagem: "Oi! Estou fazendo o curso Assinatura na Prática, do BestBarbers. Quero receber os lembretes das aulas por aqui.",
    depois: "Mande a mensagem que já está escrita no WhatsApp para ativar os lembretes.",
  },
  linkInvalido: {
    titulo: "Não conseguimos abrir o seu curso com este link",
    texto: "Digite o e-mail do seu cadastro. Um link novo chega no seu e-mail.",
    campo: { rotulo: "Seu e-mail", exemplo: "Ex: joao@email.com" },
    botao: "REENVIAR MEU LINK",
    // Texto novo: e-mail fora do formato.
    erroEmail: "Digite um e-mail válido.",
    depois: "Se este e-mail estiver no cadastro do curso, o link novo chega em alguns minutos. Confira também a caixa de spam.",
    whatsapp: {
      pergunta: "Prefere pelo WhatsApp?",
      botao: "PEDIR O LINK NO WHATSAPP",
      mensagem: "Oi! Quero receber de novo o link do curso Assinatura na Prática, do BestBarbers.",
    },
    rodape: { pergunta: "Ainda não tem cadastro?", botao: "FAZER MEU CADASTRO" },
  },
  plano: {
    titulo: "O seu plano de assinatura",
    destaque: "montado com os números da sua barbearia",
    frase: "Cada parte veio da ficha de uma aula. Para mudar uma resposta, volte à aula.",
    blocoEmBranco: (n: number) => `A ficha da aula ${n} está em branco.`,
    responder: (n: number) => `RESPONDER A FICHA DA AULA ${n}`,
    fechoSemSinal: {
      titulo: "Monte este plano no BestBarbers",
      texto: "Um especialista do BestBarbers confere o plano com você e mostra tudo funcionando para a sua barbearia.",
    },
    fechoComSinal: {
      texto: "Um especialista do BestBarbers vai te chamar no WhatsApp para conferir este plano com você.",
      data: (data: string) => `Data em que você quer começar: ${data}`,
    },
    rodape: "Este plano fica salvo no seu link. Volte quando quiser.",
    // Texto novo: o botão de voltar da tela do plano.
    voltar: "VOLTAR PARA AS AULAS",
  },
} as const;

// ─── Fichas (03 §3.4; campos e limites do contrato §5) ──────────────────────────────────────

export const TEXTOS_FICHA = {
  cabecalho: (n: number) => `Ficha da aula ${n}`,
  intro: "Anote os números da sua barbearia. As respostas montam o seu plano no fim do curso.",
  botao: "SALVAR A FICHA",
  // Texto novo: botão enquanto salva.
  salvando: "SALVANDO…",
  salvou: (n: number) => `Ficha da aula ${n} salva. Você pode mudar as respostas quando quiser.`,
  erro: "A ficha não foi salva. Confira a internet e toque em salvar de novo.",
  // Texto novo: campo fora do limite do contrato.
  campoInvalido: "Confira este campo.",
  // Texto novo: a sessão caiu (link revogado) no meio do uso.
  sessaoExpirada: "O seu link não vale mais. Peça um link novo para continuar.",
  aula1: {
    precoCorte: { rotulo: "Quanto custa o corte avulso na sua barbearia?", unidade: "R$", exemplo: "Ex.: 55" },
    diasRetorno: {
      rotulo: "De quantos em quantos dias o seu cliente mais fiel volta?",
      unidade: "dias",
      exemplo: "Ex.: 40",
      ajuda: "Se você tem sistema, olhe o relatório de frequência. Se não tem, olhe as datas de dez clientes fiéis na agenda.",
    },
    depoisTeto: (teto: string) =>
      `${teto} é o teto do seu plano de corte: duas vezes o preço do seu corte. O preço exato sai na aula 3.`,
    depoisAno: (visitas: number, valorNoAno: string) =>
      `No avulso, o seu cliente fiel vem cerca de ${visitas} vezes por ano e deixa ${valorNoAno} na barbearia.`,
  },
  aula2: {
    comoCobraHoje: {
      rotulo: "Como você cobra a assinatura hoje?",
      opcoes: [
        { valor: "nao_cobra", rotulo: "Ainda não tenho assinatura" },
        { valor: "pix", rotulo: "Cobro no Pix, todo mês" },
        { valor: "cartao_por_fora", rotulo: "Cobro no cartão, por fora do sistema" },
        { valor: "sistema", rotulo: "Cobro pelo sistema" },
      ],
    },
    atrasados: {
      rotulo: "Quantos assinantes estão com a mensalidade atrasada hoje?",
      exemplo: "Ex.: 3",
      naoSei: "Não sei",
    },
    depois: ["Pronto. A tabela de precificação está liberada.", "Você vai usar a tabela na aula 3 para achar o preço exato do seu plano."],
    botaoTabela: "ABRIR A TABELA DE PRECIFICAÇÃO",
    tabelaBloqueada: "Responda a ficha da aula 2 para liberar a tabela de precificação.",
    // Texto novo: o atalho da aula 3 para a ficha da aula 2.
    irParaFicha2: "RESPONDER A FICHA DA AULA 2",
  },
  /**
   * Tabela de precificação EMBUTIDA na área (recomendação técnica do contrato §5: o aluno que
   * preencher o formulário da página aberta geraria um card de recadastro). O cálculo é o mesmo
   * da `/tabela-precificacao-clube` (`calc.ts`), e os rótulos repetem os de lá, com "plano" no
   * lugar de "clube".
   */
  tabela: {
    titulo: "Tabela de precificação",
    corte: "Valor do seu corte avulso",
    agenda: "Como está a sua agenda hoje?",
    recomendada: "Mensalidade recomendada do plano de corte",
    faixa: (min: string, max: string, teto: string, corte: string) =>
      `Faixa saudável: ${min} a ${max} · teto: ${teto} (2 × ${corte})`,
    como:
      "Como calculamos: a mensalidade parte do teto de 2 cortes avulsos, com o lançamento um pouco abaixo do teto. A posição na faixa acompanha a sua agenda. É um ponto de partida: a decisão final do preço é sua.",
  },
  aula3: {
    agenda: {
      rotulo: "Como está a sua agenda hoje?",
      ajuda: "O relatório de ocupação mostra isso. Sem relatório, pense na última semana.",
      opcoes: [
        { valor: "sobra_horario", rotulo: "Sobra horário" },
        { valor: "movimentada", rotulo: "Movimentada" },
        { valor: "quase_lotada", rotulo: "Quase lotada" },
      ],
    },
    planos: {
      // Texto novo: título do grupo (o 03 só tem os rótulos dos campos).
      titulo: "Os seus planos (até 3)",
      ajuda: "Comece simples: um plano de corte, um de barba e um de corte e barba.",
      nome: { rotulo: "Nome do plano", exemplo: "Ex.: Plano corte" },
      preco: { rotulo: "Preço por mês", unidade: "R$", exemplo: "Ex.: 94,90" },
      oQueEntra: { rotulo: "O que entra no plano", exemplo: "Ex.: corte, máquina e pezinho" },
      adicionar: "+ ADICIONAR OUTRO PLANO",
      // Texto novo.
      remover: "Remover",
      maximo: 3,
    },
    lembreteTeto: (teto: string) => `Lembrete da aula 1: o plano de corte não passa de ${teto}.`,
  },
  aula4: {
    receitaAssinaturaMes: {
      rotulo: "Quanto você acha que vai entrar de assinatura por mês? (opcional)",
      unidade: "R$",
      exemplo: "Ex.: 12.000",
    },
    percentualPote: {
      rotulo: "Qual a comissão da equipe na assinatura?",
      unidade: "%",
      exemplo: "Ex.: 40",
      ajuda: "É a parte do que entra de assinatura que vira o pote da equipe.",
    },
    pesos: {
      rotulo: "Quantos pontos vale cada serviço?",
      ajuda: "Os pontos seguem o tempo que o serviço ocupa na agenda.",
      /** Linhas iniciais: o serviço vem escrito, os pontos ficam para a pessoa. */
      iniciais: [
        { servico: "Corte", exemplo: "Ex.: 40" },
        { servico: "Barba", exemplo: "Ex.: 20" },
        { servico: "Corte e barba", exemplo: "Ex.: 60" },
        { servico: "Pezinho", exemplo: "Ex.: 10" },
      ],
      // Texto novo: rótulos das colunas e do serviço acrescentado.
      servico: "Serviço",
      pontos: "Pontos",
      exemploServico: "Ex.: Sobrancelha",
      adicionar: "+ ADICIONAR SERVIÇO",
      remover: "Remover",
      maximo: 10,
    },
    depoisPote: (pote: string) => `O pote da sua equipe: ${pote} por mês, com os números que você anotou.`,
  },
  aula5: {
    dataReuniaoEquipe: {
      rotulo: "Em que data vai ser a reunião com a sua equipe?",
      ajuda: "Passe a aula 5 nessa reunião.",
    },
    comissaoDeVenda: {
      rotulo: "Você vai pagar comissão para o barbeiro que vender a assinatura?",
      opcoes: [
        { valor: "sim", rotulo: "Sim" },
        { valor: "nao", rotulo: "Não" },
        { valor: "nao_decidi", rotulo: "Ainda não decidi" },
      ],
      // Ajuste ao contrato (§5: `unidade` + `valor` no lugar do texto livre do 03). A pergunta do
      // 03 vai na escolha da unidade; o rótulo do valor e as opções são texto novo.
      comoVaiSer: "Como vai ser a comissão de venda?",
      unidades: [
        { valor: "reais_por_venda", rotulo: "Valor fixo por assinatura vendida" },
        { valor: "percentual", rotulo: "Percentual da assinatura" },
      ],
      valor: { rotulo: "Quanto?", exemplo: "Ex.: 20" },
    },
    equipe: {
      titulo: "Mande a aula 5 para a sua equipe",
      texto: "A sua equipe assiste só a aula 5. A sua ficha continua só com você.",
      botao: "MANDAR A AULA 5 NO WHATSAPP",
      mensagem: (link: string) => `Pessoal, assistam a esta aula antes da nossa reunião sobre a assinatura: ${link}`,
    },
  },
  aula6: {
    dataLancamento: {
      rotulo: "Em que data você quer lançar a assinatura para os seus clientes?",
      ajuda: "Lembrete da aula: de duas a quatro semanas de aviso antes de lançar.",
    },
    tamanhoPrimeiroLote: { rotulo: "Quantas vagas vai ter o primeiro lote?", exemplo: "Ex.: 50" },
    // Texto novo: o roteiro (§5) pede, o 03 não tem o rótulo.
    listaDeEspera: { rotulo: "Onde vai ficar a lista de espera?", exemplo: "Ex.: caderno do balcão" },
    caixaSinal: {
      titulo: "Monte a sua assinatura com o BestBarbers",
      texto:
        "Escolha a data em que você quer começar. Um especialista do BestBarbers monta o plano com os números da sua ficha e mostra tudo funcionando para a sua barbearia.",
      campo: "Em que data você quer começar com o BestBarbers?",
    },
  },
  // Texto novo: datas fora da janela do contrato (§5).
  erroDataFutura: "Escolha uma data a partir de hoje.",
  erroDataReuniao: "Escolha uma data entre o último mês e o próximo ano.",
} as const;

/** Rótulos que o plano montado usa para as respostas de escolha (texto novo, pendente). */
export const ROTULOS_DO_PLANO = {
  comoCobraHoje: {
    nao_cobra: "ainda não cobra assinatura",
    pix: "no Pix, todo mês",
    cartao_por_fora: "no cartão, por fora do sistema",
    sistema: "pelo sistema",
  },
  agenda: { sobra_horario: "sobra horário", movimentada: "movimentada", quase_lotada: "quase lotada" },
  blocos: {
    preco: "Preço (aula 1)",
    contaDoAno: "A conta do ano, com os seus números",
    cobranca: "Cobrança (aula 2)",
    planos: "Os seus planos (aula 3)",
    barbeiro: "Pagamento do barbeiro (aula 4)",
    equipe: "Equipe (aula 5)",
    lancamento: "Lançamento (aula 6)",
  },
  colunasPlanos: { plano: "Plano", preco: "Preço por mês", oQueEntra: "O que entra" },
} as const;
