import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FeatureCTA } from "@/components/FeatureCTA";
import { cities } from "@/data/cities";

/* ─── Static params for all 30 cities ─── */
export function generateStaticParams() {
  return cities.map((city) => ({ cidade: city.slug }));
}

/* ─── Dynamic metadata ─── */
export function generateMetadata({
  params,
}: {
  params: { cidade: string };
}): Metadata {
  const city = cities.find((c) => c.slug === params.cidade);
  if (!city) return {};

  return {
    title: `Sistema para Barbearia em ${city.name} — App Próprio + Gestão | BestBarbers`,
    description: `Sistema completo para barbearia em ${city.name}/${city.stateAbbr}: app próprio, clube de assinaturas, agendamento 24h, nota fiscal automática e gestão financeira. 1.200+ barbearias confiam no BestBarbers.`,
    alternates: {
      canonical: `/sistema-para-barbearia/${city.slug}`,
    },
    openGraph: {
      title: `Sistema para Barbearia em ${city.name} | BestBarbers`,
      description: `O BestBarbers é o sistema mais completo para barbearias em ${city.name}. App próprio, clube de assinaturas, agendamento online e muito mais.`,
    },
  };
}

/* ─── Features list ─── */
const features = [
  {
    title: "App Próprio Personalizado",
    desc: "Seu app exclusivo na App Store e Play Store, com a identidade visual da sua barbearia.",
    href: "/app-proprio-barbearia",
  },
  {
    title: "Clube de Assinaturas",
    desc: "Receita recorrente com cobrança automática. 51.000+ assinantes ativos na plataforma.",
    href: "/clube-de-assinaturas",
  },
  {
    title: "Agendamento Online 24h",
    desc: "Seus clientes agendam pelo app ou link personalizado, a qualquer hora, sem WhatsApp.",
    href: "/agendamento-online",
  },
  {
    title: "Nota Fiscal Automática",
    desc: "NFS-e emitida automaticamente após cada atendimento. Configure uma vez, o sistema faz o resto.",
    href: "/nota-fiscal-barbearia",
  },
  {
    title: "Gestão Financeira Completa",
    desc: "Fluxo de caixa, relatórios diários, controle de pagamentos — tudo em tempo real.",
    href: "/gestao-financeira-barbearia",
  },
  {
    title: "Gestão de Comissões",
    desc: "Cálculo automático de comissões por barbeiro, por serviço, por período.",
    href: "/gestao-comissoes-barbeiro",
  },
  {
    title: "Totem de Autoatendimento",
    desc: "Check-in, comanda digital, pagamento e reagendamento. Sem filas no caixa.",
    href: "/totem-autoatendimento",
  },
  {
    title: "Notificações Push",
    desc: "Envie promoções, lembretes e novidades direto no celular do cliente.",
    href: null,
  },
];

/* ─── Page component ─── */
export default function CityPage({
  params,
}: {
  params: { cidade: string };
}) {
  const city = cities.find((c) => c.slug === params.cidade);
  if (!city) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "BestBarbers",
            applicationCategory: "BusinessApplication",
            operatingSystem: "iOS, Android, Web",
            description: `Sistema completo para barbearias em ${city.name}/${city.stateAbbr} com app próprio, clube de assinaturas e gestão integrada`,
            areaServed: {
              "@type": "City",
              name: city.name,
              containedInPlace: {
                "@type": "State",
                name: city.state,
              },
            },
            offers: {
              "@type": "AggregateOffer",
              lowPrice: "0",
              highPrice: "299",
              priceCurrency: "BRL",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "1200",
            },
          }),
        }}
      />

      <main className="min-h-screen bg-white">
        <Navbar />

        {/* Hero */}
        <section className="bg-[#121212] pt-28 pb-16 md:pt-32 md:pb-20">
          <div className="container-custom">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8">
              <Link href="/" className="hover:text-[#ffaf02] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/sistema-para-barbearia"
                className="hover:text-[#ffaf02] transition-colors"
              >
                Sistema para Barbearia
              </Link>
              <span>/</span>
              <span className="text-gray-400">{city.name}</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Sistema para Barbearia em{" "}
              <span className="text-[#ffaf02]">{city.name}</span>
            </h1>
            <p className="mt-6 text-gray-300 text-base md:text-lg leading-relaxed max-w-3xl">
              O BestBarbers é a plataforma mais completa para barbearias em{" "}
              {city.name}/{city.stateAbbr}. App próprio na App Store, clube de
              assinaturas, agendamento online 24h, nota fiscal automática, gestão
              financeira e muito mais — tudo em um único sistema.
            </p>
            <p className="mt-4 text-gray-400 text-sm md:text-base">
              Mais de 1.200 barbearias em todo o Brasil já confiam no
              BestBarbers para gerenciar suas operações.
            </p>

            <div className="mt-10">
              <FeatureCTA
                originDesc={`[Site]BT-City-${city.stateAbbr}`}
                className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
              >
                QUERO UM APP PRÓPRIO PARA MINHA BARBEARIA
              </FeatureCTA>
            </div>
          </div>
        </section>

        {/* Funcionalidades */}
        <section className="bg-white py-16 md:py-20">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-bold text-[#121212]">
              Tudo que sua barbearia em {city.name} precisa
            </h2>
            <p className="mt-4 text-gray-600 text-base max-w-3xl">
              O BestBarbers oferece todas as ferramentas para você gerenciar e
              crescer sua barbearia em {city.name}. Veja o que está incluído:
            </p>

            <div className="mt-10 grid md:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-bold text-[#121212] mb-2">
                    {feature.href ? (
                      <Link
                        href={feature.href}
                        className="hover:text-[#ffaf02] transition-colors"
                      >
                        {feature.title}
                      </Link>
                    ) : (
                      feature.title
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Por que BestBarbers */}
        <section className="bg-[#121212] py-16 md:py-20">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Por que barbearias em {city.name} escolhem o BestBarbers
            </h2>

            <div className="mt-10 grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="text-3xl font-bold text-[#ffaf02]">1.200+</p>
                <p className="text-sm text-gray-300 mt-2">
                  Barbearias ativas na plataforma em todo o Brasil
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="text-3xl font-bold text-[#ffaf02]">51.000+</p>
                <p className="text-sm text-gray-300 mt-2">
                  Assinantes ativos nos clubes de assinaturas
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="text-3xl font-bold text-[#ffaf02]">6M+</p>
                <p className="text-sm text-gray-300 mt-2">
                  Agendamentos processados por mês na plataforma
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <FeatureCTA
                originDesc={`[Site]BT-City-${city.stateAbbr}`}
                className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
              >
                QUERO VER O POTENCIAL DA MINHA BARBEARIA
              </FeatureCTA>
            </div>
          </div>
        </section>

        {/* Planos */}
        <section className="bg-white py-16 md:py-20">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-bold text-[#121212]">
              Planos para barbearias em {city.name}
            </h2>
            <div className="mt-10 grid md:grid-cols-2 gap-8 max-w-4xl">
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-[#121212] mb-2">
                  Plano Básico
                </h3>
                <p className="text-[#ffaf02] font-bold text-lg mb-4">
                  Grátis para começar
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Gestão de agenda e controle financeiro básico. Ideal para
                  barbearias que estão começando a se organizar.
                </p>
              </div>
              <div className="bg-[#121212] rounded-2xl p-8 border border-[#ffaf02]/20">
                <h3 className="text-xl font-bold text-white mb-2">
                  Plano App Exclusivo
                </h3>
                <p className="text-[#ffaf02] font-bold text-lg mb-4">
                  A partir de R$299/mês
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Tudo do básico + app próprio na loja, clube de assinaturas,
                  nota fiscal automática, notificações push e totem de
                  autoatendimento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Outras cidades */}
        <section className="bg-gray-50 py-12 md:py-16">
          <div className="container-custom">
            <h2 className="text-xl md:text-2xl font-bold text-[#121212] mb-6">
              BestBarbers em outras cidades
            </h2>
            <div className="flex flex-wrap gap-2">
              {cities
                .filter((c) => c.slug !== city.slug)
                .slice(0, 15)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/sistema-para-barbearia/${c.slug}`}
                    className="px-3 py-1.5 bg-white rounded-full text-xs text-gray-600 border border-gray-200 hover:border-[#ffaf02] hover:text-[#121212] transition-colors"
                  >
                    {c.name}/{c.stateAbbr}
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-[#121212] py-16 md:py-20">
          <div className="container-custom text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Pronto para transformar sua barbearia em{" "}
              <span className="text-[#ffaf02]">{city.name}</span>?
            </h2>
            <p className="mt-4 text-gray-400 text-base max-w-xl mx-auto">
              Fale com nossa equipe e descubra como o BestBarbers pode ajudar
              sua barbearia a crescer.
            </p>
            <div className="mt-8">
              <FeatureCTA
                originDesc={`[Site]BT-City-${city.stateAbbr}`}
                className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-10 py-5 rounded-full text-base font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
              >
                QUERO UM APP PRÓPRIO PARA MINHA BARBEARIA
              </FeatureCTA>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
