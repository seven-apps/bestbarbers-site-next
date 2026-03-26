import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FeatureCTA } from "@/components/FeatureCTA";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { videos } from "@/content/videos";
import { articles } from "@/content/blog";

/* ─── Static params ─── */
export function generateStaticParams() {
  return videos.map((v) => ({ slug: v.slug }));
}

/* ─── Dynamic metadata ─── */
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const video = videos.find((v) => v.slug === params.slug);
  if (!video) return {};

  return {
    title: `${video.title} | Conteúdo BestBarbers`,
    description: video.description,
    keywords: video.keywords,
    alternates: { canonical: `/conteudo/${video.slug}` },
    openGraph: {
      title: video.title,
      description: video.description,
      type: "article",
      images: [
        {
          url: `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
          width: 1280,
          height: 720,
          alt: video.title,
        },
      ],
    },
  };
}

/* ─── Helper: split transcript into paragraphs ─── */
function splitTranscript(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

/* ─── Page component ─── */
export default function VideoPage({
  params,
}: {
  params: { slug: string };
}) {
  const video = videos.find((v) => v.slug === params.slug);
  if (!video) notFound();

  const relatedVideos = videos.filter((v) =>
    video.relatedVideoSlugs.includes(v.slug)
  );
  const relatedArticles = articles.filter((a) =>
    video.relatedBlogSlugs.includes(a.slug)
  );
  const transcriptParagraphs = splitTranscript(video.transcript);

  return (
    <>
      {/* JSON-LD VideoObject */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: video.title,
            description: video.description,
            thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
            uploadDate: video.publishedAt,
            duration: durationToISO(video.duration),
            embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
            contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
            publisher: {
              "@type": "Organization",
              name: "BestBarbers",
              url: "https://www.bestbarbers.app",
            },
          }),
        }}
      />

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
              {
                "@type": "ListItem",
                position: 3,
                name: video.title,
                item: `https://www.bestbarbers.app/conteudo/${video.slug}`,
              },
            ],
          }),
        }}
      />

      <main className="min-h-screen bg-white">
        <Navbar />

        {/* Hero */}
        <section className="bg-[#121212] pt-28 pb-8 md:pt-32 md:pb-10">
          <div className="container-custom max-w-4xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-gray-500 mb-5">
              <Link href="/" className="hover:text-[#ffaf02] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/conteudo"
                className="hover:text-[#ffaf02] transition-colors"
              >
                Conteúdo
              </Link>
              <span>/</span>
              <span className="text-gray-400 truncate">{video.title}</span>
            </nav>

            {/* Meta info */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="bg-[#ffaf02]/10 text-[#ffaf02] text-xs font-semibold px-3 py-1 rounded-full">
                {video.category}
              </span>
              <span className="text-gray-500 text-xs">{video.duration}</span>
              <span className="text-gray-500 text-xs">
                {new Date(video.publishedAt).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="text-gray-600 text-xs">
                Canal: {video.channel}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              {video.title}
            </h1>
          </div>
        </section>

        {/* Video Embed */}
        <section className="bg-[#121212] pb-12 md:pb-16">
          <div className="container-custom max-w-4xl">
            <YouTubeEmbed videoId={video.youtubeId} title={video.title} />
          </div>
        </section>

        {/* Summary + Key Takeaways */}
        <section className="py-10 md:py-14">
          <div className="container-custom max-w-3xl">
            {/* Summary */}
            <h2 className="text-xl font-bold text-[#121212] mb-3">Resumo</h2>
            <p className="text-gray-700 text-base leading-relaxed mb-8">
              {video.summary}
            </p>

            {/* Key Takeaways */}
            {video.keyTakeaways.length > 0 && (
              <>
                <h2 className="text-xl font-bold text-[#121212] mb-4">
                  Principais aprendizados
                </h2>
                <ul className="space-y-3 mb-8">
                  {video.keyTakeaways.map((takeaway, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-gray-700 text-sm leading-relaxed"
                    >
                      <span className="mt-0.5 w-5 h-5 bg-[#ffaf02]/10 text-[#ffaf02] rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        ✓
                      </span>
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Featured Quote */}
            {video.quotes.length > 0 && (
              <blockquote className="bg-[#121212] rounded-2xl p-6 my-8 border-l-4 border-[#ffaf02]">
                <p className="text-white text-base italic leading-relaxed">
                  &ldquo;{video.quotes[0].text}&rdquo;
                </p>
              </blockquote>
            )}
          </div>
        </section>

        {/* Mid CTA */}
        <section className="bg-gray-50 py-8 md:py-10">
          <div className="container-custom max-w-3xl text-center">
            <p className="text-lg font-bold text-[#121212] mb-2">
              Quer ver como isso funciona na prática?
            </p>
            <p className="text-gray-600 text-sm mb-4">
              Fale com nossa equipe e descubra como o BestBarbers pode
              transformar sua barbearia.
            </p>
            <FeatureCTA
              originDesc={`[Site]BT-Video-${video.slug}`}
              className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              QUERO CONHECER O BESTBARBERS
            </FeatureCTA>
          </div>
        </section>

        {/* Benchmarks */}
        {video.benchmarks.length > 0 && (
          <section className="py-10 md:py-14">
            <div className="container-custom max-w-3xl">
              <h2 className="text-xl font-bold text-[#121212] mb-4">
                Dados e métricas do vídeo
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {video.benchmarks.map((b, i) => (
                  <div
                    key={i}
                    className="bg-[#121212] rounded-xl p-5 text-center"
                  >
                    <p className="text-2xl font-bold text-[#ffaf02]">
                      {b.value}
                    </p>
                    <p className="text-sm text-gray-300 mt-1">{b.metric}</p>
                    {b.context && (
                      <p className="text-xs text-gray-500 mt-1">{b.context}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Features */}
        {video.relatedFeatures.length > 0 && (
          <section className="bg-gray-50 py-10 md:py-14">
            <div className="container-custom max-w-3xl">
              <h2 className="text-xl font-bold text-[#121212] mb-4">
                Soluções relacionadas
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {video.relatedFeatures.map((f) => (
                  <Link
                    key={f.href}
                    href={f.href}
                    className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-[#ffaf02] hover:shadow-md transition-all group"
                  >
                    <p className="font-bold text-[#121212] group-hover:text-[#ffaf02] transition-colors text-sm">
                      {f.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {f.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Full Transcript */}
        {transcriptParagraphs.length > 0 && (
          <section className="py-10 md:py-14">
            <div className="container-custom max-w-3xl">
              <h2 className="text-xl font-bold text-[#121212] mb-4">
                Transcrição completa
              </h2>
              <div className="prose prose-sm prose-gray max-w-none">
                {transcriptParagraphs.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-gray-700 text-sm leading-relaxed mb-3"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
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
                originDesc={`[Site]BT-Video-${video.slug}`}
                className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-10 py-5 rounded-full text-base font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
              >
                QUERO UM APP PRÓPRIO PARA MINHA BARBEARIA
              </FeatureCTA>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="bg-gray-50 py-10 md:py-14">
            <div className="container-custom">
              <h2 className="text-xl font-bold text-[#121212] mb-4">
                Artigos relacionados
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-[#ffaf02]/30 transition-all group"
                  >
                    <span className="text-xs text-[#ffaf02] font-semibold">
                      {article.category}
                    </span>
                    <h3 className="text-sm font-bold text-[#121212] mt-2 group-hover:text-[#ffaf02] transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2">
                      {article.readingTime} min de leitura
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Videos */}
        {relatedVideos.length > 0 && (
          <section className="py-10 md:py-14">
            <div className="container-custom">
              <h2 className="text-xl font-bold text-[#121212] mb-4">
                Vídeos relacionados
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedVideos.map((rv) => (
                  <Link
                    key={rv.slug}
                    href={`/conteudo/${rv.slug}`}
                    className="rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md hover:border-[#ffaf02]/30 transition-all group"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${rv.youtubeId}/mqdefault.jpg`}
                      alt={rv.title}
                      className="w-full aspect-video object-cover"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <span className="text-xs text-[#ffaf02] font-semibold">
                        {rv.category}
                      </span>
                      <h3 className="text-sm font-bold text-[#121212] mt-1 group-hover:text-[#ffaf02] transition-colors leading-snug">
                        {rv.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-2">
                        {rv.duration}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </main>
    </>
  );
}

/* ─── Utility: convert "5:11" to "PT5M11S" ─── */
function durationToISO(duration: string): string {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) {
    return `PT${parts[0]}H${parts[1]}M${parts[2]}S`;
  }
  if (parts.length === 2) {
    return `PT${parts[0]}M${parts[1]}S`;
  }
  return `PT${parts[0]}M`;
}
