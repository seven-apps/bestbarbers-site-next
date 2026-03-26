import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FeatureCTA } from "@/components/FeatureCTA";
import { articles } from "@/content/blog";

export const metadata: Metadata = {
  title: "Blog BestBarbers — Conteúdo para Donos de Barbearia",
  description:
    "Artigos, guias e dicas para donos de barbearia: gestão financeira, fidelização de clientes, nota fiscal, comissões e mais. Conteúdo baseado em dados reais de 1.200+ barbearias.",
  keywords: [
    "blog barbearia",
    "gestão de barbearia",
    "dicas para barbearia",
    "como montar barbearia",
    "sistema para barbearia",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog BestBarbers — Conteúdo para Donos de Barbearia",
    description:
      "Artigos, guias e dicas baseados em dados reais de 1.200+ barbearias.",
    type: "website",
  },
};

export default function BlogPage() {
  const sortedArticles = [...articles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const featured = sortedArticles[0];
  const rest = sortedArticles.slice(1);

  return (
    <>
      {/* JSON-LD BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
                name: "Blog",
                item: "https://www.bestbarbers.app/blog",
              },
            ],
          }),
        }}
      />

      <main className="min-h-screen bg-white">
        <Navbar />

        {/* Hero */}
        <section className="bg-[#121212] pt-28 pb-12 md:pt-32 md:pb-16">
          <div className="container-custom">
            <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
              <Link href="/" className="hover:text-[#ffaf02] transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-400">Blog</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Blog <span className="text-[#ffaf02]">BestBarbers</span>
            </h1>
            <p className="mt-4 text-gray-400 text-base md:text-lg max-w-2xl">
              Conteúdo exclusivo para donos de barbearia. Guias, dados reais e
              estratégias baseadas em mais de 1.200 barbearias na plataforma.
            </p>
          </div>
        </section>

        {/* Featured Article */}
        {featured && (
          <section className="py-10 md:py-14 bg-gray-50">
            <div className="container-custom">
              <Link
                href={`/blog/${featured.slug}`}
                className="block bg-white rounded-2xl border border-gray-100 p-6 md:p-10 hover:shadow-lg hover:border-[#ffaf02]/30 transition-all group"
              >
                <span className="text-xs text-[#ffaf02] font-semibold uppercase tracking-wide">
                  {featured.category} — Destaque
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-[#121212] mt-3 group-hover:text-[#ffaf02] transition-colors leading-tight">
                  {featured.title}
                </h2>
                <p className="text-gray-600 mt-3 text-base leading-relaxed max-w-3xl">
                  {featured.description}
                </p>
                <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                  <span>{featured.readingTime} min de leitura</span>
                  <span>
                    {new Date(featured.publishedAt).toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Article Grid */}
        {rest.length > 0 && (
          <section className="py-10 md:py-14">
            <div className="container-custom">
              <h2 className="text-xl font-bold text-[#121212] mb-6">
                Todos os artigos
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:border-[#ffaf02]/30 transition-all group"
                  >
                    <span className="text-xs text-[#ffaf02] font-semibold">
                      {article.category}
                    </span>
                    <h3 className="text-lg font-bold text-[#121212] mt-2 group-hover:text-[#ffaf02] transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                      {article.description}
                    </p>
                    <div className="flex items-center gap-3 mt-4 text-xs text-gray-400">
                      <span>{article.readingTime} min de leitura</span>
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString(
                          "pt-BR",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-[#121212] py-16 md:py-20">
          <div className="container-custom text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Pronto para transformar sua barbearia?
            </h2>
            <p className="mt-4 text-gray-400 text-base max-w-xl mx-auto">
              Mais de 1.200 barbearias já confiam no BestBarbers.
            </p>
            <div className="mt-8">
              <FeatureCTA
                originDesc="[Site]BT-Blog-Listing"
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
