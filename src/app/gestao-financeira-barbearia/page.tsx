import type { Metadata } from "next";
import { LinkTexto, PaginaDeRecurso, type ConteudoDeRecurso } from "@/components/recurso/PaginaDeRecurso";

/**
 * Página de "controle financeiro" e "sistema de caixa para barbearia" (SEO lote 2, 24/Nov/26). O Google rastreou a
 * versão anterior em 03/Jul/26 e não indexou. Saíram dela, por não terem fonte ou não existirem: "dor número 1,
 * mencionada 47 vezes", "saiba exatamente quanto ganha", "conciliado automaticamente", comparativo semanal e ocupação
 * nos "relatórios que se geram sozinhos". Não dizer DRE, lucro nem margem. Caixa, sangria, entrada, saída e exportação
 * para o Excel foram conferidos nas telas Cashier, FinancesReleases e SelectReleaseTypeModal do painel; o
 * saldo do período (entradas menos saídas) no manual do extrato da API. O saldo não é lucro: comissão só entra quando paga.
 */

const DESCRICAO =
  "Controle financeiro para barbearia: caixa do dia, entradas e saídas, extrato e a comissão de cada barbeiro calculada, sem planilha. A partir de R$299/mês.";

export const metadata: Metadata = {
  title: "Controle Financeiro para Barbearia: Caixa e Comissão | BestBarbers",
  description: DESCRICAO,
  alternates: { canonical: "/gestao-financeira-barbearia" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.bestbarbers.app/gestao-financeira-barbearia",
    title: "Controle financeiro para barbearia | BestBarbers",
    description: DESCRICAO,
    siteName: "BestBarbers",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "BestBarbers — controle financeiro para barbearia" }],
  },
};

const conteudo: ConteudoDeRecurso = {
  slug: "gestao-financeira-barbearia",
  trilha: "Controle financeiro",
  descricao: DESCRICAO,
  h1: "Controle financeiro para barbearia",
  frase: "O caixa do dia, o que entrou, o que saiu e a comissão de cada barbeiro no mesmo sistema, sem planilha.",
  destaques: [
    "Fechou a conta do cliente, o valor já aparece no caixa",
    "Entradas e saídas no mesmo extrato",
    "A comissão de cada barbeiro sai calculada",
  ],
  botao: "QUERO CONTROLE FINANCEIRO NA MINHA BARBEARIA",
  originDesc: "[Site]BT-Financeiro",
  prova: "Mais de 1.200 barbearias usam o BestBarbers.",
  oQueE: {
    titulo: "O que é o controle financeiro da barbearia",
    paragrafos: [
      "É saber quanto entrou no dia, o que saiu e quanto é de cada barbeiro.",
      "Na planilha, alguém anota cada corte. No sistema, a comanda, que é a conta do atendimento, já faz esse registro quando você fecha.",
      <>
        No BestBarbers, o financeiro faz parte do <LinkTexto href="/sistema-para-barbearia">sistema para barbearia</LinkTexto>,
        junto com a agenda, a comissão e os clientes.
      </>,
    ],
  },
  passos: {
    titulo: "Como fazer o controle financeiro da barbearia",
    sub: "Seis passos, do começo do dia ao fim do mês.",
    itens: [
      { titulo: "Abra o caixa", texto: "Com o valor que está na gaveta." },
      { titulo: "Feche cada comanda com a forma de pagamento", texto: "Dinheiro, Pix, débito ou crédito." },
      { titulo: "Lance o que saiu", texto: "As contas, como aluguel, luz e material, e a sangria, que é o dinheiro tirado da gaveta no meio do dia." },
      { titulo: "Feche o caixa no fim do dia", texto: "Conte o dinheiro da gaveta e compare com o valor em dinheiro que o sistema mostra." },
      { titulo: "Acerte a comissão pelo fechamento", texto: "O valor de cada barbeiro já vem calculado." },
      { titulo: "Veja o saldo do período", texto: "O extrato mostra o que entrou menos o que saiu. Os relatórios mostram os atendimentos e o faturamento de cada barbeiro." },
    ],
  },
  tabela: {
    titulo: "O que o financeiro do sistema faz",
    linhas: [
      { nome: "Caixa do dia", resolve: "Abre com o dinheiro da gaveta e fecha com o valor contado. Mostra as comandas, as entradas, as saídas e o valor em dinheiro no caixa." },
      { nome: "Sangria", resolve: "O dinheiro tirado da gaveta no meio do dia fica registrado." },
      { nome: "Entradas e saídas", resolve: "Você lança as contas, como aluguel, luz e material, e outras entradas que não são de atendimento." },
      { nome: "Extrato", resolve: "Atendimentos, produtos, assinaturas, despesas e comissões do período, com o saldo. Dá para exportar para o Excel." },
      { nome: "Formas de pagamento", resolve: "Quanto entrou em dinheiro, Pix, débito e crédito." },
      { nome: "Comissão dos barbeiros", resolve: "Calculada sozinha. O barbeiro vê o fechamento dele no app.", href: "/gestao-comissoes-barbeiro" },
      { nome: "Relatórios do mês", resolve: "Atendimentos, gasto médio por cliente e faturamento de cada barbeiro." },
      { nome: "Produtos e estoque", resolve: "O produto vendido na comanda já sai do estoque." },
      { nome: "Assinatura", resolve: "Quem está em dia, quem venceu, quem cancelou e quanto está previsto para entrar.", href: "/clube-de-assinaturas", modulo: true },
      { nome: "Nota fiscal", resolve: "A nota do serviço e a do produto vendido saem pelo sistema, com os arquivos que o contador pede.", href: "/nota-fiscal-barbearia", modulo: true },
    ],
  },
  preco: { titulo: "Quanto custa o sistema de caixa" },
  faq: {
    titulo: "Perguntas sobre controle financeiro para barbearia",
    itens: [
      { pergunta: "Dá para fazer o controle financeiro da barbearia em planilha?", resposta: "Dá, enquanto alguém anota cada atendimento, cada despesa e cada comissão todo dia. No sistema, a comanda fechada já aparece no caixa e entra na comissão do barbeiro." },
      { pergunta: "Qual a diferença entre o caixa e o extrato?", resposta: "O caixa é do dia: abre, recebe as comandas e fecha. O extrato é do período que você escolher e junta atendimentos, produtos, assinaturas, despesas e comissões." },
      { pergunta: "O sistema calcula a comissão dos barbeiros?", resposta: "Sim. Você cadastra o percentual de cada barbeiro uma vez. Na assinatura, que é à parte, você diz qual parte vira comissão e o sistema divide pelo que cada um atendeu." },
      { pergunta: "O sistema substitui o contador?", resposta: "Não. Ele registra o que entrou, o que saiu e as comissões. A contabilidade e os impostos continuam com o seu contador." },
    ],
  },
  leiaTambem: (
    <>
      Quer entender as contas antes? Leia o guia de <LinkTexto href="/blog/gestao-financeira-barbearia">gestão financeira para barbearia</LinkTexto>{" "}
      e use a <LinkTexto href="/calculadora-lucro-do-corte">calculadora de lucro do corte</LinkTexto>.
    </>
  ),
  fim: { titulo: "Fale com um especialista e veja o financeiro funcionando", texto: "Ele mostra o caixa, o extrato e a comissão com o jeito da sua barbearia." },
};

export default function GestaoFinanceiraBarbearia() {
  return <PaginaDeRecurso conteudo={conteudo} />;
}
