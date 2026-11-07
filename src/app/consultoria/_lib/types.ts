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

export interface PlanoDaTrava {
  titulo: string;
  passo1: string;
  alavanca?: "assinatura" | "caderno";
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
    pronto: {
      rotulo: string; titulo: string; distancia_titulo: string; distancia_meio: string; passo_titulo: string;
      horario_titulo: string; horario_texto: string; horario_ok: string; horario_ok_mensagem: string;
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
    alavancas: Record<"assinatura" | "caderno", string>;
    por_trava: Record<string, PlanoDaTrava>;
  };
}
