import { faqItems } from "@/content/faq-home";

/**
 * FAQ no dado estruturado = só o que o HTML da home mostra sem clique (a aba aberta, "App Próprio"), e sem o prazo de
 * publicação do app, que não tem medição (knowledge/dominio/bestbarbers-product-features.md, 03/Nov/26). Antes eram 20
 * perguntas, 17 invisíveis e algumas com recurso que não existe (assinatura no Pix, painel consolidado da rede).
 * FAQ não dá mais caixa na busca para empresa (Google, ago/2023), mas o Google e as IAs leem o par pergunta-resposta.
 */
const faqVisivel = faqItems.filter((item) => item.category === "App Próprio" && !item.question.startsWith("Quanto tempo"));

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BestBarbers",
  alternateName: "Best Barbers",
  url: "https://www.bestbarbers.app",
  logo: "https://www.bestbarbers.app/images/bestbarbers-logo-black.png", // o branco sumia no fundo branco do Google
  description:
    "Plataforma completa para barbearias com app próprio, clube de assinaturas e gestão integrada",
  foundingDate: "2020",
  numberOfEmployees: { "@type": "QuantitativeValue", value: 50 },
  sameAs: [
    "https://www.instagram.com/bestbarbersapp/",
    "https://www.linkedin.com/company/bestbarbers/",
    "https://www.youtube.com/@bestbarbers",
    "https://www.facebook.com/bestbarbersapp",
    "https://www.tiktok.com/@bestbarbersapp",
    "https://apps.apple.com/br/app/bestbarbers/id1501336370",
    "https://play.google.com/store/apps/details?id=bestbarbers.app",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+55-31-99065-7164",
    contactType: "sales",
    availableLanguage: "Portuguese",
  },
  // `aggregateRating` removido em 19/Set/26: eram 4,8 estrelas com 1.200 avaliações, e o
  // 1.200 é o número de BARBEARIAS na plataforma, reaproveitado como número de avaliações.
  // Não existe uma avaliação real por trás. Rich snippet de avaliação fabricada é motivo de
  // penalização manual no Google. Só volta com avaliação real, auditável e com a fonte citada.
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BestBarbers",
  applicationCategory: "BusinessApplication",
  operatingSystem: "iOS, Android, Web",
  description:
    "Sistema completo para barbearias com app próprio, clube de assinaturas, agendamento online e gestão financeira",
  // Sem "lowPrice 0": não existe plano grátis. Preço público canônico: "a partir de R$299/mês" (product-features).
  offers: {
    "@type": "Offer",
    price: "299",
    priceCurrency: "BRL",
    description: "A partir de R$299/mês",
  },
  // `aggregateRating` removido em 19/Set/26: eram 4,8 estrelas com 1.200 avaliações, e o
  // 1.200 é o número de BARBEARIAS na plataforma, reaproveitado como número de avaliações.
  // Não existe uma avaliação real por trás. Rich snippet de avaliação fabricada é motivo de
  // penalização manual no Google. Só volta com avaliação real, auditável e com a fonte citada.
  featureList: [
    "App próprio personalizado na App Store e Play Store",
    "Clube de assinaturas com cobrança automática",
    "Agendamento online 24/7",
    "Emissão automática de NFS-e",
    "Gestão financeira completa",
    "Gestão de comissões automática",
    "Totem de autoatendimento",
    "Notificações push personalizadas",
    "Gestão de estoque",
    "Relatórios gerenciais",
    "Várias unidades no mesmo login",
    "Controle de comandas",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqVisivel.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BestBarbers",
  url: "https://www.bestbarbers.app",
  // Sem SearchAction: a URL apontava para uma busca que não existe e o Google aposentou a caixa de busca em 2024.
};

// `Product` saiu (23/Nov/26): sem offers, review nem nota é inválido para o Google; o produto já está no SoftwareApplication.

export function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
