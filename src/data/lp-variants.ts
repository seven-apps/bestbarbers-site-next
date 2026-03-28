// LP V6 — 5 variantes de conteudo por utm_content
// Copy exata do Wave 3 Copy Maximizer (131+ pecas validadas)

export interface LPMetric {
  value: string;
  label: string;
}

export interface PainCard {
  icon: "money" | "clock" | "lock";
  scene: string;
  stat: string;
  color: "red" | "blue" | "amber";
}

export interface Testimonial {
  quote: string;
  name: string;
  detail: string;
  badge: string;
}

export interface LPVariant {
  hero: {
    badge: string;
    headline: string;
    highlight: string;
    sub: string;
    trustLine: string;
  };
  proof: {
    metrics: LPMetric[];
  };
  pain: {
    cards: PainCard[];
    transition: string;
  };
  objections: { question: string; answer: string }[];
  socialProof: {
    videoUrl?: string;
    testimonials: Testimonial[];
  };
  ctaFinal: {
    headline: string;
    sub: string;
    cta: string;
  };
}

// ============================================================
// DEFAULT — B-2 Pattern (Pub2, Pirajussara, 4 cadeiras)
// Unico criativo com vendas: 2 won, 22.2% WR, QS 23
// ============================================================
const defaultVariant: LPVariant = {
  hero: {
    badge: "Caso real: Embu das Artes/SP \u00b7 4 cadeiras",
    headline: "De R$15.892 para R$31.690.",
    highlight: "Mesmas 4 cadeiras.",
    sub: "353 assinantes. R$0 implantacao. 3 ja pagam o sistema.",
    trustLine: "1.200+ barbearias \u00b7 R$5M+/mes \u00b7 5.0 App Store",
  },
  proof: {
    metrics: [
      { value: "R$31.690", label: "faturamento/mes" },
      { value: "353", label: "assinantes" },
      { value: "6M", label: "agendamentos/mes" },
      { value: "1.200+", label: "barbearias" },
    ],
  },
  pain: {
    cards: [
      {
        icon: "money",
        scene: "\u201cO movimento melhorava, mas nunca sobrava dinheiro.\u201d",
        stat: "-R$1,95 por corte. R$1.755/mes. Pagando pra trabalhar.",
        color: "red",
      },
      {
        icon: "clock",
        scene: "\u201cTem hor\u00e1rio?\u201d \u201c15h pode?\u201d \u201cN\u00e3o d\u00e1.\u201d \u201cDeixa pra l\u00e1.\u201d",
        stat: "2 horas por dia no WhatsApp. 30 clientes perdidos por mes.",
        color: "blue",
      },
      {
        icon: "lock",
        scene: "\u201cSe eu me machucar, ficar doente ou tirar f\u00e9rias, minha barbearia quebra.\u201d",
        stat: "Sua barbearia roda sem voce na cadeira?",
        color: "amber",
      },
    ],
    transition: "1.200+ donos pararam de pagar pra trabalhar. Com BestBarbers.",
  },
  objections: [
    {
      question: "Assinante vai vir todo dia e dar preju\u00edzo?",
      answer:
        "Media real de 51.000 assinantes ativos: 2,1 visitas por mes. Assinante paga R$128/mes. Avulso paga R$45. Quase 3x mais.",
    },
    {
      question: "N\u00e3o tenho investimento pra isso agora.",
      answer:
        "R$10 por dia. Menos que um almoco. Com apenas 3 assinantes no clube, o sistema ja se paga. Thais opera sozinha e se paga em meio dia.",
    },
    {
      question: "Funciona pra barbearia pequena?",
      answer:
        "Thais opera sozinha com 1 cadeira e fatura R$12K/mes. R$138K em 12 meses. Gestao organizada faz mais diferenca quando o time e enxuto.",
    },
    {
      question: "O que ta incluso nos R$299/mes?",
      answer:
        "Gestao financeira (R$500), clube de assinaturas (R$800), agenda online (R$600), NFS-e (R$300), dashboard multi-unidade (R$400) e gerente dedicado (R$1.000). Total percebido: R$3.600/mes. Voce paga R$299. 12x menos.",
    },
    {
      question: "J\u00e1 uso outro sistema. Por que trocar?",
      answer:
        "82 barbearias ja migraram. Tem app proprio com sua marca? Clube integrado com cobranca automatica? NFS-e automatica? Dashboard multi-unidade? Qual sistema tem tudo junto? Migracao completa inclusa.",
    },
  ],
  socialProof: {
    testimonials: [
      {
        quote: "Era R$15 mil. Montei o clube. Dobrei em 4 meses. Mesma equipe, mesmo ponto.",
        name: "Barbearia Pirajussara",
        detail: "Embu das Artes/SP \u00b7 4 cadeiras \u00b7 353 assinantes",
        badge: "R$15K\u2192R$31K/mes",
      },
      {
        quote: "De 1 pra 3 unidades. R$100K por mes. Tudo pelo app e dashboard.",
        name: "Mileno Rocha",
        detail: "@omilenorocha \u00b7 3 unidades \u00b7 521 assinantes",
        badge: "R$918K acumulados",
      },
      {
        quote: "Uma cadeira. Sozinha. R$12K por mes. Sem WhatsApp, sem papel.",
        name: "Thais D\u2019Antunes",
        detail: "@thaisdantbarber \u00b7 Solo \u00b7 1 cadeira",
        badge: "R$12.589/mes",
      },
    ],
  },
  ctaFinal: {
    headline: "A cada dia sem clube, R$195 perdidos.",
    sub: "Sem taxa. Sem fidelidade. Gerente dedicado. Cancela quando quiser.",
    cta: "VER MEU DIAGNOSTICO GRATUITO",
  },
};

// ============================================================
// MILENO — SCALER (Pub2+Pub3, 3 unidades, R$101K/mes)
// ============================================================
const milenoVariant: LPVariant = {
  hero: {
    badge: "@omilenorocha \u00b7 3 unidades \u00b7 521 assinantes",
    headline: "De 1 para 3 barbearias.",
    highlight: "R$100 mil por mes.",
    sub: "521 assinantes em 3 unidades. R$0 implantacao.",
    trustLine: "1.200+ barbearias \u00b7 R$5M+/mes \u00b7 5.0 App Store",
  },
  proof: {
    metrics: [
      { value: "R$101K", label: "faturamento/mes" },
      { value: "521", label: "assinantes" },
      { value: "R$918K", label: "acumulado 22m" },
      { value: "23K", label: "agendamentos" },
    ],
  },
  pain: {
    cards: [
      {
        icon: "money",
        scene: "\u201cO movimento melhorava, mas nunca sobrava dinheiro.\u201d",
        stat: "-R$1,95 por corte. R$1.755/mes.",
        color: "red",
      },
      {
        icon: "clock",
        scene: "\u201cTem hor\u00e1rio?\u201d \u201cN\u00e3o d\u00e1.\u201d \u201cDeixa pra l\u00e1.\u201d 30 vezes por dia.",
        stat: "3 clientes perdidos por dia.",
        color: "blue",
      },
      {
        icon: "lock",
        scene: "\u201cSe eu me machucar, a barbearia quebra.\u201d 3 anos sem f\u00e9rias.",
        stat: "Imagina abrir o celular e ver R$48K ja na conta.",
        color: "amber",
      },
    ],
    transition: "Mileno comecou com 1 cadeira em Osasco. Hoje: 3 unidades com BestBarbers.",
  },
  objections: [
    {
      question: "Ja tenho sistema.",
      answer: "Mileno faturou R$918K depois de migrar. Nao voltaria por nada.",
    },
    {
      question: "E caro.",
      answer: "R$10 por dia. Se paga com 3 assinantes. Ele tem 521.",
    },
    {
      question: "Nao funciona pra multi-unidade.",
      answer: "3 unidades. 3 cidades. Tudo no celular.",
    },
    {
      question: "O que ta incluso nos R$299/mes?",
      answer:
        "Gestao financeira, clube de assinaturas, agenda online, NFS-e, dashboard multi-unidade e gerente dedicado. Total percebido: R$3.600/mes. Voce paga R$299. 12x menos.",
    },
    {
      question: "Funciona pra barbearia pequena?",
      answer: "Mileno comecou com 1 cadeira em Osasco. Hoje: R$101K/mes em 3 unidades.",
    },
  ],
  socialProof: {
    testimonials: [
      {
        quote: "O que mudou nao fui eu. Foi o sistema.",
        name: "Mileno Rocha",
        detail: "@omilenorocha \u00b7 3 unidades \u00b7 521 assinantes",
        badge: "R$918K acumulados",
      },
      {
        quote: "Era R$15 mil. Montei o clube. Dobrei em 4 meses.",
        name: "Barbearia Pirajussara",
        detail: "Embu das Artes/SP \u00b7 4 cadeiras",
        badge: "R$15K\u2192R$31K/mes",
      },
      {
        quote: "Uma cadeira. Sozinha. R$12K por mes.",
        name: "Thais D\u2019Antunes",
        detail: "@thaisdantbarber \u00b7 Solo",
        badge: "R$12.589/mes",
      },
    ],
  },
  ctaFinal: {
    headline: "A cada dia sem clube, R$195 perdidos.",
    sub: "Sem taxa. Sem fidelidade. Gerente dedicado. Cancela quando quiser.",
    cta: "Quero ver o potencial da MINHA barbearia",
  },
};

// ============================================================
// JOAO — CLOSER (Pub2, BH, 32 meses, ROI 127x)
// ============================================================
const joaoVariant: LPVariant = {
  hero: {
    badge: "@joaoseletto \u00b7 BH \u00b7 32 meses \u00b7 Top 4",
    headline: "R$1.222.716 em 32 meses.",
    highlight: "Uma barbearia em BH.",
    sub: "Top 4 entre 1.200+. Abrindo segunda.",
    trustLine: "1.200+ barbearias \u00b7 R$5M+/mes \u00b7 5.0 App Store",
  },
  proof: {
    metrics: [
      { value: "R$1.222K", label: "acumulado" },
      { value: "475", label: "assinantes" },
      { value: "R$2.911", label: "por dia" },
      { value: "32", label: "meses" },
    ],
  },
  pain: {
    cards: [
      {
        icon: "money",
        scene: "\u201cEu tomava decisao no achismo.\u201d",
        stat: "Sem saber quanto ganha, nao sabe se perde.",
        color: "red",
      },
      {
        icon: "clock",
        scene: "\u201cComecava do zero todo mes.\u201d",
        stat: "Montanha-russa: produz, produz, comeca do zero.",
        color: "blue",
      },
      {
        icon: "lock",
        scene: "\u201cQuanto voce ganhou esse mes?\u201d Silencio.",
        stat: "Deus no ceu, dados na terra.",
        color: "amber",
      },
    ],
    transition: "Joao parou de decidir no achismo. 32 meses, R$1.222.716 com BestBarbers.",
  },
  objections: [
    {
      question: "32 meses preso num sistema?",
      answer: "ESCOLHENDO ficar. Se nao funcionasse, teria trocado no terceiro mes.",
    },
    {
      question: "Sou menor que ele.",
      answer: "Comecou com 0 assinantes. Cresceu de dentro. Hoje abrindo segunda unidade.",
    },
    {
      question: "Medo de mexer no que ta funcionando.",
      answer: "Funciona quanto? R$2.911 por DIA. Se nao sabe quanto ganha, nao funciona.",
    },
    {
      question: "O que ta incluso nos R$299/mes?",
      answer:
        "Gestao financeira, clube de assinaturas, agenda online, NFS-e, dashboard multi-unidade e gerente dedicado. Total percebido: R$3.600/mes. Voce paga R$299. 12x menos.",
    },
    {
      question: "Ja uso outro sistema.",
      answer: "Joao usava outro. 32 meses depois: R$1.222.716. ROI 127x.",
    },
  ],
  socialProof: {
    testimonials: [
      {
        quote: "Se nao funcionasse, teria trocado no terceiro.",
        name: "Joao Seletto",
        detail: "@joaoseletto \u00b7 BH \u00b7 32 meses",
        badge: "ROI 127x",
      },
      {
        quote: "De 1 pra 3 unidades. R$100K por mes.",
        name: "Mileno Rocha",
        detail: "@omilenorocha \u00b7 3 unidades",
        badge: "R$918K acumulados",
      },
      {
        quote: "Era R$15 mil. Dobrei em 4 meses.",
        name: "Barbearia Pirajussara",
        detail: "Embu das Artes/SP \u00b7 4 cadeiras",
        badge: "R$15K\u2192R$31K/mes",
      },
    ],
  },
  ctaFinal: {
    headline: "Quanto voce perdeu nos ultimos 32 meses sem saber?",
    sub: "Sem taxa. Sem fidelidade. Gerente dedicado. Cancela quando quiser.",
    cta: "Quero parar de decidir no achismo",
  },
};

// ============================================================
// KAIQUE — SPECIALIST (Pub2, assinatura, Top 5, 469 subs)
// ============================================================
const kaiqueVariant: LPVariant = {
  hero: {
    badge: "@o_kaique_alves \u00b7 RJ \u00b7 Top 5 \u00b7 469 assinantes",
    headline: "469 assinantes. Uma barbearia.",
    highlight: "Top 5 do Brasil.",
    sub: "57% do faturamento no automatico. Abrindo a segunda.",
    trustLine: "1.200+ barbearias \u00b7 R$5M+/mes \u00b7 5.0 App Store",
  },
  proof: {
    metrics: [
      { value: "469", label: "assinantes" },
      { value: "57%", label: "recorrente" },
      { value: "R$592K", label: "acumulado" },
      { value: "R$5K+", label: "por barbeiro" },
    ],
  },
  pain: {
    cards: [
      {
        icon: "money",
        scene: "\u201cAssinatura e desconto.\u201d R$360/ano avulso vs R$900 assinante.",
        stat: "2,5x mais. Quem ta dando desconto?",
        color: "red",
      },
      {
        icon: "clock",
        scene: "\u201cBarbeiro ganha menos com assinatura.\u201d",
        stat: "R$2.600 \u2192 R$5.000+. 83% mais.",
        color: "blue",
      },
      {
        icon: "lock",
        scene: "\u201cComecava do zero todo mes. Rezava pro movimento.\u201d",
        stat: "Faz chuva ou sol, o dinheiro cai.",
        color: "amber",
      },
    ],
    transition: "Kaique montou o clube. 469 assinantes. Top 5. Com BestBarbers.",
  },
  objections: [
    {
      question: "Assinatura e desconto.",
      answer: "R$360/ano avulso. R$900/ano assinante. 2,5x MAIS. Quem ta dando desconto?",
    },
    {
      question: "Cliente vai usar demais.",
      answer: "Media real: 2,1 visitas por mes. NAO 30. Ilimitado e psicologico, nao pratico.",
    },
    {
      question: "Nao consigo gerenciar isso na mao.",
      answer: "Cobranca automatica. Bloqueio por inadimplencia. Comissao calculada. Tudo no sistema.",
    },
    {
      question: "O que ta incluso nos R$299/mes?",
      answer:
        "Gestao financeira, clube de assinaturas, agenda online, NFS-e, dashboard multi-unidade e gerente dedicado. Total percebido: R$3.600/mes. Voce paga R$299. 12x menos.",
    },
    {
      question: "E caro.",
      answer: "R$10 por dia. 3 assinantes pagam. Os outros 466? Lucro. Barbeiro ganhou 83% mais.",
    },
  ],
  socialProof: {
    testimonials: [
      {
        quote: "Faz chuva ou sol, o dinheiro cai.",
        name: "Kaique (Bagulho)",
        detail: "@o_kaique_alves \u00b7 RJ \u00b7 469 assinantes",
        badge: "Top 5 Brasil",
      },
      {
        quote: "De 1 pra 3 unidades. R$100K por mes.",
        name: "Mileno Rocha",
        detail: "@omilenorocha \u00b7 3 unidades",
        badge: "R$918K acumulados",
      },
      {
        quote: "Uma cadeira. Sozinha. R$12K por mes.",
        name: "Thais D\u2019Antunes",
        detail: "@thaisdantbarber \u00b7 Solo",
        badge: "R$12.589/mes",
      },
    ],
  },
  ctaFinal: {
    headline: "A cada dia sem clube, R$195 perdidos.",
    sub: "Sem taxa. Sem fidelidade. Gerente dedicado. Cancela quando quiser.",
    cta: "Quero montar meu clube de assinaturas",
  },
};

// ============================================================
// THAIS — OPENER (Pub1, solo, tom confessional)
// Registro emocional unico: vulnerabilidade → forca
// ============================================================
const thaisVariant: LPVariant = {
  hero: {
    badge: "@thaisdantbarber \u00b7 Solo \u00b7 1 cadeira",
    headline: "Uma cadeira. R$12 mil por mes.",
    highlight: "Sozinha.",
    sub: "\u201cAchava que era pra grande. Tinha vergonha de ter uma cadeira s\u00f3.\u201d",
    trustLine: "14% das barbearias tem 1 cadeira. Nenhuma tinha case. At\u00e9 agora.",
  },
  proof: {
    metrics: [
      { value: "R$12.589", label: "faturamento/mes" },
      { value: "255", label: "clientes" },
      { value: "1.628", label: "agendamentos" },
      { value: "5.0 \u2605", label: "nota" },
    ],
  },
  pain: {
    cards: [
      {
        icon: "clock",
        scene:
          "Cortando. WhatsApp toca. Para. Tira luva. Responde. Volta. 10 min depois: outra. Cliente espera. O do WhatsApp desiste.",
        stat: "20 min WhatsApp \u00d7 15 clientes = 5 horas/dia.",
        color: "blue",
      },
      {
        icon: "money",
        scene: "Fim do mes. Caderno. Soma. Soma de novo. D\u00e1 diferente. Banco n\u00e3o bate.",
        stat: "Sem saber se esta lucrando ou pagando pra trabalhar.",
        color: "red",
      },
      {
        icon: "lock",
        scene: "\u201cPequena n\u00e3o precisa de sistema.\u201d",
        stat: "R$138K em 12 meses. 1 cadeira. Sozinha. Sem desculpa.",
        color: "amber",
      },
    ],
    transition: "Thais provou: tamanho nao importa. O que importa e gestao. Com BestBarbers.",
  },
  objections: [
    {
      question: "Sou pequena demais.",
      answer:
        "1 cadeira. R$138K em 12 meses. Se paga em MEIO DIA. Toda barbearia de 10 cadeiras comecou com 1.",
    },
    {
      question: "Nao sei tecnologia.",
      answer: "Mais facil que WhatsApp. Gerente configura COM voce. 20 minutos.",
    },
    {
      question: "R$299 e muito pra quem trabalha sozinha.",
      answer: "R$10 por dia. 1,7% do faturamento dela. 3 clientes novos cobrem o ANO.",
    },
    {
      question: "O que ta incluso nos R$299/mes?",
      answer:
        "Gestao financeira, clube de assinaturas, agenda online, NFS-e, dashboard e gerente dedicado. Total percebido: R$3.600/mes. Voce paga R$299. 12x menos.",
    },
    {
      question: "Ja uso outro sistema.",
      answer:
        "Tem app proprio com sua marca? Agenda integrada com cobranca? Gerente dedicado? Thais trocou e fatura R$12K/mes.",
    },
  ],
  socialProof: {
    testimonials: [
      {
        quote: "Achava que era pra grande. Tava errada. Era pra quem leva a serio.",
        name: "Thais D\u2019Antunes",
        detail: "@thaisdantbarber \u00b7 Solo \u00b7 1 cadeira",
        badge: "R$138K em 12m",
      },
      {
        quote: "Era R$15 mil. Montei o clube. Dobrei em 4 meses.",
        name: "Barbearia Pirajussara",
        detail: "Embu das Artes/SP \u00b7 4 cadeiras",
        badge: "R$15K\u2192R$31K/mes",
      },
      {
        quote: "De 1 pra 3 unidades. R$100K por mes.",
        name: "Mileno Rocha",
        detail: "@omilenorocha \u00b7 3 unidades",
        badge: "R$918K acumulados",
      },
    ],
  },
  ctaFinal: {
    headline: "Se paga em meio dia. Os outros 29 sao seus.",
    sub: "Sem taxa. Sem fidelidade. Gerente configura em 20 min. Cancela quando quiser.",
    cta: "Quero me organizar. Hoje.",
  },
};

// ============================================================
// VARIANT SELECTOR
// ============================================================
const variants: Record<string, LPVariant> = {
  default: defaultVariant,
  mileno: milenoVariant,
  joao: joaoVariant,
  kaique: kaiqueVariant,
  thais: thaisVariant,
};

export function getVariant(utmContent: string | null): LPVariant {
  if (!utmContent) return defaultVariant;
  const content = utmContent.toLowerCase();

  if (content.includes("mileno")) return milenoVariant;
  if (content.includes("joao") || content.includes("seletto")) return joaoVariant;
  if (content.includes("kaique") || content.includes("bagulho")) return kaiqueVariant;
  if (content.includes("thais")) return thaisVariant;

  // Wave 2 triggers → default (B-2 formula works for all ad angles)
  return defaultVariant;
}

export { variants };
