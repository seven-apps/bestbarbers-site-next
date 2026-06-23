import type { BlogArticle } from "./types";

export const gestaoFinanceira: BlogArticle = {
  slug: "gestao-financeira-barbearia",
  title: "Gestão Financeira de Barbearia: Lucro Real vs. Faturamento (Guia 2026)",
  description:
    "Gestão financeira de barbearia: entenda a diferença entre faturamento, caixa e lucro real, e descubra o que realmente sobra por corte.",
  keywords: [
    "gestão financeira barbearia",
    "lucro barbearia",
    "margem barbearia",
    "fluxo de caixa barbearia",
    "faturamento barbearia",
    "comissão barbeiro",
    "receita recorrente barbearia",
    "controle financeiro barbearia",
  ],
  publishedAt: "2026-06-23T10:00:00-03:00",
  updatedAt: "2026-06-23T10:00:00-03:00",
  readingTime: 21,
  category: "Gestão Financeira",
  tags: [
    "gestão financeira",
    "lucro",
    "margem",
    "fluxo de caixa",
    "comissão",
    "receita recorrente",
    "inadimplência",
  ],
  sections: [
    // =========================================================================
    // SECTION 1 — A cena: sábado cheio, segunda sem dinheiro
    // =========================================================================
    {
      heading: "Sábado cheio, segunda sem dinheiro: como isso acontece?",
      blocks: [
        {
          type: "paragraph",
          text: "É sábado. A barbearia está lotada, a campainha não para, a equipe corta sem parar e você bate 30 cortes ao longo do dia. No fim do expediente, o caixa registra R$2.400. Você fecha a porta cansado, mas com aquela sensação boa de quem fez um dia de trabalho de verdade. Na segunda-feira, você abre o caixa para separar o dinheiro do fornecedor de produtos, pagar a comissão dos barbeiros, deixar reservado o aluguel — e não sobra quase nada. Pior: às vezes falta. Como é que um sábado tão cheio vira uma segunda tão vazia?",
        },
        {
          type: "paragraph",
          text: "Se essa cena soa familiar, você não está sozinho. É um dos relatos mais comuns entre donos de barbearia, e ele revela um problema que não tem nada a ver com falta de cliente ou preço baixo. O problema é de clareza. A maioria dos donos administra a barbearia olhando para um número só — quanto entrou — e ignora os outros dois números que de fato decidem se o negócio dá certo ou não: quanto vira dinheiro na conta e quanto realmente sobra no fim.",
        },
        {
          type: "paragraph",
          text: "Faturar bem e não ter dinheiro não é contradição. É o estado natural de quem confunde movimento com resultado. Uma barbearia movimentada que não controla o que sai pode trabalhar o mês inteiro para sustentar fornecedor, comissão e aluguel — e o dono, que é quem corre o risco, fica por último na fila. Este guia existe para inverter isso. Vamos separar, em linguagem de dono, três coisas que parecem a mesma e não são: faturamento, caixa e lucro real.",
        },
        {
          type: "callout",
          text: "Faturar não é ganhar. Movimento não é resultado. A barbearia que não sabe quanto sobra por corte está dirigindo no escuro — pode estar indo bem ou pode estar furando, e só vai descobrir quando o tanque esvaziar.",
        },
        {
          type: "paragraph",
          text: "Antes de seguir, um aviso honesto: este guia fala de dinheiro do ponto de vista de quem administra a cadeira, não de quem cuida de imposto. Para questões fiscais e contábeis, consulte o seu contador. O que você vai ler aqui é sobre enxergar com clareza o que entra, o que sai e o que fica — o tipo de leitura que faz você dormir tranquilo sabendo que o negócio se paga.",
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — Faturamento ≠ caixa ≠ lucro
    // =========================================================================
    {
      heading: "Faturamento, caixa e lucro: três números que parecem um só",
      blocks: [
        {
          type: "paragraph",
          text: "Quase todo dono de barbearia conhece o faturamento de cor. Pergunte e ele responde na hora: \"faturei R$60 mil no mês\". O problema é que esse número, sozinho, não diz quase nada sobre a saúde do negócio. Ele é só o primeiro de três. Vamos separar os três com calma, porque é exatamente nessa confusão que mora o sábado cheio que vira segunda vazia.",
        },
        {
          type: "subheading",
          text: "Faturamento: tudo o que foi vendido",
        },
        {
          type: "paragraph",
          text: "Faturamento é a soma de tudo o que você vendeu no período: cortes, barbas, produtos, assinaturas. É o número grande, o que dá orgulho de falar. Mas faturamento é uma promessa, não um fato. Quando o cliente paga no cartão parcelado, aquele valor foi faturado hoje mas só cai na conta daqui a 30 dias. Quando o assinante tem a mensalidade vencendo dia 10 e não paga, aquilo entrou no faturamento e nunca virou dinheiro. Faturamento responde a uma pergunta: quanto eu vendi? Só isso.",
        },
        {
          type: "subheading",
          text: "Caixa (recebimento): o dinheiro que realmente entrou",
        },
        {
          type: "paragraph",
          text: "Caixa é o dinheiro que de fato pingou na sua conta. É o que você pode usar agora para pagar fornecedor, comissão e aluguel. A diferença entre faturamento e caixa é onde muita barbearia quebra mesmo lucrando no papel. Vendeu R$60 mil no cartão parcelado em 3x? O faturamento foi R$60 mil, mas o caixa do mês foi uma fração disso — o resto vem ao longo dos próximos meses, já descontada a taxa da maquininha. Caixa responde a outra pergunta: quanto dinheiro eu tenho hoje para pagar minhas contas?",
        },
        {
          type: "callout",
          text: "Barbearia não quebra por falta de lucro. Quebra por falta de caixa. Dá para ter um mês lucrativo no papel e não conseguir pagar a comissão na sexta porque o dinheiro está preso na maquininha. Lucro paga o sonho; caixa paga a conta de hoje.",
        },
        {
          type: "subheading",
          text: "Lucro real: o que sobra depois de TUDO",
        },
        {
          type: "paragraph",
          text: "Lucro real é o que sobra para você, o dono, depois que tudo foi pago: comissão dos barbeiros, produtos usados, aluguel, energia, água, internet, taxa da maquininha, software, marketing e todo o resto. É o número que ninguém fala de cor porque dá trabalho calcular — e é justamente o único que importa de verdade. Você pode ter o maior faturamento do bairro e o pior lucro, se as suas contas estiverem mal estruturadas. O faturamento alimenta o ego; o lucro alimenta a sua família.",
        },
        {
          type: "paragraph",
          text: "Veja como os três se relacionam com um exemplo hipotético. Imagine uma barbearia que faturou R$60 mil no mês. Desse total, R$48 mil já caíram na conta (o resto está parcelado ou atrasado) — esse é o caixa. E desses R$60 mil de venda, depois de pagar comissão, produtos, aluguel e tudo mais, sobraram R$9 mil para o dono — esse é o lucro real. Três números, três realidades. O dono que só olha os R$60 mil acha que está rico; o que olha os R$9 mil sabe exatamente onde está pisando.",
        },
        {
          type: "highlight",
          value: "3 números",
          label: "faturamento (vendi), caixa (recebi), lucro (sobrou) — confundir os três é a causa nº 1 do aperto",
        },
        {
          type: "paragraph",
          text: "A boa notícia é que você não precisa de planilha complicada nem de curso de finanças para enxergar os três. Precisa de um sistema que registre cada venda, mostre o que já entrou de fato e separe o que é seu do que é dos outros. O resto deste guia é sobre como fazer essa leitura virar rotina — começando pela conta mais reveladora de todas: quanto sobra por corte.",
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — Como calcular o que sobra por corte
    // =========================================================================
    {
      heading: "Quanto sobra por corte? A conta que muda tudo",
      blocks: [
        {
          type: "paragraph",
          text: "Pergunte a dez donos de barbearia quanto eles ganham por corte e nove vão responder o preço do corte. \"Meu corte é R$45.\" Mas R$45 é o que o cliente paga, não o que sobra para a barbearia. Entre o que entra e o que fica existe uma sequência de descontos que quase ninguém faz de cabeça — e é exatamente por não fazer essa conta que o sábado cheio decepciona na segunda. Vamos fazer juntos, com um exemplo hipotético e números redondos para ficar fácil de acompanhar.",
        },
        {
          type: "subheading",
          text: "A conta, passo a passo (exemplo hipotético)",
        },
        {
          type: "paragraph",
          text: "Imagine um corte de R$45, com o barbeiro recebendo 40% de comissão e R$5 de custo de produto (lâmina, pó, toalha, descartáveis). Vamos descer do preço de venda até o que realmente sobra:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Preço do corte: R$45 — é o que o cliente paga.",
            "Menos a comissão do barbeiro (40%): -R$18 — sobra R$27.",
            "Menos o custo de produto: -R$5 — sobra R$22.",
            "Menos a taxa da maquininha (se foi no cartão, suponha ~3%): -R$1,35 — sobra cerca de R$20,65.",
            "Esses R$20,65 ainda precisam cobrir aluguel, energia, água, internet, software e o seu pró-labore — só o que passar disso é lucro de verdade.",
          ],
        },
        {
          type: "paragraph",
          text: "Repare no que aconteceu. O corte de R$45 virou cerca de R$20 antes mesmo de pagar o aluguel. Quase metade do preço já foi embora em comissão e produto. Agora volte para a cena do começo: 30 cortes no sábado a R$45 dão R$1.350 de faturamento naquele dia (no exemplo de uma agenda variada, o número real flutua), mas o que sobra para cobrir custos fixos e virar lucro é uma fração disso. O sábado não mentiu — você só estava olhando o número errado.",
        },
        {
          type: "callout",
          text: "Não pergunte \"quanto eu faturei?\". Pergunte \"quanto sobrou por corte depois de pagar comissão, produto e maquininha?\". É essa segunda pergunta que separa a barbearia que cresce da que só trabalha.",
        },
        {
          type: "paragraph",
          text: "Essa conta também explica por que aumentar preço nem sempre resolve. Se você sobe o corte de R$45 para R$50 mas a comissão continua sendo 40%, o barbeiro também leva mais — e a sua sobra por corte cresce bem menos do que os R$5 do aumento. Por isso, antes de mexer no preço, o dono inteligente olha primeiro para a estrutura de comissão, para o custo de produto e para a ociosidade da cadeira. Preço é só uma das alavancas, e raramente a mais importante.",
        },
        {
          type: "subheading",
          text: "A cadeira parada também custa",
        },
        {
          type: "paragraph",
          text: "Tem um custo que não aparece em conta nenhuma e dói no bolso todo mês: a cadeira vazia. Toda hora que um barbeiro está na barbearia sem cliente na cadeira, você está pagando aluguel, energia e a presença daquele profissional sem nada entrar. Por isso, ocupação da agenda é um número financeiro, não operacional. Uma cadeira que fica 30% do tempo ociosa é uma cadeira que precisaria cobrar muito mais por corte para fechar a conta — ou, melhor ainda, uma cadeira que precisa de uma base de clientes que volte com previsibilidade. E é aqui que a recorrência entra como a maior alavanca de caixa que existe.",
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — Comissão: a variável mais importante e mais ignorada
    // =========================================================================
    {
      heading: "Comissão: a variável mais importante e mais ignorada",
      blocks: [
        {
          type: "paragraph",
          text: "Se existe um número que decide a vida financeira de uma barbearia, é a comissão. Ela costuma ser a maior despesa do negócio — maior que o aluguel, maior que produtos — e, paradoxalmente, é a que o dono menos controla com método. A maioria define um percentual no olho (\"todo mundo paga 50%, então pago 50%\"), nunca revisa e nunca conecta esse número ao que de fato sobra. É a variável mais pesada do caixa sendo tratada com o menor rigor.",
        },
        {
          type: "subheading",
          text: "Por que a comissão pesa tanto",
        },
        {
          type: "paragraph",
          text: "Volte à conta do corte de R$45 com 40% de comissão: R$18 de cada corte vai para o barbeiro. Em 30 cortes no sábado, são R$540 só de comissão em um dia. Em um mês cheio, a comissão pode facilmente ser a maior linha de saída da barbearia. Quando ela está mal calibrada — alta demais para a margem do serviço, ou aplicada igual sobre coisas que têm custos muito diferentes — ela come o lucro silenciosamente, todo dia, sem fazer barulho.",
        },
        {
          type: "highlight",
          value: "a maior despesa",
          label: "a comissão costuma pesar mais que aluguel e produtos juntos — e é a que menos gente controla",
        },
        {
          type: "subheading",
          text: "O erro de comissionar tudo igual",
        },
        {
          type: "paragraph",
          text: "Um corte tem custo de produto baixo. A venda de uma pomada tem custo de produto altíssimo (você comprou o produto). A barba tem custo de tempo. Mesmo assim, muita barbearia paga o mesmo percentual de comissão sobre todos eles. O resultado é que o barbeiro pode ganhar mais vendendo um produto de margem apertada do que prestando um serviço de margem boa — e ninguém percebe. Comissionar serviço e produto pela mesma régua é como pagar o frete pelo peso da caixa, sem olhar o que tem dentro.",
        },
        {
          type: "paragraph",
          text: "A correção não é cortar comissão — é estruturá-la. Percentuais diferentes para serviços e para produtos. Comissão sobre o que sobra, não sobre o preço cheio, quando o serviço tem custo de insumo relevante. E, acima de tudo, transparência: o barbeiro precisa ver exatamente como a comissão dele é calculada, ou cria-se desconfiança. Comissão clara motiva; comissão obscura gera atrito e rotatividade — e barbeiro que vai embora leva clientes junto.",
        },
        {
          type: "callout",
          text: "Comissão não é um número que você define uma vez e esquece. É a alavanca financeira mais sensível da barbearia. Mexer 5 pontos na comissão pode dobrar ou zerar o seu lucro — por isso ela merece cálculo, não chute.",
        },
        {
          type: "paragraph",
          text: "Calcular comissão na mão, no fim do mês, com calculadora e caderno, é onde mora boa parte dos erros e das brigas. Some os atendimentos errados, esqueça um produto vendido, aplique o percentual trocado e pronto: ou você paga a mais (perde dinheiro) ou paga a menos (perde a confiança do barbeiro). Um sistema que registra cada atendimento e calcula a comissão automaticamente, por regra e por profissional, transforma a maior despesa da barbearia de fonte de erro em fonte de controle.",
        },
        {
          type: "link-box",
          title: "Gestão de Comissões BestBarbers",
          href: "/gestao-comissoes-barbeiro",
          description:
            "Configure percentuais diferentes por serviço e por produto, e deixe o sistema calcular a comissão de cada barbeiro automaticamente, com transparência total.",
        },
        {
          type: "paragraph",
          text: "Se você quer se aprofundar em como definir o percentual ideal e estruturar regras diferentes por serviço, vale ler o guia dedicado ao tema — a comissão é importante demais para ser resolvida em um parágrafo.",
        },
      ],
    },

    // =========================================================================
    // SECTION 5 — Como a recorrência do clube transforma o caixa
    // =========================================================================
    {
      heading: "Como a recorrência do clube transforma o caixa",
      blocks: [
        {
          type: "paragraph",
          text: "Volte à cena inicial uma última vez. O que torna o sábado cheio tão frágil não é o volume de cortes — é a imprevisibilidade. Cada corte avulso é uma aposta nova: o cliente pode voltar daqui a 15 dias ou sumir para sempre. A barbearia que vive só de avulso está sempre recomeçando do zero, todo mês. A recorrência — o clube de assinaturas — é a virada de chave que transforma essa aposta diária em um piso de caixa garantido.",
        },
        {
          type: "subheading",
          text: "De aposta a piso garantido",
        },
        {
          type: "paragraph",
          text: "Quando um cliente vira assinante, ele para de ser uma incógnita e passa a ser uma linha previsível no seu caixa. No dia da cobrança, aquele valor entra independentemente de chuva, feriado, janeiro fraco ou humor do cliente. Multiplique isso por dezenas ou centenas de assinantes e você tem um número que cai na conta todo mês antes mesmo de abrir a porta. Esse piso muda completamente a gestão: você passa a negociar com fornecedor com mais segurança, contratar com menos medo e planejar reforma sem apostar.",
        },
        {
          type: "paragraph",
          text: "Os dados da base BestBarbers mostram o tamanho dessa virada. Entre as mais de 1.297 barbearias ativas na plataforma, 622 já operam com clube de assinaturas — quase metade (47,96%) da base —, somando 47.793 assinantes ativos. O ticket médio por cobrança de assinatura é de R$128,14, e a receita líquida média por assinante-mês fica em torno de R$128. Não é uma tendência de nicho: é metade das barbearias da plataforma construindo um piso de caixa que o avulso nunca dá.",
        },
        {
          type: "highlight",
          value: "47,96%",
          label: "das barbearias na base BestBarbers já têm clube de assinaturas (622 de 1.297)",
        },
        {
          type: "paragraph",
          text: "Tem outro número que merece atenção: a média de permanência no clube é de 12,1 meses. Isso significa que o assinante médio não some no segundo mês — ele fica pouco mais de um ano. Pense no que isso faz pelo caixa: cada novo assinante não vale uma cobrança, vale, em média, mais de doze. É o oposto da lógica do avulso, em que cada cliente vale exatamente um corte de cada vez. A recorrência não soma; ela compõe.",
        },
        {
          type: "highlight",
          value: "12,1 meses",
          label: "tempo médio de clube ativo por assinante na base BestBarbers — cada adesão vale muito mais que uma cobrança",
        },
        {
          type: "subheading",
          text: "O efeito composto, na prática",
        },
        {
          type: "paragraph",
          text: "Veja um caso real da plataforma, anonimizado: uma barbearia de 3 cadeiras no interior de Minas Gerais. A receita recorrente do clube, quando começou a ser medida, era de R$9.249 por mês. Com foco em venda ativa do clube na cadeira e melhor comunicação dos planos, a base cresceu de forma consistente. Em 18 meses, ela chegou a 290 assinantes e R$27.586 por mês de receita recorrente — praticamente o triplo. Note: não é um pico de faturamento de um sábado bom. É um piso que se renova todo mês, mês após mês.",
        },
        {
          type: "highlight",
          value: "R$9.249 → R$27.586/mês",
          label: "receita recorrente de clube de uma barbearia de 3 cadeiras no interior de MG, em 18 meses (290 assinantes)",
        },
        {
          type: "paragraph",
          text: "Esse é o ponto que muda a gestão financeira da barbearia de patamar: a recorrência não resolve só o quanto entra, resolve o quando e o se entra. Um faturamento de R$27 mil concentrado em sábados imprevisíveis é uma coisa; R$27 mil que pingam todo mês com um cliente médio que fica mais de um ano é outra completamente diferente. O primeiro mantém você correndo; o segundo deixa você planejar. Se ainda não tem clube, vale estudar o modelo a fundo — é provavelmente a maior alavanca de caixa disponível para uma barbearia hoje.",
        },
        {
          type: "link-box",
          title: "Clube de Assinaturas BestBarbers",
          href: "/clube-de-assinaturas",
          description:
            "Crie planos de assinatura, automatize a cobrança recorrente e construa um piso de caixa que se renova todo mês, independentemente do movimento.",
        },
      ],
    },

    // =========================================================================
    // SECTION 6 — Inadimplência: o buraco invisível
    // =========================================================================
    {
      heading: "Inadimplência: o buraco invisível no seu caixa",
      blocks: [
        {
          type: "paragraph",
          text: "Existe um vazamento que não aparece em nenhuma cena dramática, mas que esvazia o caixa todo mês: a inadimplência. Diferente do sábado cheio que decepciona na segunda, a inadimplência é silenciosa. Ela não grita, não bate na porta, não aparece no número de faturamento — porque a venda aconteceu, ela só nunca virou dinheiro. É o buraco mais perigoso justamente por ser invisível para quem só olha o que foi vendido.",
        },
        {
          type: "paragraph",
          text: "No mundo do avulso, a inadimplência quase não existe: o cliente paga e vai embora. Mas no momento em que a barbearia entra no jogo da recorrência — e vimos que é metade da base BestBarbers —, ela ganha um novo tipo de receita e, junto, um novo tipo de risco. O assinante que não tem o cartão atualizado, cuja cobrança falha, que esquece de pagar e ninguém avisa: cada um desses é faturamento que existe no papel e não existe na conta. Quanto maior o clube, mais esse buraco importa.",
        },
        {
          type: "callout",
          text: "Inadimplência é a única despesa que você paga sem nem perceber. Ela não tem boleto, não tem aviso, não aparece no relatório de vendas. Só aparece quando você compara o que faturou com o que de fato recebeu — e descobre a diferença.",
        },
        {
          type: "paragraph",
          text: "A boa notícia é que, ao contrário de quase todos os outros custos, a inadimplência tem conserto direto. Cobrança automática que tenta de novo quando o cartão falha, aviso ao cliente antes do vencimento, retentativa programada e um painel que mostra na hora quem está em dia e quem está pendente — esse conjunto transforma um buraco invisível em um número visível e gerenciável. O dono que vê a inadimplência consegue agir sobre ela; o que não vê apenas a sustenta com o próprio bolso.",
        },
        {
          type: "paragraph",
          text: "A inadimplência é um tema grande o suficiente para merecer um guia próprio — como estruturar a cobrança, como abordar o cliente atrasado sem perder a relação e como reduzir a perda a um mínimo. Aqui, o que importa fixar é o princípio: o que você faturou só é seu quando vira caixa, e a inadimplência é exatamente a distância entre os dois. Ignorá-la é deixar lucro escorrer pelo ralo todo mês.",
        },
        {
          type: "link-box",
          title: "Inadimplência na barbearia: como cobrar sem perder o cliente",
          href: "/blog/inadimplencia-barbearia-como-cobrar",
          description:
            "O guia completo para fechar o buraco invisível do caixa: cobrança automática, retentativa, abordagem do cliente atrasado e redução de perdas.",
        },
      ],
    },

    // =========================================================================
    // SECTION 7 — Passo a passo para clareza financeira
    // =========================================================================
    {
      heading: "Passo a passo para ter clareza financeira na sua barbearia",
      blocks: [
        {
          type: "paragraph",
          text: "Você não precisa virar especialista em finanças para nunca mais ter um sábado cheio que vira segunda vazia. Precisa, sim, transformar três ou quatro hábitos em rotina. Aqui está um passo a passo prático, em ordem, do mais fácil ao mais transformador. Comece pelo primeiro e suba conforme cada um vira automático.",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Separe os três números. Pare de olhar só o faturamento. Toda semana, anote (ou veja no sistema) três coisas: quanto vendi, quanto entrou de fato na conta e quanto sobrou depois de pagar tudo. Só esse hábito já muda a sua percepção do negócio.",
            "Calcule o que sobra por corte. Faça a conta do seu corte mais comum: preço menos comissão, menos produto, menos taxa da maquininha. Saber esse número de cabeça é o que te dá poder de decisão sobre preço, comissão e mix de serviços.",
            "Estruture a comissão com método. Reveja os percentuais, separe comissão de serviço de comissão de produto e garanta que o barbeiro enxergue como o número é calculado. Tire a maior despesa da barbearia do chute.",
            "Construa o piso de caixa com recorrência. Se ainda não tem clube de assinaturas, este é provavelmente o passo de maior impacto. Transforme clientes avulsos em assinantes e troque a imprevisibilidade do avulso por um caixa que se renova todo mês.",
            "Feche o buraco da inadimplência. Automatize a cobrança recorrente, ative retentativa e avisos, e acompanhe num painel quem está em dia. Garanta que o que você faturou de fato vire dinheiro.",
            "Olhe os números toda semana, não só no fim do mês. Clareza financeira é hábito, não evento. Cinco minutos por semana olhando os relatórios certos valem mais que uma maratona de planilha uma vez por ano.",
          ],
        },
        {
          type: "paragraph",
          text: "Repare que nenhum desses passos exige conhecimento técnico de contabilidade. São decisões de dono, baseadas em números que qualquer pessoa entende quando estão organizados na frente dela. O obstáculo nunca foi a matemática — é a falta de uma fonte única e confiável que mostre o que vendeu, o que entrou e o que sobrou, sem você precisar montar planilha no domingo à noite. E mais uma vez vale o lembrete: para questões fiscais e contábeis, consulte o seu contador. O foco aqui é a saúde do caixa e do lucro, não o imposto.",
        },
        {
          type: "subheading",
          text: "Onde a tecnologia entra",
        },
        {
          type: "paragraph",
          text: "Tudo o que descrevemos — separar faturamento de caixa, calcular o que sobra por corte, comissionar com transparência, manter o piso da recorrência e cobrar automaticamente quem atrasou — é viável na mão até um certo tamanho. Acima disso, vira fonte de erro e de horas perdidas. Um sistema de gestão que conecta agenda, comissão, clube e cobrança em um painel só é o que permite ao dono fazer essa leitura em minutos, e não em finais de semana inteiros. É a diferença entre administrar a barbearia e ser administrado por ela.",
        },
        {
          type: "highlight",
          value: "a partir de R$299/mês",
          label: "o módulo financeiro do BestBarbers, com agenda, comissão, clube e cobrança integrados",
        },
        {
          type: "link-box",
          title: "Módulo Financeiro BestBarbers",
          href: "/gestao-financeira-barbearia",
          description:
            "Veja o módulo financeiro do BestBarbers — faturamento, caixa, comissão e clube em um painel só. A partir de R$299/mês, sem taxa por barbeiro.",
        },
        {
          type: "paragraph",
          text: "Ainda em dúvida se o aperto é real ou impressão? Antes de mais nada, vale colocar os seus números na mesa e ver, em segundos, onde está o vazamento. A calculadora abaixo faz uma estimativa do que pode estar escapando do seu caixa hoje — comissão mal calibrada, cadeira ociosa, inadimplência — e mostra o tamanho da oportunidade de fechar essas torneiras.",
        },
        {
          type: "link-box",
          title: "Calculadora: quanto a sua barbearia pode estar perdendo?",
          href: "/calculadora-prejuizo",
          description:
            "Simule em 30 segundos o impacto de comissão, cadeira ociosa e inadimplência no seu lucro. Resultado personalizado com base no seu perfil.",
        },
        {
          type: "paragraph",
          text: "No fim, gestão financeira de barbearia não é sobre fórmulas complicadas. É sobre nunca mais ser surpreendido na segunda-feira. É saber, com clareza, quanto você vendeu, quanto entrou e quanto sobrou — e poder decidir com base nisso, não no susto. O sábado cheio continua sendo motivo de orgulho. A diferença é que, agora, a segunda também vai ser.",
        },
      ],
    },
  ],

  // ===========================================================================
  // FAQ
  // ===========================================================================
  faq: [
    {
      question: "Qual a diferença entre faturamento e lucro numa barbearia?",
      answer:
        "Faturamento é tudo o que você vendeu no período (cortes, produtos, assinaturas) — é uma promessa, não dinheiro garantido. Lucro real é o que sobra para você depois de pagar comissão, produtos, aluguel, taxas e todas as despesas. Dá para ter faturamento alto e lucro baixo se as contas estiverem mal estruturadas. O lucro é o único número que mede a saúde do negócio.",
    },
    {
      question: "Por que minha barbearia fatura bem mas nunca sobra dinheiro?",
      answer:
        "Quase sempre é confusão entre faturamento, caixa e lucro. O sábado cheio fatura muito, mas boa parte desse valor está parcelada na maquininha (não virou caixa) ou some em comissão e produto (não virou lucro). Faça a conta do que sobra por corte e separe os três números semanalmente — é a forma mais rápida de descobrir onde o dinheiro está escapando.",
    },
    {
      question: "Como calcular quanto sobra por corte na barbearia?",
      answer:
        "Pegue o preço do corte e desconte, nesta ordem: a comissão do barbeiro, o custo de produto (lâmina, pó, descartáveis) e a taxa da maquininha. O que sobra ainda precisa cobrir aluguel, energia, software e o seu pró-labore — só o que passar disso é lucro. Num exemplo hipotético de corte de R$45 com 40% de comissão e R$5 de produto, sobram cerca de R$20 antes dos custos fixos.",
    },
    {
      question: "Por que a comissão do barbeiro é tão importante na gestão financeira?",
      answer:
        "Porque a comissão costuma ser a maior despesa da barbearia, maior que aluguel e produtos. Um ajuste de poucos pontos no percentual pode dobrar ou zerar o lucro. O erro mais comum é comissionar serviços e produtos pela mesma régua, ignorando que têm custos muito diferentes. Estruturar a comissão com percentuais distintos e total transparência é uma das decisões financeiras de maior impacto.",
    },
    {
      question: "Como o clube de assinaturas melhora o caixa da barbearia?",
      answer:
        "A recorrência transforma cada cliente, que antes era uma aposta a cada visita, em uma linha previsível de caixa que entra todo mês independentemente do movimento. Na base BestBarbers, o tempo médio de clube ativo é de 12,1 meses, então cada novo assinante vale, em média, mais de doze cobranças. Esse piso garantido permite negociar, contratar e planejar com segurança que o avulso nunca oferece.",
    },
    {
      question: "O que é inadimplência na barbearia e como ela afeta o lucro?",
      answer:
        "Inadimplência é a venda que aconteceu mas nunca virou dinheiro — o assinante cuja cobrança falhou, o cartão não atualizado, a mensalidade esquecida. É um buraco invisível porque aparece no faturamento mas não no caixa. Cobrança automática com retentativa, avisos antes do vencimento e um painel de pendências transformam essa perda silenciosa em um número visível e gerenciável.",
    },
    {
      question: "O BestBarbers ajuda com a parte fiscal e contábil da barbearia?",
      answer:
        "O foco do BestBarbers é a saúde do caixa e do lucro: faturamento, recebimento, comissão, clube e cobrança em um painel único. Para questões fiscais e contábeis — impostos, obrigações e declarações —, consulte sempre o seu contador. O sistema organiza os números do dia a dia da operação para que você decida com clareza e leve dados confiáveis ao seu contador quando precisar.",
    },
  ],

  // ===========================================================================
  // Related
  // ===========================================================================
  relatedSlugs: [
    "inadimplencia-barbearia-como-cobrar",
    "como-calcular-comissao-barbeiro",
    "clube-assinatura-barbearia",
  ],
  relatedFeatures: [
    {
      title: "Gestão Financeira",
      href: "/gestao-financeira-barbearia",
      description:
        "Controle faturamento, caixa, comissões e clube da sua barbearia em um painel único, com relatórios automáticos.",
    },
    {
      title: "Gestão de Comissões",
      href: "/gestao-comissoes-barbeiro",
      description:
        "Configure percentuais por serviço e por produto e deixe o sistema calcular a comissão de cada barbeiro com transparência.",
    },
    {
      title: "Clube de Assinaturas",
      href: "/clube-de-assinaturas",
      description:
        "Crie planos de assinatura e construa um piso de caixa que se renova todo mês com cobrança recorrente automática.",
    },
  ],
};
