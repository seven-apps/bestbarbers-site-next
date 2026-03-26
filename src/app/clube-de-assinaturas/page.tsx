import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FeatureCTA } from "@/components/FeatureCTA";
import {
  ArrowRight,
  ChevronRight,
  Repeat,
  ShieldCheck,
  Ban,
  BarChart3,
  Smartphone,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle2,
  Quote,
} from "lucide-react";

/* ─── SEO Metadata ─── */
export const metadata: Metadata = {
  title:
    "Clube de Assinaturas para Barbearia — Receita Recorrente | BestBarbers",
  description:
    "Crie planos de assinatura na sua barbearia e gere receita previsivel. 51.000+ assinantes ativos. De R$15K para R$31K/mes. Sistema completo com cobranca automatica.",
  alternates: {
    canonical: "/clube-de-assinaturas",
  },
  openGraph: {
    title:
      "Clube de Assinaturas para Barbearia — Receita Recorrente | BestBarbers",
    description:
      "Crie planos de assinatura na sua barbearia e gere receita previsivel. 51.000+ assinantes ativos. De R$15K para R$31K/mes.",
    url: "https://www.bestbarbers.app/clube-de-assinaturas",
    type: "website",
    locale: "pt_BR",
    siteName: "BestBarbers",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Clube de Assinaturas BestBarbers — Receita recorrente para barbearias",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clube de Assinaturas para Barbearia | BestBarbers",
    description:
      "Crie planos de assinatura na sua barbearia e gere receita previsivel. 51.000+ assinantes ativos.",
    images: ["/og-image.jpg"],
  },
};

/* ─── FAQ data (used for rendering + JSON-LD) ─── */
const faqItems = [
  {
    question: "Quanto tempo leva para montar o clube de assinaturas?",
    answer:
      "No mesmo dia. Voce cria os planos, define precos e ja pode comecar a cadastrar assinantes. O sistema cuida da cobranca automatica, bloqueio de inadimplentes e relatorios.",
  },
  {
    question: "E se o assinante quiser trocar de plano?",
    answer:
      "O proprio cliente troca de plano direto pelo app, sem precisar falar com ninguem. O sistema calcula o pro-rata automaticamente e ajusta a proxima cobranca.",
  },
  {
    question:
      "Posso ter planos diferentes (limitado e ilimitado) ao mesmo tempo?",
    answer:
      "Sim! Voce pode criar quantos planos quiser. Exemplos comuns: plano basico (4 cortes/mes), plano premium (ilimitado), plano VIP (ilimitado + barba). Cada plano com preco e servicos diferentes.",
  },
  {
    question: "Como funciona a cobranca automatica?",
    answer:
      "O sistema cobra automaticamente no dia de vencimento via cartao de credito, Pix ou boleto. Se o pagamento falhar, o cliente recebe lembretes automaticos. Apos o prazo de tolerancia, o agendamento e bloqueado ate a regularizacao.",
  },
];

/* ─── JSON-LD FAQPage schema ─── */
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

/* ─── Page Component ─── */
export default function ClubeDeAssinaturasPage() {
  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="min-h-screen">
        <Navbar />

        {/* ════════════════════════════════════════════
            HERO — Dark section
            ════════════════════════════════════════════ */}
        <section className="bg-[#121212] pt-28 md:pt-36 pb-16 md:pb-24">
          <div className="container-custom">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs text-gray-500 mb-8"
            >
              <Link
                href="/"
                className="hover:text-[#ffaf02] transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-300">Clube de Assinaturas</span>
            </nav>

            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffaf02]/10 text-[#ffaf02] text-xs font-semibold mb-6 border border-[#ffaf02]/20">
                <Repeat className="w-4 h-4" />
                RECEITA RECORRENTE
              </span>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
                Clube de Assinaturas para Barbearia{" "}
                <span className="text-gradient-primary">
                  — Receita Recorrente no Automatico
                </span>
              </h1>

              <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-4">
                <span className="text-[#ffaf02] font-semibold">
                  &ldquo;No fim do mes nunca sobra nada&rdquo;
                </span>{" "}
                — Essa frase apareceu em 47 conversas com donos de barbearia.
                Se voce se identifica, o clube de assinaturas e a resposta.
              </p>

              <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-8">
                Com o clube, voce sabe no dia 1 do mes quanto vai faturar.
                Seus clientes pagam automaticamente, voltam com mais
                frequencia e gastam 2.8x mais por ano. Sem planilha, sem
                cobrar no WhatsApp, sem surpresas.
              </p>

              {/* Stat pills */}
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { label: "51.000+ assinantes ativos", icon: Users },
                  { label: "2.8x mais receita/cliente", icon: TrendingUp },
                  { label: "2.1 visitas/mes (media)", icon: Repeat },
                ].map(({ label, icon: Icon }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs md:text-sm text-gray-300"
                  >
                    <Icon className="w-4 h-4 text-[#ffaf02]" />
                    {label}
                  </span>
                ))}
              </div>

              <FeatureCTA
                originDesc="[Site]BT-Clube"
                className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_4px_20px_rgba(255,175,2,0.3)]"
              >
                QUERO VER O POTENCIAL DA MINHA BARBEARIA
                <ArrowRight className="w-4 h-4" />
              </FeatureCTA>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            WHY — White section
            ════════════════════════════════════════════ */}
        <section className="bg-white py-16 md:py-24">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#121212] mb-4 text-center">
              Por que Barbearias com Clube Faturam{" "}
              <span style={{ color: "#ffaf02" }}>2x Mais</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base text-center max-w-2xl mx-auto mb-12 md:mb-16">
              Nao e teoria. Sao numeros reais de barbearias que usam o
              BestBarbers hoje.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: TrendingUp,
                  stat: "R$15.892 → R$31.690/mes",
                  title: "Barbearia de 4 cadeiras",
                  desc: "Mesmas 4 cadeiras, mesma equipe. A unica mudanca foi criar o clube de assinaturas. Dobraram o faturamento em 6 meses.",
                },
                {
                  icon: DollarSign,
                  stat: "R$1.536/ano vs R$540 avulso",
                  title: "Assinante gasta 2.8x mais",
                  desc: "O cliente avulso vem quando lembra. O assinante vem porque ja pagou — e aproveita para fazer barba, sobrancelha, produtos.",
                },
                {
                  icon: Repeat,
                  stat: "2.1 visitas/mes",
                  title: "Frequencia media do assinante",
                  desc: "Cliente avulso vem a cada 45 dias. Assinante vem a cada 14 dias. Mais visitas = mais servicos adicionais = mais receita.",
                },
                {
                  icon: Users,
                  stat: "51.000+",
                  title: "Assinantes ativos na plataforma",
                  desc: "Mais de 51 mil clientes ja usam o clube de assinaturas no BestBarbers. O modelo funciona — e os numeros provam.",
                },
              ].map(({ icon: Icon, stat, title, desc }) => (
                <div
                  key={title}
                  className="bg-[#f8f8f8] rounded-2xl p-6 md:p-8 border border-gray-100 hover:border-[#ffaf02]/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#ffaf02]/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#ffaf02]" />
                    </div>
                    <span className="text-lg md:text-xl font-extrabold text-[#121212]">
                      {stat}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#121212] mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            HOW IT WORKS — Dark section
            ════════════════════════════════════════════ */}
        <section className="bg-[#121212] py-16 md:py-24">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4 text-center">
              Como Funciona o Clube de Assinaturas{" "}
              <span className="text-gradient-primary">no BestBarbers</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base text-center max-w-2xl mx-auto mb-12 md:mb-16">
              Tudo automatizado. Voce configura uma vez e o sistema cuida
              do resto.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: Smartphone,
                  title: "Crie planos flexiveis",
                  desc: "Planos limitados (4 cortes/mes) ou ilimitados. Defina servicos, precos e regras de cada plano. Mude quando quiser.",
                },
                {
                  icon: Repeat,
                  title: "Cobranca automatica",
                  desc: "Cartao, Pix ou boleto. O sistema cobra no vencimento, envia lembretes e registra tudo. Zero inadimplencia manual.",
                },
                {
                  icon: Ban,
                  title: "Bloqueio automatico de inadimplentes",
                  desc: "Se o pagamento nao cai, o agendamento e bloqueado automaticamente. Sem conversa constrangedora com o cliente.",
                },
                {
                  icon: BarChart3,
                  title: "Relatorios de churn, frequencia e receita",
                  desc: "Saiba quem cancelou, quem nunca vem e quanto entra por mes. Dados reais para tomar decisao, nao achismo.",
                },
                {
                  icon: ShieldCheck,
                  title: "Troca de plano direto pelo app",
                  desc: "O cliente muda de plano sozinho, sem te ligar. Upgrade, downgrade, cancelamento — tudo pelo app com pro-rata automatico.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#ffaf02]/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#ffaf02]/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-[#ffaf02]" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Mid-page CTA */}
            <div className="text-center mt-12">
              <FeatureCTA
                originDesc="[Site]BT-Clube"
                className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_4px_20px_rgba(255,175,2,0.3)]"
              >
                QUERO VER O POTENCIAL DA MINHA BARBEARIA
                <ArrowRight className="w-4 h-4" />
              </FeatureCTA>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            OBJECTIONS — White section
            ════════════════════════════════════════════ */}
        <section className="bg-white py-16 md:py-24">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#121212] mb-4 text-center">
              Objecoes Respondidas
            </h2>
            <p className="text-gray-500 text-sm md:text-base text-center max-w-2xl mx-auto mb-12 md:mb-16">
              As 3 duvidas que todo dono de barbearia tem antes de criar o
              clube — respondidas com dados.
            </p>

            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Objection 1 */}
              <div className="bg-[#f8f8f8] rounded-2xl p-6 md:p-8 border border-gray-100">
                <p className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-2">
                  Objecao
                </p>
                <p className="text-base md:text-lg font-bold text-[#121212] mb-3">
                  &ldquo;Cliente vai vir todos os dias e nao vai
                  compensar&rdquo;
                </p>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <strong className="text-[#121212]">Dado real:</strong>{" "}
                      A media de frequencia dos assinantes e de{" "}
                      <strong className="text-[#121212]">
                        2.1 visitas por mes
                      </strong>
                      . Ninguem vem todo dia. O medo e natural, mas os
                      numeros nao mentem — em 51.000+ assinantes, a media se
                      mantem estavel.
                    </p>
                  </div>
                </div>
              </div>

              {/* Objection 2 */}
              <div className="bg-[#f8f8f8] rounded-2xl p-6 md:p-8 border border-gray-100">
                <p className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-2">
                  Objecao
                </p>
                <p className="text-base md:text-lg font-bold text-[#121212] mb-3">
                  &ldquo;Barbeiro ganha menos na assinatura&rdquo;
                </p>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <strong className="text-[#121212]">Dado real:</strong>{" "}
                      Barbeiro que atende so avulso fatura em media{" "}
                      <strong className="text-[#121212]">
                        R$2.625/mes
                      </strong>
                      . Barbeiro com assinantes fatura{" "}
                      <strong className="text-[#121212]">
                        R$4.805/mes
                      </strong>
                      . Isso e{" "}
                      <span
                        className="font-extrabold"
                        style={{ color: "#ffaf02" }}
                      >
                        83% MAIS
                      </span>
                      . Assinante volta mais, faz mais servicos e o
                      profissional tem agenda cheia garantida.
                    </p>
                  </div>
                </div>
              </div>

              {/* Objection 3 */}
              <div className="bg-[#f8f8f8] rounded-2xl p-6 md:p-8 border border-gray-100">
                <p className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-2">
                  Objecao
                </p>
                <p className="text-base md:text-lg font-bold text-[#121212] mb-3">
                  &ldquo;Barbearia por assinatura e dar desconto&rdquo;
                </p>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <strong className="text-[#121212]">Dado real:</strong>{" "}
                      Cliente avulso gasta em media{" "}
                      <strong className="text-[#121212]">
                        R$360/ano
                      </strong>
                      . Assinante gasta{" "}
                      <strong className="text-[#121212]">
                        R$900/ano
                      </strong>
                      . Isso e{" "}
                      <span
                        className="font-extrabold"
                        style={{ color: "#ffaf02" }}
                      >
                        2.5x MAIS
                      </span>
                      . O desconto no unitario e uma ilusao — o LTV (valor
                      no tempo) e drasticamente maior na assinatura.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            CASE STUDIES — Dark section
            ════════════════════════════════════════════ */}
        <section className="bg-[#121212] py-16 md:py-24">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4 text-center">
              Casos Reais
            </h2>
            <p className="text-gray-400 text-sm md:text-base text-center max-w-2xl mx-auto mb-12 md:mb-16">
              Barbearias reais usando o clube de assinaturas do BestBarbers.
              Numeros reais, nao projecoes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  name: "Barbearia com 4 cadeiras",
                  highlight: "R$31.690/mes",
                  details: [
                    "4 cadeiras",
                    "353 assinantes",
                    "De R$15.892 para R$31.690/mes",
                  ],
                  quote:
                    "Dobramos o faturamento com as mesmas 4 cadeiras. O clube mudou tudo.",
                },
                {
                  name: "Rede com 6 unidades",
                  highlight: "R$176K/mes",
                  details: [
                    "6 unidades",
                    "1.000 assinantes",
                    "R$176K/mes so no clube",
                  ],
                  quote:
                    "O clube de assinaturas e o coracao da operacao. Receita previsivel em 6 lojas.",
                },
                {
                  name: "Barbearia single-unit",
                  highlight: "700+ assinantes",
                  details: [
                    "Single-unit",
                    "700+ assinantes",
                    "Maior clube single-unit do Brasil",
                  ],
                  quote:
                    "Uma unica loja com 700 assinantes. Prova que nao precisa de rede para escalar.",
                },
              ].map(({ name, highlight, details, quote }) => (
                <div
                  key={name}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col hover:border-[#ffaf02]/30 transition-colors"
                >
                  <p className="text-xs text-[#ffaf02] font-semibold uppercase tracking-wider mb-2">
                    {name}
                  </p>
                  <p className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                    {highlight}
                  </p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {details.map((d) => (
                      <li
                        key={d}
                        className="flex items-center gap-2 text-sm text-gray-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#ffaf02] flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-white/10 pt-4">
                    <Quote className="w-4 h-4 text-[#ffaf02]/50 mb-2" />
                    <p className="text-xs text-gray-400 italic leading-relaxed">
                      {quote}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FAQ — White section
            ════════════════════════════════════════════ */}
        <section className="bg-white py-16 md:py-24">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#121212] mb-4 text-center">
              Perguntas Frequentes sobre Clube de Assinaturas
            </h2>
            <p className="text-gray-500 text-sm md:text-base text-center max-w-2xl mx-auto mb-12 md:mb-16">
              As duvidas mais comuns sobre o clube de assinaturas no
              BestBarbers.
            </p>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqItems.map((item, idx) => (
                <details
                  key={idx}
                  className="group bg-[#f8f8f8] rounded-2xl border border-gray-100 overflow-hidden"
                >
                  <summary className="cursor-pointer list-none flex items-center justify-between p-6 gap-4 text-left">
                    <span className="text-sm md:text-base font-semibold text-[#121212] group-hover:text-[#b87a00] transition-colors leading-relaxed">
                      {item.question}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform duration-200 flex-shrink-0" />
                  </summary>
                  <div className="px-6 pb-6 -mt-2">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            INTERNAL LINKS — Dark section
            ════════════════════════════════════════════ */}
        <section className="bg-[#121212] py-12 md:py-16 border-t border-white/5">
          <div className="container-custom">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-6 text-center">
              Explore outras funcionalidades
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {[
                {
                  label: "Agendamento Online",
                  href: "/agendamento-online",
                },
                {
                  label: "Gestao Financeira",
                  href: "/gestao-financeira-barbearia",
                },
                {
                  label: "App Proprio",
                  href: "/app-proprio-barbearia",
                },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-xs md:text-sm text-gray-300 hover:text-[#ffaf02] hover:border-[#ffaf02]/30 transition-colors"
                >
                  {label}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FINAL CTA — Yellow accent section
            ════════════════════════════════════════════ */}
        <section className="bg-[#ffaf02] py-16 md:py-20">
          <div className="container-custom text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#121212] mb-4">
              Pronto para criar seu clube de assinaturas?
            </h2>
            <p className="text-sm md:text-base text-[#121212]/70 max-w-xl mx-auto mb-8">
              Descubra quanto sua barbearia pode faturar com receita
              recorrente. Sem compromisso.
            </p>
            <FeatureCTA
              originDesc="[Site]BT-Clube"
              className="inline-flex items-center gap-2 bg-[#121212] text-white px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#1a1a1a] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            >
              QUERO VER O POTENCIAL DA MINHA BARBEARIA
              <ArrowRight className="w-4 h-4" />
            </FeatureCTA>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
