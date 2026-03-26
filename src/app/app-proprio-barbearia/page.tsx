import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import {
  Smartphone,
  Palette,
  Download,
  CalendarCheck,
  CreditCard,
  Bell,
  Crown,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Store,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "App Proprio para Barbearia na App Store e Play Store | BestBarbers",
  description:
    "Unico sistema que cria um app exclusivo da sua barbearia, com sua marca, publicado na App Store e Play Store. Seus clientes so veem sua barbearia, sem concorrentes.",
  alternates: {
    canonical: "/app-proprio-barbearia",
  },
  openGraph: {
    title: "App Proprio para Barbearia na App Store e Play Store | BestBarbers",
    description:
      "Unico sistema que cria um app exclusivo da sua barbearia, com sua marca, publicado na App Store e Play Store. Seus clientes so veem sua barbearia, sem concorrentes.",
    url: "https://www.bestbarbers.app/app-proprio-barbearia",
    type: "website",
    locale: "pt_BR",
    siteName: "BestBarbers",
  },
};

const faqItems = [
  {
    question: "O que e o App Proprio personalizado?",
    answer:
      "E um aplicativo exclusivo da sua barbearia, publicado na App Store e Play Store com o nome e a identidade visual do seu negocio. Seus clientes baixam o app da sua barbearia e acessam apenas os servicos do seu estabelecimento, sem ver concorrentes.",
  },
  {
    question:
      "Quanto tempo leva para ter meu App Proprio publicado nas lojas?",
    answer:
      "Apos a assinatura do contrato e envio das informacoes necessarias (logo, cores, dados do negocio), o processo de desenvolvimento e publicacao leva em media 15 a 30 dias uteis, dependendo da aprovacao das lojas (Apple e Google).",
  },
  {
    question: "Posso enviar notificacoes personalizadas para meus clientes?",
    answer:
      "Sim! Com o App Proprio voce pode enviar push notifications personalizadas diretamente para o celular dos seus clientes. Ideal para avisar sobre promocoes, lembrar de agendamentos, comunicar novidades ou reativar clientes inativos.",
  },
];

const faqSchema = {
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

const features = [
  {
    icon: Palette,
    title: "Identidade visual personalizada",
    description:
      "Logo, cores e nome da sua barbearia no app. Seus clientes reconhecem sua marca antes mesmo de abrir.",
  },
  {
    icon: Download,
    title: "Publicacao na App Store e Play Store",
    description:
      'Seu app aparece nas lojas oficiais da Apple e Google. Cliente busca "sua barbearia" e encontra.',
  },
  {
    icon: CalendarCheck,
    title: "Agendamento online integrado",
    description:
      "Seus clientes agendam 24h por dia, escolhem profissional, servico e horario direto no app.",
  },
  {
    icon: Crown,
    title: "Clube de assinaturas no app",
    description:
      "Planos recorrentes com cobranca automatica. Receita previsivel e cliente fidelizado sem esforco.",
  },
  {
    icon: Bell,
    title: "Push notifications personalizadas",
    description:
      "Envie avisos de promocao, lembrete de agendamento e reative clientes inativos direto no celular.",
  },
  {
    icon: CreditCard,
    title: "Pagamento online pelo app",
    description:
      "Pix, cartao de credito e debito. O cliente paga antes ou depois do atendimento, tudo registrado.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Contrato",
    description: "Assine o plano App Exclusivo e envie logo, cores e dados do negocio.",
  },
  {
    step: "02",
    title: "Desenvolvimento",
    description:
      "Nossa equipe constroi o app com a identidade visual da sua barbearia.",
  },
  {
    step: "03",
    title: "Homologacao",
    description:
      "Voce valida o app e solicita ajustes antes da publicacao nas lojas.",
  },
  {
    step: "04",
    title: "Review das Lojas",
    description:
      "Apple e Google analisam o app. Esse processo leva de 3 a 7 dias uteis.",
  },
  {
    step: "05",
    title: "Publicacao",
    description:
      "App publicado e pronto para seus clientes baixarem e agendarem.",
  },
];

const CTA_URL =
  "https://www.bestbarbers.app/form?source=site&desc=[Site]BT-AppProprio";

export default function AppProprioBarbearia() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen overflow-x-hidden max-w-[100vw] w-full">
        <Navbar />

        {/* Breadcrumb */}
        <div className="bg-[#121212] pt-[90px] md:pt-[100px]">
          <div className="container-custom">
            <nav aria-label="Breadcrumb" className="text-xs text-gray-500">
              <ol className="flex items-center gap-1.5">
                <li>
                  <Link
                    href="/"
                    className="hover:text-[#ffaf02] transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li className="text-gray-400">App Proprio para Barbearia</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Hero Section — Dark */}
        <section className="bg-[#121212] pt-8 pb-16 md:pt-12 md:pb-24">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffaf02]/10 text-[#ffaf02] text-xs md:text-sm font-semibold mb-6 border border-[#ffaf02]/20">
                <Smartphone className="w-4 h-4" />
                APP EXCLUSIVO
              </span>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
                App Proprio para Barbearia{" "}
                <span className="text-[#ffaf02]">
                  — Sua Marca na App Store e Play Store
                </span>
              </h1>

              <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-4">
                Seus clientes abrem um app generico para agendar com voce — e veem{" "}
                <strong className="text-white">
                  15 concorrentes na mesma tela
                </strong>
                . Com o App Proprio BestBarbers, eles abrem{" "}
                <strong className="text-[#ffaf02]">O SEU APP</strong>. So sua
                marca. So seus servicos.
              </p>

              <p className="text-sm md:text-base text-gray-400 mb-8">
                <strong className="text-white">1.200+ barbearias</strong> ja tem
                app proprio com BestBarbers.
              </p>

              <Link
                href={CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm md:text-base font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_4px_20px_rgba(255,175,2,0.3)]"
              >
                QUERO UM APP PROPRIO PARA MINHA BARBEARIA
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Why Not Generic — White */}
        <section className="bg-white py-16 md:py-24">
          <div className="container-custom">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#121212] mb-4">
                Por que Ter um App Proprio e Nao Usar um App Generico
              </h2>
              <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">
                A diferenca entre perder clientes para concorrentes e ser a
                unica opcao na tela do seu cliente.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
              {/* Card 1 — Data */}
              <div className="bg-[#121212] rounded-2xl p-6 md:p-8 text-center border border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-[#ffaf02]/10 flex items-center justify-center mx-auto mb-5">
                  <Zap className="w-7 h-7 text-[#ffaf02]" />
                </div>
                <p className="text-3xl md:text-4xl font-extrabold text-[#ffaf02] mb-2">
                  23,1%
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Melhor conversao nas vendas quando o cliente descobre que tera
                  um{" "}
                  <strong className="text-white">
                    app proprio com a marca dele
                  </strong>
                </p>
              </div>

              {/* Card 2 — No competitors */}
              <div className="bg-[#121212] rounded-2xl p-6 md:p-8 text-center border border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-[#ffaf02]/10 flex items-center justify-center mx-auto mb-5">
                  <Store className="w-7 h-7 text-[#ffaf02]" />
                </div>
                <p className="text-lg md:text-xl font-bold text-white mb-2">
                  Sua marca na loja
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Seu app publicado na App Store e Play Store.{" "}
                  <strong className="text-white">
                    Zero concorrentes visiveis
                  </strong>{" "}
                  — o cliente so ve a sua barbearia
                </p>
              </div>

              {/* Card 3 — Push */}
              <div className="bg-[#121212] rounded-2xl p-6 md:p-8 text-center border border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-[#ffaf02]/10 flex items-center justify-center mx-auto mb-5">
                  <Bell className="w-7 h-7 text-[#ffaf02]" />
                </div>
                <p className="text-lg md:text-xl font-bold text-white mb-2">
                  Push para SEUS clientes
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Envie notificacoes direto no celular.{" "}
                  <strong className="text-white">
                    Promocoes, lembretes, reativacao
                  </strong>{" "}
                  — sem depender de algoritmo
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included — Dark */}
        <section className="bg-[#121212] py-16 md:py-24">
          <div className="container-custom">
            <div className="text-center mb-12 md:mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffaf02]/10 text-[#ffaf02] text-xs md:text-sm font-semibold mb-4 border border-[#ffaf02]/20">
                <CheckCircle2 className="w-4 h-4" />
                TUDO INCLUSO
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4">
                O que Vem no App Proprio BestBarbers
              </h2>
              <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
                Cada detalhe pensado para sua barbearia parecer uma franquia de
                milhoes — com o investimento de uma assinatura.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-[#1a1a1a]/90 to-[#1e1e1e]/90 rounded-2xl p-6 border border-gray-800/50 hover:border-[#ffaf02]/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#ffaf02]/10 flex items-center justify-center mb-4 group-hover:bg-[#ffaf02]/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-[#ffaf02]" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Internal Links */}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/clube-de-assinaturas"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#ffaf02] transition-colors"
              >
                Saiba mais sobre o Clube de Assinaturas
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-gray-700">|</span>
              <Link
                href="/agendamento-online"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#ffaf02] transition-colors"
              >
                Veja o Agendamento Online
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-gray-700">|</span>
              <Link
                href="/totem-autoatendimento"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#ffaf02] transition-colors"
              >
                Conhea o Totem de Autoatendimento
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Process Timeline — White */}
        <section className="bg-white py-16 md:py-24">
          <div className="container-custom">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#121212] mb-4">
                De 15 a 30 Dias para Seu App na Loja
              </h2>
              <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">
                Do contrato a publicacao, acompanhamos cada etapa. Voce nao
                precisa entender de tecnologia.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {processSteps.map((step, index) => (
                <div key={index} className="flex gap-4 md:gap-6 mb-8 last:mb-0">
                  {/* Step indicator */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#121212] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#ffaf02] text-xs md:text-sm font-bold">
                        {step.step}
                      </span>
                    </div>
                    {index < processSteps.length - 1 && (
                      <div className="w-px h-full min-h-[24px] bg-gray-200 mt-2" />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="pb-2">
                    <h3 className="text-base md:text-lg font-bold text-[#121212] mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ — Dark */}
        <section className="bg-[#121212] py-16 md:py-24">
          <div className="container-custom">
            <div className="text-center mb-10 md:mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffaf02]/10 text-[#ffaf02] text-xs md:text-sm font-semibold mb-4 border border-[#ffaf02]/20">
                <ShieldCheck className="w-4 h-4" />
                TIRE SUAS DUVIDAS
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-3">
                Perguntas Frequentes sobre App Proprio
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-[#1a1a1a]/90 to-[#1e1e1e]/90 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-gray-800/50 px-5 md:px-8 shadow-2xl divide-y divide-gray-800/30">
                {faqItems.map((item, index) => (
                  <details key={index} className="group" {...(index === 0 ? { open: true } : {})}>
                    <summary className="flex items-center justify-between cursor-pointer py-5 md:py-6 text-left gap-4 list-none [&::-webkit-details-marker]:hidden">
                      <span className="text-sm md:text-base font-medium text-white group-hover:text-[#ffaf02] transition-colors leading-relaxed">
                        {item.question}
                      </span>
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/10 group-open:bg-[#ffaf02]/20 transition-all duration-300">
                        <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#ffaf02] group-open:text-[#ffaf02] group-open:rotate-180 transition-all duration-300" />
                      </div>
                    </summary>
                    <p className="pb-5 md:pb-6 text-sm md:text-[15px] text-gray-400 leading-relaxed pr-12">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA — Dark with yellow accent */}
        <section className="bg-[#0a0a0a] py-16 md:py-24 border-t border-white/5">
          <div className="container-custom text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4">
              Pronto para ter{" "}
              <span className="text-[#ffaf02]">seu proprio app</span>?
            </h2>
            <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto mb-8">
              Pare de dividir tela com concorrentes. Tenha um app exclusivo com
              a cara da sua barbearia na App Store e Play Store.
            </p>
            <Link
              href={CTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm md:text-base font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_4px_20px_rgba(255,175,2,0.3)]"
            >
              QUERO UM APP PROPRIO PARA MINHA BARBEARIA
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-xs text-gray-600 mt-4">
              A partir de R$299/mes no plano App Exclusivo
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
