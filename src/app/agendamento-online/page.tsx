import type { Metadata } from "next";
import { LinkTexto, PaginaDeRecurso, type ConteudoDeRecurso } from "@/components/recurso/PaginaDeRecurso";

/**
 * Página dona de "agendamento online", "agenda online" e "agenda para barbearia" (SEO lote 2, 24/Nov/26).
 * "sistema de agendamento" é da /sistema-para-barbearia (posição 4 a 5) e "aplicativo de agendamento" é da home
 * (posição 6): daqui saem links com esse texto para elas, e a página não disputa essas buscas.
 * Saíram da versão anterior, por não terem fonte ou não existirem: aviso por SMS,
 * "até 40% menos faltas", "30 conversas por dia", "2+ horas", a pesquisa com 21 menções e "em menos de 24 horas".
 */

const DESCRICAO =
  "Agendamento online para barbearia: o cliente vê os horários livres de cada barbeiro e marca sozinho, pelo link ou pelo app. O app lembra do horário.";

export const metadata: Metadata = {
  title: "Agendamento Online e Agenda para Barbearia | BestBarbers",
  description: DESCRICAO,
  alternates: { canonical: "/agendamento-online" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.bestbarbers.app/agendamento-online",
    title: "Agendamento online para barbearia | BestBarbers",
    description: DESCRICAO,
    siteName: "BestBarbers",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "BestBarbers — agendamento online para barbearia" }],
  },
};

const conteudo: ConteudoDeRecurso = {
  slug: "agendamento-online",
  trilha: "Agendamento online",
  descricao: DESCRICAO,
  h1: "Agendamento online para barbearia",
  frase: "O cliente vê os horários livres de cada barbeiro e marca sozinho, pelo link ou pelo aplicativo da sua barbearia.",
  destaques: [
    "O cliente marca a qualquer hora, sem você responder um por um",
    "Cada barbeiro tem a agenda dele",
    "O app lembra o cliente do horário",
  ],
  botao: "QUERO AGENDAMENTO ONLINE NA MINHA BARBEARIA",
  originDesc: "[Site]BT-Agendamento",
  prova: "Mais de 1.200 barbearias usam o BestBarbers.",
  oQueE: {
    titulo: "O que é agendamento online para barbearia",
    paragrafos: [
      "É uma agenda que o cliente abre no celular. Ele escolhe o serviço, o barbeiro e um horário livre, que entra na sua agenda na hora.",
      <>
        No BestBarbers, a agenda online faz parte do{" "}
        <LinkTexto href="/sistema-para-barbearia">sistema de agendamento para barbearia</LinkTexto>, junto com o caixa e a
        comissão dos barbeiros. O cliente também marca pelo{" "}
        <LinkTexto href="/">aplicativo de agendamento para barbearia</LinkTexto> com a sua marca.
      </>,
    ],
  },
  passos: {
    titulo: "Como o cliente marca o horário",
    itens: [
      { titulo: "Ele abre o link ou o app", texto: "O link da sua barbearia vai no Instagram, no WhatsApp e no Google. O app é o da sua barbearia, na App Store e no Google Play." },
      { titulo: "Escolhe o serviço e o barbeiro", texto: "Só aparecem os horários livres daquele barbeiro." },
      { titulo: "Confirma o horário", texto: "Na primeira vez, ele faz um cadastro com senha. Nas próximas, é só marcar." },
      { titulo: "O horário entra na agenda", texto: "O barbeiro vê no app dele e você vê no painel." },
    ],
  },
  tabela: {
    titulo: "O que a agenda online faz na sua barbearia",
    linhas: [
      { nome: "Link de agendamento", resolve: "O cliente marca pelo navegador do celular, sem baixar nada." },
      { nome: "Aplicativo com a sua marca", resolve: "O cliente marca pelo app com o nome da sua barbearia.", href: "/app-proprio-barbearia" },
      { nome: "Agenda por barbeiro", resolve: "Cada barbeiro tem a coluna dele, com o horário de trabalho dele." },
      { nome: "Almoço, folga e férias", resolve: "Você bloqueia um horário, um período ou o mesmo horário toda semana. O cliente não marca em cima." },
      { nome: "Cliente fixo", resolve: "O horário que se repete é lançado uma vez e aparece nas semanas seguintes." },
      { nome: "Encaixe", resolve: "Você coloca o cliente num horário fora da grade, sem mexer no resto da agenda." },
      { nome: "Lembrete do horário", resolve: "O app avisa o cliente na véspera e de novo perto do horário marcado." },
      { nome: "Cliente que faltou", resolve: "A falta fica marcada na agenda." },
      { nome: "Assinante", resolve: "Marca pelo app dentro do plano dele. Quem atrasou a mensalidade só volta a marcar quando pagar.", href: "/clube-de-assinaturas", modulo: true },
      { nome: "Totem de autoatendimento", resolve: "O cliente marca horário e avisa que chegou no balcão.", href: "/totem-autoatendimento", modulo: true },
      { nome: "Agente de IA no WhatsApp", resolve: "Marca, remarca ou cancela o horário na agenda, pela conversa do WhatsApp.", href: "/agente-ia-whatsapp", modulo: true },
    ],
  },
  preco: {
    titulo: "Quanto custa",
    legenda: "Plano com a agenda online e o aplicativo da sua barbearia.",
    itens: [
      "Agenda, caixa, comissão, clientes e o aplicativo com a sua marca",
      "Implantação feita pelo nosso time, com você",
      "Gerente de contas para tirar as suas dúvidas",
      "Assinatura, totem e agente de IA são contratados à parte",
    ],
    botao: "QUERO SABER O PREÇO PARA MINHA BARBEARIA",
  },
  faq: {
    titulo: "Perguntas sobre agendamento online para barbearia",
    itens: [
      { pergunta: "Como funciona o agendamento online de uma barbearia?", resposta: "O cliente abre o link ou o aplicativo da barbearia, escolhe o serviço, o barbeiro e um horário livre, e confirma. O horário entra na agenda na hora. O barbeiro vê no app dele e o dono vê no painel." },
      { pergunta: "O cliente precisa baixar um aplicativo para marcar?", resposta: "Não. Ele marca pelo link, no navegador do celular. Quem baixa o aplicativo da barbearia também recebe o lembrete do horário." },
      { pergunta: "O cliente consegue marcar de madrugada ou no domingo?", resposta: "Sim. O link e o app ficam abertos a qualquer hora, e só aparecem os horários em que a barbearia atende." },
      { pergunta: "O lembrete diminui a falta?", resposta: "Sim. Nas barbearias que usam o BestBarbers, a falta é menor nos horários com lembrete. O aviso sai na véspera e de novo perto do horário, e chega a quem tem o app com as notificações ligadas." },
      { pergunta: "Dá para bloquear almoço, folga e férias?", resposta: "Sim. Você bloqueia um horário, um período ou o mesmo horário toda semana, para um barbeiro ou para todos. O cliente só vê o que está livre." },
      { pergunta: "E o cliente que prefere marcar pelo WhatsApp?", resposta: "Você manda o link na conversa e ele marca sozinho. Se quiser, o agente de IA no WhatsApp marca, remarca e cancela direto na agenda. Ele é contratado à parte." },
      { pergunta: "Existe agenda online para barbearia grátis?", resposta: "Existe agenda com plano grátis, mas o BestBarbers não tem. O plano com o aplicativo da sua barbearia custa a partir de R$299 por mês. Se for testar uma grátis, confira se cada barbeiro tem a agenda dele, se o cliente recebe lembrete e se a comissão sai calculada." },
    ],
  },
  leiaTambem: (
    <>
      Tem cliente que marca e não aparece? Veja <LinkTexto href="/blog/como-reduzir-faltas-barbearia">como reduzir faltas na barbearia</LinkTexto>.
    </>
  ),
  fim: { titulo: "Fale com um especialista e veja a agenda funcionando", texto: "Ele mostra o link, o app e a agenda de cada barbeiro com o jeito da sua barbearia." },
};

export default function AgendamentoOnline() {
  return <PaginaDeRecurso conteudo={conteudo} />;
}
