import type { Metadata } from "next";
import { LinkTexto, PaginaDeRecurso, type ConteudoDeRecurso } from "@/components/recurso/PaginaDeRecurso";

/**
 * Página dona de "app próprio" e "aplicativo personalizado para barbearia" (SEO lote 2, 24/Nov/26).
 * "aplicativo para barbearia" é da home (posição 5 a 6): daqui sai o link com esse texto.
 * Saíram da versão anterior, por não terem fonte ou não existirem: app na loja em 15 a 30 dias, pagar antes pelo app
 * (Pix e débito), "1.200+ barbearias já têm app próprio", "15 concorrentes na mesma tela" e "23,1% de conversão".
 */

const DESCRICAO =
  "App próprio para barbearia: um aplicativo personalizado com o seu nome e a sua logo, na App Store e no Google Play. O cliente marca e recebe recados.";

export const metadata: Metadata = {
  title: "App Próprio para Barbearia: Aplicativo Personalizado | BestBarbers",
  description: DESCRICAO,
  alternates: { canonical: "/app-proprio-barbearia" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.bestbarbers.app/app-proprio-barbearia",
    title: "App próprio para barbearia | BestBarbers",
    description: DESCRICAO,
    siteName: "BestBarbers",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "BestBarbers — app próprio para barbearia" }],
  },
};

const conteudo: ConteudoDeRecurso = {
  slug: "app-proprio-barbearia",
  trilha: "App próprio para barbearia",
  descricao: DESCRICAO,
  h1: "App próprio para barbearia",
  frase: "Um aplicativo personalizado com o nome e a logo da sua barbearia, na App Store e no Google Play.",
  destaques: [
    "No app, o cliente só vê a sua barbearia",
    "Ele marca o horário pelo celular, a qualquer hora",
    "Você manda recados que aparecem no celular de quem tem o seu app, sem pagar por envio",
  ],
  botao: "QUERO UM APP PRÓPRIO PARA MINHA BARBEARIA",
  originDesc: "[Site]BT-AppProprio",
  prova: "Mais de 1.200 barbearias usam o BestBarbers.",
  oQueE: {
    titulo: "O que é um app próprio para barbearia",
    paragrafos: [
      "É um aplicativo personalizado para barbearia: o nome e a logo são os seus. O cliente procura o nome da sua barbearia na loja do celular, baixa e marca por ali.",
      <>
        Ele vem com o sistema que cuida da agenda, do caixa e da comissão. Veja tudo o que o{" "}
        <LinkTexto href="/">aplicativo para barbearia</LinkTexto> do BestBarbers faz.
      </>,
    ],
  },
  comparacao: {
    titulo: "App próprio ou app com várias barbearias?",
    colunas: ["Diferença", "App próprio", "App com várias barbearias"],
    linhas: [
      ["O que o cliente vê", "Só a sua barbearia", "Várias barbearias na mesma tela"],
      ["Nome e logo na loja", "Os da sua barbearia", "Os do aplicativo"],
      ["Recado no celular", "Chega pelo app da sua barbearia", "Chega pelo app que reúne várias"],
    ],
  },
  tabela: {
    titulo: "O que vem com o aplicativo",
    linhas: [
      { nome: "Agendamento online", resolve: "O cliente escolhe o serviço, o barbeiro e um horário livre, a qualquer hora.", href: "/agendamento-online" },
      { nome: "Lembrete do horário", resolve: "O app avisa o cliente na véspera e de novo perto do horário marcado." },
      { nome: "Recado para os clientes", resolve: "Você escreve o recado e manda quantas vezes quiser, sem pagar por envio." },
      { nome: "Cliente que sumiu", resolve: "O sistema mostra quem não vem há um tempo. Você filtra a lista e manda um recado para todos de uma vez." },
      { nome: "Histórico do cliente", resolve: "O cliente vê os horários marcados e os atendimentos passados." },
      { nome: "Agenda do barbeiro", resolve: "O barbeiro vê a agenda e o fechamento da comissão dele no app.", href: "/gestao-comissoes-barbeiro" },
      { nome: "Painel do dono", resolve: "Você acompanha agenda, caixa, clientes e comissão pelo navegador.", href: "/sistema-para-barbearia" },
      { nome: "Assinatura", resolve: "O cliente assina pelo app e a mensalidade é cobrada no cartão de crédito, todo mês.", href: "/clube-de-assinaturas", modulo: true },
    ],
  },
  passos: {
    titulo: "Como o app da sua barbearia entra na loja",
    itens: [
      { titulo: "Você contrata e manda a sua marca", texto: "O nome e a logo da barbearia." },
      { titulo: "O nosso time configura com você", texto: "Serviços, barbeiros e horários entram no sistema." },
      { titulo: "O app vai para análise", texto: "A Apple e o Google conferem cada aplicativo antes de publicar." },
      { titulo: "O app entra na loja", texto: "O cliente procura o nome da sua barbearia, baixa e marca." },
    ],
  },
  preco: { titulo: "Quanto custa um app próprio para barbearia" },
  faq: {
    titulo: "Perguntas sobre app próprio para barbearia",
    itens: [
      { pergunta: "Em quanto tempo o app entra na loja?", resposta: "Quem decide a data é a Apple e o Google, que conferem cada aplicativo antes de publicar. Enquanto isso, o cliente já marca pelo link da sua barbearia." },
      { pergunta: "E o cliente que não quiser baixar o app?", resposta: "Ele marca pelo link da barbearia, no navegador do celular. Só o assinante precisa do app, porque é nele que assina e marca pelo plano." },
      { pergunta: "Todo cliente recebe os recados?", resposta: "O recado chega a quem tem o app da sua barbearia com as notificações ligadas. Você manda quantas vezes quiser, sem pagar por envio." },
      { pergunta: "Se um barbeiro sair, ele leva os clientes?", resposta: "O cadastro não vai com ele: fica no sistema da sua barbearia, com o histórico de cada cliente." },
    ],
  },
  leiaTambem: (
    <>
      Cliente parou de vir? Veja <LinkTexto href="/blog/recuperar-cliente-sumido-barbearia">como recuperar cliente sumido na barbearia</LinkTexto>.
    </>
  ),
  fim: { titulo: "Fale com um especialista e veja um app funcionando", texto: "Ele mostra como fica o app com a marca da sua barbearia." },
};

export default function AppProprioBarbearia() {
  return <PaginaDeRecurso conteudo={conteudo} />;
}
