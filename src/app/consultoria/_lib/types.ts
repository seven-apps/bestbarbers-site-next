// Fonte: src/app/consultoria/_data/consultoria-v1.json (protótipo aprovado pelo André em 04/Nov/26).
export type Tela = "objetivo" | "trava" | "quem" | "assinatura" | "prazo" | "contato" | "pronto";

export interface Respostas {
  objetivo?: string;
  trava?: string;
  quem?: string;
  porte?: string;
  assinatura?: string;
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

export interface ConteudoConsultoria {
  telas: {
    objetivo: { rotulo: string; pergunta: string; texto: string; ver_exemplo: string };
    exemplo: { rotulo: string; mensagens: string[]; rodape: string };
    quem: { pergunta: string; porte: string };
    assinatura: { pergunta: string };
    prazo: { pergunta: string };
    contato: {
      rotulo: string; pergunta: string; nome: string; nome_placeholder: string;
      whatsapp: string; whatsapp_placeholder: string; botao: string; rodape: string;
    };
    pronto: { titulo: string; botao: string; rodape: string };
  };
  mensagem_whatsapp: string;
  objetivos: Objetivo[];
  travas: Record<string, { pergunta: string; opcoes: OpcaoTrava[] }>;
  quem: Opcao[];
  porte: Opcao[];
  assinatura: (Opcao & { resumo: string })[];
  prazo: Opcao[];
}
