import type { BlogArticle } from "./types";

export const nfse2026: BlogArticle = {
  slug: "nfse-barbearia-2026",
  title: "NFS-e 2026: O que Muda para Barbearias e Como se Preparar",
  description:
    "Entenda as mudanças na NFS-e (Nota Fiscal de Serviço Eletrônica) em 2026: quem precisa emitir, como se adequar e evitar multas. Guia para barbearias.",
  keywords: [
    "nota fiscal barbearia 2026",
    "nfse barbearia",
    "nota fiscal de serviço eletrônica barbearia",
    "nfs-e 2026",
    "nota fiscal mei barbearia",
    "emissão nota fiscal barbearia",
    "obrigatoriedade nfse 2026",
    "padrão nacional nfse",
    "nota fiscal serviço barbearia",
    "gestão fiscal barbearia",
  ],
  publishedAt: "2026-03-25T10:00:00Z",
  updatedAt: "2026-06-23T10:00:00Z",
  readingTime: 9,
  category: "Gestão Fiscal",
  tags: [
    "NFS-e",
    "nota fiscal",
    "gestão fiscal",
    "MEI",
    "barbearia",
    "compliance",
    "2026",
    "padrão nacional",
  ],
  sections: [
    {
      heading: "O que é NFS-e e por que ela importa para barbearias em 2026",
      blocks: [
        {
          type: "paragraph",
          text: "A Nota Fiscal de Serviço Eletrônica (NFS-e) é o documento digital que comprova a prestação de um serviço. Para barbearias, cada corte de cabelo, cada barba feita e cada tratamento capilar realizado é, na prática, uma prestação de serviço que pode exigir a emissão desse documento. Em 2026, as regras ficaram mais rigorosas, e entender o que muda é fundamental para manter seu negócio regularizado.",
        },
        {
          type: "paragraph",
          text: "Historicamente, muitas barbearias operavam de forma informal, sem emitir notas fiscais. Isso funcionava quando a fiscalização era menos digital. Porém, com a implementação do padrão nacional de NFS-e e a integração dos sistemas municipais com a Receita Federal, o cenário mudou completamente. O cruzamento de dados entre o que você declara e o que movimenta na sua conta bancária está cada vez mais automatizado.",
        },
        {
          type: "paragraph",
          text: "Para ter uma dimensão do mercado: a BestBarbers já processou mais de 6 milhões de agendamentos em sua plataforma. Isso significa milhões de serviços prestados que precisam de respaldo fiscal. Se a sua barbearia ainda não emite nota fiscal eletronicamente, 2026 é o ano para mudar isso antes que a fiscalização bata na sua porta.",
        },
        {
          type: "highlight",
          value: "6 milhões+",
          label: "agendamentos processados na plataforma BestBarbers",
        },
        {
          type: "paragraph",
          text: "Além da questão legal, emitir NFS-e traz benefícios concretos para o dono de barbearia. Você consegue comprovar renda para financiamentos, tem um histórico financeiro organizado para tomar decisões e passa uma imagem profissional para seus clientes. Barbearias que tratam a gestão fiscal com seriedade tendem a crescer de forma mais sustentável, porque enxergam com clareza o que entra e o que sai do caixa.",
        },
        {
          type: "callout",
          text: "O padrão nacional de NFS-e está em processo de implementação em todo o Brasil. Consulte a prefeitura da sua cidade e seu contador para saber o status na sua região e os prazos de adequação.",
        },
      ],
    },
    {
      heading: "O novo padrão nacional de NFS-e: o que mudou",
      blocks: [
        {
          type: "paragraph",
          text: "Até recentemente, cada município brasileiro tinha seu próprio sistema de emissão de nota fiscal de serviço. Isso criava um cenário caótico: portais diferentes, leiautes diferentes, regras diferentes. Um dono de barbearia que tivesse unidades em duas cidades precisava lidar com dois sistemas completamente distintos. O padrão nacional de NFS-e veio para acabar com essa confusão.",
        },
        {
          type: "paragraph",
          text: "O novo padrão, instituído pelo Comitê Gestor do Simples Nacional (CGSN) e que vem sendo implementado gradualmente, estabelece um leiaute único para a NFS-e em todo o território nacional. Isso significa que, independentemente de onde sua barbearia esteja localizada, o formato da nota fiscal será o mesmo. A emissão passa a ser feita por meio de um portal nacional ou por sistemas integrados via API.",
        },
        {
          type: "paragraph",
          text: "Para barbearias, as principais mudanças práticas são: o código de serviço agora segue uma tabela nacional unificada (os serviços de barbeiro, cabeleireiro e estética capilar estão na lista); o envio e validação da nota acontecem em tempo real, não mais em lote; e as informações fiscais ficam disponíveis para a Receita Federal de forma automática, eliminando a necessidade de declarações separadas em muitos casos.",
        },
        {
          type: "list",
          ordered: false,
          items: [
            "Leiaute único nacional unificando os diversos sistemas municipais existentes",
            "Código de serviço padronizado para atividades de barbearia e estética",
            "Emissão e validação em tempo real (não mais em lote)",
            "Integração automática com Receita Federal e PGDAS-D",
            "Portal nacional gratuito para MEIs e pequenas empresas",
            "API aberta para integração com sistemas de gestão",
          ],
        },
        {
          type: "paragraph",
          text: "Uma mudança importante é que o Ambiente de Dados Nacional (ADN) passa a centralizar todas as NFS-e emitidas no país. Isso facilita a fiscalização cruzada: se você tem uma barbearia com faturamento alto no cartão de crédito mas emite poucas notas fiscais, essa discrepância será detectada automaticamente. A era de operar no escuro fiscal acabou. Consulte sempre seu contador para orientações atualizadas sobre prazos e obrigatoriedades na sua cidade.",
        },
        {
          type: "paragraph",
          text: "A boa notícia é que, para quem já usa um sistema de gestão com emissão de nota fiscal integrada, a transição é praticamente transparente. O sistema se atualiza para o novo leiaute e você continua emitindo normalmente. O problema é para quem ainda faz tudo manualmente ou não emite nota alguma.",
        },
      ],
    },
    {
      heading: "Quem precisa emitir NFS-e: MEI, ME e EPP",
      blocks: [
        {
          type: "paragraph",
          text: "Uma dúvida frequente entre donos de barbearia é se o seu porte de empresa exige ou não a emissão de NFS-e. A resposta curta: sim, praticamente todos precisam. Mas vamos detalhar por categoria para que não reste dúvida.",
        },
        {
          type: "subheading",
          text: "MEI (Microempreendedor Individual)",
        },
        {
          type: "paragraph",
          text: "O MEI sempre foi dispensado de emitir nota fiscal quando o serviço era prestado para pessoa física. Porém, o cenário de obrigatoriedade muda conforme o município e pode ter sido atualizado recentemente. Além disso, quando o serviço é prestado para pessoa jurídica (por exemplo, um contrato com uma empresa para barbear seus funcionários), a emissão já era obrigatória. Em 2026, a recomendação é clara: mesmo que você seja MEI, comece a emitir NFS-e para todos os serviços. Isso protege você em caso de fiscalização e cria um histórico financeiro sólido.",
        },
        {
          type: "subheading",
          text: "ME (Microempresa) e EPP (Empresa de Pequeno Porte)",
        },
        {
          type: "paragraph",
          text: "Para barbearias enquadradas como ME ou EPP no Simples Nacional, a emissão de NFS-e já era obrigatória e continua sendo. A diferença agora é que o novo padrão nacional facilita o processo, pois unifica o sistema. Se você tinha dificuldade com o portal da sua prefeitura, a tendência é que a experiência melhore com a migração para o sistema nacional.",
        },
        {
          type: "paragraph",
          text: "Muitas barbearias crescem e ultrapassam o limite do MEI (verifique o limite vigente com seu contador) sem perceber. Com o clube de assinatura, por exemplo, a receita recorrente pode escalar rapidamente. Na plataforma BestBarbers, já são mais de 47 mil assinantes ativos distribuídos por 1.297 barbearias. Se o seu faturamento cresceu, é fundamental que o enquadramento tributário e a emissão de notas acompanhem esse crescimento.",
        },
        {
          type: "highlight",
          value: "47 mil+",
          label: "assinantes ativos gerenciados na plataforma BestBarbers",
        },
        {
          type: "callout",
          text: "Atenção: barbearias que faturam acima do limite do MEI (consulte o valor atualizado com seu contador) e ainda estão enquadradas como MEI podem estar irregulares. O desenquadramento e a regularização fiscal devem ser prioridade.",
        },
        {
          type: "paragraph",
          text: "Independentemente do porte, a recomendação prática é a mesma: automatize a emissão de notas fiscais. Tentar emitir manualmente no portal da prefeitura depois de cada corte é inviável no dia a dia de uma barbearia movimentada. Você precisa de um sistema que faça isso por você, automaticamente, ao final de cada atendimento.",
        },
      ],
    },
    {
      heading: "Passo a passo: como preparar sua barbearia para a NFS-e 2026",
      blocks: [
        {
          type: "paragraph",
          text: "A adequação à NFS-e não precisa ser complicada. Se você seguir um passo a passo organizado, consegue resolver tudo em poucos dias. Abaixo, listamos as etapas práticas que todo dono de barbearia deve seguir.",
        },
        {
          type: "subheading",
          text: "1. Verifique seu enquadramento tributário",
        },
        {
          type: "paragraph",
          text: "O primeiro passo é confirmar se sua barbearia está corretamente enquadrada. Consulte seu contador ou acesse o Portal do Simples Nacional para verificar se você é MEI, ME ou EPP. Se seu faturamento ultrapassou o limite do MEI, providencie o desenquadramento imediatamente. Operar com enquadramento errado agrava qualquer penalidade fiscal.",
        },
        {
          type: "subheading",
          text: "2. Obtenha seu acesso ao sistema de NFS-e",
        },
        {
          type: "paragraph",
          text: "Acesse o portal da sua prefeitura ou o novo portal nacional de NFS-e (nfs-e.gov.br). Faça o cadastro da sua empresa, vincule seu certificado digital (se necessário) ou utilize o acesso simplificado para MEI. Anote seu login e senha em local seguro. Algumas prefeituras ainda estão em fase de migração para o padrão nacional, então verifique se a sua já aderiu.",
        },
        {
          type: "subheading",
          text: "3. Identifique o código de serviço correto",
        },
        {
          type: "paragraph",
          text: "No novo padrão, os serviços de barbearia estão classificados na Lista de Serviços anexa à Lei Complementar 116/2003, geralmente no item 6.02 (barbeiros, cabeleireiros, manicures, pedicures e congêneres). Confirme com seu contador qual código se aplica aos serviços que você oferece. Se sua barbearia também vende produtos (pomadas, shampoos), lembre-se de que a venda de mercadorias gera nota fiscal de produto (NF-e), não de serviço.",
        },
        {
          type: "subheading",
          text: "4. Integre a emissão ao seu sistema de gestão",
        },
        {
          type: "paragraph",
          text: "Esse é o passo mais importante. Em vez de emitir notas manualmente no portal da prefeitura, configure seu sistema de gestão para emitir automaticamente. A BestBarbers, por exemplo, permite que a NFS-e seja emitida automaticamente ao finalizar cada atendimento no sistema, sem que o barbeiro precise fazer nada. Isso elimina o risco de esquecer e garante que 100% dos serviços estejam documentados.",
        },
        {
          type: "link-box",
          title: "Nota Fiscal para Barbearia: Emissão Automática",
          href: "/nota-fiscal-barbearia",
          description:
            "Veja como a BestBarbers emite NFS-e automaticamente após cada serviço, sem trabalho manual para o barbeiro ou recepcionista.",
        },
        {
          type: "subheading",
          text: "5. Teste e valide o processo",
        },
        {
          type: "paragraph",
          text: "Antes de operar em regime de produção, faça testes. Emita algumas notas fiscais de serviço em ambiente de homologação (se disponível) ou em valores baixos para confirmar que os dados estão corretos: CNPJ da barbearia, descrição do serviço, alíquota de ISS, valor. Um erro no cadastro pode gerar retrabalho e até notas com valor incorreto de imposto.",
        },
        {
          type: "subheading",
          text: "6. Treine sua equipe",
        },
        {
          type: "paragraph",
          text: "Se você tem recepcionistas ou barbeiros que finalizam atendimentos no sistema, garanta que eles saibam como funciona a emissão. Com um sistema automatizado, o treinamento é mínimo: basta finalizar o atendimento normalmente e a nota é gerada. Mas é importante que a equipe entenda por que a nota é emitida e saiba o que fazer caso ocorra algum erro (como dados incorretos do cliente).",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Verifique o enquadramento tributário (MEI, ME ou EPP)",
            "Cadastre-se no portal nacional de NFS-e ou no sistema municipal",
            "Confirme o código de serviço correto (item 6.02 da LC 116/2003)",
            "Integre a emissão automática ao seu sistema de gestão",
            "Teste a emissão com notas de homologação ou valores baixos",
            "Treine a equipe sobre o novo fluxo de finalização de atendimento",
          ],
        },
      ],
    },
    {
      heading: "Penalidades e riscos de não emitir NFS-e",
      blocks: [
        {
          type: "paragraph",
          text: "Ignorar a obrigatoriedade da NFS-e não é uma opção viável em 2026. As penalidades podem ser severas e vão muito além de uma simples multa. Entenda os riscos reais que a sua barbearia corre ao operar sem emissão de nota fiscal.",
        },
        {
          type: "paragraph",
          text: "A multa por não emissão de NFS-e varia de município para município. As penalidades podem incluir percentuais sobre o ISS não recolhido, além de juros e correção monetária. Consulte a legislação do seu município para valores exatos.",
        },
        {
          type: "callout",
          text: "Multas por não emissão de NFS-e variam por município e podem incluir percentuais sobre o ISS, juros e correção monetária. Em casos graves, o alvará de funcionamento pode ser suspenso.",
        },
        {
          type: "paragraph",
          text: "Além da multa financeira, existem riscos operacionais sérios. A prefeitura pode suspender o alvará de funcionamento da sua barbearia, impedindo que você opere legalmente. O CNPJ pode ser bloqueado para emissão de novas notas, criando um círculo vicioso. E, no caso de fiscalização da Receita Federal, a ausência de notas fiscais pode levar ao arbitramento do lucro, onde o fisco estima quanto você deveria ter faturado e cobra impostos sobre esse valor estimado, que quase sempre é maior do que o real.",
        },
        {
          type: "paragraph",
          text: "Outro risco menos óbvio é a perda de credibilidade comercial. Fornecedores, bancos e até franqueadores exigem regularidade fiscal. Se você planeja expandir sua barbearia, abrir novas unidades ou buscar um empréstimo, a ausência de notas fiscais vai travar qualquer negociação. Barbearias que operam de forma regular têm acesso a crédito, a condições melhores com fornecedores e a oportunidades de crescimento que simplesmente não existem para quem opera na informalidade.",
        },
        {
          type: "paragraph",
          text: "Por fim, existe o risco para os próprios clientes. Cada vez mais, consumidores exigem nota fiscal para deduções, reembolsos corporativos ou simplesmente como comprovante. Uma barbearia que não emite nota fiscal perde clientes para concorrentes que emitem. É um diferencial competitivo silencioso, mas real.",
        },
        {
          type: "list",
          ordered: false,
          items: [
            "Multas proporcionais ao ISS não recolhido, com juros e correção",
            "Suspensão do alvará de funcionamento",
            "Bloqueio do CNPJ para emissão de novas notas",
            "Arbitramento de lucro pela Receita Federal",
            "Perda de acesso a crédito e financiamentos",
            "Perda de clientes que exigem nota fiscal",
          ],
        },
      ],
    },
    {
      heading: "Como a emissão automática de NFS-e economiza tempo e evita erros",
      blocks: [
        {
          type: "paragraph",
          text: "Para ilustrar: imagine que sua barbearia atende 40 clientes por dia. Se cada emissão de nota fiscal manual leva 3 minutos (acessar o portal, preencher os dados, conferir, enviar), são 2 horas por dia gastas apenas com burocracia fiscal. Em um mês, são quase 44 horas, o equivalente a mais de uma semana de trabalho. Esse tempo poderia ser usado atendendo clientes, treinando a equipe ou planejando o crescimento do negócio.",
        },
        {
          type: "paragraph",
          text: "A emissão automática resolve esse problema de forma definitiva. No fluxo da BestBarbers, quando o barbeiro finaliza um atendimento no sistema, a NFS-e é gerada automaticamente em segundo plano. O cliente recebe a nota por e-mail ou WhatsApp, e o valor já é contabilizado no relatório financeiro do dia. Não há etapa manual, não há risco de esquecimento, não há retrabalho.",
        },
        {
          type: "highlight",
          value: "1.297+",
          label: "barbearias já utilizam a plataforma BestBarbers para gestão completa",
        },
        {
          type: "paragraph",
          text: "Além da economia de tempo, a automação elimina erros humanos. Quando você digita dados manualmente em um portal, erros acontecem: CNPJ errado, valor com vírgula no lugar errado, código de serviço trocado. Cada erro gera a necessidade de cancelar a nota e emitir outra, multiplicando o trabalho. Com a emissão automática, os dados vêm do cadastro do sistema, que já está validado, e a chance de erro cai para praticamente zero.",
        },
        {
          type: "paragraph",
          text: "Outro benefício significativo é a rastreabilidade. Com todas as notas emitidas automaticamente, você tem um registro completo de todos os serviços prestados. Isso facilita a declaração de impostos, a conferência com o contador e até a análise de desempenho do negócio. Você consegue saber exatamente quanto faturou em cortes, quanto em barbas, quanto em tratamentos, tudo documentado nota a nota.",
        },
        {
          type: "paragraph",
          text: "Para barbearias que trabalham com clube de assinatura, a automação é ainda mais crítica. Cada serviço prestado dentro do plano precisa ser documentado fiscalmente, mesmo que o pagamento seja recorrente. Emitir manualmente dezenas de notas por dia para assinantes é simplesmente inviável. O sistema precisa fazer isso por você, de forma transparente e sem fricção para o barbeiro.",
        },
        {
          type: "link-box",
          title: "Nota Fiscal para Barbearia: Emissão Automática",
          href: "/nota-fiscal-barbearia",
          description:
            "Descubra como automatizar a emissão de NFS-e na sua barbearia e eliminar o trabalho manual com cada atendimento.",
        },
        {
          type: "callout",
          text: "Exemplo ilustrativo: uma barbearia com 40 atendimentos/dia, gastando 3 minutos por nota manual, perderia cerca de 44 horas por mês com burocracia fiscal. A automação elimina esse custo oculto.",
        },
      ],
    },
    {
      heading: "A conexão entre conformidade fiscal e controle financeiro",
      blocks: [
        {
          type: "paragraph",
          text: "Muitos donos de barbearia enxergam a nota fiscal apenas como uma obrigação chata. Na realidade, a NFS-e é uma das ferramentas mais poderosas de gestão financeira que você tem à disposição. Cada nota emitida é um registro preciso de receita, e quando você tem 100% dos seus serviços documentados, o controle financeiro deixa de ser um exercício de adivinhação.",
        },
        {
          type: "paragraph",
          text: "Com a emissão automática integrada ao sistema de gestão, você consegue gerar relatórios financeiros confiáveis em tempo real. Quanto a barbearia faturou hoje? Qual barbeiro gerou mais receita? Qual serviço tem maior margem? Qual dia da semana é mais lucrativo? Todas essas perguntas são respondidas com precisão quando cada serviço tem uma nota fiscal vinculada.",
        },
        {
          type: "paragraph",
          text: "Essa visibilidade financeira é o que diferencia barbearias que crescem de forma sustentável daquelas que vivem apagando incêndio. Quando você sabe exatamente quanto entra e quanto sai, consegue tomar decisões informadas: contratar mais um barbeiro, investir em marketing, negociar melhor com fornecedores ou ajustar o preço dos serviços. Sem dados confiáveis, cada decisão é um tiro no escuro.",
        },
        {
          type: "link-box",
          title: "Gestão Financeira para Barbearia",
          href: "/gestao-financeira-barbearia",
          description:
            "Veja como a BestBarbers integra emissão de notas, controle de caixa, comissões e relatórios financeiros em uma única plataforma.",
        },
        {
          type: "paragraph",
          text: "A conformidade fiscal também facilita a relação com o contador. Em vez de entregar uma caixa de recibos no final do mês, você compartilha um relatório digital com todas as notas emitidas, organizadas por data, serviço e valor. Isso reduz o custo da contabilidade (menos horas de trabalho do contador) e praticamente elimina o risco de erros na declaração de impostos.",
        },
        {
          type: "paragraph",
          text: "Para barbearias que operam com múltiplas unidades ou franquias, o controle centralizado via NFS-e automática é indispensável. Você consegue comparar o desempenho de cada unidade com dados reais, não com estimativas. Identificar qual unidade está subperformando, onde há desperdício e onde há oportunidade de crescimento se torna uma análise objetiva, baseada em números auditáveis.",
        },
        {
          type: "paragraph",
          text: "No fim das contas, a NFS-e não é apenas uma obrigação legal. É o alicerce de uma gestão financeira profissional. Barbearias que abracem essa mudança em 2026 não estarão apenas evitando multas. Estarão construindo a base para um negócio mais lucrativo, mais organizado e mais preparado para crescer. Com um sistema como a BestBarbers, a partir de R$299/mês, você tem emissão automática de notas, controle financeiro completo e a tranquilidade de operar 100% dentro da lei.",
        },
        {
          type: "highlight",
          value: "a partir de R$299/mês",
          label: "plano BestBarbers com emissão automática de NFS-e e gestão completa",
        },
        {
          type: "link-box",
          title: "Calculadora: o que a burocracia fiscal está custando para sua barbearia?",
          href: "/calculadora-prejuizo",
          description:
            "Veja em 30 segundos o impacto financeiro de operar sem automação — tempo perdido com burocracia, erros de cálculo e conformidade em risco.",
        },
      ],
    },
  ],
  faq: [
    {
      question: "Barbearia MEI precisa emitir NFS-e em 2026?",
      answer:
        "Sim. Embora o MEI tenha dispensa para serviços prestados a pessoa física em alguns municípios, a recomendação em 2026 é emitir NFS-e para todos os atendimentos. Com o padrão nacional e o cruzamento automático de dados, operar sem nota fiscal aumenta significativamente o risco de fiscalização e multas.",
    },
    {
      question: "Qual o código de serviço da NFS-e para barbearia?",
      answer:
        "Serviços de barbearia estão geralmente enquadrados no item 6.02 da Lista de Serviços anexa à Lei Complementar 116/2003: 'Barbeiros, cabeleireiros, manicures, pedicures e congêneres'. Confirme com seu contador, pois alguns municípios podem ter códigos locais específicos.",
    },
    {
      question: "Qual a multa por não emitir nota fiscal de serviço na barbearia?",
      answer:
        "A multa varia por município, mas pode chegar a 50% do valor do ISS que deveria ter sido recolhido, além de juros e correção monetária. Em casos graves, o alvará de funcionamento pode ser suspenso e o CNPJ bloqueado para emissão de novas notas.",
    },
    {
      question: "Como emitir NFS-e automaticamente na barbearia?",
      answer:
        "A forma mais prática é usar um sistema de gestão com emissão integrada. A BestBarbers, por exemplo, emite a NFS-e automaticamente ao finalizar cada atendimento, sem trabalho manual. O barbeiro finaliza o serviço no sistema e a nota é gerada e enviada ao cliente em segundo plano.",
    },
    {
      question: "O que é o padrão nacional de NFS-e?",
      answer:
        "É um leiaute único para a Nota Fiscal de Serviço Eletrônica, válido em todo o Brasil. Ele substitui os mais de 5.500 sistemas municipais diferentes por um formato padronizado, facilitando a emissão, a fiscalização e a integração com sistemas de gestão.",
    },
    {
      question: "Barbearia que vende produtos também precisa de NFS-e?",
      answer:
        "A NFS-e cobre apenas a prestação de serviços (corte, barba, tratamentos). A venda de produtos (pomadas, shampoos, cosméticos) exige a emissão de NF-e (Nota Fiscal Eletrônica de produto) ou NFC-e (Nota Fiscal de Consumidor Eletrônica), dependendo do regime tributário e do estado.",
    },
    {
      question: "Preciso de certificado digital para emitir NFS-e na barbearia?",
      answer:
        "Para MEI, o acesso ao portal nacional de NFS-e pode ser feito com login Gov.br, sem necessidade de certificado digital. Para ME e EPP, a maioria dos municípios exige certificado digital (e-CNPJ). Verifique as regras da sua prefeitura ou use um sistema integrado que gerencie a autenticação automaticamente.",
    },
  ],
  relatedSlugs: ["melhor-sistema-barbearia-2026", "barbearia-por-assinatura"],
  relatedFeatures: [
    {
      title: "Nota Fiscal para Barbearia",
      href: "/nota-fiscal-barbearia",
      description:
        "Emissão automática de NFS-e após cada atendimento, sem trabalho manual para o barbeiro.",
    },
    {
      title: "Gestão Financeira para Barbearia",
      href: "/gestao-financeira-barbearia",
      description:
        "Controle completo de caixa, comissões e relatórios financeiros integrados à emissão de notas.",
    },
  ],
};
