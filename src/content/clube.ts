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
      "O mês começa com receita na conta — não com a agenda em branco. Seu cliente assina pelo app com a sua marca e a mensalidade cai todo mês, no automático — seja criando o clube do zero, seja aposentando a planilha e o PIX cobrado um a um.",
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
          antes: "Reajuste empurrado de mês em mês",
          depois: "Planos ajustáveis no painel",
        },
        {
          antes: "Cada assinante de cabeça",
          depois: "Relatório que o contador entende",
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
          "com 10 ou com 90 assinantes, a NFS-e sai sozinha a cada pagamento de assinatura ou atendimento — e, se hoje você cobra no PIX e não emite, o suporte te ajuda a configurar a emissão desde o início",
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
      "O assinante agenda pelo app, o corte desconta do plano sozinho, o financeiro registra a receita e a nota sai emitida — agenda, financeiro e fiscal ligados na mesma engrenagem do clube.",
    items: homeContent.features.items,
    cta: {
      text: "QUERO O CLUBE NA MINHA BARBEARIA",
    },
  },

  // ===== TOTEM =====
  totem: {
    title: {
      main: "Opcional, para quando o clube crescer:",
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
          "quem some da cadeira recebe o chamado de volta pelo app — sem você caçar cliente no WhatsApp",
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
    subline: "R$5M+ processados por mês por toda a rede BestBarbers",
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
          "Nosso especialista desenha o clube com você — e, se você já tem um, entende como ele roda hoje: planos, valores, assinantes e o que acontece com as cobranças em andamento na virada. Você sai da conversa sabendo valores e o desenho do seu plano.",
      },
      {
        number: "2",
        title: "Assinatura do contrato",
        description:
          "O contrato formaliza o que já ficou combinado na conversa — valores, planos e cronograma. Nada aparece aqui que você não tenha visto antes.",
      },
      {
        number: "3",
        title: "Desenvolvimento e homologação",
        description:
          "Nosso time de desenvolvimento produz e publica o seu app na App Store e na Play Store — em média, de 15 a 30 dias úteis após o contrato e o envio dos seus dados.",
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
          "Seu app no ar, com o nome da sua barbearia nas lojas — e seus clientes assinando o clube por ele. Daqui em diante, a mensalidade cai todo mês, no automático.",
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
