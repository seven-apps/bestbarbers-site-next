import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FeatureCTA } from "@/components/FeatureCTA";

/**
 * Página dona das buscas "sistema para barbearia", "sistema de barbearia", "software/programa para barbearia" e
 * "gestão de barbearia" (SEO lote 1, 23/Nov/26; plano em bestbarbers-ai/docs/operacional/seo/PLANO.md).
 * A home é a dona de "app/aplicativo para barbearia" e é linkada daqui com esse texto.
 *
 * Todo recurso citado foi conferido em bestbarbers-ai/knowledge/dominio/bestbarbers-product-features.md (03/Nov/26).
 * Saíram da versão anterior por não terem fonte ou não existirem: assinatura no Pix, plano grátis, painel consolidado
 * da rede, "faturam 3x mais", prazo de 15 dias para o app, "NFS-e obrigatória / risco de multa", aviso antes de vencer.
 * FAQ visível = FAQ do JSON-LD (mesma lista). Preço público: só "a partir de R$299/mês".
 */

const TITULO = "Sistema para Barbearia: Agenda, Caixa, Comissão e Assinatura | BestBarbers";
const DESCRICAO =
  "Sistema para barbearia com agenda online, caixa, comissão calculada sozinha, assinatura cobrada no cartão e o aplicativo com a marca da sua barbearia. A partir de R$299/mês.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "/sistema-para-barbearia" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.bestbarbers.app/sistema-para-barbearia",
    title: "Sistema para barbearia | BestBarbers",
    description: DESCRICAO,
    siteName: "BestBarbers",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "BestBarbers — sistema para barbearia" }],
  },
};

type Recurso = { nome: string; resolve: string; href?: string; modulo?: boolean };

const RECURSOS: Recurso[] = [
  { nome: "Agenda online", resolve: "O cliente vê os horários livres e marca sozinho pelo link ou pelo app, a qualquer hora.", href: "/agendamento-online" },
  { nome: "Aplicativo com a sua marca", resolve: "O cliente baixa o app com o nome da sua barbearia na App Store e no Google Play.", href: "/app-proprio-barbearia" },
  { nome: "Lembrete do horário", resolve: "O app avisa o cliente na véspera e de novo perto do horário marcado.", href: "/agendamento-online" },
  { nome: "Assinatura", resolve: "A mensalidade é cobrada no cartão de crédito, todo mês, na mesma data. Quem está com o pagamento atrasado não agenda.", href: "/clube-de-assinaturas", modulo: true },
  { nome: "Comissão dos barbeiros", resolve: "Calculada sozinha para cada barbeiro, inclusive a da assinatura. O barbeiro vê o fechamento dele no app.", href: "/gestao-comissoes-barbeiro" },
  { nome: "Caixa e financeiro", resolve: "Caixa, extrato, entradas e saídas e o relatório do mês por barbeiro.", href: "/gestao-financeira-barbearia" },
  { nome: "Clientes", resolve: "Quando cada cliente veio, quantas vezes e quanto gastou. A lista de quem sumiu sai pronta para você chamar de volta pelo app." },
  { nome: "Nota fiscal", resolve: "Nota fiscal de serviço (NFS-e) e de produto (NFC-e) emitidas pelo sistema, com PDF e XML para o contador.", href: "/nota-fiscal-barbearia", modulo: true },
  { nome: "Totem de autoatendimento", resolve: "O cliente marca horário, faz check-in e paga sozinho no balcão.", href: "/totem-autoatendimento", modulo: true },
  { nome: "Produtos e estoque", resolve: "O produto vendido na comanda já sai do estoque." },
  { nome: "Várias unidades", resolve: "Todas as unidades no mesmo login: você troca de unidade no painel." },
  { nome: "Agente de IA no WhatsApp", resolve: "Atende o cliente no WhatsApp da barbearia e marca, remarca ou cancela o horário direto na agenda.", href: "/agente-ia-whatsapp", modulo: true },
];

const COMO_ESCOLHER = [
  { pergunta: "O cliente consegue marcar sozinho?", porque: "Se cada horário ainda passa pelo seu WhatsApp, o sistema virou só uma agenda digital." },
  { pergunta: "Ele calcula a comissão de cada barbeiro?", porque: "Inclusive a parte da assinatura, que é onde a conta na mão mais dá briga." },
  { pergunta: "Ele cobra a assinatura no cartão, todo mês?", porque: "E impede o cliente com o pagamento atrasado de agendar, sem você precisar cobrar ninguém." },
  { pergunta: "O app é da sua barbearia ou é um app com várias barbearias?", porque: "No app com a sua marca, o seu cliente só vê a sua barbearia." },
  { pergunta: "Quem implanta e quem atende depois?", porque: "Pergunte quem configura o sistema com você e com quem você fala quando tiver dúvida." },
  { pergunta: "Consigo trazer o que já tenho?", porque: "Clientes, serviços e os assinantes que você já cobra no PIX ou controla na planilha." },
];

const FAQ = [
  {
    pergunta: "O que é um sistema para barbearia?",
    resposta:
      "É o programa que junta num lugar só a agenda, o caixa, a comissão dos barbeiros e os clientes da barbearia. Ele substitui o caderno, a planilha e a conta de comissão feita na mão no fim do mês.",
  },
  {
    pergunta: "Qual o melhor sistema para barbearia?",
    resposta:
      "O que resolve, juntas, as três contas que mais tomam o tempo do dono: agenda, comissão e assinatura. Antes de escolher, confira se o cliente marca sozinho, se a comissão sai calculada por barbeiro e se a assinatura é cobrada no cartão todo mês. O BestBarbers faz as três, com o aplicativo da sua barbearia.",
  },
  {
    pergunta: "Quanto custa o sistema para barbearia do BestBarbers?",
    resposta:
      "O plano com o aplicativo da sua barbearia custa a partir de R$299 por mês. Assinatura, nota fiscal, totem e o agente de IA no WhatsApp são módulos contratados à parte. O valor final depende das unidades e dos módulos que você escolher.",
  },
  {
    pergunta: "Serve para barbearia de uma cadeira ou só para quem tem equipe?",
    resposta:
      "Serve para as duas. Agenda, caixa, clientes e assinatura funcionam do mesmo jeito. Com equipe, o sistema também calcula a comissão de cada barbeiro.",
  },
  {
    pergunta: "Já cobro assinatura no PIX ou controlo na planilha. Consigo trazer para o sistema?",
    resposta:
      "Sim. O BestBarbers importa a sua planilha com o vencimento de cada assinante, e o assinante cadastra o cartão no primeiro acesso ao app.",
  },
  {
    pergunta: "O barbeiro e o cliente usam pelo celular?",
    resposta:
      "Sim. O cliente marca pelo aplicativo da barbearia ou pelo link de agendamento. O barbeiro vê a agenda e o fechamento da comissão dele no app. O dono usa o painel pelo navegador.",
  },
];

const CASOS = [
  // Casos do banco vivo (knowledge/dominio/cases-clube.json, crivel: true, fora do cases-blocklist.json), sem nome da
  // barbearia. Todo valor é RECEITA DA ASSINATURA, nunca faturamento total.
  { porte: "Barbearia com 4 cadeiras", cidade: "Araxá/MG", assinantes: "277", valor: "R$30.447", nota: "De 99 assinantes e R$9.249/mês para 277 e R$30.447/mês em 19 meses, nas mesmas 4 cadeiras." },
  { porte: "Barbearia com 8 cadeiras", cidade: "Belo Horizonte/MG", assinantes: "600", valor: "R$72.577", nota: "De 88 para 600 assinantes em 25 meses, com a cobrança no cartão todo mês." },
  { porte: "Barbearia com 2 cadeiras", cidade: "São Paulo/SP", assinantes: "75", valor: "R$16.152", nota: "De R$4.844 para R$16.152/mês em 10 meses, com o app da própria marca." },
];

const URL = "https://www.bestbarbers.app/sistema-para-barbearia";
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://www.bestbarbers.app" },
      { "@type": "ListItem", position: 2, name: "Sistema para barbearia", item: URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BestBarbers",
    url: URL,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    description: DESCRICAO,
    offers: { "@type": "Offer", price: "299", priceCurrency: "BRL", description: "A partir de R$299/mês" },
    featureList: RECURSOS.map((r) => r.nome),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.pergunta, acceptedAnswer: { "@type": "Answer", text: f.resposta } })),
  },
];

const BOTAO =
  "inline-flex items-center justify-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]";

function Feito() {
  return <span className="text-[#ffaf02] mt-0.5 shrink-0" aria-hidden>&#10003;</span>;
}

export default function SistemaParaBarbearia() {
  return (
    <main className="min-h-screen overflow-x-hidden max-w-[100vw] w-full">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      {/* Trilha */}
      <section className="bg-[#121212] pt-28 pb-4">
        <div className="container-custom">
          <nav aria-label="Trilha" className="text-sm text-gray-400">
            <Link href="/" className="hover:text-[#ffaf02] transition-colors">Início</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Sistema para barbearia</span>
          </nav>
        </div>
      </section>

      {/* Herói: título que nomeia o produto + uma frase + 3 destaques */}
      <section className="bg-[#121212] pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="container-custom">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl">
            Sistema para barbearia
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
            O BestBarbers junta a agenda, o caixa, a comissão dos barbeiros e a assinatura dos clientes num lugar só,
            com o aplicativo da sua barbearia na App Store e no Google Play.
          </p>
          <ul className="mt-8 space-y-3 text-gray-200 max-w-2xl">
            <li className="flex gap-3"><Feito />O cliente marca o horário sozinho, pelo link ou pelo app</li>
            <li className="flex gap-3"><Feito />A comissão de cada barbeiro sai calculada</li>
            <li className="flex gap-3"><Feito />A assinatura é cobrada no cartão, todo mês</li>
          </ul>
          <div className="mt-10">
            <FeatureCTA originDesc="[Site]BT-Sistema" className={BOTAO}>
              QUERO O SISTEMA NA MINHA BARBEARIA
            </FeatureCTA>
          </div>
          <p className="mt-6 text-sm text-gray-400 max-w-3xl">
            Mais de 1.200 barbearias usam o BestBarbers, que gerencia mais de 51 mil assinaturas todo mês.
          </p>
        </div>
      </section>

      {/* Resposta direta: o que é */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom max-w-3xl">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212]">O que é um sistema para barbearia</h2>
          <p className="mt-6 text-gray-700 text-lg leading-relaxed">
            É o programa que junta num lugar só a agenda, o caixa, a comissão dos barbeiros e os clientes da
            barbearia. Ele substitui o caderno, a planilha e a conta de comissão feita na mão no fim do mês.
          </p>
          <p className="mt-4 text-gray-700 text-lg leading-relaxed">
            O BestBarbers foi feito só para barbearia. Por isso ele cuida do que sistema de salão não cuida: a comissão
            de cada barbeiro, a assinatura cobrada todo mês e o{" "}
            <Link href="/" className="text-[#b37a00] underline underline-offset-4 hover:text-[#121212]">aplicativo para barbearia</Link>{" "}
            com a sua marca.
          </p>
        </div>
      </section>

      {/* O que o sistema faz: tabela de relance */}
      <section className="bg-[#121212] py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-white">O que o sistema faz na sua barbearia</h2>
          <p className="mt-4 text-gray-400 max-w-3xl">Cada linha leva para a explicação completa do recurso.</p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-gray-300 text-xs uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-4 md:px-6 py-3 w-[38%]">Recurso</th>
                  <th scope="col" className="px-4 md:px-6 py-3">O que resolve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {RECURSOS.map((r) => (
                  <tr key={r.nome} className="align-top">
                    <th scope="row" className="px-4 md:px-6 py-4 text-white font-semibold text-sm md:text-base">
                      {r.href ? (
                        <Link href={r.href} className="hover:text-[#ffaf02] transition-colors underline-offset-4 hover:underline">{r.nome}</Link>
                      ) : r.nome}
                      {r.modulo && <span className="block mt-1 text-xs font-normal text-gray-500">módulo à parte</span>}
                    </th>
                    <td className="px-4 md:px-6 py-4 text-gray-300 text-sm md:text-base leading-relaxed">{r.resolve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Como escolher: a dúvida de quem compara */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212]">Como escolher um sistema para barbearia</h2>
          <p className="mt-4 text-gray-600 text-lg max-w-3xl">Seis perguntas para fazer antes de contratar qualquer sistema.</p>
          <ol className="mt-10 grid md:grid-cols-2 gap-6">
            {COMO_ESCOLHER.map((c, i) => (
              <li key={c.pergunta} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <p className="text-sm font-bold text-[#b37a00]">{i + 1}</p>
                <h3 className="mt-1 text-lg font-bold text-[#121212]">{c.pergunta}</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">{c.porque}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Preço */}
      <section className="bg-[#121212] py-16 md:py-20">
        <div className="container-custom max-w-3xl">
          <h2 className="text-2xl md:text-4xl font-bold text-white">Quanto custa</h2>
          <p className="mt-6 text-4xl md:text-5xl font-bold text-[#ffaf02]">A partir de R$299/mês</p>
          <ul className="mt-8 space-y-3 text-gray-200">
            <li className="flex gap-3"><Feito />Agenda, caixa, comissão, clientes e o aplicativo com a sua marca</li>
            <li className="flex gap-3"><Feito />Implantação feita pelo nosso time, com você</li>
            <li className="flex gap-3"><Feito />Gerente de contas para tirar as suas dúvidas</li>
            <li className="flex gap-3"><Feito />Assinatura, nota fiscal, totem e agente de IA são módulos à parte</li>
          </ul>
          <div className="mt-10">
            <FeatureCTA originDesc="[Site]BT-Sistema-Preco" className={BOTAO}>
              QUERO SABER O PREÇO PARA MINHA BARBEARIA
            </FeatureCTA>
          </div>
        </div>
      </section>

      {/* Quem já usa */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212]">Quem já usa a assinatura no sistema</h2>
          <p className="mt-4 text-gray-600 text-lg max-w-3xl">Receita mensal da assinatura de barbearias que usam o BestBarbers.</p>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {CASOS.map((c) => (
              <div key={c.cidade} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <h3 className="text-lg font-bold text-[#121212]">{c.porte}</h3>
                <p className="text-sm text-gray-500">{c.cidade}</p>
                <p className="mt-6 text-3xl font-bold text-[#b37a00]">{c.assinantes}</p>
                <p className="text-sm text-gray-600">assinantes</p>
                <p className="mt-4 text-3xl font-bold text-[#b37a00]">{c.valor}</p>
                <p className="text-sm text-gray-600">de assinatura por mês</p>
                <p className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">{c.nota}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perguntas: a mesma lista vai para o JSON-LD */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container-custom max-w-3xl">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212] mb-10">Perguntas sobre sistema para barbearia</h2>
          <div className="space-y-4">
            {FAQ.map((f) => (
              <div key={f.pergunta} className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-[#121212]">{f.pergunta}</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">{f.resposta}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-gray-600">
            Quer aprender a montar a assinatura antes de contratar? Veja o{" "}
            <Link href="/curso-assinatura" className="text-[#b37a00] underline underline-offset-4">curso grátis de assinatura</Link>{" "}
            e os artigos do <Link href="/blog" className="text-[#b37a00] underline underline-offset-4">blog para donos de barbearia</Link>.
          </p>
        </div>
      </section>

      {/* Chamada final */}
      <section className="bg-[#121212] py-16 md:py-24">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white max-w-3xl mx-auto">
            Fale com um especialista e veja o sistema funcionando
          </h2>
          <p className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto">
            Ele mostra a agenda, a comissão e a assinatura com o jeito da sua barbearia.
          </p>
          <div className="mt-10">
            <FeatureCTA originDesc="[Site]BT-Sistema" className={BOTAO}>
              QUERO O SISTEMA NA MINHA BARBEARIA
            </FeatureCTA>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
