import type { Metadata } from "next";
import { LinkTexto, PaginaDeRecurso, type ConteudoDeRecurso } from "@/components/recurso/PaginaDeRecurso";

/**
 * Página dona de "agendamento online", "agenda online" e "agenda para barbearia" (SEO lote 2, 24/Nov/26).
 * "sistema de agendamento" é da /sistema-para-barbearia (posição 4 a 5) e "aplicativo de agendamento" é da home
 * (posição 6): daqui saem links com esse texto para elas, e a página não disputa essas buscas.
 * Saíram da versão anterior, por não terem fonte ou não existirem: aviso por SMS,
 * "até 40% menos faltas", "30 conversas por dia", "2+ horas", a pesquisa com 21 menções e "em menos de 24 horas".
 * Cancelar pelo link e pelo app: bestbarbers-web-clients AppointmentDetailsModal/DetailsOptions.jsx e app Appointment/
 * Details/settings.js:208; a antecedência é o minimum_cancel_time (API appointments.js:1017). Nenhum dos dois remarca.
 * Assinante marca pelo app: o link só cria agendamento "normal" (conferido no pacote em produção, 24/Nov/26).
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
    "O cliente marca a qualquer hora, sem combinar horário um por um",
    "Cada barbeiro tem a agenda dele",
    "Quem tem o app recebe lembrete na véspera e perto do horário",
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
      { titulo: "Ele abre o link ou o app", texto: "Você coloca o link no Instagram, no WhatsApp e no perfil do Google. O app é o da sua barbearia, na App Store e no Google Play." },
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
      { nome: "Almoço, folga e férias", resolve: "Você bloqueia um horário, um período ou o mesmo horário toda semana, para um barbeiro ou para todos. O cliente só vê o que está livre." },
      { nome: "Cliente fixo", resolve: "Você lança uma vez o horário que se repete, e ele aparece na agenda nas semanas seguintes." },
      { nome: "Encaixe", resolve: "Você coloca o cliente num horário fora da grade, sem mexer no resto da agenda." },
      { nome: "Cancelar o horário", resolve: "O cliente cancela pelo link ou pelo app, com a antecedência que você definir. Para mudar de horário, ele cancela e marca outro." },
      { nome: "Lembrete do horário", resolve: "O app avisa o cliente na véspera e de novo perto do horário marcado." },
      { nome: "Cliente que faltou", resolve: "A falta fica marcada na agenda." },
      { nome: "Assinante", resolve: "Marca pelo app, dentro do plano dele. Quem atrasou a mensalidade só volta a marcar pelo plano depois de pagar.", href: "/clube-de-assinaturas", modulo: true },
      { nome: "Totem de autoatendimento", resolve: "Uma tela no balcão: o cliente avisa que chegou ou marca o próximo horário.", href: "/totem-autoatendimento", modulo: true },
      { nome: "Agente de IA no WhatsApp", resolve: "Responde o cliente no WhatsApp da barbearia e marca, remarca ou cancela o horário na agenda.", href: "/agente-ia-whatsapp", modulo: true },
    ],
  },
  preco: { titulo: "Quanto custa" },
  faq: {
    titulo: "Perguntas sobre agendamento online para barbearia",
    itens: [
      { pergunta: "O cliente precisa baixar um aplicativo para marcar?", resposta: "Não. Ele marca pelo link, no navegador do celular. Só o assinante precisa do app, porque é nele que assina e marca pelo plano. Quem baixa o app também recebe o lembrete do horário." },
      { pergunta: "O cliente consegue marcar de madrugada ou no domingo?", resposta: "Sim. O link e o app ficam abertos a qualquer hora, e só aparecem os horários em que a barbearia atende." },
      { pergunta: "O lembrete diminui a falta?", resposta: "Ajuda: quem recebe o lembrete falta menos. Não acaba com a falta. Ele chega a quem tem o app com as notificações ligadas." },
      { pergunta: "E o cliente que prefere marcar pelo WhatsApp?", resposta: "Você manda o link na conversa e ele marca sozinho. Se quiser, o agente de IA responde no WhatsApp da barbearia e marca direto na agenda. Ele é à parte." },
      { pergunta: "Existe agenda online para barbearia grátis?", resposta: "Existe agenda grátis, mas o BestBarbers não tem versão grátis. Se for testar uma grátis, confira se cada barbeiro tem a agenda dele e se o cliente recebe lembrete." },
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
