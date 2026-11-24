import type { ReactNode } from "react";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FeatureCTA } from "@/components/FeatureCTA";

/**
 * Molde das páginas de recurso (SEO lote 2, 24/Nov/26), tirado de /sistema-para-barbearia, que o André aprovou no lote 1.
 * Cada página entrega só conteúdo; o desenho, o JSON-LD e o FAQ visível = FAQ declarado ao Google moram aqui.
 * Todo recurso citado é conferido em bestbarbers-ai/knowledge/dominio/bestbarbers-product-features.md.
 */

export interface Recurso {
  nome: string;
  resolve: string;
  href?: string;
  /** Contratado à parte do sistema com o aplicativo. */
  modulo?: boolean;
}

export interface Caso {
  porte: string;
  cidade: string;
  assinantes: string;
  valor: string;
  nota: string;
}

export interface ConteudoDeRecurso {
  slug: string;
  trilha: string;
  h1: string;
  frase: string;
  destaques: string[];
  botao: string;
  originDesc: string;
  prova: string;
  oQueE: { titulo: string; paragrafos: ReactNode[] };
  comparacao?: { titulo: string; colunas: [string, string, string]; linhas: [string, string, string][] };
  tabela: { titulo: string; linhas: Recurso[] };
  passos: { titulo: string; sub?: string; itens: { titulo: string; texto: string }[] };
  /** `nota` é só para o que o preço NÃO inclui nesta página; o resto do bloco é igual em todas (PRECO_ITENS). */
  preco: { titulo: string; nota?: string };
  casos?: { titulo: string; sub: string; itens: Caso[] };
  faq: { titulo: string; itens: { pergunta: string; resposta: string }[] };
  leiaTambem: ReactNode;
  fim: { titulo: string; texto: string };
  descricao: string;
}

const SITE = "https://www.bestbarbers.app";

/** O preço tem um nome só e uma lista só de "à parte" nas páginas de recurso (leitor frio, 24/Nov/26). */
const PRECO_NOME = "Sistema com o aplicativo da sua barbearia";
const PRECO_ITENS = [
  "Agenda, caixa, comissão dos barbeiros e cadastro de clientes",
  "Aplicativo com o nome e a logo da sua barbearia",
  "Implantação feita pelo nosso time, com você",
  "Gerente de contas para tirar as suas dúvidas",
];
const PRECO_A_PARTE = "À parte: assinatura, nota fiscal, totem e agente de IA.";

const BOTAO =
  "inline-flex items-center justify-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]";

/** Link de texto sobre fundo claro. */
export function LinkTexto({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-[#b37a00] underline underline-offset-4 hover:text-[#121212]">
      {children}
    </Link>
  );
}

function Feito() {
  return <span className="text-[#ffaf02] mt-0.5 shrink-0" aria-hidden>&#10003;</span>;
}

function jsonLd(c: ConteudoDeRecurso) {
  const url = `${SITE}/${c.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE },
        { "@type": "ListItem", position: 2, name: c.trilha, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "BestBarbers",
      url,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, iOS, Android",
      description: c.descricao,
      offers: { "@type": "Offer", price: "299", priceCurrency: "BRL", description: `${PRECO_NOME}, a partir de R$299 por mês` },
      featureList: c.tabela.linhas.map((r) => r.nome),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: c.faq.itens.map((f) => ({ "@type": "Question", name: f.pergunta, acceptedAnswer: { "@type": "Answer", text: f.resposta } })),
    },
  ];
}

export function PaginaDeRecurso({ conteudo: c }: { conteudo: ConteudoDeRecurso }) {
  return (
    <main className="min-h-screen overflow-x-hidden max-w-[100vw] w-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(c)) }} />
      <Navbar />

      {/* Trilha */}
      <section className="bg-[#121212] pt-28 pb-4">
        <div className="container-custom">
          <nav aria-label="Trilha" className="text-sm text-gray-400">
            <Link href="/" className="hover:text-[#ffaf02] transition-colors">Início</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{c.trilha}</span>
          </nav>
        </div>
      </section>

      {/* Herói: título que nomeia o produto + uma frase + 3 destaques */}
      <section className="bg-[#121212] pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="container-custom">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl">{c.h1}</h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">{c.frase}</p>
          <ul className="mt-8 space-y-3 text-gray-200 max-w-2xl">
            {c.destaques.map((d) => (
              <li key={d} className="flex gap-3"><Feito />{d}</li>
            ))}
          </ul>
          <div className="mt-10">
            <FeatureCTA originDesc={c.originDesc} className={BOTAO}>{c.botao}</FeatureCTA>
          </div>
          <p className="mt-6 text-sm text-gray-400 max-w-3xl">{c.prova}</p>
        </div>
      </section>

      {/* Resposta direta: o que é */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom max-w-3xl">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212]">{c.oQueE.titulo}</h2>
          {c.oQueE.paragrafos.map((p, i) => (
            <p key={i} className={`${i === 0 ? "mt-6" : "mt-4"} text-gray-700 text-lg leading-relaxed`}>{p}</p>
          ))}
        </div>
        {c.comparacao && (
          <div className="mt-14">
            <div className="container-custom">
              <h2 className="text-2xl md:text-3xl font-bold text-[#121212]">{c.comparacao.titulo}</h2>
              <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                    <tr>
                      {c.comparacao.colunas.map((col, i) => (
                        <th key={col} scope="col" className={`px-3 md:px-6 py-3 ${i === 0 ? "w-[28%]" : "w-[36%]"}`}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {c.comparacao.linhas.map(([tema, nosso, outro]) => (
                      <tr key={tema} className="align-top">
                        <th scope="row" className="px-3 md:px-6 py-4 text-[#121212] font-semibold text-sm md:text-base">{tema}</th>
                        <td className="px-3 md:px-6 py-4 text-[#121212] text-sm md:text-base leading-relaxed">{nosso}</td>
                        <td className="px-3 md:px-6 py-4 text-gray-500 text-sm md:text-base leading-relaxed">{outro}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* O que faz: tabela de relance */}
      <section className="bg-[#121212] py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-white">{c.tabela.titulo}</h2>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-gray-300 text-xs uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-4 md:px-6 py-3 w-[38%]">Recurso</th>
                  <th scope="col" className="px-4 md:px-6 py-3">O que resolve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {c.tabela.linhas.map((r) => (
                  <tr key={r.nome} className="align-top">
                    <th scope="row" className="px-4 md:px-6 py-4 text-white font-semibold text-sm md:text-base">
                      {r.href ? (
                        <Link href={r.href} className="underline underline-offset-4 decoration-white/30 hover:text-[#ffaf02] transition-colors">{r.nome}</Link>
                      ) : r.nome}
                      {r.modulo && <span className="block mt-1 text-xs font-normal text-gray-500">à parte</span>}
                    </th>
                    <td className="px-4 md:px-6 py-4 text-gray-300 text-sm md:text-base leading-relaxed">{r.resolve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Passo a passo */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212]">{c.passos.titulo}</h2>
          {c.passos.sub && <p className="mt-4 text-gray-600 text-lg max-w-3xl">{c.passos.sub}</p>}
          <ol className="mt-10 grid md:grid-cols-2 gap-6">
            {c.passos.itens.map((p, i) => (
              <li key={p.titulo} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <p className="text-sm font-bold text-[#b37a00]">{i + 1}</p>
                <h3 className="mt-1 text-lg font-bold text-[#121212]">{p.titulo}</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Preço */}
      <section className="bg-[#121212] py-16 md:py-20">
        <div className="container-custom max-w-3xl">
          <h2 className="text-2xl md:text-4xl font-bold text-white">{c.preco.titulo}</h2>
          <p className="mt-6 text-gray-300 text-lg">{PRECO_NOME}</p>
          <p className="mt-2 text-4xl md:text-5xl font-bold text-[#ffaf02]">A partir de R$299 por mês</p>
          {c.preco.nota && <p className="mt-4 text-gray-200 leading-relaxed">{c.preco.nota}</p>}
          <ul className="mt-8 space-y-3 text-gray-200">
            {PRECO_ITENS.map((d) => (
              <li key={d} className="flex gap-3"><Feito />{d}</li>
            ))}
          </ul>
          <p className="mt-6 text-gray-400">{PRECO_A_PARTE}</p>
          <div className="mt-10">
            <FeatureCTA originDesc={c.originDesc} className={BOTAO}>QUERO SABER O PREÇO PARA MINHA BARBEARIA</FeatureCTA>
          </div>
        </div>
      </section>

      {/* Quem já usa */}
      {c.casos && (
        <section className="bg-white py-16 md:py-20">
          <div className="container-custom">
            <h2 className="text-2xl md:text-4xl font-bold text-[#121212]">{c.casos.titulo}</h2>
            <p className="mt-4 text-gray-600 text-lg max-w-3xl">{c.casos.sub}</p>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {c.casos.itens.map((k) => (
                <div key={k.cidade} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                  <h3 className="text-lg font-bold text-[#121212]">{k.porte}</h3>
                  <p className="text-sm text-gray-500">{k.cidade}</p>
                  <p className="mt-6 text-3xl font-bold text-[#b37a00]">{k.assinantes}</p>
                  <p className="text-sm text-gray-600">assinantes</p>
                  <p className="mt-4 text-3xl font-bold text-[#b37a00]">{k.valor}</p>
                  <p className="text-sm text-gray-600">de assinatura por mês</p>
                  <p className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">{k.nota}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Perguntas: a mesma lista vai para o JSON-LD */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container-custom max-w-3xl">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212] mb-10">{c.faq.titulo}</h2>
          <div className="space-y-4">
            {c.faq.itens.map((f) => (
              <div key={f.pergunta} className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-[#121212]">{f.pergunta}</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">{f.resposta}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-gray-600">{c.leiaTambem}</p>
        </div>
      </section>

      {/* Chamada final */}
      <section className="bg-[#121212] py-16 md:py-24">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white max-w-3xl mx-auto">{c.fim.titulo}</h2>
          <p className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto">{c.fim.texto}</p>
          <div className="mt-10">
            <FeatureCTA originDesc={c.originDesc} className={BOTAO}>{c.botao}</FeatureCTA>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
