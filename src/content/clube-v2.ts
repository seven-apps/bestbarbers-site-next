/**
 * Conteúdo da página /clube-v2 — a v2 da copy do clube (28/Set/26), em rota PRÓPRIA.
 *
 * Por que rota própria e não edição de `clube.ts`: a `/clube` é o braço `longa` do A/B de
 * página do ciclo 1 (`lib/ab-clube.ts`) e, desde 28/Set, recebe 100% do tráfego do teste.
 * Mexer em `clube.ts` ou nos componentes de `components/clube/` muda a página no meio da
 * leitura. Aqui nada é compartilhado com o que o ciclo 1 lê, exceto blocos reaproveitados
 * SEM alteração (NFS-e, passo a passo, FAQ, rodapé).
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
 * - 3 cases por porte e cidade: literais do cases-clube.json (bb#12612, bb#15550, bb#16402).
 *
 * Imagens: nenhuma arte nova. Cenas do lote de estáticos do funil de clube (já em
 * `public/images/clube/cena/`), captura real da calculadora da tabela de precificação e a
 * tela real do cadastro de plano (conta de demonstração, só o painel do plano).
 */

import { homeContent } from "@/content/home";

export const clubeV2Content = {
  // ===== 1. HERÓI =====
  hero: {
    title: {
      main: "Clube de assinaturas",
      highlight: " no aplicativo próprio",
      subtitle: "da sua barbearia",
    },
    description:
      "O seu cliente assina o clube pelo app da sua barbearia e a mensalidade é cobrada no cartão dele todo mês, de forma automática. O BestBarbers cobra a assinatura, bloqueia o agendamento do cliente que está com o pagamento atrasado e emite a nota fiscal de cada cobrança. Você não precisa cobrar ninguém.",
    cta: { text: "QUERO O CLUBE\nNA MINHA BARBEARIA" },
    // Mesma foto dos cinco parceiros da home e da /clube: acervo que não se troca.
    image: homeContent.hero.image,
  },

  // ===== 2. PROVA (empresa → parceiro falando → barbearia do tamanho do leitor) =====
  prova: {
    titulo: {
      destaque: "Mais de 1.200 barbearias",
      resto: " usam o BestBarbers, que gerencia mais de 51 mil assinaturas todo mês",
    },
    // Parceiros da foto do herói vêm PRIMEIRO na esteira. Faltam 3 logos (the Champs,
    // Gladstone e Thais D'Antunes): em `parceiros/assets` só existem os retratos.
    logosParceiros: [
      { src: "/images/parceiros-logos/seletto.jpeg", alt: "Logo da Barbearia Seletto" },
      { src: "/images/parceiros-logos/borborema.png", alt: "Logo da Barbearia Borborema" },
    ],
    depoimentos: {
      titulo: "Quem já tem o clube no app conta como foi",
      itens: [
        {
          chave: "joao-seletto",
          nome: "João Seletto",
          barbearia: "Barbearia Seletto",
          fala: "A minha receita com assinatura saiu de 5 para 58 mil reais mensais em apenas um ano e meio. É cliente pagando a barbearia como se fosse uma Netflix.",
        },
        {
          chave: "kaique-alves",
          nome: "Kaique Alves",
          barbearia: "Bagulho Barbershop",
          fala: "A Bagulho Barbershop é a maior barbearia por assinatura do bairro, com mais de 800 assinantes e tudo isso rodando no automático com a tecnologia do BestBarbers.",
        },
        {
          chave: "david-champs",
          nome: "David",
          barbearia: "the Champs",
          fala: "É através do sistema que você vai acompanhar de fato os pagamentos. Hoje a gente usa o Best. Ele te entrega tudo de forma simples, fácil e objetiva. E fora o suporte, que é surreal.",
        },
      ],
    },
    cases: {
      titulo: "E em barbearias do tamanho da sua",
      apoio:
        "Barbearias reais na plataforma, identificadas por porte e cidade. Os valores são de receita do clube, medidos no próprio sistema.",
      itens: [
        {
          porte: "Barbearia de 2 cadeiras",
          cidade: "São Paulo/SP",
          numero: "R$16.152 por mês",
          texto: "75 assinantes pagando pelo app da barbearia.",
        },
        {
          porte: "Barbearia de 4 cadeiras",
          cidade: "Belo Horizonte/MG",
          numero: "R$2.724 → R$10.486 por mês",
          texto: "De 23 para 100 assinantes em 15 meses.",
        },
        {
          porte: "Barbearia de 4 cadeiras",
          cidade: "Antônio Carlos/SC",
          numero: "R$2.264 → R$10.542 por mês",
          texto: "90 assinantes no clube, em 12 meses.",
        },
      ],
    },
  },

  // ===== 3. TUDO PARA O CLUBE EM UM SÓ LUGAR =====
  tudoEmUmLugar: {
    titulo: { main: "Tudo para o seu clube de assinaturas,", highlight: "em um só lugar" },
    // Frases com sujeito, na ordem em que as coisas acontecem.
    itens: [
      "O cliente assina e agenda sozinho pelo app da sua barbearia.",
      "A mensalidade é cobrada no cartão do cliente todo mês, de forma automática.",
      "O cliente que atrasa o pagamento fica bloqueado para agendar.",
      "Você vê nos relatórios quantas vezes cada assinante veio no mês.",
      "A nota fiscal de cada assinatura sai emitida sem você digitar nada.",
    ],
    cta: "QUERO O CLUBE NA MINHA BARBEARIA",
    image: {
      src: "/images/clube/cena/cobranca-automatica-retrato.webp",
      alt: "Celular com o app da barbearia mostrando as mensalidades do clube cobradas e pagas no dia",
      width: 800,
      height: 1000,
    },
  },

  // ===== MIGRAÇÃO (quem já cobra assinatura) =====
  migracao: {
    titulo: "Já cobra assinatura no PIX ou controla na planilha?",
    texto:
      "O BestBarbers importa a sua planilha com os vencimentos que cada assinante já tem. O assinante cadastra o cartão no primeiro acesso ao app e a cobrança continua na data de sempre. Você não perde nenhum assinante na mudança.",
    cta: "JÁ TENHO CLUBE E QUERO MIGRAR",
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
      main: "Não sabe quanto cobrar no seu clube de assinaturas?",
      highlight: "O BestBarbers calcula com você",
    },
    paragrafos: [
      "Você informa o preço do corte, o número de cadeiras e a comissão do barbeiro. A tabela de precificação mostra a mensalidade recomendada, a margem da barbearia e o ganho do barbeiro.",
      "Um especialista do BestBarbers desenha o clube com você antes de qualquer contrato: planos, valores e regras. Depois da contratação, você tem um gerente de contas dedicado desde o primeiro dia.",
    ],
    cta: "QUERO AJUDA PARA MONTAR O MEU CLUBE",
    image: {
      src: "/images/clube-v2/tabela-precificacao.webp",
      alt: "Tabela de precificação do BestBarbers calculando a mensalidade recomendada do clube, a margem da barbearia e o ganho do barbeiro",
      width: 1400,
      height: 1039,
    },
  },

  // ===== 5. PLANOS COM LIMITE =====
  planosComLimite: {
    titulo: { main: "Tem medo de o assinante vir toda semana?", highlight: "Crie planos com limite" },
    paragrafos: [
      "Você cria planos limitados por quantidade de uso, como 4 cortes por mês, ou por dias da semana, como de segunda a quarta.",
      "O sistema controla quanto cada assinante pode usar no período. O assinante que quer vir toda semana marca um horário de cada vez.",
    ],
    cta: "QUERO O CLUBE NA MINHA BARBEARIA",
    image: {
      src: "/images/clube-v2/plano-com-limite.webp",
      alt: "Tela do BestBarbers de cadastro de plano do clube, com limite de utilização ligado e atendimento só de segunda a quarta",
      width: 1022,
      height: 1188,
    },
    legenda: "Tela real do sistema, conta de demonstração.",
  },

  // ===== 7. NOTIFICAÇÕES =====
  notificacoes: {
    titulo: { main: "Quem lembra o assinante", highlight: "é o app da sua marca" },
    paragrafos: [
      "O app envia sozinho o lembrete do pagamento da assinatura e o lembrete do horário marcado.",
      "Você também envia quantas notificações quiser, com o texto que quiser, para todos os seus clientes, sem custo adicional.",
      "A notificação chega no celular do cliente com a logo da sua barbearia, do mesmo jeito que chega a do iFood ou a do Nubank.",
    ],
    cta: "QUERO O CLUBE NA MINHA BARBEARIA",
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
