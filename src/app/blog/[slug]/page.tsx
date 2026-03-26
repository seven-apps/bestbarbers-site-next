import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FeatureCTA } from "@/components/FeatureCTA";
import { articles } from "@/content/blog";
import type { ContentBlock, BlogSection } from "@/content/blog/types";

/* ─── Static params for all articles ─── */
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

/* ─── Dynamic metadata ─── */
export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return {};

  return {
    title: `${article.title} | Blog BestBarbers`,
    description: article.description,
    keywords: article.keywords,
    alternates: {
      canonical: `/blog/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: ["BestBarbers"],
      tags: article.tags,
    },
  };
}

/* ─── Render a content block ─── */
function RenderBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-gray-700 text-base leading-relaxed mb-4">
          {block.text}
        </p>
      );
    case "subheading":
      return (
        <h3 className="text-xl font-bold text-[#121212] mt-8 mb-3">
          {block.text}
        </h3>
      );
    case "list":
      const ListTag = block.ordered ? "ol" : "ul";
      return (
        <ListTag
          className={`mb-4 pl-6 space-y-2 ${
            block.ordered ? "list-decimal" : "list-disc"
          } text-gray-700`}
        >
          {block.items.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ListTag>
      );
    case "highlight":
      return (
        <div className="bg-[#121212] rounded-2xl p-6 my-6 text-center">
          <p className="text-3xl font-bold text-[#ffaf02]">{block.value}</p>
          <p className="text-sm text-gray-300 mt-2">{block.label}</p>
        </div>
      );
    case "callout":
      return (
        <div className="bg-amber-50 border-l-4 border-[#ffaf02] p-4 my-6 rounded-r-lg">
          <p className="text-gray-800 text-sm leading-relaxed">{block.text}</p>
        </div>
      );
    case "link-box":
      return (
        <Link
          href={block.href}
          className="block bg-gray-50 border border-gray-200 rounded-xl p-4 my-4 hover:border-[#ffaf02] hover:shadow-md transition-all group"
        >
          <p className="font-bold text-[#121212] group-hover:text-[#ffaf02] transition-colors">
            {block.title}
          </p>
          <p className="text-sm text-gray-600 mt-1">{block.description}</p>
        </Link>
      );
  }
}

/* ─── Render a section ─── */
function RenderSection({ section, index }: { section: BlogSection; index: number }) {
  return (
    <section className="mb-10">
      <h2
        id={section.heading
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")}
        className="text-2xl font-bold text-[#121212] mb-4 scroll-mt-24"
      >
        {section.heading}
      </h2>
      {section.blocks.map((block, i) => (
        <RenderBlock key={`${index}-${i}`} block={block} />
      ))}
    </section>
  );
}

/* ─── Page component ─── */
export default function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const relatedArticles = articles.filter((a) =>
    article.relatedSlugs.includes(a.slug)
  );

  // Insert CTA after section 2 (mid-article)
  const midCtaIndex = Math.min(2, article.sections.length - 1);

  return (
    <>
      {/* JSON-LD Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.description,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt,
            author: {
              "@type": "Organization",
              name: "BestBarbers",
              url: "https://www.bestbarbers.app",
            },
            publisher: {
              "@type": "Organization",
              name: "BestBarbers",
              logo: {
                "@type": "ImageObject",
                url: "https://www.bestbarbers.app/images/Logo-BestBarbers-branco_1.webp",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://www.bestbarbers.app/blog/${article.slug}`,
            },
          }),
        }}
      />

      {/* JSON-LD FAQ Schema */}
      {article.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: article.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            }),
          }}
        />
      )}

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
              {
                "@type": "ListItem",
                position: 3,
                name: article.title,
                item: `https://www.bestbarbers.app/blog/${article.slug}`,
              },
            ],
          }),
        }}
      />

      <main className="min-h-screen bg-white">
        <Navbar />

        {/* Hero */}
        <section className="bg-[#121212] pt-28 pb-12 md:pt-32 md:pb-16">
          <div className="container-custom max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
              <Link href="/" className="hover:text-[#ffaf02] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/blog"
                className="hover:text-[#ffaf02] transition-colors"
              >
                Blog
              </Link>
              <span>/</span>
              <span className="text-gray-400 truncate">{article.title}</span>
            </nav>

            {/* Category + Reading Time */}
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#ffaf02]/10 text-[#ffaf02] text-xs font-semibold px-3 py-1 rounded-full">
                {article.category}
              </span>
              <span className="text-gray-500 text-xs">
                {article.readingTime} min de leitura
              </span>
              <span className="text-gray-500 text-xs">
                {new Date(article.publishedAt).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              {article.title}
            </h1>
            <p className="mt-4 text-gray-400 text-base leading-relaxed">
              {article.description}
            </p>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-12 md:py-16">
          <div className="container-custom max-w-3xl">
            {article.sections.map((section, index) => (
              <div key={index}>
                <RenderSection section={section} index={index} />
                {/* Mid-article CTA */}
                {index === midCtaIndex && (
                  <div className="bg-gray-50 rounded-2xl p-6 md:p-8 my-10 text-center border border-gray-100">
                    <p className="text-lg font-bold text-[#121212] mb-2">
                      Quer ver como isso funciona na prática?
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      Fale com nossa equipe e descubra como o BestBarbers pode
                      transformar sua barbearia.
                    </p>
                    <FeatureCTA
                      originDesc={`[Site]BT-Blog-${article.slug}`}
                      className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
                    >
                      QUERO CONHECER O BESTBARBERS
                    </FeatureCTA>
                  </div>
                )}
              </div>
            ))}

            {/* Related Feature Pages */}
            {article.relatedFeatures.length > 0 && (
              <section className="mt-10 mb-10">
                <h2 className="text-xl font-bold text-[#121212] mb-4">
                  Conheça nossas soluções
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {article.relatedFeatures.map((feature) => (
                    <Link
                      key={feature.href}
                      href={feature.href}
                      className="block bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-[#ffaf02] hover:shadow-md transition-all group"
                    >
                      <p className="font-bold text-[#121212] group-hover:text-[#ffaf02] transition-colors text-sm">
                        {feature.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {feature.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ Section */}
            {article.faq.length > 0 && (
              <section className="mt-10 mb-10">
                <h2 className="text-2xl font-bold text-[#121212] mb-6">
                  Perguntas Frequentes
                </h2>
                <div className="space-y-4">
                  {article.faq.map((item, i) => (
                    <details
                      key={i}
                      className="bg-gray-50 rounded-xl border border-gray-100 group"
                    >
                      <summary className="p-4 cursor-pointer font-semibold text-[#121212] text-sm hover:text-[#ffaf02] transition-colors list-none flex items-center justify-between">
                        {item.question}
                        <span className="text-gray-400 group-open:rotate-180 transition-transform ml-2">
                          ▾
                        </span>
                      </summary>
                      <div className="px-4 pb-4">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>

        {/* CTA Final */}
        <section className="bg-[#121212] py-16 md:py-20">
          <div className="container-custom text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Pronto para transformar sua barbearia?
            </h2>
            <p className="mt-4 text-gray-400 text-base max-w-xl mx-auto">
              Mais de 1.200 barbearias já confiam no BestBarbers. Fale com
              nossa equipe e descubra o potencial do seu negócio.
            </p>
            <div className="mt-8">
              <FeatureCTA
                originDesc={`[Site]BT-Blog-${article.slug}`}
                className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-10 py-5 rounded-full text-base font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
              >
                QUERO UM APP PRÓPRIO PARA MINHA BARBEARIA
              </FeatureCTA>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="bg-gray-50 py-12 md:py-16">
            <div className="container-custom">
              <h2 className="text-xl md:text-2xl font-bold text-[#121212] mb-6">
                Artigos relacionados
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:border-[#ffaf02]/30 transition-all group"
                  >
                    <span className="text-xs text-[#ffaf02] font-semibold">
                      {related.category}
                    </span>
                    <h3 className="text-base font-bold text-[#121212] mt-2 group-hover:text-[#ffaf02] transition-colors leading-snug">
                      {related.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                      {related.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-3">
                      {related.readingTime} min de leitura
                    </p>
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
