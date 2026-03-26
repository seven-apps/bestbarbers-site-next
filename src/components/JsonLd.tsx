const faqItems = [
  {
    question: "O que é o App Próprio personalizado?",
    answer:
      "É um aplicativo exclusivo da sua barbearia, publicado na App Store e Play Store com o nome e a identidade visual do seu negócio. Seus clientes baixam o app da sua barbearia e acessam apenas os serviços do seu estabelecimento, sem ver concorrentes.",
  },
  {
    question: "Quanto tempo leva para ter meu App Próprio publicado nas lojas?",
    answer:
      "Após a assinatura do contrato e envio das informações necessárias (logo, cores, dados do negócio), o processo de desenvolvimento e publicação leva em média 15 a 30 dias úteis, dependendo da aprovação das lojas (Apple e Google).",
  },
  {
    question:
      "Posso enviar notificações personalizadas para meus clientes?",
    answer:
      "Sim! Com o App Próprio você pode enviar push notifications personalizadas diretamente para o celular dos seus clientes. Ideal para avisar sobre promoções, lembrar de agendamentos, comunicar novidades ou reativar clientes inativos.",
  },
  {
    question: "Como funciona o Clube de Assinaturas?",
    answer:
      "O Clube de Assinaturas permite que você crie planos recorrentes (mensais, quinzenais, semanais) para seus clientes. Eles pagam automaticamente e têm direito a um número determinado de serviços por período. Isso gera receita previsível e fideliza o cliente.",
  },
  {
    question: "Posso criar diferentes tipos de planos de assinatura?",
    answer:
      "Sim! Você pode criar planos limitados (ex: 4 cortes por mês) ou ilimitados (cortes ilimitados por mês). Também pode incluir diferentes serviços em cada plano e definir preços diferenciados.",
  },
  {
    question:
      "O que acontece quando um cliente assinante está inadimplente?",
    answer:
      "O sistema bloqueia automaticamente o agendamento de clientes inadimplentes e envia notificações de lembrete de pagamento. Você também pode acompanhar relatórios de inadimplência e chargeback.",
  },
  {
    question: "Como recebo os pagamentos das assinaturas?",
    answer:
      "Os pagamentos são processados automaticamente e o valor é creditado na sua conta. Você pode acompanhar o extrato de recebimentos, faturas previstas e fazer saques diretamente pelo sistema.",
  },
  {
    question: "Como funciona a emissão automática de Notas Fiscais?",
    answer:
      "O sistema emite automaticamente a nota fiscal de serviço (NFS-e) após cada atendimento ou pagamento. Você configura os dados fiscais uma vez e o sistema cuida do resto.",
  },
  {
    question:
      "Preciso ter CNPJ para emitir notas fiscais pelo sistema?",
    answer:
      "Sim, é necessário ter CNPJ e estar cadastrado na prefeitura da sua cidade para emissão de NFS-e. Nosso time pode ajudar você a configurar a integração com o sistema da sua prefeitura.",
  },
  {
    question: "Posso exportar as notas fiscais emitidas?",
    answer:
      "Sim! Você pode exportar todas as notas fiscais em formato PDF e XML, além de ter acesso ao histórico completo de notas emitidas para controle contábil.",
  },
  {
    question: "Como funciona o agendamento online?",
    answer:
      "Seus clientes podem agendar serviços 24 horas por dia, 7 dias por semana, diretamente pelo aplicativo ou pelo link personalizado da sua barbearia. Eles escolhem o profissional, serviço, data e horário disponíveis.",
  },
  {
    question: "Os clientes recebem lembretes dos agendamentos?",
    answer:
      "Sim! O sistema envia automaticamente notificações e lembretes de agendamento para os clientes, reduzindo faltas e no-shows. Você pode configurar quando e quantos lembretes enviar.",
  },
  {
    question: "Posso bloquear horários específicos na agenda?",
    answer:
      "Sim! Você pode bloquear horários para folgas, reuniões, ou qualquer outro compromisso. Também pode configurar os horários de funcionamento de cada profissional individualmente.",
  },
  {
    question: "Quais formas de pagamento o sistema aceita?",
    answer:
      "O sistema aceita pagamento em dinheiro, cartão de crédito/débito (presencial ou online), Pix, e pagamentos recorrentes para assinaturas. Tudo é registrado automaticamente no controle financeiro.",
  },
  {
    question: "Como funciona a gestão de comissões dos barbeiros?",
    answer:
      "Você configura a porcentagem ou valor fixo de comissão para cada serviço e profissional. O sistema calcula automaticamente quanto cada barbeiro tem a receber e gera relatórios detalhados.",
  },
  {
    question: "O que é o Totem de Autoatendimento?",
    answer:
      "É um equipamento físico (tablet em suporte) que fica na sua barbearia permitindo que o cliente faça check-in, adicione produtos à comanda, efetue pagamento e agende o próximo atendimento de forma autônoma.",
  },
  {
    question: "Preciso comprar o Totem separadamente?",
    answer:
      "O Totem é um adicional opcional ao plano App Exclusivo. Você pode adquiri-lo para modernizar o atendimento da sua barbearia e reduzir filas no caixa.",
  },
  {
    question: "Quantos barbeiros posso cadastrar no sistema?",
    answer:
      "Não há limite! Tanto no plano Básico quanto no App Exclusivo, você pode cadastrar quantos barbeiros e profissionais precisar, sem custos adicionais por usuário.",
  },
  {
    question: "O sistema funciona em múltiplas unidades?",
    answer:
      "Sim! Se você tem mais de uma barbearia, pode gerenciar todas as unidades em um único painel, com relatórios consolidados ou separados por unidade.",
  },
  {
    question: "Tem suporte se eu tiver dúvidas?",
    answer:
      "Sim! Oferecemos suporte por WhatsApp e e-mail para todos os clientes. No plano App Exclusivo, você ainda conta com um gerente de contas exclusivo para te ajudar.",
  },
];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BestBarbers",
  alternateName: "Best Barbers",
  url: "https://www.bestbarbers.app",
  logo: "https://www.bestbarbers.app/images/Logo-BestBarbers-branco_1.webp",
  description:
    "Plataforma completa para barbearias com app próprio, clube de assinaturas e gestão integrada",
  foundingDate: "2020",
  numberOfEmployees: { "@type": "QuantitativeValue", value: 50 },
  sameAs: [
    "https://www.instagram.com/bestbarbersapp/",
    "https://apps.apple.com/br/app/bestbarbers/id1501336370",
    "https://play.google.com/store/apps/details?id=bestbarbers.app",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+55-31-99065-7164",
    contactType: "sales",
    availableLanguage: "Portuguese",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "1200",
    bestRating: "5",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BestBarbers",
  applicationCategory: "BusinessApplication",
  operatingSystem: "iOS, Android, Web",
  description:
    "Sistema completo para barbearias com app próprio, clube de assinaturas, agendamento online e gestão financeira",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "0",
    highPrice: "299",
    priceCurrency: "BRL",
    offerCount: "2",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "1200",
  },
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
    "Multi-unidades",
    "Controle de comandas",
  ],
};

const faqSchema = {
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

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BestBarbers",
  url: "https://www.bestbarbers.app",
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "BestBarbers - Sistema para Barbearia",
  description: "Plataforma all-in-one para barbearias com app próprio, clube de assinaturas, agendamento online e gestão financeira completa",
  brand: { "@type": "Brand", name: "BestBarbers" },
  review: [
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Dono de Rede com 6 Unidades" },
      reviewBody:
        "6 unidades, 1.000 assinantes, R$440K/mês. O BestBarbers transformou nossa operação.",
      reviewRating: { "@type": "Rating", ratingValue: "5" },
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Dono de Barbearia em SP" },
      reviewBody:
        "4 cadeiras, 353 assinantes, de R$15K para R$31.690/mês. Dobramos o faturamento.",
      reviewRating: { "@type": "Rating", ratingValue: "5" },
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "1200",
    bestRating: "5",
  },
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
    </>
  );
}
