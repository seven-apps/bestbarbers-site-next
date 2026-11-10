// Fonte: src/app/consultoria/_data/consultoria-v2.json (ficha aprovada em 04/Nov/26 + faturamento e meta, S21 de 07/Nov/26).
export type Tela = "objetivo" | "trava" | "quem" | "assinatura" | "faturamento" | "meta" | "prazo" | "contato" | "pronto";

export interface Respostas {
  objetivo?: string;
  trava?: string;
  /** O que o dono escreveu em "Outra coisa" (opcional). */
  outra?: string;
  quem?: string;
  porte?: string;
  assinatura?: string;
  /** Faixa do faturamento de hoje (`faixas_hoje`). */
  faturamento?: string;
  /** Faixa da meta, daqui a 1 ano (`faixas_meta`). */
  meta?: string;
  prazo?: string;
}

export interface Opcao {
  id: string;
  texto: string;
}

export interface OpcaoTrava extends Opcao {
  /** A trava já diz a resposta da assinatura (ex.: "cobrar cada assinante na mão" → "mao"). */
  assinatura_implicita?: string;
}

export interface Objetivo extends Opcao {
  icone: string;
}

export interface Faixa extends Opcao {
  min: number;
  /** `null` = faixa aberta ("Mais de R$ 60 mil"): sem meio, a distância não sai. */
  max: number | null;
}

export interface Horario extends Opcao {
  /** Como a escolha entra na frase e na anotação do card ("amanhã de manhã"). */
  quando: string;
}

/** A ação da 1ª tela: o que fazer (objeto concreto), como e o que ela traz. */
export interface Acao {
  titulo: string;
  como: string;
  traz: string;
}

/** O plano curto das travas sem caso completo: 1 ação no mesmo visual (S46, 08/Nov/26). */
export interface PlanoDaTrava {
  titulo: string;
  passo1: string;
  acao: Acao;
  /** A mensagem (ou a folha) pronta para copiar: o que o anúncio promete ("com a mensagem pronta"). */
  pronto: { rotulo: string; texto: string };
  /** O caso de campo que sustenta o número da ação, quando ela cita um. */
  prova?: { rotulo: string; texto: string };
}

/**
 * Texto que pode valer só em alguns meses (1 a 12, hora de Brasília), como "em dezembro a barbearia enche sozinha".
 * Os textos aceitam {mes-1}, {mes}, {mes+1} e {mes+2} (e {Mes…}, com maiúscula), trocados pelo nome do mês.
 */
export type Texto = string | { texto: string; meses: number[] };

export interface AcaoV5 extends Acao {
  /** O id do bloco que detalha a ação (a âncora do cartão). */
  id: string;
}

export interface BlocoV5 {
  id: string;
  rotulo: string;
  titulo: string;
  textos?: Texto[];
  passos?: string[];
  feito?: string[];
  /** O material pronto para copiar; `equipe` é o aviso para mandar no WhatsApp da equipe, com {texto}. */
  pronto?: { rotulo: string; texto: string; equipe?: string };
  no_bestbarbers?: string;
  sem_sistema?: string;
  prova?: { rotulo: string; texto: string };
  medir?: { rotulo: string; meta?: string; textos: string[] };
  depois?: Texto[];
}

/** O plano completo de um caso (trava × quem), no molde aprovado em 08/Nov/26 ("s45 OK, ficou bem melhor"). */
export interface PlanoV5 {
  subtitulo: string;
  acoes: AcaoV5[];
  gancho: string;
  divisor: string;
  blocos: BlocoV5[];
  ligacao: BlocoV5 & { chamada: string };
  fontes: { rotulo: string; texto: string };
  /**
   * Ação que só vale em alguns meses (o reajuste do preço: outubro a janeiro). Fora deles, a ação e o bloco
   * dela saem, e cada trecho de `trocas` é trocado em todo o caso (o subtítulo, a meta, "as 3 coisas").
   */
  epoca?: { acao: string; meses: number[]; trocas: { de: string; para: string }[] };
}

export interface ConteudoConsultoria {
  telas: {
    objetivo: { rotulo: string; pergunta: string; texto: string };
    quem: { pergunta: string; porte: string };
    assinatura: { pergunta: string };
    faturamento: { pergunta: string; linha: string };
    meta: { pergunta: string; linha: string; pergunta_abrir: string };
    outra: { rotulo: string; placeholder: string; botao: string };
    prazo: { pergunta: string };
    contato: {
      rotulo: string; pergunta: string; nome: string; nome_placeholder: string;
      whatsapp: string; whatsapp_placeholder: string; botao: string; rodape: string;
      enviando: string; erro: string;
    };
    /** A tela de contato do braço cedo (A/B de 10/Nov/26, ./ab.ts): vem antes das últimas perguntas, não antes do plano. */
    contato_cedo: {
      rotulo: string; pergunta: string; nome: string; nome_placeholder: string;
      whatsapp: string; whatsapp_placeholder: string; botao: string; rodape: string;
      enviando: string; erro: string;
    };
    pronto: {
      titulo: string; titulo_sem_nome: string; uma: string; varias: string;
      gancho: string; divisor: string; divisor_uma: string; rotulo_uma: string;
      no_bestbarbers: string; sem_sistema: string; copiar: string; copiado: string; mandar_equipe: string;
      horario_rotulo: string; horario_titulo: string; horario_texto: string; horario_ok: string; horario_ok_mensagem: string;
      horario_erro: string; sem_cadastro: string; refazer: string;
    };
  };
  objetivos: Objetivo[];
  travas: Record<string, { pergunta: string; opcoes: OpcaoTrava[] }>;
  quem: Opcao[];
  porte: Opcao[];
  assinatura: (Opcao & { resumo: string })[];
  faixas_hoje: Faixa[];
  faixas_meta: Faixa[];
  prazo: Opcao[];
  horarios: Horario[];
  planos: {
    por_trava: Record<string, PlanoDaTrava>;
    /** Chave "<trava>:<quem>" (ex.: "p19:equipe"). */
    v5: Record<string, PlanoV5>;
  };
}
