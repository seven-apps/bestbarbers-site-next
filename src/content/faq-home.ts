/**
 * Perguntas da home: a MESMA lista alimenta a seção visível (FAQSection) e o JSON-LD (JsonLd.tsx).
 * Antes eram duas cópias que divergiam (SEO, 23/Nov/26). Mudou uma resposta? Muda só aqui.
 */
export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const faqItems: FAQItem[] = [
  // App Próprio
  {
    category: "App Próprio",
    question: "O que é o App Próprio personalizado?",
    answer: "É um aplicativo exclusivo da sua barbearia, publicado na App Store e Play Store com o nome e a identidade visual do seu negócio. Seus clientes baixam o app da sua barbearia e acessam apenas os serviços do seu estabelecimento, sem ver concorrentes.",
  },
  {
    category: "App Próprio",
    question: "Quanto tempo leva para ter meu App Próprio publicado nas lojas?",
    answer: "Você manda o nome e a logo, e o nosso time prepara o app. Quem decide a data é a Apple e o Google, que conferem cada aplicativo antes de publicar. Enquanto isso, o cliente já marca pelo link da sua barbearia.",
  },
  {
    category: "App Próprio",
    question: "Posso enviar notificações personalizadas para meus clientes?",
    answer: "Sim! Com o App Próprio você pode enviar push notifications personalizadas diretamente para o celular dos seus clientes. Ideal para avisar sobre promoções, lembrar de agendamentos, comunicar novidades ou reativar clientes inativos.",
  },
  // Clube de Assinaturas
  {
    category: "Clube de Assinaturas",
    question: "Como funciona o Clube de Assinaturas?",
    answer: "O Clube de Assinaturas permite que você crie planos recorrentes (mensais, quinzenais, semanais) para seus clientes. Eles pagam automaticamente e têm direito a um número determinado de serviços por período. Isso gera receita previsível e fideliza o cliente.",
  },
  {
    category: "Clube de Assinaturas",
    question: "Posso criar diferentes tipos de planos de assinatura?",
    // "Cortes ilimitados" saiu: o clube do produto é por CRÉDITOS ou por DIAS DE USO
    // — a régua está escrita em src/components/clube/FAQClube.tsx ("nunca corte
    // ilimitado"). A home descrevia o mesmo produto de um jeito que a /clube proíbe.
    answer: "Sim! Você pode criar planos por créditos (ex: 4 cortes por mês) ou por dias de uso, incluir serviços diferentes em cada plano e definir preços diferenciados. O sistema controla sozinho o que cada assinante já usou no período.",
  },
  {
    category: "Clube de Assinaturas",
    question: "O que acontece quando um cliente assinante está inadimplente?",
    answer: "O sistema bloqueia automaticamente o agendamento de clientes inadimplentes e envia notificações de lembrete de pagamento. Você também pode acompanhar relatórios de inadimplência e chargeback.",
  },
  {
    category: "Clube de Assinaturas",
    question: "Como recebo os pagamentos das assinaturas?",
    answer: "Os pagamentos são processados automaticamente e o valor é creditado na sua conta. Você pode acompanhar o extrato de recebimentos, faturas previstas e fazer saques diretamente pelo sistema.",
  },
  // Notas Fiscais
  {
    category: "Notas Fiscais",
    question: "Como funciona a emissão automática de Notas Fiscais?",
    answer: "O sistema emite automaticamente a nota fiscal de serviço (NFS-e) após cada atendimento ou pagamento. Você configura os dados fiscais uma vez e o sistema cuida do resto.",
  },
  {
    category: "Notas Fiscais",
    question: "Preciso ter CNPJ para emitir notas fiscais pelo sistema?",
    answer: "Sim, é necessário ter CNPJ e estar cadastrado na prefeitura da sua cidade para emissão de NFS-e. Nosso time pode ajudar você a configurar a integração com o sistema da sua prefeitura.",
  },
  {
    category: "Notas Fiscais",
    question: "Posso exportar as notas fiscais emitidas?",
    answer: "Sim! Você pode exportar todas as notas fiscais em formato PDF e XML, além de ter acesso ao histórico completo de notas emitidas para controle contábil.",
  },
  // Agendamentos
  {
    category: "Agendamentos",
    question: "Como funciona o agendamento online?",
    answer: "Seus clientes podem agendar serviços 24 horas por dia, 7 dias por semana, diretamente pelo aplicativo ou pelo link personalizado da sua barbearia. Eles escolhem o profissional, serviço, data e horário disponíveis.",
  },
  {
    category: "Agendamentos",
    question: "Os clientes recebem lembretes dos agendamentos?",
    answer: "Sim! O sistema envia automaticamente notificações e lembretes de agendamento para os clientes, reduzindo faltas e no-shows. Você pode configurar quando e quantos lembretes enviar.",
  },
  {
    category: "Agendamentos",
    question: "Posso bloquear horários específicos na agenda?",
    answer: "Sim! Você pode bloquear horários para folgas, reuniões, ou qualquer outro compromisso. Também pode configurar os horários de funcionamento de cada profissional individualmente.",
  },
  // Gestão Financeira
  {
    category: "Gestão Financeira",
    question: "Quais formas de pagamento o sistema aceita?",
    answer: "No balcão, você registra dinheiro, Pix, cartão de débito e cartão de crédito. A assinatura é cobrada só no cartão de crédito, todo mês.",
  },
  {
    category: "Gestão Financeira",
    question: "Como funciona a gestão de comissões dos barbeiros?",
    answer: "Você configura a porcentagem ou valor fixo de comissão para cada serviço e profissional. O sistema calcula automaticamente quanto cada barbeiro tem a receber e gera relatórios detalhados.",
  },
  // Totem
  {
    category: "Totem",
    question: "O que é o Totem de Autoatendimento?",
    answer: "É um equipamento físico (tablet em suporte) que fica na sua barbearia permitindo que o cliente faça check-in, adicione produtos à comanda, efetue pagamento e agende o próximo atendimento de forma autônoma.",
  },
  {
    category: "Totem",
    question: "Preciso comprar o Totem separadamente?",
    answer: "O Totem é um adicional opcional ao plano App Exclusivo. Você pode adquiri-lo para modernizar o atendimento da sua barbearia e reduzir filas no caixa.",
  },
  // Geral
  {
    category: "Geral",
    question: "Quantos barbeiros posso cadastrar no sistema?",
    answer: "Não há limite! Tanto no plano Básico quanto no App Exclusivo, você pode cadastrar quantos barbeiros e profissionais precisar, sem custos adicionais por usuário.",
  },
  {
    category: "Geral",
    question: "O sistema funciona em múltiplas unidades?",
    answer: "Sim! Se você tem mais de uma barbearia, pode gerenciar todas as unidades em um único painel, com relatórios consolidados ou separados por unidade.",
  },
  {
    category: "Geral",
    question: "Tem suporte se eu tiver dúvidas?",
    answer: "Sim! Oferecemos suporte por WhatsApp e e-mail para todos os clientes. No plano App Exclusivo, você ainda conta com um gerente de contas exclusivo para te ajudar.",
  },
];
