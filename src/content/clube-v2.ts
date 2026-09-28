/**
 * Conteúdo da página do clube — v2 da copy (28/Set/26). Por decisão do André, é o conteúdo
 * da `/clube` e de todo `/clube/<peça>` (braço `longa`). O conteúdo anterior (`clube.ts`)
 * ainda alimenta o passo a passo, a navbar (logo e link de cliente), o FAQ e o rodapé, e
 * fica no repositório para rollback da página antiga.
 *
 * Régua da copy (decisão do André, 28/Set/26): público leigo → didática e direta; sujeito
 * explícito em toda frase; mecanismo antes de promessa; zero metáfora e zero frase de efeito;
 * sem kicker. Diagnóstico e fontes: bestbarbers-ai/docs/operacional/trafego/copy-pagina-clube-analise-set26.md
 *
 * Afirmações e de onde vem o lastro:
 * - bloqueio automático do inadimplente, migração com os vencimentos, "não perde assinante":
 *   liberadas pelo André em 22/Set/26.
 * - gerente de contas dedicado; notificações ilimitadas e sem custo adicional: confirmadas
 *   pelo André em 28/Set/26.
 * - 1.200+ barbearias e 51 mil assinaturas: números oficiais de divulgação.
 * - falas de parceiro: LITERAIS dos brutos transcritos (bestbarbers-media/output/trafego-pago/
 *   reedicao/<peça>/transcript.json). O número é de quem fala, entre aspas; a casa não afirma.
 *
 * Imagens: nenhuma arte nova. Cenas do lote de estáticos do funil de clube (já em
 * `public/images/clube/cena/`), captura real da calculadora da tabela de precificação e a
 * tela real do cadastro de plano (conta de demonstração, só o painel do plano).
 */

import { homeContent } from "@/content/home";

export const clubeV2Content = {
  // ===== BOTÕES DA NAVBAR E DO PASSO A PASSO =====
  // O dono de barbearia fala "assinatura" mais do que "clube" (André, 28/Set/26): o botão
  // usa a palavra dele. Navbar e passo a passo são cópias dos componentes da /clube só para
  // trocar o texto do botão sem tocar na página do ciclo 1.
  navbar: {
    cta: { text: "QUERO ASSINATURA NA MINHA BARBEARIA", textMobile: "Quero assinatura" },
  },
  passos: {
    // Título próprio da v2 (André, 28/Set): sem quebra forçada, o navegador reparte as linhas.
    titulo: {
      highlight: "Passo a passo",
      main: " para ter o clube de assinaturas no app próprio personalizado da sua barbearia",
    },
    cta: "QUERO ASSINATURA NA MINHA BARBEARIA",
  },

  // ===== 1. HERÓI =====
  hero: {
    title: {
      main: "Clube de assinaturas",
      highlight: " no aplicativo próprio",
      subtitle: "da sua barbearia",
    },
    // Celular primeiro (André, 28/Set): uma frase curta e três destaques que se leem de relance.
    description:
      "O seu cliente assina pelo app e o BestBarbers cobra a mensalidade por você.",
    destaques: [
      "Cobrança automática no cartão",
      "Bloqueio de quem está com o pagamento atrasado",
      "Nota fiscal emitida em cada cobrança",
    ],
    cta: { text: "QUERO ASSINATURA\nNA MINHA BARBEARIA" },
    // Mesma foto dos cinco parceiros da home e da /clube: acervo que não se troca.
    image: homeContent.hero.image,
  },

  // ===== 2. PROVA (empresa → parceiro falando → barbearia do tamanho do leitor) =====
  prova: {
    titulo: {
      destaque: "Mais de 1.200 barbearias",
      resto: " usam o BestBarbers, que gerencia mais de 51 mil assinaturas todo mês",
    },
    // Parceiros da foto do herói são os PRIMEIROS da esteira de logos. Faltam 3 logos
    // (the Champs, Gladstone e Thais D'Antunes): em `parceiros/assets` só existem os retratos.
    logosParceiros: [
      { src: "/images/parceiros-logos/seletto.jpeg", alt: "Logo da Barbearia Seletto" },
      { src: "/images/parceiros-logos/borborema.png", alt: "Logo da Barbearia Borborema" },
    ],
    depoimentos: {
      titulo: "Quem já tem o clube no app conta como foi",
      itens: [
        {
          chave: "joao-seletto",
          foto: "/images/clube-v2/joao-seletto.webp",
          nome: "João Seletto",
          barbearia: "Barbearia Seletto",
          fala: "A minha receita com assinatura saiu de 5 para 58 mil reais mensais em apenas um ano e meio. É cliente pagando a barbearia como se fosse uma Netflix.",
        },
        {
          chave: "kaique-alves",
          foto: "/images/clube-v2/kaique-alves.webp",
          nome: "Kaique Alves",
          barbearia: "Bagulho Barbershop",
          fala: "A Bagulho Barbershop é a maior barbearia por assinatura do bairro, com mais de 800 assinantes e tudo isso rodando no automático com a tecnologia do BestBarbers.",
        },
        {
          chave: "david-champs",
          foto: "/images/clube-v2/david-champs.webp",
          nome: "David",
          barbearia: "the Champs",
          fala: "É através do sistema que você vai acompanhar de fato os pagamentos. Hoje a gente usa o Best. Ele te entrega tudo de forma simples, fácil e objetiva. E fora o suporte, que é surreal.",
        },
      ],
    },
  },

  // ===== 3. TUDO PARA O CLUBE EM UM SÓ LUGAR =====
  tudoEmUmLugar: {
    titulo: { main: "Tudo para o seu clube de assinaturas,", highlight: "em um só lugar" },
    // Frases com sujeito, na ordem em que as coisas acontecem.
    itens: [
      "O cliente assina e agenda pelo app",
      "Cobrança automática no cartão, todo mês",
      "Cliente com pagamento atrasado não agenda",
      "Relatório de frequência de cada assinante",
      "Nota fiscal emitida em cada cobrança",
    ],
    cta: "QUERO ASSINATURA NA MINHA BARBEARIA",
    image: {
      // A mesma arte da seção de assinaturas da home (pedido do André, 28/Set).
      src: "/images/gerenciamento-de-assinaturas.png",
      alt: "App da barbearia no celular e painel financeiro do BestBarbers no notebook",
      width: 2696,
      height: 1542,
    },
  },

  // ===== MIGRAÇÃO (quem já cobra assinatura) =====
  migracao: {
    titulo: "Já cobra assinatura no PIX ou controla na planilha?",
    itens: [
      "O BestBarbers importa a sua planilha com o vencimento de cada assinante",
      "O assinante cadastra o cartão no primeiro acesso ao app",
      "Você não perde nenhum assinante na mudança",
    ],
    cta: "QUERO MIGRAR MEU CLUBE DE ASSINATURAS",
    image: {
      src: "/images/clube/cena/sem-caderno-faixa.webp",
      alt: "Caderno de controle rabiscado ao lado do celular com a lista de assinantes e o vencimento de cada um",
      width: 800,
      height: 500,
    },
  },

  // ===== 4. PRECIFICAÇÃO =====
  precificacao: {
    titulo: {
      main: "Não sabe quanto cobrar no clube?",
      highlight: "O BestBarbers calcula com você",
    },
    itens: [
      "A tabela calcula a mensalidade ideal do seu clube",
      "Mostra a margem da barbearia e o ganho do barbeiro",
      "Um especialista monta o clube com você",
      "Gerente de contas dedicado desde o primeiro dia",
    ],
    cta: "QUERO AJUDA PARA PRECIFICAR MINHA ASSINATURA",
    image: {
      src: "/images/clube-v2/tabela-precificacao.webp",
      alt: "Tabela de precificação do BestBarbers calculando a mensalidade recomendada do clube, a margem da barbearia e o ganho do barbeiro",
      width: 1400,
      height: 1039,
    },
  },

  // ===== 5. PLANOS COM LIMITE =====
  planosComLimite: {
    titulo: { main: "Tem medo do assinante vir toda semana?", highlight: "Crie planos com limite de uso" },
    itens: [
      "Limite por quantidade, como 4 cortes por mês",
      "Limite por dia da semana, como de segunda a quarta",
      "O sistema controla o uso de cada assinante",
      "O assinante marca um horário de cada vez",
    ],
    cta: "QUERO ASSINATURA NA MINHA BARBEARIA",
    image: {
      // Tela INTEIRA do sistema, dentro de um notebook (André, 28/Set). A lista de planos da
      // conta de demonstração vai desfocada, como no estático do mesmo tema.
      src: "/images/clube-v2/plano-com-limite-tela.webp",
      alt: "Tela do BestBarbers de cadastro de plano do clube, com limite de utilização ligado e atendimento só de segunda a quarta",
      width: 2000,
      height: 1188,
    },
    legenda: "Tela real do sistema, conta de demonstração.",
  },

  // ===== 6. NOTA FISCAL =====
  // Mesmo conteúdo do bloco da /clube, em frases curtas: no celular o bloco original era o
  // trecho com mais texto da página. NFS-e é recurso real do produto.
  notaFiscal: {
    titulo: { main: "Assinatura cobrada,", highlight: "nota fiscal emitida" },
    itens: [
      "Nota fiscal emitida a cada pagamento de assinatura",
      "Integração com a prefeitura da sua cidade",
      "PDF e XML prontos para o seu contador",
    ],
    cta: "QUERO ASSINATURA NA MINHA BARBEARIA",
    image: {
      src: "/images/Nota-fiscal_1.webp",
      alt: "Emissão automática de nota fiscal a cada cobrança de assinatura no BestBarbers",
      width: 735,
      height: 500,
    },
  },

  // ===== 7. NOTIFICAÇÕES =====
  notificacoes: {
    titulo: { main: "Quem lembra o assinante", highlight: "é o app da sua marca" },
    itens: [
      "Lembrete automático do pagamento da assinatura",
      "Lembrete automático do horário marcado",
      "Notificações ilimitadas, sem custo adicional",
      "Chegam com a logo da sua barbearia, como as do iFood e do Nubank",
    ],
    cta: "QUERO ASSINATURA NA MINHA BARBEARIA",
    image: {
      src: "/images/notifications-app-proprio.webp",
      alt: "Notificações do app da barbearia chegando no celular do cliente com a logo da barbearia",
      width: 1640,
      height: 857,
    },
  },

  seo: {
    title: "Clube de Assinaturas no App Próprio da sua Barbearia | BestBarbers",
    description:
      "O cliente assina pelo app da sua barbearia, a mensalidade é cobrada no cartão todo mês e o BestBarbers bloqueia quem atrasou e emite a nota fiscal.",
  },
} as const;
