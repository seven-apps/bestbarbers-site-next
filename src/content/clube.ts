/**
 * Conteúdo textual da página /clube — destino de tráfego pago de clube de assinaturas
 * Mesmo padrão do home.ts: todos os textos, links e configurações centralizados.
 * Fonte da copy: docs/operacional/pagina-clube-site.md (bestbarbers-ai)
 * Números de case: knowledge/dominio/cases-clube.json (literais do JSON vivo)
 */

import { homeContent } from "@/content/home";

export const clubeContent = {
  // ===== NAVBAR =====
  navbar: {
    logo: homeContent.navbar.logo,
    buttons: {
      primary: {
        text: "QUERO O CLUBE NA MINHA BARBEARIA",
        textMobile: "Quero o clube",
      },
      secondary: {
        text: "JÁ SOU CLIENTE",
        href: "https://adm.bestbarbers.app/login",
      },
    },
  },

  // ===== HERO =====
  hero: {
    title: {
      main: "Clube de Assinaturas",
      highlight: " no\u00A0App",
      subtitle: "com a cara da sua Barbearia",
    },
    description:
      "O mês começa com receita na conta — não com a agenda em branco. Seu cliente assina o plano pelo app da sua própria barbearia e a mensalidade cai todo mês, no automático.",
    cta: {
      text: "QUERO O CLUBE\nNA MINHA BARBEARIA",
    },
    image: {
      src: "/images/hero-best-5-influencers.png",
      alt: "Clube de assinaturas no app próprio da barbearia — BestBarbers na App Store e Play Store",
      width: 1712,
      height: 450,
    },
  },

  // ===== FORK: CRIAR × MIGRAR =====
  fork: {
    title: {
      main: "Vai criar o clube — ",
      highlight: "ou trazer um que já existe?",
    },
    criar: {
      kicker: "PARA QUEM VAI COMEÇAR",
      title: "Criar o clube do zero",
      description:
        "Você define os planos — créditos ou dias de uso —, os preços e os serviços, e o clube nasce dentro do seu app. O caminho que 1.200+ barbearias já percorreram.",
      itens: [
        "Planos por créditos ou dias de uso — você define",
        "Preços e serviços do seu jeito",
        "Seu cliente assina direto pelo app com a sua marca",
      ],
      cta: "QUERO CRIAR MEU CLUBE",
    },
    migrar: {
      kicker: "PARA QUEM JÁ TEM CLUBE",
      title: "Trazer o clube que já roda",
      description:
        "Você provou que assinatura funciona, no PIX e na planilha. Agora ela ganha sistema:",
      pares: [
        { antes: "Cobrar um a um", depois: "Cobrança automática" },
        {
          antes: "Descobrir inadimplente no fechamento",
          depois: "Status monitorado no dia",
        },
        {
          antes: "Preço parado há um ano",
          depois: "Planos ajustáveis no painel",
        },
        {
          antes: "Clube do tamanho da sua mão",
          depois: "Operação que cresce",
        },
      ],
      cta: "COMO FUNCIONA A MIGRAÇÃO DO MEU CLUBE?",
    },
  },

  // ===== ASSINATURAS =====
  subscriptions: {
    title: {
      main: "“Quem não pagou este mês?”",
      highlight: "Você nunca mais faz essa pergunta",
    },
    features: [
      {
        title: "Cobrança recorrente automática:",
        description:
          "a mensalidade cai todo mês na sua conta, sem PIX pedido um a um",
      },
      {
        title: "Status de pagamento monitorado automaticamente:",
        description:
          "quem pagou e quem não pagou, tudo por conta do sistema",
      },
      {
        title: "Planos por créditos ou dias de uso:",
        description:
          "assinatura, pagamentos e troca de plano direto pelo app da sua barbearia",
      },
    ],
    cta: {
      text: "QUERO O CLUBE NA MINHA BARBEARIA",
    },
    image: {
      src: "/images/gerenciamento-de-assinaturas.png",
      alt: "Clube de assinaturas para barbearia — gestão automática BestBarbers",
      width: 1500,
      height: 1200,
    },
  },

  // ===== NOTAS FISCAIS =====
  invoices: {
    title: {
      main: "Assinatura cobrada,\n",
      highlight: "nota emitida",
    },
    features: [
      {
        title: "Nenhuma nota digitada à mão:",
        description:
          "90 assinantes são 90 cobranças por mês — e a NFS-e sai automaticamente a cada pagamento de assinatura ou atendimento",
      },
      {
        title: "Integração com a prefeitura:",
        description:
          "configuração única dos dados fiscais, com emissão integrada à prefeitura da sua cidade",
      },
      {
        title: "Tudo pronto para o contador:",
        description:
          "exportação em PDF e XML, com histórico completo organizado automaticamente",
      },
    ],
    cta: {
      text: "QUERO O CLUBE NA MINHA BARBEARIA",
    },
    image: {
      src: "/images/Nota-fiscal_1.webp",
      alt: "Emissão automática de nota fiscal NFS-e a cada cobrança de assinatura",
      width: 735,
      height: 500,
    },
  },

  // ===== FUNCIONALIDADES =====
  features: {
    badge: "Funcionalidades",
    title: "O clube na frente, o sistema completo atrás",
    subtitle:
      "Assinaturas, agenda, financeiro e nota fiscal no mesmo sistema — tudo que a operação da sua barbearia precisa em um só lugar.",
    items: homeContent.features.items,
    cta: {
      text: "QUERO O CLUBE NA MINHA BARBEARIA",
    },
  },

  // ===== TOTEM =====
  totem: {
    title: {
      main: "Adquira também:",
      highlight: "o Totem que recebe o seu assinante",
    },
    features: [
      "Seu assinante faz o check-in e o barbeiro recebe uma notificação de que ele chegou",
      "Você pode adicionar produtos e serviços na comanda e o cliente efetua o pagamento após o atendimento",
      "Após o pagamento, ele já deixa o próximo agendamento marcado, tudo de forma autônoma",
    ],
    cta: {
      text: "QUERO O CLUBE NA MINHA BARBEARIA\n+ TOTEM DE AUTOATENDIMENTO",
    },
    image: {
      src: "/images/Totem_Seletto.png",
      alt: "Totem de autoatendimento para barbearia — check-in e pagamento do assinante",
      width: 1457,
      height: 600,
    },
  },

  // ===== NOTIFICAÇÕES =====
  notifications: {
    title: {
      main: "Quem lembra o assinante",
      highlight: "\né o app da sua marca",
    },
    features: [
      {
        title: "Lembretes anti-falta:",
        description:
          "“marcou e não veio” tem conserto de sistema, não de paciência — notificação de agendamento configurável antes do horário",
      },
      {
        title: "Reativação:",
        description:
          "quem some da cadeira, o sistema chama de volta com comunicação segmentada",
      },
      {
        title: "Push com a sua marca:",
        description:
          "a notificação chega com o nome da sua barbearia, não mais uma mensagem de número desconhecido",
      },
    ],
    cta: {
      text: "QUERO O CLUBE NA MINHA BARBEARIA",
    },
    image: {
      src: "/images/notifications.webp",
      alt: "Notificações push do app da barbearia lembrando o assinante",
      width: 1640,
      height: 800,
    },
  },

  // ===== CLIENTES (PROVA SOCIAL) =====
  clients: {
    countUp: 51000,
    titleAfterCount: " assinantes",
    titleMiddle: " pagando todo mês,",
    titleEnd: " em 1.200+ barbearias",
    subline: "R$5M+ processados por mês · 6M+ agendamentos mensais",
  },

  // ===== PASSO A PASSO =====
  steps: {
    title: {
      highlight: "Passo a passo ",
      main: "para o clube no app\ncom a cara da sua barbearia:",
    },
    items: [
      {
        number: "1",
        title: "Preencha o formulário",
        description:
          "Nosso especialista trabalhará com você para entender seus objetivos e necessidades — e, se você já tem clube, como ele roda hoje: planos, valores, assinantes.",
      },
      {
        number: "2",
        title: "Assinatura do contrato",
        description:
          "Hora de formalizarmos a nossa parceria e oficializarmos esse grande passo da sua barbearia.",
      },
      {
        number: "3",
        title: "Desenvolvimento e homologação",
        description:
          "Contamos com um time de desenvolvedores experts na produção de aplicativos. Seu app ficará pronto mais rápido do que você imagina!",
      },
      {
        number: "4",
        title: "Revisão do aplicativo",
        description:
          "Subiremos uma versão Beta do seu aplicativo para validar com o seu time — você confere planos, preços e regras antes de qualquer assinante ver.",
      },
      {
        number: "5",
        title: "Entrega do App Personalizado",
        description:
          "Desfrute de todos os benefícios da exclusividade do aplicativo próprio e proporcione uma experiência fantástica para seus clientes!",
      },
    ],
    cta: {
      text: "QUERO O CLUBE NA MINHA BARBEARIA",
    },
    image: {
      src: "/images/Passo-a-passo-mockup-seletto.png",
      alt: "Passo a passo para ter o clube de assinaturas no app da sua barbearia",
      width: 587,
      height: 800,
    },
  },

  // ===== FOOTER (linha extra de migração) =====
  footer: {
    migracao: {
      text: "Quer conversar sobre a migração do seu clube?",
      ctaText: "Chama no WhatsApp.",
      href: "https://wa.me/5531990657164?text=Olá!%20Quero%20conversar%20sobre%20a%20migração%20do%20clube%20da%20minha%20barbearia%20para%20o%20BestBarbers!",
    },
  },

  // ===== SEO / METADATA =====
  seo: {
    title:
      "Clube de Assinaturas no App da sua Barbearia | BestBarbers",
    description:
      "Clube de assinaturas dentro do app com a cara da sua barbearia: cobrança recorrente automática, planos por créditos ou dias de uso e nota fiscal emitida a cada cobrança.",
  },
} as const;
