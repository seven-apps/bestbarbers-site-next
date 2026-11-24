import type { Metadata } from "next";
import { LinkTexto, PaginaDeRecurso, type ConteudoDeRecurso } from "@/components/recurso/PaginaDeRecurso";

/**
 * Página de PRODUTO da assinatura (SEO lote 2, 24/Nov/26), dona de "sistema de assinatura para barbearia". As buscas de
 * dúvida são dos artigos, que é quem o Google mostra (90 dias até 21/Nov: /blog/clube-assinatura-barbearia 344
 * impressões, /blog/barbearia-por-assinatura 339, esta página 6): daqui saem links com o texto da busca para eles.
 * Saíram da versão anterior: assinatura no Pix ou no boleto (só cartão de crédito), planos "ilimitados", troca de plano
 * com pro-rata, "83% mais" para o barbeiro, "47 conversas", relatório de churn e o código interno das barbearias na tela.
 * Casos: knowledge/dominio/cases-clube.json (crivel, sem bloqueio, coleta de 20/Out/26: bb#11545, bb#10773, bb#14054), sem o nome da barbearia e
 * diferentes dos três da /sistema-para-barbearia. Todo valor é RECEITA DA ASSINATURA, nunca faturamento total.
 * "Pelo plano": o vencido ainda marca horário normal, pago à parte (bestbarbers-api docs/manual situacao-da-assinatura §2.8).
 */

const DESCRICAO =
  "Sistema de assinatura para barbearia: o cliente assina pelo app, a mensalidade é cobrada no cartão todo mês e a comissão de cada barbeiro sai calculada.";

export const metadata: Metadata = {
  title: "Sistema de Assinatura para Barbearia: Cobrança no Cartão | BestBarbers",
  description: DESCRICAO,
  alternates: { canonical: "/clube-de-assinaturas" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.bestbarbers.app/clube-de-assinaturas",
    title: "Sistema de assinatura para barbearia | BestBarbers",
    description: DESCRICAO,
    siteName: "BestBarbers",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "BestBarbers — sistema de assinatura para barbearia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistema de assinatura para barbearia | BestBarbers",
    description: DESCRICAO,
    images: ["/og-image.jpg"],
  },
};

const conteudo: ConteudoDeRecurso = {
  slug: "clube-de-assinaturas",
  trilha: "Assinatura na barbearia",
  descricao: DESCRICAO,
  h1: "Sistema de assinatura para barbearia",
  frase: "O seu cliente assina pelo app e o sistema cobra a mensalidade no cartão dele, todo mês.",
  destaques: [
    "A cobrança sai sozinha, sempre na mesma data",
    "Quem atrasou só volta a marcar pelo plano depois de pagar",
    "Comissão da assinatura calculada por barbeiro",
  ],
  botao: "QUERO ASSINATURA NA MINHA BARBEARIA",
  originDesc: "[Site]BT-Clube",
  prova: "Mais de 1.200 barbearias usam o BestBarbers, que gerencia mais de 51 mil assinaturas todo mês.",
  oQueE: {
    titulo: "O que o sistema de assinatura faz",
    paragrafos: [
      "Você cadastra os planos. O sistema cobra a mensalidade no cartão do cliente, controla quanto cada assinante usou e calcula a comissão dos barbeiros.",
      <>
        Está começando? Veja antes <LinkTexto href="/blog/barbearia-por-assinatura">como funciona a barbearia por assinatura</LinkTexto>{" "}
        e como montar o <LinkTexto href="/blog/clube-assinatura-barbearia">plano de assinatura da barbearia</LinkTexto>.
      </>,
    ],
  },
  tabela: {
    titulo: "O que você controla na assinatura",
    linhas: [
      { nome: "Planos", resolve: "Você define os serviços, quantos cortes por mês e o preço." },
      { nome: "Limite de uso", resolve: "Por quantidade, como 4 cortes por mês, ou por dia da semana, como de segunda a quarta." },
      { nome: "Cobrança", resolve: "No cartão de crédito do assinante, todo mês, na mesma data. O cartão recusado é tentado de novo." },
      { nome: "Pagamento atrasado", resolve: "O assinante recebe aviso no app e só volta a marcar pelo plano depois de pagar." },
      { nome: "Agendamento do assinante", resolve: "Ele marca pelo app, dentro do plano dele.", href: "/agendamento-online" },
      { nome: "Comissão da assinatura", resolve: "Você cadastra a parte do plano que vira comissão e quanto vale cada serviço. O sistema divide entre os barbeiros.", href: "/gestao-comissoes-barbeiro" },
      { nome: "Resumo dos assinantes", resolve: "Quem está em dia, quem venceu, quem cancelou e quanto está previsto para entrar." },
      { nome: "Frequência", resolve: "Quantas vezes cada assinante veio." },
      { nome: "Tabela de preço", resolve: "Ajuda você a chegar na mensalidade do plano.", href: "/tabela-precificacao-clube" },
      { nome: "Nota fiscal da mensalidade", resolve: "Com a nota ligada, o sistema pede a nota sozinho depois de cada mensalidade paga.", href: "/nota-fiscal-barbearia", modulo: true },
    ],
  },
  passos: {
    titulo: "Como começar a assinatura na sua barbearia",
    itens: [
      { titulo: "Monte o plano", texto: "Escolha os serviços, o limite de uso e a mensalidade. Um especialista monta com você." },
      { titulo: "Cadastre no sistema", texto: "O plano aparece no app da sua barbearia." },
      { titulo: "Ofereça para quem já é cliente", texto: "Na cadeira, no balcão e por aviso no app." },
      { titulo: "O cliente assina pelo app", texto: "Ele cadastra o cartão de crédito uma vez." },
      { titulo: "A cobrança sai todo mês", texto: "Na mesma data, sem você mandar mensagem." },
      { titulo: "Acompanhe", texto: "Veja quem está em dia, quem atrasou e quanto está previsto para entrar." },
    ],
  },
  preco: {
    titulo: "Quanto custa",
    nota: "Os R$299 por mês são do sistema com o aplicativo e não incluem a assinatura. O valor da assinatura o especialista passa na primeira conversa.",
  },
  casos: {
    titulo: "Quem já usa a assinatura no sistema",
    sub: "Receita mensal da assinatura de barbearias que usam o BestBarbers.",
    itens: [
      { porte: "Barbearia com 2 cadeiras", cidade: "Belo Horizonte/MG", assinantes: "82", valor: "R$11.615", nota: "De 29 assinantes e R$4.095/mês para 82 e R$11.615/mês em 26 meses." },
      { porte: "Barbearia com 3 cadeiras", cidade: "Guarulhos/SP", assinantes: "181", valor: "R$25.834", nota: "De 44 assinantes e R$6.257/mês para 181 e R$25.834/mês em 9 meses." },
      { porte: "Barbearia com 4 cadeiras", cidade: "São Paulo/SP", assinantes: "365", valor: "R$50.126", nota: "De 67 assinantes e R$7.323/mês para 365 e R$50.126/mês em 19 meses." },
    ],
  },
  faq: {
    titulo: "Perguntas sobre o sistema de assinatura",
    itens: [
      { pergunta: "Dá para cobrar a assinatura no Pix ou no boleto?", resposta: "Não. A assinatura é cobrada só no cartão de crédito. É assim que a cobrança sai sozinha, sem você mandar mensagem." },
      { pergunta: "O que acontece quando o cartão é recusado?", resposta: "O cartão é tentado de novo. Se a mensalidade atrasar, o assinante abre o app da barbearia, onde aparece o pagamento em aberto, escolhe o cartão e paga. Depois disso, volta a marcar pelo plano." },
      { pergunta: "O assinante pode vir quantas vezes quiser?", resposta: "Você decide. O plano pode ter limite por quantidade, como 4 cortes por mês, ou por dia da semana, como de segunda a quarta. O sistema controla o uso de cada assinante." },
      { pergunta: "Como fica a comissão do barbeiro na assinatura?", resposta: "No cadastro do plano você diz qual parte vira comissão e quanto vale cada serviço. No fechamento, o sistema divide entre os barbeiros pelo que cada um atendeu." },
      { pergunta: "Já cobro assinatura no Pix ou controlo na planilha. Consigo trazer para o sistema?", resposta: "Sim, mas a cobrança passa para o cartão de crédito. O BestBarbers importa a sua planilha com o vencimento de cada assinante, e o assinante cadastra o cartão no primeiro acesso ao app." },
      { pergunta: "Serve para barbearia pequena?", resposta: "Serve. É você que define o plano, o limite e o preço, e a cobrança sai do mesmo jeito com 10 ou com 500 assinantes." },
    ],
  },
  leiaTambem: (
    <>
      Não sabe quanto cobrar? Use a <LinkTexto href="/tabela-precificacao-clube">tabela de preço da assinatura</LinkTexto> ou faça o{" "}
      <LinkTexto href="/curso-assinatura">curso grátis de assinatura</LinkTexto>.
    </>
  ),
  fim: { titulo: "Fale com um especialista e veja a assinatura funcionando", texto: "Ele mostra o plano, a cobrança e a comissão com o jeito da sua barbearia." },
};

export default function ClubeDeAssinaturas() {
  return <PaginaDeRecurso conteudo={conteudo} />;
}
