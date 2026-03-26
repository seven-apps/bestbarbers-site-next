import type { BlogArticle } from "./types";

export const comoCalcularComissao: BlogArticle = {
  slug: "como-calcular-comissao-barbeiro",
  title: "Como Calcular Comissão de Barbeiro: Guia Completo com Exemplos",
  description:
    "Aprenda a calcular comissão de barbeiro corretamente: modelos fixo, percentual e misto, exemplos práticos com valores reais e como automatizar o cálculo para evitar erros e conflitos.",
  keywords: [
    "comissão barbeiro",
    "como calcular comissão barbeiro",
    "comissão barbeiro calcular",
    "porcentagem barbeiro",
    "comissão barbearia",
    "pagamento barbeiro comissão",
    "quanto pagar barbeiro",
  ],
  publishedAt: "2026-03-26",
  updatedAt: "2026-03-26",
  readingTime: 10,
  category: "Gestão Financeira",
  tags: ["comissão", "financeiro", "gestão", "barbeiros", "equipe"],
  relatedSlugs: ["barbearia-por-assinatura", "nfse-barbearia-2026"],
  relatedFeatures: [
    {
      title: "Gestão de Comissões Automática",
      href: "/gestao-comissoes-barbeiro",
      description:
        "Cálculo automático de comissões por barbeiro, por serviço e por período. Sem planilhas.",
    },
    {
      title: "Gestão Financeira Completa",
      href: "/gestao-financeira-barbearia",
      description:
        "Fluxo de caixa, relatórios diários e controle de pagamentos em tempo real.",
    },
    {
      title: "Clube de Assinaturas",
      href: "/clube-de-assinaturas",
      description:
        "Como calcular comissão de barbeiro sobre atendimentos de assinantes.",
    },
  ],
  sections: [
    {
      heading: "Por que acertar a comissão do barbeiro é tão importante",
      blocks: [
        {
          type: "paragraph",
          text: "A comissão é, depois do aluguel, o maior custo operacional de uma barbearia. Em muitos casos, as comissões dos barbeiros representam 40% a 60% do faturamento total. Acertar esse cálculo não é apenas uma questão contábil — é uma questão de sobrevivência do negócio e de retenção da equipe.",
        },
        {
          type: "paragraph",
          text: "Quando a comissão é baixa demais, os melhores barbeiros vão embora. Quando é alta demais, o dono trabalha o mês inteiro para pagar a equipe e não sobra margem para reinvestir. Encontrar o ponto de equilíbrio exige entender os diferentes modelos, calcular corretamente e — principalmente — ter transparência total com a equipe.",
        },
        {
          type: "paragraph",
          text: "O problema é que muitos donos de barbearia fazem esse cálculo na cabeça, em caderninhos, ou em planilhas quebradas. Erros de centavos se acumulam ao longo do mês, geram desconfiança, e eventualmente causam conflitos que poderiam ser totalmente evitados com um sistema transparente.",
        },
        {
          type: "callout",
          text: "Pesquisa BestBarbers: \"quanto pagar de comissão\" é a 3ª dúvida mais frequente entre novos donos de barbearia que entram na plataforma, com mais de 31 menções espontâneas na pesquisa de onboarding.",
        },
        {
          type: "paragraph",
          text: "Neste guia, vamos explicar os 3 modelos de comissão mais usados no mercado, com exemplos práticos de cálculo, vantagens e desvantagens de cada um, e como automatizar todo o processo para que ninguém precise conferir conta nenhuma no final do mês.",
        },
      ],
    },
    {
      heading: "Os 3 modelos de comissão para barbearias",
      blocks: [
        {
          type: "subheading",
          text: "Modelo 1: Comissão percentual (o mais comum)",
        },
        {
          type: "paragraph",
          text: "No modelo percentual, o barbeiro recebe uma porcentagem do valor de cada serviço que realiza. É o modelo mais usado em barbearias brasileiras pela simplicidade e pelo alinhamento de incentivos — quanto mais o barbeiro atende, mais ganha.",
        },
        {
          type: "paragraph",
          text: "As porcentagens praticadas no mercado variam bastante conforme a região e o porte da barbearia. Com base no que é comumente praticado no setor, as faixas mais observadas são:",
        },
        {
          type: "list",
          items: [
            "30% a 40%: Faixa mais comum para barbearias que fornecem todos os produtos e infraestrutura.",
            "40% a 50%: Barbearias premium com barbeiros especializados ou de alto ticket.",
            "50% a 60%: Barbeiros seniores em modelos de \"salão compartilhado\" onde o profissional traz a própria clientela.",
          ],
        },
        {
          type: "paragraph",
          text: "Exemplo prático: se o barbeiro cobra R$60 por corte e a comissão é de 40%, ele recebe R$24 por corte. Em um dia com 8 atendimentos, são R$192. Em 22 dias úteis, o barbeiro fatura R$4.224 e a barbearia fica com R$6.336 para cobrir custos fixos, produtos e margem.",
        },
        {
          type: "highlight",
          value: "30% a 50%",
          label: "Faixa de comissão mais comum em barbearias brasileiras",
        },
        {
          type: "subheading",
          text: "Modelo 2: Valor fixo por serviço",
        },
        {
          type: "paragraph",
          text: "No modelo fixo, o barbeiro recebe um valor pré-determinado por cada tipo de serviço, independente do preço cobrado do cliente. Por exemplo: R$20 por corte, R$15 por barba, R$30 por corte + barba.",
        },
        {
          type: "paragraph",
          text: "A vantagem desse modelo é a previsibilidade: tanto o dono quanto o barbeiro sabem exatamente quanto vai entrar e quanto vai sair. A desvantagem é que, quando a barbearia aumenta os preços, o barbeiro não se beneficia automaticamente — o que pode gerar insatisfação se não houver reajustes periódicos.",
        },
        {
          type: "paragraph",
          text: "Esse modelo funciona bem para barbearias com muitos serviços de valor variável (corte simples, platinado, progressiva, design de barba) onde a porcentagem fixa geraria discrepâncias grandes entre serviços simples e complexos.",
        },
        {
          type: "subheading",
          text: "Modelo 3: Fixo + percentual (modelo misto)",
        },
        {
          type: "paragraph",
          text: "O modelo misto combina um salário base fixo com uma porcentagem menor sobre os serviços. Por exemplo: R$1.500/mês fixo + 20% sobre os serviços realizados. É o modelo que oferece mais segurança para o barbeiro (ele tem uma renda mínima garantida) e, ao mesmo tempo, mantém o incentivo de produtividade.",
        },
        {
          type: "paragraph",
          text: "Esse modelo é especialmente útil para barbeiros em fase de construção de clientela (recém-contratados) ou em meses sazonalmente fracos. A desvantagem é que a gestão financeira fica mais complexa — o dono precisa acompanhar tanto o fixo quanto o variável de cada profissional.",
        },
        {
          type: "callout",
          text: "Dica: o modelo misto é excelente para reter talentos. Barbeiros seniores com salário fixo + comissão tendem a permanecer mais tempo na barbearia do que os que recebem apenas comissão pura.",
        },
      ],
    },
    {
      heading: "Como calcular comissão na prática: exemplos completos",
      blocks: [
        {
          type: "subheading",
          text: "Exemplo 1: Barbearia com 3 barbeiros — modelo percentual",
        },
        {
          type: "paragraph",
          text: "Uma barbearia com 3 barbeiros, ticket médio de R$55, comissão de 40%. Cada barbeiro faz em média 7 atendimentos por dia, 22 dias úteis no mês.",
        },
        {
          type: "list",
          items: [
            "Faturamento por barbeiro: 7 × R$55 × 22 = R$8.470/mês",
            "Comissão por barbeiro (40%): R$3.388/mês",
            "Faturamento total da barbearia: R$8.470 × 3 = R$25.410/mês",
            "Total de comissões: R$3.388 × 3 = R$10.164/mês",
            "Margem bruta da barbearia: R$25.410 - R$10.164 = R$15.246/mês",
          ],
        },
        {
          type: "paragraph",
          text: "Desses R$15.246, o dono ainda precisa pagar aluguel, produtos, energia, água, contador, sistema, e outros custos fixos. Se os custos fixos somam R$8.000, a margem líquida é de R$7.246 — ou 28,5% do faturamento. Essa margem é saudável para uma barbearia.",
        },
        {
          type: "subheading",
          text: "Exemplo 2: Barbearia com assinantes — cálculo diferenciado",
        },
        {
          type: "paragraph",
          text: "Quando a barbearia tem clube de assinaturas, o cálculo de comissão sobre atendimentos de assinantes precisa de atenção especial. Existem duas abordagens comuns:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Comissão sobre o valor do plano rateado: Se o plano é R$120/mês para 4 cortes, cada corte \"vale\" R$30. O barbeiro recebe 40% de R$30 = R$12 por atendimento de assinante.",
            "Comissão fixa por atendimento de assinante: Independente do valor do plano, o barbeiro recebe um valor fixo (ex: R$15) por cada atendimento de assinante.",
          ],
        },
        {
          type: "paragraph",
          text: "A primeira abordagem é mais justa matematicamente, mas pode gerar insatisfação porque a comissão por atendimento de assinante é menor que a de um avulso. A segunda abordagem é mais simples e previsível. Na plataforma BestBarbers, o sistema calcula automaticamente a comissão de atendimentos de assinantes conforme a regra configurada pelo dono.",
        },
        {
          type: "subheading",
          text: "Exemplo 3: Produtos e serviços adicionais",
        },
        {
          type: "paragraph",
          text: "Além dos serviços, muitas barbearias vendem produtos (pomada, óleo para barba, shampoo). A comissão sobre produtos geralmente é menor que sobre serviços — tipicamente 10% a 20% — porque a margem do produto já é menor.",
        },
        {
          type: "paragraph",
          text: "O cálculo fica: se um barbeiro vendeu R$300 em produtos no mês com 15% de comissão, recebe R$45 adicionais. Parece pouco, mas quando cada barbeiro vende R$300/mês, em uma equipe de 4, são R$1.200 em vendas adicionais que não existiriam sem o incentivo.",
        },
      ],
    },
    {
      heading: "Erros comuns no cálculo de comissão",
      blocks: [
        {
          type: "paragraph",
          text: "Com base na experiência de mercado, existem erros frequentes que donos de barbearia cometem no cálculo de comissões. Cada um deles pode causar prejuízo financeiro ou conflito com a equipe.",
        },
        {
          type: "subheading",
          text: "1. Calcular comissão sobre o valor bruto (incluindo taxa de cartão)",
        },
        {
          type: "paragraph",
          text: "Se o cliente paga R$60 no cartão e a taxa da maquininha é 3%, a barbearia recebe R$58,20. Mas muitos donos calculam a comissão sobre os R$60, pagando mais do que deviam. Em 1.000 atendimentos por mês, essa diferença de R$1,80 × 40% = R$0,72 por atendimento resulta em R$720/mês de comissão paga a mais.",
        },
        {
          type: "subheading",
          text: "2. Não separar comissão de serviço e de produto",
        },
        {
          type: "paragraph",
          text: "Aplicar a mesma porcentagem para serviços e produtos é um erro comum. A margem de um corte é muito diferente da margem de uma pomada. Se a comissão é 40% em tudo, a barbearia pode estar tendo prejuízo nas vendas de produtos (onde a margem bruta já é de 50% a 60%).",
        },
        {
          type: "subheading",
          text: "3. Não contabilizar descontos e cortesias",
        },
        {
          type: "paragraph",
          text: "Quando o dono dá desconto a um cliente VIP ou faz uma cortesia, a comissão deve ser sobre o valor efetivamente cobrado, não sobre o preço cheio. Se o barbeiro recebe comissão sobre o preço cheio de uma cortesia, o dono está pagando comissão sobre faturamento que não existiu.",
        },
        {
          type: "subheading",
          text: "4. Cálculo manual com caderninho ou planilha",
        },
        {
          type: "paragraph",
          text: "Planilhas e caderninhos são fonte inesgotável de erros e discussões. O barbeiro anota 8 atendimentos, o dono conta 7. A planilha tem uma fórmula errada que ninguém percebe por meses. A comissão de um serviço novo não foi adicionada. Cada erro desses corrói a confiança da equipe.",
        },
        {
          type: "callout",
          text: "Na plataforma BestBarbers, o cálculo de comissão é 100% automático. Cada atendimento é registrado no sistema com profissional, serviço, forma de pagamento e valor líquido. No final do mês, o relatório de comissão é gerado com transparência total — o barbeiro pode conferir cada centavo.",
        },
        {
          type: "link-box",
          title: "Gestão de Comissões Automática",
          href: "/gestao-comissoes-barbeiro",
          description:
            "Cálculo automático de comissões por barbeiro, por serviço, por período. Configuração flexível e relatórios transparentes.",
        },
      ],
    },
    {
      heading: "Como definir a porcentagem ideal de comissão",
      blocks: [
        {
          type: "paragraph",
          text: "Não existe uma porcentagem mágica que funcione para toda barbearia. A comissão ideal depende de vários fatores: localização, ticket médio, volume de atendimentos, custos fixos e modelo de negócio. Mas existe uma fórmula que ajuda a encontrar o ponto de equilíbrio.",
        },
        {
          type: "subheading",
          text: "A regra do 30-30-30-10",
        },
        {
          type: "paragraph",
          text: "Uma referência bastante usada por consultorias de barbearia é a regra do 30-30-30-10:",
        },
        {
          type: "list",
          items: [
            "30% para comissões da equipe",
            "30% para custos fixos (aluguel, energia, água, contador, sistema, etc.)",
            "30% para reinvestimento e margem do dono",
            "10% para produtos e insumos",
          ],
        },
        {
          type: "paragraph",
          text: "Se os custos fixos da sua barbearia são maiores que 30% do faturamento, a comissão precisa ser menor. Se são menores, há espaço para pagar mais e reter melhores profissionais. O importante é fazer essa conta antes de definir a porcentagem, não depois.",
        },
        {
          type: "subheading",
          text: "Fórmula prática para definir a comissão",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Calcule seu faturamento mensal médio (últimos 3 meses)",
            "Subtraia todos os custos fixos (aluguel, contas, sistema, contador, etc.)",
            "Subtraia o custo de produtos e insumos",
            "Do valor restante, defina quanto você precisa/quer como margem",
            "O que sobra é o teto total para comissões",
            "Divida pelo número de barbeiros proporcionalmente à produção de cada um",
          ],
        },
        {
          type: "paragraph",
          text: "Exemplo: Faturamento R$30.000 - Custos fixos R$9.000 - Produtos R$3.000 - Margem desejada R$6.000 = R$12.000 disponível para comissões. Se tem 3 barbeiros com produção similar, são R$4.000 por barbeiro, o que equivale a ~40% sobre o faturamento individual de R$10.000 cada.",
        },
        {
          type: "link-box",
          title: "Gestão Financeira para Barbearia",
          href: "/gestao-financeira-barbearia",
          description:
            "Relatórios financeiros em tempo real: faturamento, custos, margem e comissões. Tudo automático.",
        },
      ],
    },
    {
      heading: "Automatizando o cálculo: por que planilha não basta",
      blocks: [
        {
          type: "paragraph",
          text: "Até aqui, todos os exemplos de cálculo são relativamente simples. Mas na prática do dia a dia, a complexidade cresce rapidamente. Um barbeiro faz 3 cortes avulsos, 2 atendimentos de assinantes com comissão diferente, vende 1 produto, e um dos clientes pagou parte em Pix e parte em cartão. Fazer isso manualmente para 4 barbeiros, 22 dias por mês, é receita para erro.",
        },
        {
          type: "paragraph",
          text: "Sistemas de gestão para barbearia automatizam esse cálculo completamente. Cada atendimento é registrado no momento em que acontece, com todas as variáveis: profissional, serviço, valor, forma de pagamento, se é assinante ou avulso, se houve desconto. No final do mês (ou quando quiser), o relatório de comissão está pronto — detalhado, transparente e conferível.",
        },
        {
          type: "highlight",
          value: "1.200+",
          label: "Barbearias calculam comissões automaticamente na plataforma BestBarbers",
        },
        {
          type: "paragraph",
          text: "A transparência é o benefício mais importante. Quando o barbeiro tem acesso ao relatório detalhado — vê cada atendimento, cada valor, cada cálculo — a confiança aumenta. Não existe mais a discussão de \"eu fiz 8 e você anotou 7\". Os dados são os mesmos para todos.",
        },
        {
          type: "paragraph",
          text: "Para barbearias com clube de assinaturas, a automação é praticamente obrigatória. O cálculo de comissão sobre atendimentos de assinantes, com rateio proporcional do valor do plano, descontos por inadimplência e diferentes regras por profissional, é simplesmente inviável de fazer manualmente sem erros frequentes.",
        },
      ],
    },
  ],
  faq: [
    {
      question: "Qual a porcentagem de comissão mais comum para barbeiros?",
      answer:
        "A faixa mais comum no mercado brasileiro é de 30% a 50%, variando conforme a região, porte da barbearia e experiência do profissional. Barbearias que fornecem toda a infraestrutura tendem a praticar porcentagens menores, enquanto modelos de salão compartilhado podem chegar a 60%.",
    },
    {
      question: "Como calcular comissão de barbeiro sobre atendimento de assinante?",
      answer:
        "Existem duas abordagens: (1) Comissão sobre o valor do plano rateado — divide o valor mensal pelo número de serviços incluídos e aplica a porcentagem. (2) Valor fixo por atendimento de assinante, independente do plano. A primeira é mais precisa, a segunda é mais simples.",
    },
    {
      question: "Devo pagar comissão sobre o valor bruto ou líquido do serviço?",
      answer:
        "O ideal é calcular sobre o valor líquido (após descontar taxas de cartão e gateway de pagamento). Calcular sobre o bruto pode parecer justo, mas gera um custo adicional de 1% a 3% que se acumula significativamente ao longo do mês.",
    },
    {
      question: "É melhor comissão fixa ou percentual para barbeiros?",
      answer:
        "Depende do perfil da barbearia. Comissão percentual alinha incentivos (barbeiro ganha mais quando produz mais), mas gera insegurança em meses fracos. O modelo misto (fixo + percentual menor) é o mais equilibrado para retenção de talentos.",
    },
    {
      question: "Como evitar conflitos de comissão com a equipe?",
      answer:
        "Transparência é a chave. Use um sistema que registre automaticamente cada atendimento e gere relatórios detalhados acessíveis ao barbeiro. Defina as regras de comissão por escrito e comunique antes de contratar. Erros de cálculo manual são a principal causa de conflitos.",
    },
    {
      question: "Barbeiro deve receber comissão sobre venda de produtos?",
      answer:
        "Sim, dar comissão sobre produtos incentiva vendas adicionais. Porém, a porcentagem deve ser menor que sobre serviços (tipicamente 10% a 20%) porque a margem de produtos é menor. Uma equipe de 4 barbeiros com 15% de comissão pode gerar R$1.200/mês em vendas adicionais.",
    },
  ],
};
