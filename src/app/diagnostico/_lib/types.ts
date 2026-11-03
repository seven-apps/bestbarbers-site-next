// Fonte: bestbarbers-ai/docs/operacional/marketing-vendas-nov26/estrategia-canais/diagnostico-v1/02-dados.json.
export type Answers = Record<string, number | null>;
export type DraftAnswers = Record<string, string | null>;

export interface Question {
  var: string;
  texto: string;
  tipo: string;
  rotulo: string;
  min?: number;
  max?: number;
  max_var?: string;
  aceita_nao_sei?: boolean;
  ajuda?: string;
  opcoes?: { texto: string; valor: number | string | null }[];
}

export interface Problem {
  id: string;
  mapa: string;
  tema: string;
  opcao: string;
  perguntas: Question[];
  calculos: { var: string; expr: string; formato: string; rotulo: string }[];
  plano: {
    titulo: string;
    passos: { texto: string; se_nao_sabe?: { var: string; texto: string } }[];
  };
  bestbarbers: { texto: string };
  prova: { texto: string } | null;
  material: { texto: string; link: string } | null;
}

export interface Screens {
  abertura: { titulo: string; texto: string; botao: string };
  momento: { pergunta: string; opcoes: { id: string; texto: string; momento: string }[] };
  tema: { pergunta: string; opcoes: { id: string; texto: string; descricao: string; pergunta: string; problemas: string[] }[] };
  problema: { outra_coisa: { opcao: string; campo: string; placeholder: string; obrigatorio: boolean } };
  numeros: { titulo: string; texto: string; botao: string };
  contato: { titulo: string; texto: string; botao: string; campos: { var: string; rotulo: string; obrigatorio: boolean }[] };
  plano: { estrutura: string[]; rotulos: { cabecalho: string; os_seus_numeros: string; passos: string; onde_o_bestbarbers_entra: string; prova: string }; retorno: string };
  fim_outra_coisa: { titulo: string; texto: string };
}

export interface DiagnosticContent {
  screens: Screens;
  problems: Problem[];
}
