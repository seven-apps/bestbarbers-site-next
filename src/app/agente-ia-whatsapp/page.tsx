import type { Metadata } from "next";
import Link from "next/link";
import { FeatureCTA } from "@/components/FeatureCTA";
import {
  Bot,
  Sparkles,
  Mic,
  CalendarCheck,
  CalendarClock,
  RefreshCw,
  Crown,
  UserPlus,
  MapPin,
  Clock,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Check,
  X,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

/**
 * Origem dedicada desta LP no Ploomes: "Site - Módulo de IA" (id 120003855).
 * É o default de atribuição do formulário desta página — o ?origin=<id>/UTM da URL sempre vence.
 */
const IA_ORIGIN_ID = 120003855;

/* ------------------------------------------------------------------ */
/*  Metadata                                                          */
/* ------------------------------------------------------------------ */
export const metadata: Metadata = {
  title: "Agente de IA para Barbearia no WhatsApp — 24h | BestBarbers",
  description:
    "Agente de IA que atende no WhatsApp da sua barbearia 24h: agenda, remarca, cancela e entende áudio, integrado à sua agenda. Sem contratar recepcionista.",
  alternates: {
    canonical: "https://www.bestbarbers.app/agente-ia-whatsapp",
  },
  openGraph: {
    title: "Agente de IA para Barbearia no WhatsApp — 24h | BestBarbers",
    description:
      "Um atendente virtual de IA que agenda, remarca e entende áudio direto no WhatsApp da sua barbearia — integrado à sua agenda. 24 horas por dia.",
    url: "https://www.bestbarbers.app/agente-ia-whatsapp",
    siteName: "BestBarbers",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BestBarbers — Agente de IA no WhatsApp para Barbearia",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  FAQ data (used in content + JSON-LD)                              */
/* ------------------------------------------------------------------ */
const faqItems = [
  {
    question: "O agente atende direto no WhatsApp da minha barbearia?",
    answer:
      "Sim. O agente responde os clientes de forma nativa, direto no WhatsApp da sua barbearia. O nosso time ativa o módulo na sua conta e conecta o agente ao seu WhatsApp e à sua agenda — você não precisa mexer em nada.",
  },
  {
    question: "O agente entende áudios enviados pelos clientes?",
    answer:
      "Sim. Muito cliente prefere mandar áudio a digitar. O agente ouve e entende as mensagens de voz, interpreta o pedido em português natural e responde na hora — sem obrigar o cliente a digitar em um menu de números.",
  },
  {
    question: "Ele agenda sozinho, conectado à minha agenda de verdade?",
    answer:
      "Sim. O agente é integrado nativamente à agenda do sistema BestBarbers. Ele consulta em tempo real os horários realmente disponíveis, marca, remarca e cancela — e se o cliente já tiver um horário agendado, ele avisa. Você não corre risco de horário marcado em cima do outro.",
  },
  {
    question: "O agente fecha a assinatura do meu clube pelo WhatsApp?",
    answer:
      "O foco do agente é o agendamento. Sobre o clube, ele explica como funciona quando o cliente pergunta e direciona o cliente para assinar pelo app da sua barbearia — a contratação em si é feita no app, não pela conversa.",
  },
  {
    question: "Preciso contratar uma recepcionista só para o WhatsApp?",
    answer:
      "Não. O objetivo do agente é justamente eliminar essa necessidade. Ele funciona como um atendente virtual completo rodando 24 horas por dia, 7 dias por semana — cadastrando clientes, agendando e tirando dúvidas — enquanto a sua equipe foca em cortar cabelo.",
  },
  {
    question: "O agente de IA já está disponível? Como eu ativo na minha conta?",
    answer:
      "Sim, está disponível para as barbearias BestBarbers. Para ativar, é só falar com o nosso time: liberamos o atendente virtual na sua conta e conectamos ao WhatsApp da sua barbearia e à sua agenda. Clique em qualquer botão desta página para começar.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.bestbarbers.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Agente de IA no WhatsApp",
      item: "https://www.bestbarbers.app/agente-ia-whatsapp",
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  WhatsApp chat mockup (Server Component — CSS-only, sem imagem)    */
/* ------------------------------------------------------------------ */
function WhatsAppChat() {
  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      {/* Glow atrás do celular */}
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[3rem] bg-[#25D366]/15 blur-3xl"
      />

      <div className="relative rounded-[2.2rem] border border-white/10 bg-[#0b141a] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] overflow-hidden animate-float-subtle">
        {/* Header do WhatsApp */}
        <div className="flex items-center gap-3 bg-[#202c33] px-4 py-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#ffaf02] to-[#ffca00] text-[#121212] font-extrabold text-sm">
            BB
            <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0b141a]">
              <Bot className="h-3 w-3 text-[#25D366]" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              Barbearia Premium
            </p>
            <p className="flex items-center gap-1 text-[11px] text-[#25D366]">
              <Sparkles className="h-3 w-3" /> Atendente IA • online agora
            </p>
          </div>
          <div className="flex gap-3 text-white/40">
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span className="h-1 w-1 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Corpo do chat */}
        <div className="space-y-2.5 px-3.5 py-4 text-[13px] leading-snug">
          {/* Cliente */}
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-[#202c33] px-3 py-2 text-gray-100">
              Boa noite! Tem horário amanhã pra fazer corte + barba?
              <span className="mt-1 block text-right text-[10px] text-gray-400">
                23:47
              </span>
            </div>
          </div>

          {/* IA */}
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#005c4b] px-3 py-2 text-white">
              Boa noite! 😊 Tenho sim. Amanhã tenho 14h, 15h30 e 18h com o João.
              Qual fica melhor pra você?
              <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-white/60">
                23:47
                <CheckCircle2 className="h-3 w-3 text-[#53bdeb]" />
              </span>
            </div>
          </div>

          {/* Cliente — áudio */}
          <div className="flex justify-start">
            <div className="flex max-w-[80%] items-center gap-2.5 rounded-2xl rounded-tl-sm bg-[#202c33] px-3 py-2.5 text-gray-100">
              <Mic className="h-4 w-4 flex-shrink-0 text-[#25D366]" />
              <div className="flex items-end gap-[2px]">
                {[6, 11, 8, 14, 9, 16, 7, 12, 6, 13, 8, 10, 6].map((h, i) => (
                  <span
                    key={i}
                    className="w-[2px] rounded-full bg-gray-400"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
              <span className="text-[10px] text-gray-400">0:06</span>
            </div>
          </div>

          {/* IA */}
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#005c4b] px-3 py-2 text-white">
              Perfeito! ✅ Marquei <strong>15h30 com o João</strong> pra amanhã
              (01/08) — corte + barba.
              <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-white/60">
                23:47
                <CheckCircle2 className="h-3 w-3 text-[#53bdeb]" />
              </span>
            </div>
          </div>

          {/* IA — clube */}
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#005c4b] px-3 py-2 text-white">
              Quer conhecer nosso Clube de assinatura? Te explico os planos — e a
              assinatura é rapidinha pelo app da barbearia. Te mando o link? 💈
              <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-white/60">
                23:48
                <CheckCircle2 className="h-3 w-3 text-[#53bdeb]" />
              </span>
            </div>
          </div>

          {/* Cliente */}
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-[#202c33] px-3 py-2 text-gray-100">
              Pode mandar sim 👊
              <span className="mt-1 block text-right text-[10px] text-gray-400">
                23:48
              </span>
            </div>
          </div>

          {/* Digitando */}
          <div className="flex justify-end">
            <div className="flex items-center gap-1 rounded-2xl rounded-tr-sm bg-[#005c4b] px-3.5 py-3">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/70 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/70 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component (Server Component)                                 */
/* ------------------------------------------------------------------ */
export default function AgenteIaWhatsappPage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Navbar />

      <main className="pt-[70px] md:pt-[80px]">
        {/* ====================================================== */}
        {/*  HERO — Dark background                                */}
        {/* ====================================================== */}
        <section className="bg-[#121212] pt-6 md:pt-8 lg:pt-10 pb-16 md:pb-24 lg:pb-28">
          <div className="container-custom">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="mb-8 text-sm text-gray-400 flex items-center gap-1.5"
            >
              <Link href="/" className="hover:text-[#ffaf02] transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-400">Agente de IA no WhatsApp</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center">
              {/* Texto */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#ffaf02]/30 bg-[#ffaf02]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#ffaf02] mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  Novo módulo • Disponível para ativar
                </span>

                <h1 className="text-3xl md:text-4xl lg:text-[2.8rem] font-extrabold text-white leading-[1.12] mb-6">
                  Agente de IA que atende sua barbearia{" "}
                  <span className="text-[#ffaf02]">no WhatsApp, 24 horas por dia</span>
                </h1>

                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                  Um atendente virtual de inteligência artificial que agenda,
                  remarca e cancela horários, entende áudio e cadastra clientes —
                  direto no WhatsApp da sua barbearia e integrado à sua agenda em
                  tempo real. Sem contratar uma recepcionista.
                </p>

                <FeatureCTA
                  originDesc="[Site]BT-IA-Whatsapp"
                  originId={IA_ORIGIN_ID}
                  className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm md:text-base font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
                >
                  QUERO ATIVAR NA MINHA CONTA
                  <ArrowRight className="w-5 h-5" />
                </FeatureCTA>

                {/* Trust chips */}
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                  {[
                    { icon: Clock, label: "24 horas por dia" },
                    { icon: Mic, label: "Entende áudio" },
                    { icon: RefreshCw, label: "Integrado à agenda" },
                  ].map((chip) => (
                    <span
                      key={chip.label}
                      className="flex items-center gap-2 text-sm text-gray-400"
                    >
                      <chip.icon className="w-4 h-4 text-[#ffaf02]" />
                      {chip.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mockup */}
              <div className="flex justify-center lg:justify-end">
                <div>
                  <WhatsAppChat />
                  <p className="mt-5 text-center text-xs text-gray-400 max-w-[340px] mx-auto">
                    Seu agente de IA atendendo um cliente sozinho — entendeu o
                    áudio, agendou às 23h e ainda explicou o Clube.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/*  STATS — White background                              */}
        {/* ====================================================== */}
        <section className="bg-white py-16 md:py-24">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#121212] text-center mb-4">
              Um funcionário que nunca dorme, nunca falta e não te custa salário
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12 md:mb-16 text-base md:text-lg">
              A mesma tecnologia de IA que já move a plataforma usada por mais de
              1.200 barbearias — agora atendendo os seus clientes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto mb-12">
              {[
                {
                  value: "24/7",
                  label: "atendendo, inclusive de madrugada",
                  icon: Clock,
                },
                {
                  value: "Áudio",
                  label: "entende voz e texto do cliente",
                  icon: Mic,
                },
                {
                  value: "1.200+",
                  label: "barbearias já usam o BestBarbers",
                  icon: MessageSquare,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center bg-gray-50 rounded-2xl p-6 md:p-8"
                >
                  <stat.icon className="w-8 h-8 text-[#ffaf02] mx-auto mb-3" />
                  <p className="text-3xl md:text-4xl font-extrabold text-[#121212] mb-1">
                    {stat.value}
                  </p>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            <p className="text-gray-600 text-center max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Enquanto você corta cabelo, dorme ou aproveita o domingo, o agente
              continua trabalhando: recebe a mensagem, entende o pedido, consulta
              a sua agenda e resolve — sem você precisar tocar no celular.
            </p>
          </div>
        </section>

        {/* ====================================================== */}
        {/*  O QUE O AGENTE FAZ — Dark background                  */}
        {/* ====================================================== */}
        <section className="bg-[#121212] py-16 md:py-24">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white text-center mb-4">
              O que o agente de IA faz pela sua barbearia
            </h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12 md:mb-16 text-base">
              Um atendente virtual completo, treinado para atender como um
              profissional e conectado ao seu sistema.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: CalendarCheck,
                  title: "Agenda, remarca e cancela",
                  description:
                    "O cliente pede em português natural e o agente marca, remarca ou cancela o horário na hora — sem menu de números, sem “digite 1 para agendar”.",
                },
                {
                  icon: Mic,
                  title: "Entende áudio do cliente",
                  description:
                    "O cliente mandou um áudio às 23h? O agente ouve, entende o que ele quer e responde. Nada de “não consigo ouvir agora”.",
                },
                {
                  icon: RefreshCw,
                  title: "Integrado à agenda em tempo real",
                  description:
                    "Ele consulta os horários realmente disponíveis no seu sistema. Se o cliente já tem um horário marcado, o agente avisa. Zero conflito de agenda.",
                },
                {
                  icon: Crown,
                  title: "Explica o seu clube",
                  description:
                    "Quando o cliente pergunta sobre a assinatura, o agente explica como funciona o seu clube e direciona ele para assinar pelo app da barbearia.",
                },
                {
                  icon: UserPlus,
                  title: "Cadastra novos clientes",
                  description:
                    "Cliente novo chamou no WhatsApp? O agente já faz o cadastro dele no sistema durante a conversa, sem trabalho manual pra você.",
                },
                {
                  icon: MapPin,
                  title: "Responde sobre a barbearia",
                  description:
                    "Endereço, horário de funcionamento, serviços, como funciona o espaço — o agente tira as dúvidas do cliente com informação completa.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:border-[#ffaf02]/30 transition-colors"
                >
                  <feature.icon className="w-8 h-8 text-[#ffaf02] mb-4" />
                  <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/*  VEJA O AGENTE TRABALHANDO — White background          */}
        {/* ====================================================== */}
        <section className="bg-white py-16 md:py-24">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#121212] text-center mb-4">
              Veja o agente resolvendo sozinho
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12 md:mb-16 text-base md:text-lg">
              Três situações que acontecem todos os dias no WhatsApp da sua
              barbearia — e como o agente resolve cada uma.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  tag: "Agendou por áudio",
                  client: { type: "audio" as const },
                  ai: "Fechado! Marquei quinta às 16h com o Léo. Te espero por aqui 💈",
                },
                {
                  tag: "Já tinha horário",
                  client: {
                    type: "text" as const,
                    text: "Quero marcar sexta 10h",
                  },
                  ai: "Você já tem um horário marcado na sexta às 10h com o João 👍 Quer manter, remarcar ou cancelar?",
                },
                {
                  tag: "Explicou o clube",
                  client: {
                    type: "text" as const,
                    text: "Como funciona a assinatura de vocês?",
                  },
                  ai: "Te explico rapidinho como funciona o nosso Clube 💈 A assinatura você faz direto pelo app da barbearia — quer que eu te mande o link?",
                },
              ].map((scn) => (
                <div
                  key={scn.tag}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-5 md:p-6"
                >
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#005c4b]/10 px-3 py-1 text-xs font-bold text-[#005c4b] mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    {scn.tag}
                  </span>

                  <div className="space-y-2.5 text-[13px] leading-snug">
                    {/* Cliente */}
                    <div className="flex justify-start">
                      {scn.client.type === "audio" ? (
                        <div className="flex items-center gap-2.5 rounded-2xl rounded-tl-sm bg-white border border-gray-200 px-3 py-2.5 text-gray-700">
                          <Mic className="h-4 w-4 flex-shrink-0 text-[#25D366]" />
                          <div className="flex items-end gap-[2px]">
                            {[6, 11, 8, 14, 9, 15, 7, 12, 6].map((h, i) => (
                              <span
                                key={i}
                                className="w-[2px] rounded-full bg-gray-300"
                                style={{ height: `${h}px` }}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400">
                            0:08
                          </span>
                        </div>
                      ) : (
                        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white border border-gray-200 px-3 py-2 text-gray-700">
                          {scn.client.text}
                        </div>
                      )}
                    </div>
                    {/* IA */}
                    <div className="flex justify-end">
                      <div className="max-w-[90%] rounded-2xl rounded-tr-sm bg-[#005c4b] px-3 py-2 text-white">
                        {scn.ai}
                        <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-white/60">
                          <CheckCircle2 className="h-3 w-3 text-[#53bdeb]" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/*  DIFERENCIAL — Dark background                         */}
        {/* ====================================================== */}
        <section className="bg-[#121212] py-16 md:py-24">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white text-center mb-4">
              Esqueça o robô de “digite 1 para agendar”
            </h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12 md:mb-16 text-base">
              A diferença entre um robô de menuzinho e um agente de IA de verdade
              é o cliente perceber — ou não — que está falando com uma máquina.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
              {/* Chatbot comum */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                <h3 className="text-lg md:text-xl font-bold text-gray-300 mb-6">
                  Robô de menu comum
                </h3>
                <ul className="space-y-4">
                  {[
                    "“Digite 1 para agendar, 2 para cancelar…”",
                    "Não entende áudio — pede pra digitar tudo",
                    "Não conhece a sua agenda de verdade",
                    "Trava quando o cliente foge do script",
                    "Cliente percebe que é robô e desiste",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-gray-400 text-sm md:text-base"
                    >
                      <X className="w-5 h-5 text-red-400/70 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Agente BestBarbers */}
              <div className="rounded-2xl border border-[#ffaf02]/30 bg-[#ffaf02]/[0.06] p-6 md:p-8">
                <h3 className="flex items-center gap-2 text-lg md:text-xl font-bold text-[#ffaf02] mb-6">
                  <Bot className="w-5 h-5" />
                  Agente de IA BestBarbers
                </h3>
                <ul className="space-y-4">
                  {[
                    "Conversa em português natural, como uma pessoa",
                    "Ouve e entende os áudios do cliente",
                    "Integrado à sua agenda em tempo real",
                    "Entende o pedido mesmo fora do padrão",
                    "Atende bem e o cliente sai com o horário marcado",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-gray-200 text-sm md:text-base"
                    >
                      <Check className="w-5 h-5 text-[#25D366] mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/*  DOR — White background                                */}
        {/* ====================================================== */}
        <section className="bg-white py-16 md:py-24">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#121212] text-center mb-4">
                Quantos clientes você perde enquanto está de tesoura na mão?
              </h2>
              <p className="text-gray-600 text-center mb-10 md:mb-14 text-base md:text-lg">
                O cliente não espera. Se ninguém responde, ele agenda em outro
                lugar — e você nem fica sabendo que ele existiu.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  "Mensagem chega às 23h, você só vê às 8h — ele já marcou na barbearia do lado",
                  "Você para no meio de um corte pra responder “tem horário?” e quebra o ritmo do atendimento",
                  "Três clientes chamam ao mesmo tempo e você não dá conta de responder todos",
                  "Domingo, feriado, madrugada: WhatsApp mudo é agenda vazia na semana seguinte",
                ].map((pain) => (
                  <div
                    key={pain}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#ffaf02] mt-0.5 flex-shrink-0" />
                    <p className="text-sm md:text-base leading-relaxed">
                      {pain}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-10">
                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  Com o agente de IA, cada uma dessas mensagens vira um{" "}
                  <strong className="text-[#121212]">horário marcado</strong> — na
                  hora, a qualquer hora. Você para de perder cliente por
                  demora e a sua equipe volta a focar no que dá dinheiro:
                  atender bem quem está na cadeira.
                </p>
              </div>

              <div className="text-center">
                <FeatureCTA
                  originDesc="[Site]BT-IA-Whatsapp"
                  originId={IA_ORIGIN_ID}
                  className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm md:text-base font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
                >
                  QUERO ATIVAR NA MINHA CONTA
                  <ArrowRight className="w-5 h-5" />
                </FeatureCTA>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/*  COMO ATIVAR — Dark background                         */}
        {/* ====================================================== */}
        <section className="bg-[#121212] py-16 md:py-24">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white text-center mb-4">
              Como ativar na sua barbearia
            </h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12 md:mb-16 text-base">
              Sem instalação complicada. O nosso time deixa tudo pronto pra você.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "1",
                  icon: MessageSquare,
                  title: "Fale com o nosso time",
                  description:
                    "Clique em qualquer botão desta página e conte sobre a sua barbearia. Em poucos minutos entendemos o seu momento.",
                },
                {
                  step: "2",
                  icon: Zap,
                  title: "Liberamos o agente",
                  description:
                    "Ativamos o atendente virtual na sua conta BestBarbers e conectamos ao WhatsApp da sua barbearia e à sua agenda.",
                },
                {
                  step: "3",
                  icon: CalendarClock,
                  title: "Ele começa a atender",
                  description:
                    "A partir daí, o agente responde seus clientes 24 horas por dia e agenda no automático, direto no seu WhatsApp.",
                },
              ].map((step) => (
                <div
                  key={step.step}
                  className="relative bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8"
                >
                  <span className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#ffaf02] text-[#121212] font-extrabold text-sm">
                    {step.step}
                  </span>
                  <step.icon className="w-8 h-8 text-[#ffaf02] mb-4 mt-2" />
                  <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/*  FAQ — White background                                */}
        {/* ====================================================== */}
        <section className="bg-white py-16 md:py-24">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#121212] text-center mb-10 md:mb-14">
                Perguntas Frequentes sobre o Agente de IA
              </h2>

              <div className="space-y-6">
                {faqItems.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-2xl p-6 md:p-8"
                  >
                    <h3 className="text-base md:text-lg font-bold text-[#121212] mb-3">
                      {item.question}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/*  INTERNAL LINKS — Dark background                      */}
        {/* ====================================================== */}
        <section className="bg-[#121212] py-16 md:py-24">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-4">
              O agente é a ponta de uma plataforma completa
            </h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-10 md:mb-14 text-base">
              Ele conversa com o resto do BestBarbers — a mesma agenda, o mesmo
              clube, o mesmo sistema. Conheça o que mais transforma a sua
              barbearia:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
              {[
                {
                  href: "/agendamento-online",
                  title: "Agendamento Online",
                  desc: "A agenda 24h onde o agente marca os horários",
                },
                {
                  href: "/clube-de-assinaturas",
                  title: "Clube de Assinaturas",
                  desc: "Receita recorrente que o agente ajuda a divulgar",
                },
                {
                  href: "/app-proprio-barbearia",
                  title: "App Próprio",
                  desc: "Seu app na App Store e Play Store com sua marca",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#ffaf02]/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#ffaf02] transition-colors flex items-center gap-2">
                    {link.title}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-gray-400 text-sm">{link.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/*  FINAL CTA — Dark background                           */}
        {/* ====================================================== */}
        <section className="bg-[#121212] pb-20 md:pb-28">
          <div className="container-custom">
            <div className="rounded-3xl border border-[#ffaf02]/20 bg-gradient-to-b from-[#ffaf02]/[0.08] to-transparent px-6 py-14 md:px-12 md:py-16 text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffaf02]/10">
                <Bot className="h-7 w-7 text-[#ffaf02]" />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4">
                Ative o agente de IA na sua barbearia
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto mb-8 text-base md:text-lg">
                Deixe a inteligência artificial atender e agendar 24 horas por dia
                no seu WhatsApp — enquanto você cuida do que só você faz.
              </p>
              <FeatureCTA
                originDesc="[Site]BT-IA-Whatsapp"
                originId={IA_ORIGIN_ID}
                className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm md:text-base font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
              >
                QUERO ATIVAR NA MINHA CONTA
                <ArrowRight className="w-5 h-5" />
              </FeatureCTA>
              <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Disponível para todas as barbearias BestBarbers
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
