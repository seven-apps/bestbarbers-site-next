import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FeatureCTA } from "@/components/FeatureCTA";
import { videos } from "@/content/videos";

export const metadata: Metadata = {
  title: "Conteúdo para Donos de Barbearia — Vídeos e Transcrições | BestBarbers",
  description:
    "Biblioteca de vídeos educacionais para donos de barbearia: gestão, assinaturas, financeiro, marketing e mais. Assista e leia a transcrição completa de cada vídeo.",
  keywords: [
    "conteúdo barbearia",
    "vídeos gestão barbearia",
    "dicas para barbearia",
    "como montar barbearia",
    "gestão financeira barbearia",
    "clube de assinaturas barbearia",
  ],
  alternates: { canonical: "/conteudo" },
  openGraph: {
    title: "Conteúdo para Donos de Barbearia | BestBarbers",
    description:
      "Vídeos educacionais com transcrição completa. Gestão, assinaturas, financeiro e mais.",
    type: "website",
  },
};

export default function ConteudoPage() {
  const sorted = [...videos].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const categories = [...new Set(videos.map((v) => v.category))].sort();

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
                name: "Conteúdo",
                item: "https://www.bestbarbers.app/conteudo",
              },
            ],
          }),
        }}
      />

      {/* JSON-LD ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Vídeos Educacionais para Barbearias",
            numberOfItems: videos.length,
            itemListElement: sorted.map((v, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `https://www.bestbarbers.app/conteudo/${v.slug}`,
              name: v.title,
            })),
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
              <span className="text-gray-400">Conteúdo</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Conteúdo para{" "}
              <span className="text-[#ffaf02]">Donos de Barbearia</span>
            </h1>
            <p className="mt-4 text-gray-400 text-base md:text-lg max-w-2xl">
              Vídeos educacionais com transcrição completa. Aprenda sobre
              gestão, assinaturas, financeiro, marketing e muito mais.
            </p>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2 mt-6">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Video Grid */}
        <section className="py-10 md:py-14">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map((video) => (
                <Link
                  key={video.slug}
                  href={`/conteudo/${video.slug}`}
                  className="rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-[#ffaf02]/30 transition-all group"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                      {video.duration}
                    </div>
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-[#ffaf02] rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-[#121212] ml-0.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-[#ffaf02] font-semibold">
                        {video.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {video.channel}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-[#121212] group-hover:text-[#ffaf02] transition-colors leading-snug">
                      {video.title}
                    </h2>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                      {video.summary}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(video.publishedAt).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

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
                originDesc="[Site]BT-Conteudo-Listing"
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
