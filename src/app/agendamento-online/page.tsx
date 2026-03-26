import type { Metadata } from "next";
import Link from "next/link";
import { FeatureCTA } from "@/components/FeatureCTA";
import {
  Calendar,
  Clock,
  Link2,
  Smartphone,
  Bell,
  Users,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

/* ------------------------------------------------------------------ */
/*  Metadata                                                          */
/* ------------------------------------------------------------------ */
export const metadata: Metadata = {
  title: "Agendamento Online para Barbearia — 24h/7 dias | BestBarbers",
  description:
    "Agendamento online para barbearia que funciona 24h. 6 milhões de agendamentos/mês. Chega de perder cliente no WhatsApp. Link personalizado + app + lembretes automáticos.",
  alternates: {
    canonical: "https://www.bestbarbers.app/agendamento-online",
  },
  openGraph: {
    title: "Agendamento Online para Barbearia — 24h/7 dias | BestBarbers",
    description:
      "Agendamento online para barbearia que funciona 24h. 6 milhões de agendamentos/mês. Chega de perder cliente no WhatsApp.",
    url: "https://www.bestbarbers.app/agendamento-online",
    siteName: "BestBarbers",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BestBarbers — Agendamento Online para Barbearia",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  FAQ data (used in content + JSON-LD)                              */
/* ------------------------------------------------------------------ */
const faqItems = [
  {
    question:
      "O agendamento online funciona mesmo fora do horário comercial?",
    answer:
      "Sim. O sistema fica disponível 24 horas por dia, 7 dias por semana. Seus clientes podem agendar de madrugada, no fim de semana ou em feriados — sem depender de ninguém responder no WhatsApp.",
  },
  {
    question:
      "Meus clientes precisam baixar um aplicativo para agendar?",
    answer:
      "Não obrigatoriamente. Você recebe um link personalizado (ex: bestbarbers.app/suabarbearia) que pode ser compartilhado em qualquer lugar — Instagram, WhatsApp, Google. Além disso, com o plano App Exclusivo, sua barbearia tem um app próprio na App Store e Play Store com agendamento integrado.",
  },
  {
    question:
      "Como o sistema reduz faltas e no-show dos clientes?",
    answer:
      "O BestBarbers envia lembretes automáticos por push notification e SMS antes do horário agendado. Barbearias que usam o recurso reportam redução de até 40% nos no-shows. Você também pode configurar políticas de cancelamento e bloqueio de clientes recorrentes.",
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

/* ------------------------------------------------------------------ */
/*  Page component (Server Component)                                 */
/* ------------------------------------------------------------------ */
export default function AgendamentoOnlinePage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Navbar />

      <main className="pt-[70px] md:pt-[80px]">
        {/* ====================================================== */}
        {/*  HERO — Dark background                                */}
        {/* ====================================================== */}
        <section className="bg-[#121212] py-16 md:py-24 lg:py-32">
          <div className="container-custom">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="mb-8 text-sm text-gray-500 flex items-center gap-1.5"
            >
              <Link
                href="/"
                className="hover:text-[#ffaf02] transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-400">Agendamento Online</span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-8">
                Agendamento Online para Barbearia{" "}
                <span className="text-[#ffaf02]">
                  — Seus Clientes Agendam 24h, 7 Dias por Semana
                </span>
              </h1>

              {/* VOC hook */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
                <div className="flex items-start gap-3 mb-4">
                  <MessageSquare className="w-5 h-5 text-[#ffaf02] mt-1 flex-shrink-0" />
                  <div className="space-y-2 text-gray-300 text-base md:text-lg leading-relaxed italic">
                    <p>&quot;Tem horário?&quot;</p>
                    <p>&quot;15h pode?&quot;</p>
                    <p>&quot;Não dá.&quot;</p>
                    <p>&quot;Deixa pra lá.&quot;</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  Essa conversa acontece{" "}
                  <strong className="text-white">30 vezes por dia</strong> no
                  WhatsApp de barbearias sem agendamento online. São{" "}
                  <strong className="text-white">
                    2+ horas do seu dia
                  </strong>{" "}
                  respondendo mensagem — enquanto poderia estar cortando cabelo
                  ou gerenciando o negócio.
                </p>
              </div>

              <FeatureCTA
                originDesc="[Site]BT-Agendamento"
                className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm md:text-base font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
              >
                QUERO AGENDAMENTO ONLINE NA MINHA BARBEARIA
                <ArrowRight className="w-5 h-5" />
              </FeatureCTA>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/*  STATS — White background                              */}
        {/* ====================================================== */}
        <section className="bg-white py-16 md:py-24">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#121212] text-center mb-4">
              6 Milhões de Agendamentos por Mês no BestBarbers
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12 md:mb-16 text-base md:text-lg">
              Sem WhatsApp. Sem ligações. Sem perder cliente.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto mb-12">
              {[
                {
                  value: "6M+",
                  label: "agendamentos por mês",
                  icon: Calendar,
                },
                {
                  value: "24/7",
                  label: "disponível para seus clientes",
                  icon: Clock,
                },
                {
                  value: "1.200+",
                  label: "barbearias confiam",
                  icon: Users,
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
              O agendamento online do BestBarbers substitui o WhatsApp, as
              ligações e as anotações em papel. Seu cliente escolhe profissional,
              serviço, data e horário — tudo em menos de 30 segundos. Você só
              precisa abrir a agenda e atender.
            </p>
          </div>
        </section>

        {/* ====================================================== */}
        {/*  COMO FUNCIONA — Dark background                       */}
        {/* ====================================================== */}
        <section className="bg-[#121212] py-16 md:py-24">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white text-center mb-4">
              Como Funciona o Agendamento Online
            </h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12 md:mb-16 text-base">
              Tudo o que você precisa para nunca mais perder cliente por falta de
              resposta.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: Link2,
                  title: "Link Personalizado Compartilhável",
                  description:
                    "Sua barbearia recebe um link único (ex: bestbarbers.app/suabarbearia). Coloque no Instagram, no WhatsApp, no Google — o cliente clica e agenda direto, sem precisar baixar nada.",
                },
                {
                  icon: Smartphone,
                  title: "App Próprio com Agendamento Integrado",
                  description:
                    "No plano App Exclusivo, sua barbearia tem um app na App Store e Play Store com a sua marca. O cliente baixa, agenda, recebe lembretes e faz tudo pelo celular.",
                },
                {
                  icon: Bell,
                  title: "Lembretes Automáticos (Reduz No-Show)",
                  description:
                    "O sistema envia lembretes automáticos por push notification antes do horário agendado. Menos faltas, menos buraco na agenda, mais faturamento previsível.",
                },
                {
                  icon: Users,
                  title: "Gestão de Agenda por Profissional",
                  description:
                    "Cada barbeiro tem sua própria agenda. O cliente escolhe o profissional que preferir e vê apenas os horários disponíveis daquele barbeiro — sem conflito.",
                },
                {
                  icon: ShieldCheck,
                  title: "Bloqueio de Horários e Folgas",
                  description:
                    "Barbeiro de folga? Reunião? Almoço? Bloqueie horários individualmente. A agenda atualiza em tempo real e o cliente só vê o que está disponível.",
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
        {/*  PAIN SECTION — White background                       */}
        {/* ====================================================== */}
        <section className="bg-white py-16 md:py-24">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#121212] text-center mb-4">
                Chega de Perder Cliente no WhatsApp
              </h2>
              <p className="text-gray-600 text-center mb-10 md:mb-14 text-base md:text-lg">
                O dono de barbearia que depende do WhatsApp para agendar
                <strong> perde clientes todos os dias</strong> — e muitas vezes
                nem percebe.
              </p>

              <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-10">
                <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
                  Em pesquisa com donos de barbearia, a frase mais repetida foi:
                </p>
                <blockquote className="border-l-4 border-[#ffaf02] pl-4 md:pl-6">
                  <p className="text-[#121212] font-semibold text-lg md:text-xl italic">
                    &quot;Perco 1, 2, 3 clientes por dia porque não consigo
                    responder a tempo.&quot;
                  </p>
                </blockquote>
                <p className="text-gray-500 text-sm mt-4">
                  21 menções dessa dor em entrevistas com donos de barbearia (FDO
                  — Field Data Observation).
                </p>
              </div>

              <div className="space-y-4 mb-10">
                {[
                  "Cliente manda mensagem às 22h — você só vê às 8h, ele já agendou em outro lugar",
                  "3 clientes mandam ao mesmo tempo — você demora pra responder e perde 2",
                  "Barbeiro desmarca e você precisa avisar 1 por 1 no WhatsApp",
                  "Feriado, domingo, madrugada — sem agendamento, sem faturamento",
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

              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8">
                Com o agendamento online do BestBarbers, seu cliente agenda
                sozinho — a qualquer hora, de qualquer lugar. Você para de
                perder tempo e para de perder dinheiro.
              </p>

              <div className="text-center">
                <FeatureCTA
                  originDesc="[Site]BT-Agendamento"
                  className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm md:text-base font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
                >
                  QUERO AGENDAMENTO ONLINE NA MINHA BARBEARIA
                  <ArrowRight className="w-5 h-5" />
                </FeatureCTA>
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
              O Agendamento é Só o Começo
            </h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-10 md:mb-14 text-base">
              O BestBarbers é uma plataforma completa. Explore as outras
              funcionalidades que transformam sua barbearia:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
              {[
                {
                  href: "/clube-de-assinaturas",
                  title: "Clube de Assinaturas",
                  desc: "Receita recorrente e fidelização automática",
                },
                {
                  href: "/app-proprio-barbearia",
                  title: "App Próprio",
                  desc: "Seu app na App Store e Play Store com sua marca",
                },
                {
                  href: "/nota-fiscal-barbearia",
                  title: "Nota Fiscal Automática",
                  desc: "NFS-e emitida automaticamente a cada atendimento",
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
        {/*  FAQ — White background                                */}
        {/* ====================================================== */}
        <section className="bg-white py-16 md:py-24">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#121212] text-center mb-10 md:mb-14">
                Perguntas Frequentes sobre Agendamento
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
        {/*  FINAL CTA — Dark background                           */}
        {/* ====================================================== */}
        <section className="bg-[#121212] py-16 md:py-24">
          <div className="container-custom text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
              Pare de Perder Clientes por Falta de Resposta
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8 text-base">
              Configure o agendamento online da sua barbearia em menos de 24
              horas e comece a receber agendamentos automaticamente.
            </p>
            <FeatureCTA
              originDesc="[Site]BT-Agendamento"
              className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm md:text-base font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              QUERO AGENDAMENTO ONLINE NA MINHA BARBEARIA
              <ArrowRight className="w-5 h-5" />
            </FeatureCTA>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
