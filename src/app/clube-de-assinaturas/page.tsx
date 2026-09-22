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
    "Crie planos de assinatura na sua barbearia e gere receita previsível. 51.000+ assinantes ativos na plataforma, cobrança automática e controle de inadimplência no mesmo sistema.",
  alternates: {
    canonical: "/clube-de-assinaturas",
  },
  openGraph: {
    title:
      "Clube de Assinaturas para Barbearia — Receita Recorrente | BestBarbers",
    description:
      "Crie planos de assinatura na sua barbearia e gere receita previsível. 51.000+ assinantes ativos na plataforma, com cobrança automática.",
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
      "Crie planos de assinatura na sua barbearia e gere receita previsível. 51.000+ assinantes ativos.",
    images: ["/og-image.jpg"],
  },
};

/* ─── FAQ data (used for rendering + JSON-LD) ─── */
const faqItems = [
  {
    question: "Quanto tempo leva para montar o clube de assinaturas?",
    answer:
      "No mesmo dia. Você cria os planos, define preços e já pode começar a cadastrar assinantes. O sistema cuida da cobrança automática, bloqueio de inadimplentes e relatórios.",
  },
  {
    question: "E se o assinante quiser trocar de plano?",
    answer:
      "O próprio cliente troca de plano direto pelo app, sem precisar falar com ninguém. O sistema calcula o pro-rata automaticamente e ajusta a próxima cobrança.",
  },
  {
    // "Ilimitado" saiu: o clube do produto é por CRÉDITOS ou por DIAS DE USO — régua
    // escrita em src/components/clube/FAQClube.tsx ("nunca corte ilimitado").
    question:
      "Posso ter planos diferentes ao mesmo tempo?",
    answer:
      "Sim! Você pode criar quantos planos quiser, por créditos ou por dias de uso. Exemplos comuns: plano básico (4 cortes/mês), plano premium (mais créditos no período), plano VIP (créditos de corte + barba). Cada plano com preço e serviços diferentes.",
  },
  {
    question: "Como funciona a cobrança automática?",
    answer:
      "O sistema cobra automaticamente no dia de vencimento via cartão de crédito, Pix ou boleto. Se o pagamento falhar, o cliente recebe lembretes automáticos. Após o prazo de tolerância, o agendamento é bloqueado até a regularização.",
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
                  — Receita Recorrente no Automático
                </span>
              </h1>

              <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-4">
                <span className="text-[#ffaf02] font-semibold">
                  &ldquo;No fim do mês nunca sobra nada&rdquo;
                </span>{" "}
                — Essa frase apareceu em 47 conversas com donos de barbearia.
                Se você se identifica, o clube de assinaturas é a resposta.
              </p>

              <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-8">
                Com o clube, você sabe no dia 1 do mês quanto o clube vai te
                pagar. Seus clientes pagam automaticamente e voltam porque já
                pagaram — sem planilha, sem cobrar no WhatsApp, sem surpresas.
              </p>

              {/* Stat pills */}
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  // Só agregados oficiais (knowledge/marketing/instagram-voz-do-time.md §9).
                  // Saíram "2.8x mais receita/cliente" e "2.1 visitas/mês": ambos proibidos
                  // por nome — o 2,8× vem do R$540/ano de avulso, cuja conta real é R$360.
                  { label: "1.200+ barbearias na plataforma", icon: Users },
                  { label: "51.000+ assinantes ativos", icon: Repeat },
                  { label: "Cobrança automática todo mês", icon: TrendingUp },
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
              Por que o clube muda a conta da{" "}
              <span style={{ color: "#ffaf02" }}>sua barbearia</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base text-center max-w-2xl mx-auto mb-12 md:mb-16">
              Não é teoria. São números reais de barbearias que usam o
              BestBarbers hoje.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
              {[
                // Cases anonimizados por porte + cidade/UF, literais de
                // knowledge/dominio/cases-clube.json (crivel: true, bloqueio: null).
                // Saíram daqui: o arco "R$15.892 → R$31.690" (morto em
                // knowledge/marketing/clube-arsenal.md), o "R$1.536/ano vs R$540 avulso"
                // com o 2,8× (proibidos por nome em instagram-voz-do-time.md §9) e as
                // "2.1 visitas/mês" (idem). Nenhum tinha fonte que sobrevivesse à checagem.
                {
                  icon: TrendingUp,
                  stat: "R$9.249 → R$30.447/mês",
                  title: "Barbearia de 4 cadeiras, Araxá/MG",
                  desc: "De 99 para 277 assinantes em 19 meses. Mesmas 4 cadeiras — o que entrou foi o clube cobrando sozinho todo mês. (bb#13285)",
                },
                {
                  icon: DollarSign,
                  stat: "R$7.682 → R$71.002/mês",
                  title: "Barbearia de 6 cadeiras, Londrina/PR",
                  desc: "Começou o clube com 31 assinantes. Dezessete meses depois são 409 pagando por mês, no automático. (bb#12164)",
                },
                {
                  icon: Repeat,
                  stat: "R$2.264 → R$10.542/mês",
                  title: "Barbearia de 4 cadeiras, Antônio Carlos/SC",
                  desc: "De 24 para 90 assinantes em 12 meses. Cidade pequena, clube pequeno — e a receita do mês deixou de depender do movimento. (bb#15550)",
                },
                {
                  icon: Users,
                  stat: "51.000+",
                  title: "Assinantes ativos na plataforma",
                  desc: "Mais de 51 mil clientes já pagam clube de barbearia pelo BestBarbers. É o tamanho do modelo, não uma projeção.",
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
              Tudo automatizado. Você configura uma vez e o sistema cuida
              do resto.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: Smartphone,
                  title: "Crie planos flexíveis",
                  desc: "Planos limitados (4 cortes/mês) ou ilimitados. Defina serviços, preços e regras de cada plano. Mude quando quiser.",
                },
                {
                  icon: Repeat,
                  title: "Cobrança automática",
                  desc: "Cartão, Pix ou boleto. O sistema cobra no vencimento, envia lembretes e registra tudo. Zero inadimplência manual.",
                },
                {
                  icon: Ban,
                  title: "Bloqueio automático de inadimplentes",
                  desc: "Se o pagamento não cai, o agendamento é bloqueado automaticamente. Sem conversa constrangedora com o cliente.",
                },
                {
                  icon: BarChart3,
                  title: "Relatórios de churn, frequência e receita",
                  desc: "Saiba quem cancelou, quem nunca vem e quanto entra por mês. Dados reais para tomar decisão, não achismo.",
                },
                {
                  icon: ShieldCheck,
                  title: "Troca de plano direto pelo app",
                  desc: "O cliente muda de plano sozinho, sem te ligar. Upgrade, downgrade, cancelamento — tudo pelo app com pro-rata automático.",
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
              Objeções Respondidas
            </h2>
            <p className="text-gray-500 text-sm md:text-base text-center max-w-2xl mx-auto mb-12 md:mb-16">
              As 3 dúvidas que todo dono de barbearia tem antes de criar o
              clube — respondidas com dados.
            </p>

            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Objection 1 */}
              <div className="bg-[#f8f8f8] rounded-2xl p-6 md:p-8 border border-gray-100">
                <p className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-2">
                  Objeção
                </p>
                <p className="text-base md:text-lg font-bold text-[#121212] mb-3">
                  &ldquo;Cliente vai vir todos os dias e não vai
                  compensar&rdquo;
                </p>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <strong className="text-[#121212]">Como o sistema resolve:</strong>{" "}
                      cada plano tem regra — por{" "}
                      <strong className="text-[#121212]">créditos</strong> (o
                      assinante usa o número de serviços que contratou) ou por{" "}
                      <strong className="text-[#121212]">dias de uso</strong>.
                      O sistema controla sozinho o que já foi consumido no
                      período, sem conta de cabeça e sem discussão na recepção.
                      Você define o teto antes de vender o plano.
                    </p>
                  </div>
                </div>
              </div>

              {/* Objection 2 */}
              <div className="bg-[#f8f8f8] rounded-2xl p-6 md:p-8 border border-gray-100">
                <p className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-2">
                  Objeção
                </p>
                <p className="text-base md:text-lg font-bold text-[#121212] mb-3">
                  &ldquo;Barbeiro ganha menos na assinatura&rdquo;
                </p>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <strong className="text-[#121212]">Dado real:</strong>{" "}
                      Barbeiro que atende só avulso fatura em média{" "}
                      <strong className="text-[#121212]">
                        R$2.625/mês
                      </strong>
                      . Barbeiro com assinantes fatura{" "}
                      <strong className="text-[#121212]">
                        R$4.805/mês
                      </strong>
                      . Isso é{" "}
                      <span
                        className="font-extrabold"
                        style={{ color: "#ffaf02" }}
                      >
                        83% MAIS
                      </span>
                      . Assinante volta mais, faz mais serviços e o
                      profissional tem agenda cheia garantida.
                    </p>
                  </div>
                </div>
              </div>

              {/* Objection 3 */}
              <div className="bg-[#f8f8f8] rounded-2xl p-6 md:p-8 border border-gray-100">
                <p className="text-sm font-semibold text-red-500 uppercase tracking-wide mb-2">
                  Objeção
                </p>
                <p className="text-base md:text-lg font-bold text-[#121212] mb-3">
                  &ldquo;Barbearia por assinatura é dar desconto&rdquo;
                </p>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <strong className="text-[#121212]">O que muda de fato:</strong>{" "}
                      o desconto no corte avulso você dá e não recebe nada em
                      troca. No clube, o desconto é o preço de uma{" "}
                      <strong className="text-[#121212]">
                        receita que entra antes do primeiro corte do mês
                      </strong>
                      . Uma barbearia de 4 cadeiras em Araxá/MG saiu de
                      R$9.249 para{" "}
                      <span
                        className="font-extrabold"
                        style={{ color: "#ffaf02" }}
                      >
                        R$30.447/mês
                      </span>{" "}
                      de clube em 19 meses — sem cadeira nova. O que ela
                      trocou foi previsibilidade por margem unitária.
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
              Números reais, não projeções.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                // Três cases do banco (knowledge/dominio/cases-clube.json), anonimizados
                // por porte + cidade/UF. Saíram: o arco morto dos 353 assinantes, a "rede
                // de 6 unidades com R$176K/mês" (sem fonte) e "maior clube single-unit do
                // Brasil" (superlativo sem lastro). O campo `quote` deixou de ser fala
                // inventada e passou a ser descrição do próprio número.
                {
                  name: "Barbearia de 8 cadeiras · Belo Horizonte/MG",
                  highlight: "R$72.577/mês",
                  details: [
                    "8 cadeiras",
                    "De 88 para 600 assinantes",
                    "R$9.272 → R$72.577/mês de clube em 25 meses",
                  ],
                  quote:
                    "Receita de assinatura cobrada no automático, em uma casa só. (bb#10387)",
                },
                {
                  name: "Barbearia de 9 cadeiras · Itaguaí/RJ",
                  highlight: "525 assinantes",
                  details: [
                    "9 cadeiras",
                    "De 103 para 525 assinantes",
                    "R$8.254 → R$49.519/mês de clube em 20 meses",
                  ],
                  quote:
                    "Vinte meses de clube ativo, seis vezes a receita recorrente do início. (bb#12580)",
                },
                {
                  name: "Barbearia de 2 cadeiras · São Paulo/SP",
                  highlight: "R$16.152/mês",
                  details: [
                    "2 cadeiras",
                    "75 assinantes pagando pelo app próprio",
                    "R$4.844 → R$16.152/mês de clube em 10 meses",
                  ],
                  quote:
                    "Duas cadeiras — o clube não depende do tamanho da casa. (bb#16402)",
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
              As dúvidas mais comuns sobre o clube de assinaturas no
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
                  label: "Gestão Financeira",
                  href: "/gestao-financeira-barbearia",
                },
                {
                  label: "App Próprio",
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
