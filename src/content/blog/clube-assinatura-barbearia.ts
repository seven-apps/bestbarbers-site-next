import type { BlogArticle } from "./types";

export const clubeAssinaturaBarbearia: BlogArticle = {
  slug: "clube-assinatura-barbearia",
  title: "Clube de Assinatura para Barbearia: Guia Definitivo para Montar e Rodar",
  description:
    "Guia prático para montar um clube de assinatura para barbearia: configuração, planos, onboarding, ritual mensal e plano de lançamento de 30 dias.",
  keywords: [
    "clube de assinatura para barbearia",
    "clube de assinatura barbearia",
    "como montar clube de assinatura barbearia",
    "como rodar clube de assinatura",
    "plano de assinatura barbearia",
    "recorrência barbearia",
    "retenção de assinantes barbearia",
    "sistema clube de assinatura barbearia",
  ],
  publishedAt: "2026-06-23T10:00:00-03:00",
  updatedAt: "2026-06-23T10:00:00-03:00",
  readingTime: 21,
  category: "Modelo de Negócio",
  tags: [
    "clube de assinatura",
    "recorrência",
    "gestão",
    "retenção",
    "lançamento",
    "modelo de negócio",
  ],
  sections: [
    // =========================================================================
    // SECTION 1 — Por que fatura e não sobra (cena de abertura)
    // =========================================================================
    {
      heading: "Por que a sua barbearia fatura e não sobra",
      blocks: [
        {
          type: "paragraph",
          text: "Dia 30. A barbearia ficou cheia o mês inteiro, a agenda não teve buraco, os barbeiros mal pararam para almoçar. Você abre o aplicativo do banco esperando ver um saldo que faça jus ao corre-corre — e o número não fecha com a sensação. Pagou aluguel, pagou as comissões, repôs produto, quitou o cartão da reforma. Sobrou pouco. E o pior: você sabe que mês que vem começa do zero de novo, dependendo de quanta gente vai resolver aparecer. Faturar a barbearia já fatura. O problema é que o faturamento não vira tranquilidade.",
        },
        {
          type: "paragraph",
          text: "Essa é a armadilha do modelo avulso. Cada real que entra depende de uma decisão que o cliente toma de novo a cada visita: ele lembra que precisa cortar, escolhe a sua barbearia, escolhe o dia, escolhe a hora. Qualquer ruído nesse caminho — uma chuva, um feriado, uma semana corrida na vida dele — derruba o seu mês. Você não tem um negócio com base previsível; você tem uma sequência de meses independentes, cada um começando no zero. É por isso que tanta barbearia movimentada vive no aperto: o esforço é alto, mas a receita é frágil.",
        },
        {
          type: "paragraph",
          text: "O clube de assinatura inverte essa lógica. Em vez de torcer para o cliente voltar, você combina com ele que ele volta — e que paga todo dia 5, chova ou faça sol. No BestBarbers, mais de 1.297 barbearias usam a plataforma e 622 delas já operam com clube ativo (quase metade da base, 47,96%), somando mais de 47 mil assinantes ativos. Não é tendência de nicho: é a forma como as barbearias que querem sair do sufoco estão reorganizando a própria receita.",
        },
        {
          type: "highlight",
          value: "622 de 1.297",
          label: "barbearias da base BestBarbers já operam com clube de assinatura (47,96% de adoção)",
        },
        {
          type: "paragraph",
          text: "Este guia não vai te convencer de que recorrência é melhor que avulso — você já sentiu isso na pele no dia 30. Aqui o assunto é execução: como montar o clube do zero, como configurar e precificar os planos sem queimar margem, como receber bem o assinante nos primeiros dias, qual ritual mensal mantém ele dentro, e um plano de 30 dias para colocar tudo no ar. É o playbook operacional, do botão à comemoração do primeiro mês com a conta fechando.",
        },
        {
          type: "callout",
          text: "Movimento cheio não é o mesmo que negócio saudável. Barbearia saudável é a que sabe, no dia 1, quanto vai entrar no dia 30. É isso que o clube constrói.",
        },
      ],
    },

    // =========================================================================
    // SECTION 2 — O que é o clube e por que muda a lógica operacional
    // =========================================================================
    {
      heading: "O que muda na operação quando você tem um clube",
      blocks: [
        {
          type: "paragraph",
          text: "Clube de assinatura é, na prática, um acordo: o cliente paga um valor fixo todo mês e, em troca, tem direito a um pacote de serviços — dois cortes, quatro cortes, corte mais barba, o formato que você desenhar. A cobrança se renova sozinha, sem o cliente precisar decidir de novo. O que parece uma simples mudança de cobrança, na verdade reorganiza toda a operação da barbearia.",
        },
        {
          type: "paragraph",
          text: "A primeira coisa que muda é a agenda. Com clube, uma parte dos seus horários deixa de ser uma incógnita e vira um núcleo previsível: você sabe que aquele bloco de clientes vai retornar dentro de uma janela conhecida. Isso permite distribuir melhor os barbeiros, planejar folgas sem medo e dimensionar a equipe com base em demanda real, não em achismo. A segunda coisa que muda é o caixa: a receita do clube cai numa data fixa, o que transforma a forma como você negocia com fornecedor, contrata e investe.",
        },
        {
          type: "paragraph",
          text: "Não vamos refazer aqui a conta de quanto recorrência rende a mais que avulso — esse cálculo, com exemplos lado a lado, está detalhado em outro material. Se você ainda precisa convencer a si mesmo (ou a um sócio) de que o modelo se paga, comece por ele e depois volte para este guia, que é onde está o passo a passo de execução.",
        },
        {
          type: "link-box",
          title: "A matemática da recorrência: avulso vs assinatura",
          href: "/blog/barbearia-por-assinatura",
          description:
            "Por que a receita recorrente vence o modelo avulso — com a conta feita lado a lado, o impacto no caixa e no LTV. Leia se ainda precisa do \"porquê financeiro\".",
        },
        {
          type: "paragraph",
          text: "A terceira mudança — a mais subestimada — é no comportamento do cliente. Quem já pagou pelo corte volta mais, porque deixar de usar dá a sensação de desperdiçar o que pagou. E quem volta mais consome mais barba, sobrancelha, produto. O assinante não é só uma receita garantida; é um cliente que frequenta com mais constância e gasta mais por visita. Na base BestBarbers, o ticket médio por cobrança de assinatura é de R$128,14, e a barbearia média mantém o clube ativo por 12,1 meses — uma relação que dura, não uma promoção de um mês.",
        },
        {
          type: "highlight",
          value: "R$128,14",
          label: "ticket médio por cobrança de assinatura na base BestBarbers",
        },
        {
          type: "paragraph",
          text: "Resumindo: o clube não é só um jeito diferente de cobrar. É uma forma diferente de operar a barbearia — com agenda mais previsível, caixa mais firme e cliente mais presente. O resto deste guia é sobre como tirar isso do papel.",
        },
      ],
    },

    // =========================================================================
    // SECTION 3 — Como montar o clube do zero
    // =========================================================================
    {
      heading: "Como montar o clube do zero: passo a passo de configuração",
      blocks: [
        {
          type: "paragraph",
          text: "Muita gente trava na largada porque imagina que montar um clube é um projeto gigante. Não é. Com a estrutura certa, você configura o essencial em uma tarde e ajusta com os dados reais depois. O que importa é seguir uma ordem que não deixe buraco — porque buraco na configuração vira conflito com cliente lá na frente. Aqui está a sequência que funciona.",
        },
        {
          type: "subheading",
          text: "Passo 1 — Defina os serviços que entram no clube",
        },
        {
          type: "paragraph",
          text: "Antes de pensar em preço, decida o que o assinante leva. Para a maioria das barbearias, o coração do clube é o corte — é o serviço de maior frequência e o que cria o hábito de retorno. Barba, sobrancelha e pigmentação costumam funcionar melhor como adicionais ou como diferencial dos planos mais caros do que dentro do plano de entrada. Defina com clareza o que está incluso e o que é à parte, porque essa fronteira é o que evita discussão na cadeira depois.",
        },
        {
          type: "subheading",
          text: "Passo 2 — Estruture de 2 a 3 planos, não mais",
        },
        {
          type: "paragraph",
          text: "A regra de ouro é começar simples. Dois ou três planos, cada um falando com um perfil claro de cliente. Mais que isso confunde, trava a decisão e dificulta a venda na cadeira. Um modelo que funciona bem na prática:",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Plano de entrada: 2 cortes por mês. É a porta de entrada do clube, para o cliente que corta a cada 15 dias e quer economia.",
            "Plano intermediário (o âncora): corte mais frequente ou corte + barba. É aqui que a maioria deve cair — desenhe ele para ser o melhor custo-benefício percebido.",
            "Plano premium: o pacote completo (corte + barba + sobrancelha) com benefícios não operacionais, como prioridade de agendamento. Margem maior, fidelização máxima.",
          ],
        },
        {
          type: "paragraph",
          text: "O segredo do plano do meio como âncora é simples: quando a diferença de preço entre o de entrada e o intermediário é pequena perto do que se ganha a mais, o cliente naturalmente sobe para o intermediário. Você guia a escolha sem empurrar.",
        },
        {
          type: "subheading",
          text: "Passo 3 — Configure a cobrança recorrente",
        },
        {
          type: "paragraph",
          text: "Aqui é onde o clube deixa de ser planilha e vira operação de verdade. A cobrança precisa ser automática: rodar sozinha no dia do vencimento, tentar de novo se o cartão falhar e avisar o cliente sobre pendência — sem você virar cobrador. No BestBarbers isso já vem integrado, e o melhor: o produto é a partir de R$299/mês, sem custo de setup e sem taxa por assinante cadastrado. Ou seja, você não paga mais caro conforme o clube cresce — o que torna a margem do clube cada vez melhor à medida que a base aumenta.",
        },
        {
          type: "subheading",
          text: "Passo 4 — Ative o controle de uso e créditos",
        },
        {
          type: "paragraph",
          text: "Cada atendimento do assinante precisa ser registrado para descontar um crédito do plano. O barbeiro confirma o atendimento no app e o sistema baixa o crédito automaticamente; o cliente vê em tempo real quantos cortes ainda tem no mês. Isso elimina três problemas de uma vez: o conflito de \"achei que ainda tinha corte\", o uso indevido acima do plano e a sua cegueira sobre quem está usando muito ou pouco — informação que mais adiante é o que te avisa quem está prestes a cancelar.",
        },
        {
          type: "subheading",
          text: "Passo 5 — Coloque tudo dentro do app da barbearia",
        },
        {
          type: "paragraph",
          text: "O assinante precisa de um único lugar para agendar, ver os créditos, receber avisos e, se um dia precisar, cancelar. Esse lugar é o app próprio da barbearia. Sem ele, toda a relação depende de WhatsApp e ligação — o que funciona com 10 assinantes e desmorona com 100. Com um app com a sua marca, o assinante tem a experiência completa na mão e você ganha um canal de relacionamento que trabalha 24 horas.",
        },
        {
          type: "link-box",
          title: "App Próprio para Barbearia",
          href: "/app-proprio-barbearia",
          description:
            "Um aplicativo com a marca da sua barbearia onde o assinante agenda, acompanha créditos, recebe notificações e gerencia o plano.",
        },
        {
          type: "callout",
          text: "Não tente operar clube no caderno ou na planilha além de 20 assinantes. A partir daí, cobrança esquecida, crédito sem controle e inadimplência invisível viram o seu dia inteiro. A tecnologia é o que deixa o clube escalar de dezenas para centenas sem você perder o controle.",
        },
      ],
    },

    // =========================================================================
    // SECTION 4 — Como precificar sem queimar margem
    // =========================================================================
    {
      heading: "Como precificar sem queimar margem",
      blocks: [
        {
          type: "paragraph",
          text: "O erro que mais mata clube de assinatura não é configuração — é preço. O dono lança um plano baratíssimo para \"atrair\" assinantes rápido, enche o clube, comemora o número… e descobre no fim do mês que cada assinante que usou todos os cortes deu prejuízo. Atrair pelo preço baixo é fácil; o difícil é segurar a margem quando o cliente realmente usa o que pagou.",
        },
        {
          type: "paragraph",
          text: "A lógica para não cair nessa armadilha é direta: calcule o custo real por atendimento (comissão do barbeiro + produto + ocupação da cadeira), multiplique pela quantidade de usos que você espera no plano e só então adicione a sua margem. Veja como um exemplo hipotético — imagine uma barbearia com custo de R$18 por atendimento e um plano de 4 cortes ao mês. Se o assinante usar os 4, o custo é de R$72. Um plano de R$49,90 nesse cenário não fecha a conta: dá prejuízo no mês em que ele usa tudo. O preço precisa partir do custo, nunca do que parece atraente no anúncio.",
        },
        {
          type: "callout",
          text: "Exemplo ilustrativo, não dado da plataforma: custo de R$18/atendimento × 4 usos = R$72 de custo. Um plano abaixo disso é prejuízo garantido nos meses de uso pleno. Sempre parta do custo por atendimento.",
        },
        {
          type: "paragraph",
          text: "Existe também o lado do cliente: o plano precisa entregar economia percebida, senão ele não assina. A regra prática é mirar o preço entre 80% e 95% do que o cliente gastaria como avulso. Ele sente que economiza, você mantém margem, e os dois saem ganhando. Planos limitados (2 ou 4 cortes) são mais seguros porque você sabe exatamente quanto cada assinante vai consumir; um plano ilimitado premium pode existir, mas com preço que compense o uso intenso de quem o escolhe.",
        },
        {
          type: "paragraph",
          text: "Precificação é o tema que mais merece cuidado, porque um erro aqui contamina todos os meses seguintes. Por isso ele tem um guia dedicado, com o método completo de cálculo de margem, ancoragem de planos e os números que você precisa olhar antes de definir cada preço.",
        },
        {
          type: "link-box",
          title: "Guia completo: como precificar o clube de assinatura",
          href: "/blog/precificar-clube-assinatura-barbearia",
          description:
            "O método passo a passo para definir o preço de cada plano com margem real — custo por atendimento, ancoragem e os erros que queimam a rentabilidade.",
        },
        {
          type: "paragraph",
          text: "E não pense só em corte na hora de precificar: o ticket médio por cobrança de assinatura na base BestBarbers é de R$128,14, bem acima de um corte avulso. Isso acontece porque os planos que melhor retêm não vendem só corte — vendem conveniência, prioridade e a sensação de pertencer ao clube. Margem boa nasce da combinação de preço certo com valor percebido alto, não de plano barato.",
        },
        {
          type: "link-box",
          title: "Calcule quanto a falta de recorrência custa hoje",
          href: "/calculadora-prejuizo",
          description:
            "Em 30 segundos, veja quanto a sua barbearia deixa de previsibilidade na mesa sem um clube ativo — e qual seria o piso de receita com assinatura.",
        },
      ],
    },

    // =========================================================================
    // SECTION 5 — Onboarding: os 7 primeiros dias
    // =========================================================================
    {
      heading: "Onboarding: os 7 primeiros dias do assinante",
      blocks: [
        {
          type: "paragraph",
          text: "Tem uma verdade dura sobre clube de assinatura: o cliente decide se vai ficar muito antes do fim do primeiro mês. Os primeiros dias depois da adesão são os que mais pesam. Se o assinante sai da cadeira sem saber como usar, sem ter agendado o próximo corte e sem perceber o que ganhou, ele esfria — e o cancelamento que aparece no mês 2 já estava decidido no dia 1. Onboarding bem feito é a diferença entre um assinante de 12 meses e um que some na primeira cobrança.",
        },
        {
          type: "paragraph",
          text: "O onboarding ideal cabe em poucos gestos, todos na primeira semana. No momento da adesão, ainda na cadeira, instale o app com o cliente e mostre onde ele vê os créditos. Já deixe o próximo corte agendado — assinante com retorno marcado volta; assinante sem data marcada esquece. Nos dias seguintes, uma mensagem de boas-vindas que reforce o que ele tem direito e um lembrete antes do primeiro retorno fecham o ciclo. São toques pequenos, mas é o que transforma uma assinatura em hábito.",
        },
        {
          type: "callout",
          text: "Sair da cadeira com o app instalado e o próximo corte já agendado é o gesto de onboarding com maior impacto na retenção. Não deixe o assinante novo ir embora sem data de volta.",
        },
        {
          type: "paragraph",
          text: "Cada peça desse onboarding — a mensagem de boas-vindas, o primeiro agendamento, o lembrete certo na hora certa — tem um roteiro próprio. Montar essa sequência completa, dia a dia, é o assunto de um guia dedicado, que vale seguir à risca porque é a etapa que mais protege a base inteira do clube.",
        },
        {
          type: "link-box",
          title: "Onboarding do assinante: os 7 primeiros dias, dia a dia",
          href: "/blog/onboarding-assinante-clube-barbearia",
          description:
            "A sequência completa de boas-vindas que transforma assinante novo em assinante fiel — do app instalado ao primeiro retorno garantido.",
        },
      ],
    },

    // =========================================================================
    // SECTION 6 — Comunicação que retém: o ritual mensal
    // =========================================================================
    {
      heading: "Comunicação que retém: o ritual mensal",
      blocks: [
        {
          type: "paragraph",
          text: "Conquistar o assinante é só o começo. O que decide o tamanho do seu clube daqui a um ano não é a entrada de gente nova — é a saída. Se você ganha 30 assinantes por mês e perde 25, o seu clube cresce 5. A diferença entre uma base que estoura e uma que fica parada nos mesmos 50 assinantes quase sempre está na comunicação ao longo do mês. Assinante que não percebe valor de forma contínua cancela. Assinante lembrado do quanto ganha, fica.",
        },
        {
          type: "paragraph",
          text: "Por isso o clube precisa de um ritual mensal — uma rotina de comunicação que roda todo mês, nas mesmas datas, de forma previsível. Não é mandar mensagem aleatória quando lembra. É um calendário simples que mantém o assinante engajado e antecipa o cancelamento antes dele acontecer. Um ritual que funciona se parece com isto:",
        },
        {
          type: "list",
          ordered: false,
          items: [
            "Início do mês: lembrete amigável de que os créditos do mês renovaram e convite para já agendar o primeiro corte.",
            "Meio do mês: aviso para quem ainda não usou nenhum crédito — esse é o sinal mais claro de risco de cancelamento, e a hora de agir é antes da terceira semana.",
            "Datas especiais: aniversário do assinante com um benefício extra. Custa pouco e cria laço.",
            "Fim do mês: mensagem de valor mostrando quantos cortes ele fez e o quanto economizou no mês — a prova concreta de que vale a pena continuar.",
            "Sempre que houver novidade: aviso de novo serviço, novo barbeiro, horário estendido. Mantém o assinante sentindo que o clube evolui.",
          ],
        },
        {
          type: "paragraph",
          text: "O item mais importante dessa lista é o do meio do mês. Assinante que não apareceu até a terceira semana é o candidato número um a cancelar — ele está pagando e não está usando, e a cabeça começa a fazer a conta de \"para que estou pagando isso?\". É exatamente aí que o controle de uso vira ouro: o sistema te mostra quem sumiu, e uma mensagem ou um agendamento facilitado nessa hora salva a assinatura antes de ela virar pedido de cancelamento.",
        },
        {
          type: "callout",
          text: "A pergunta que destrói qualquer clube é \"para que estou pagando isso?\". O ritual mensal existe para responder a essa pergunta antes que o assinante a faça.",
        },
        {
          type: "paragraph",
          text: "E quando, apesar de tudo, o cancelamento vier, ele não precisa ser definitivo. Um bom sistema oferece, na hora do cancelamento, uma alternativa: pausar por um mês, descer para um plano mais barato ou um benefício de retenção. Boa parte de quem pediria para sair aceita uma dessas pontes — e é receita que você só preserva se a régua estiver montada. Esse ritual inteiro fica muito mais fácil quando o app dispara grande parte dele de forma automática, sem depender de você lembrar todo dia.",
        },
        {
          type: "link-box",
          title: "Clube de Assinaturas BestBarbers",
          href: "/clube-de-assinaturas",
          description:
            "Crie planos, automatize a cobrança, controle créditos e acompanhe quem está em risco de cancelar — tudo no painel do clube.",
        },
        {
          type: "paragraph",
          text: "Acompanhar a saúde do clube também é parte do ritual do dono, não só do assinante. Receita recorrente separada da avulsa, ticket médio por assinante, quem está pendente, quem cancelou. Esses números, num painel só, são o que transforma a gestão do clube de achismo em decisão — e é o que te avisa, com antecedência, quando algo precisa de ajuste.",
        },
        {
          type: "link-box",
          title: "Gestão Financeira para Barbearias",
          href: "/gestao-financeira-barbearia",
          description:
            "Veja a receita do clube separada da avulsa, acompanhe pagamentos e pendências e tome decisão com base em dado, não em achismo.",
        },
      ],
    },

    // =========================================================================
    // SECTION 7 — Case bb#13285 (anonimizado)
    // =========================================================================
    {
      heading: "Case: 3 cadeiras em Araxá/MG → 290 assinantes e R$27,6 mil/mês",
      blocks: [
        {
          type: "paragraph",
          text: "Para mostrar que o playbook funciona fora da teoria, vale olhar para uma barbearia real — anonimizada por política de privacidade, mas com números exatos. É uma barbearia de interior, 3 cadeiras, em Araxá, Minas Gerais. O tipo de operação que muita gente acha que \"é pequena demais para clube\". A história dela diz o contrário.",
        },
        {
          type: "paragraph",
          text: "Quando o clube começou a ser levado a sério, a receita recorrente era de R$9.249 por mês. Boa, mas longe do potencial — a equipe não abordava os avulsos na cadeira e os planos quase não apareciam na comunicação da barbearia. Não faltava cliente; faltava método. Foi exatamente o conjunto de coisas deste guia que mudou o jogo: planos bem estruturados, venda ativa na cadeira, onboarding cuidado e um ritmo constante de comunicação com os assinantes.",
        },
        {
          type: "highlight",
          value: "3× em 18 meses",
          label: "receita do clube de R$9.249 para R$27.586/mês — barbearia de 3 cadeiras em Araxá/MG",
        },
        {
          type: "paragraph",
          text: "Em 18 meses, a base chegou a 290 assinantes e a receita recorrente do clube praticamente triplicou, saltando de R$9.249 para R$27.586 por mês. Mas o número financeiro é só metade da história. A agenda passou a ter um núcleo previsível de atendimentos fixos, os barbeiros tiveram horários mais bem distribuídos e o dono finalmente conseguiu planejar contratação e folga com antecedência — porque sabia, no começo do mês, boa parte do que ia entrar no fim dele.",
        },
        {
          type: "paragraph",
          text: "Vale reparar no que NÃO mudou: o tamanho da barbearia. Continuaram sendo 3 cadeiras. O que mudou foi a disciplina — na venda, no onboarding e no ritual de comunicação. Esse é o recado mais importante do case: o que destrava o clube não é ter uma rede gigante, é executar o básico bem feito, todo mês, sem soltar a mão. O passo a passo completo dessa virada está no estudo de caso dedicado.",
        },
        {
          type: "link-box",
          title: "Case completo: a barbearia que chegou a 290 assinantes",
          href: "/blog/case-barbearia-290-assinantes-clube",
          description:
            "O passo a passo da virada — de R$9.249 para R$27.586/mês com 3 cadeiras. O que foi feito, na ordem, para triplicar a receita do clube.",
        },
      ],
    },

    // =========================================================================
    // SECTION 8 — Plano de 30 dias para lançar
    // =========================================================================
    {
      heading: "Plano de 30 dias para lançar o seu clube",
      blocks: [
        {
          type: "paragraph",
          text: "Saber o que fazer e fazer são coisas diferentes. Para não cair na paralisia, aqui está o plano de 30 dias que tira o clube do papel sem virar projeto eterno. São quatro semanas, cada uma com um foco. No fim do mês, você tem clube no ar, primeiros assinantes na base e a equipe vendendo.",
        },
        {
          type: "subheading",
          text: "Semana 1 — Estrutura e configuração",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Defina os serviços que entram no clube e a fronteira do que é à parte.",
            "Calcule o custo por atendimento e precifique de 2 a 3 planos com margem real.",
            "Configure a cobrança recorrente, o controle de créditos e os planos dentro do sistema.",
            "Garanta que o app da barbearia está pronto para receber o assinante (agenda, créditos, avisos).",
          ],
        },
        {
          type: "subheading",
          text: "Semana 2 — Equipe e venda",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Treine cada barbeiro: o que é o clube, o que cada plano inclui e por que vale para o cliente.",
            "Defina um incentivo para a equipe vender (uma comissão por adesão é investimento, não custo).",
            "Combine o script de abordagem na cadeira — consultivo, com a conta do quanto o cliente economiza.",
            "Faça o onboarding rodar: app instalado e próximo corte agendado já na adesão.",
          ],
        },
        {
          type: "subheading",
          text: "Semana 3 — Lançamento e divulgação",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Anuncie o clube nas redes e dentro da barbearia (cartaz, espelho, balcão).",
            "Comece a oferta ativa na cadeira com TODOS os barbeiros, não só o dono.",
            "Use prova social: \"a maioria de quem vem toda semana já é assinante\".",
            "Registre as objeções que aparecerem para refinar o script da equipe.",
          ],
        },
        {
          type: "subheading",
          text: "Semana 4 — Ritual e ajuste",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "Ative o ritual mensal de comunicação (renovação, meio do mês, valor no fim do mês).",
            "Olhe o painel: quantos assinaram, qual plano mais vendeu, quem ainda não usou crédito.",
            "Aja sobre quem não apareceu até a terceira semana antes que vire cancelamento.",
            "Ajuste preço, mix de planos ou script com base no que os primeiros dados mostraram.",
          ],
        },
        {
          type: "paragraph",
          text: "Trinta dias depois, o clube não está \"pronto\" — clube nenhum fica pronto, ele amadurece. Mas está no ar, com base inicial e com a máquina de venda e retenção girando. A maturidade, com base estável e ritmo previsível de adesões e renovações, costuma chegar nos meses seguintes, à medida que o ritual mensal faz o seu trabalho. O importante é que, a partir do dia 30, você para de começar todo mês do zero.",
        },
        {
          type: "callout",
          text: "O melhor dia para lançar o clube foi há um ano. O segundo melhor é hoje. Cada mês sem clube é mais um mês começando do zero no dia 1.",
        },
        {
          type: "link-box",
          title: "Veja como o clube funciona no BestBarbers",
          href: "/clube-de-assinaturas",
          description:
            "Clube de assinatura, app próprio, cobrança automática e painel de gestão — a partir de R$299/mês, sem setup e sem taxa por assinante.",
        },
      ],
    },
  ],

  // ===========================================================================
  // FAQ
  // ===========================================================================
  faq: [
    {
      question: "Como montar um clube de assinatura para barbearia do zero?",
      answer:
        "Em cinco passos: defina os serviços que entram no clube, estruture de 2 a 3 planos com preço calculado a partir do custo por atendimento, configure a cobrança recorrente, ative o controle de uso e créditos e coloque tudo dentro do app da barbearia. Com a estrutura certa, o essencial se configura em uma tarde e se ajusta com os dados reais depois.",
    },
    {
      question: "Quanto custa ter um clube de assinatura na barbearia?",
      answer:
        "No BestBarbers, o sistema completo — app próprio, clube, cobrança automática e painel de gestão — começa em R$299/mês, sem custo de setup e sem taxa por assinante cadastrado. Como não há cobrança por assinante, a margem do clube melhora à medida que a base cresce.",
    },
    {
      question: "Quantos planos eu devo oferecer no clube?",
      answer:
        "De 2 a 3 planos, não mais. Cada um falando com um perfil claro: um de entrada, um intermediário (que funciona como âncora e onde a maioria deve cair) e, opcionalmente, um premium com pacote completo e benefícios. Mais que três opções confunde o cliente e dificulta a venda na cadeira.",
    },
    {
      question: "Como evitar que o assinante cancele o clube?",
      answer:
        "A retenção começa no onboarding (app instalado e próximo corte agendado já na adesão) e se sustenta no ritual mensal de comunicação. O ponto crítico é o meio do mês: assinante que não usou nenhum crédito até a terceira semana é o principal candidato a cancelar, e uma mensagem ou agendamento facilitado nessa hora salva a assinatura.",
    },
    {
      question: "Clube de assinatura funciona em barbearia pequena?",
      answer:
        "Sim. Um case real da base é uma barbearia de apenas 3 cadeiras em Araxá/MG que chegou a 290 assinantes e R$27.586/mês de receita recorrente, triplicando o clube em 18 meses. O que destrava não é o tamanho da barbearia, é a disciplina na venda, no onboarding e na comunicação mensal.",
    },
    {
      question: "Preciso de um app para rodar o clube de assinatura?",
      answer:
        "É possível operar manualmente até cerca de 20 assinantes, mas não é recomendável acima disso. Cobrança automática, controle de créditos, notificações e acompanhamento de quem está em risco exigem um sistema dedicado — sem ele, a gestão vira cobrança esquecida e inadimplência invisível, e o clube não escala.",
    },
    {
      question: "Em quanto tempo o clube de assinatura dá resultado?",
      answer:
        "Com o plano de 30 dias, o clube entra no ar e ganha base inicial dentro do primeiro mês. A maturidade — base estável e ritmo previsível de adesões e renovações — costuma chegar nos meses seguintes, conforme o ritual mensal de retenção faz efeito. Na base BestBarbers, a barbearia média mantém o clube ativo por 12,1 meses.",
    },
  ],

  // ===========================================================================
  // Related
  // ===========================================================================
  relatedSlugs: [
    "precificar-clube-assinatura-barbearia",
    "onboarding-assinante-clube-barbearia",
    "case-barbearia-290-assinantes-clube",
  ],
  relatedFeatures: [
    {
      title: "Clube de Assinaturas",
      href: "/clube-de-assinaturas",
      description:
        "Crie planos, automatize cobranças e gerencie assinantes com painel completo de uso, pagamentos e retenção.",
    },
    {
      title: "App Próprio",
      href: "/app-proprio-barbearia",
      description:
        "Um aplicativo com a marca da sua barbearia para agendamento, clube de assinaturas, notificações e pagamentos.",
    },
    {
      title: "Gestão Financeira",
      href: "/gestao-financeira-barbearia",
      description:
        "Acompanhe a receita recorrente separada da avulsa, pagamentos e pendências em um painel unificado.",
    },
  ],
};
