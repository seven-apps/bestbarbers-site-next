import type { Metadata } from "next";

/**
 * /dezembro-lotado/materiais — a página do QR ÚNICO da palestra do André no
 * Projeto Dezembro Lotado (06/09/2026, BH). Decisão do André (05/Set): um QR só,
 * no último slide, que abre esta lista com tudo que foi citado no palco.
 *
 * Atribuição: todo link interno leva ?origin=120004072 (origem Ploomes "Evento -
 * Dezembro Lotado") + utm_medium=materiais, então os forms das páginas de destino
 * creditam o evento (lógica em src/hooks/useUtmParams.ts: originId explícito na URL
 * tem prioridade máxima). Podcast e YouTube não têm form: medem só por UTM.
 * Efêmera, noindex e fora do sitemap (mesmo critério da LP /dezembro-lotado).
 */
export const metadata: Metadata = {
  title: "Dezembro Lotado — materiais da palestra | BestBarbers",
  description:
    "Tudo que o André citou no palco do Projeto Dezembro Lotado: guia Cadeira Cheia, calculadora de preço do clube, guia Assinatura do Zero, podcast, canal e as 25 vagas.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/dezembro-lotado/materiais" },
};

const ORIGIN = "120004072";
const UTM = "utm_source=evento&utm_medium=materiais&utm_campaign=evento-dezembro-lotado";
const interno = (path: string, content: string) => `${path}?origin=${ORIGIN}&${UTM}&utm_content=${content}`;
const externo = (url: string, content: string) => `${url}?${UTM}&utm_content=${content}`;

type Item = {
  estrategia: string;
  titulo: string;
  descricao: string;
  href: string;
  cta: string;
  externo?: boolean;
};

const ITENS: Item[] = [
  {
    estrategia: "Estratégia 1 · reativando clientes da base",
    titulo: "Guia Cadeira Cheia",
    descricao: "As 6 mensagens prontas pra trazer de volta quem sumiu, na ordem certa: reconhecimento, convite e rotina.",
    href: interno("/cadeira-cheia", "cadeira-cheia"),
    cta: "Baixar o guia grátis",
  },
  {
    estrategia: "Estratégia 4 · clube de segunda a quarta",
    titulo: "Calculadora de preço do clube",
    descricao: "A regra dos dois cortes com o seu preço de corte: o teto do ilimitado e onde fica o plano de segunda a quarta.",
    href: interno("/tabela-precificacao-clube", "calculadora"),
    cta: "Abrir a calculadora",
  },
  {
    estrategia: "Pra montar o clube do zero ou consertar o que já tem",
    titulo: "Guia Assinatura do Zero",
    descricao: "Preço com conta, a conversa com a equipe, os 12 erros que derrubam o clube e a cobrança que entra sozinha.",
    href: interno("/do-zero-a-assinatura", "assinatura-do-zero"),
    cta: "Baixar o guia grátis",
  },
  {
    estrategia: "Podcast · temporada Assinatura do Zero",
    titulo: "12 episódios de uns 13 minutos",
    descricao: "Do \"clube não é desconto\" até os primeiros cem assinantes: preço, comissão do barbeiro e venda na cadeira.",
    href: `/podcast?${UTM}&utm_content=podcast`,
    cta: "Ouvir no Spotify",
  },
  {
    estrategia: "Estratégias 1 e 3 · reativação e venda na cadeira",
    titulo: "Canal da BestBarbers no YouTube",
    descricao: "Os vídeos sobre vendas e recuperação de clientes. Segunda, 07/09, às 19h: o método inteiro da venda na cadeira, com as frases prontas pra sua equipe.",
    href: externo("https://www.youtube.com/channel/UCpszGMvQZtL_piwJVmf6kow", "youtube"),
    cta: "Abrir o canal",
    externo: true,
  },
];

const font = { fontFamily: "var(--font-montserrat)" } as const;

export default function DezembroLotadoMateriais() {
  return (
    <main className="min-h-screen" style={{ background: "#0c0c0c" }}>
      <div className="container-custom py-10 md:py-16 max-w-3xl mx-auto">
        <p
          className="text-center text-xs md:text-sm font-bold uppercase mb-6"
          style={{ ...font, color: "#ffaf02", letterSpacing: "3px" }}
        >
          Projeto Dezembro Lotado · 06/09 · Belo Horizonte
        </p>

        <h1
          className="text-center leading-tight mb-4"
          style={{ ...font, fontWeight: 800, fontSize: "clamp(28px, 4.5vw, 42px)", color: "#ffffff" }}
        >
          Tudo que o André citou no palco, <span style={{ color: "#ffaf02" }}>num lugar só</span>
        </h1>
        <p className="text-center text-base md:text-lg mb-10" style={{ ...font, color: "rgba(255,255,255,0.72)" }}>
          Os guias, a calculadora, o podcast e o canal. E, no fim, a lista das 25 vagas do evento.
        </p>

        {/* Destaque: as 25 vagas */}
        <a
          href={interno("/dezembro-lotado", "vagas")}
          className="block rounded-2xl p-6 md:p-7 mb-10 transition-transform hover:-translate-y-0.5"
          style={{ background: "#ffaf02", color: "#121212", textDecoration: "none" }}
        >
          <p className="text-xs font-bold uppercase mb-2" style={{ ...font, letterSpacing: "2px", opacity: 0.75 }}>
            Condição de hoje · só pra quem fecha no evento
          </p>
          <p className="mb-3" style={{ ...font, fontWeight: 800, fontSize: "clamp(20px, 3vw, 26px)", lineHeight: 1.15 }}>
            25 vagas em que o desenvolvimento do app com a marca da sua barbearia fica por nossa conta
          </p>
          <p className="text-sm md:text-base" style={{ ...font, fontWeight: 600 }}>
            Entrar na lista das vagas →
          </p>
        </a>

        <ol className="space-y-4">
          {ITENS.map((item) => (
            <li key={item.titulo}>
              <a
                href={item.href}
                target={item.externo ? "_blank" : undefined}
                rel={item.externo ? "noopener noreferrer" : undefined}
                className="block rounded-2xl p-5 md:p-6 transition-colors"
                style={{ background: "#161616", border: "1px solid rgba(255,175,2,0.22)", textDecoration: "none" }}
              >
                <p className="text-[11px] font-bold uppercase mb-2" style={{ ...font, color: "#ffaf02", letterSpacing: "2px" }}>
                  {item.estrategia}
                </p>
                <p className="mb-2" style={{ ...font, fontWeight: 800, fontSize: "clamp(18px, 2.6vw, 22px)", color: "#ffffff", lineHeight: 1.2 }}>
                  {item.titulo}
                </p>
                <p className="text-sm md:text-[15px] mb-3" style={{ ...font, color: "rgba(255,255,255,0.72)" }}>
                  {item.descricao}
                </p>
                <p className="text-sm font-bold" style={{ ...font, color: "#ffaf02" }}>
                  {item.cta} →
                </p>
              </a>
            </li>
          ))}
        </ol>

        <p className="text-center text-xs mt-12" style={{ ...font, color: "rgba(255,255,255,0.4)" }}>
          BestBarbers — a plataforma de mais de 1.300 barbearias · Estande: traz o seu preço de corte que a gente
          monta a conta do plano com os seus números.
        </p>
      </div>
    </main>
  );
}
