/**
 * REGISTRO ÚNICO DE ARTEFATOS da família `/projeto-do-clube` (§6.1 da arquitetura).
 *
 * Ordem do André: «se para produzir a página você precisa de uma imagem do sistema,
 * cria com um placeholder e depois a gente substitui». Então nenhuma imagem faltando
 * trava a construção — o `<PcArtefato>` desenha um bloco com a proporção EXATA do
 * arquivo final, e a troca não mexe no layout nem no orçamento de peso.
 *
 * SUBSTITUIR É UM DIFF DE UMA LINHA: põe o arquivo em
 * `/public/images/projeto-clube/<id>.webp` e troca `status: "placeholder"` → `"real"`.
 * Nada mais muda. E, desde 19/Set, a troca é em UM lugar só: `controle-artefatos.ts`
 * passou a re-exportar deste registro em vez de manter cópia própria dos mesmos ids
 * — antes o mesmo `.webp` tinha dois `status` e um deles ia ficar para trás.
 *
 * ATIVOS QUEIMADOS — proibidos em qualquer forma (arquivo, arte, `alt`):
 * `hero-best-5-influencers.png`, `Rapha_2.webp`, `Rapha-LP_1.webp`, `rapha_1.webp`,
 * `rapha_1rapha.webp`, `Totem-Rapha_1.webp`, `partners/mileno.png`,
 * `partners/rapha.png`, `imagens-mobile/Mockup-app-milenitos.png`,
 * `imagens-mobile/milenitos-app-e-mockup-web.png`. Nenhum `alt`, nenhuma `descricao`
 * e nenhuma arte desta família cita pessoa, barbearia parceira ou concorrente: toda
 * captura usa marca e dados FICTÍCIOS, identificados na própria imagem.
 *
 * A guarda editorial V9 mora em `ponteEfetiva()` (`pc-copy.ts`): enquanto o artefato
 * que a peça promete for placeholder, a ponte cai para «Como segue a conversa». A
 * página nunca promete mostrar o que ainda não tem.
 */

export type PcArtefatoStatus = "placeholder" | "real";

export interface PcArtefatoSpec {
  id: string;
  /** Briefing de produção: o que a imagem final precisa mostrar. Não é legenda. */
  descricao: string;
  proporcao: `${number}/${number}`;
  /** Teto do arquivo SERVIDO, em KB (§4.3 é critério de aceite do PR). */
  pesoAlvoKb: number;
  arquivoFinal: string;
  /** Texto alternativo já escrito, sem nome de pessoa, parceiro ou concorrente. */
  alt: string;
  status: PcArtefatoStatus;
}

export const PC_ARTEFATOS: Record<string, PcArtefatoSpec> = {
  // Recriação fiel do «Extrato de recebimentos de assinaturas» do painel, com dados
  // fictícios (scripts/creative/render-telas-sistema-clube.ts, repo do OS). A captura
  // real tinha nomes de clientes, faturamento real e a coluna de taxas.
  "clube-cobranca": {
    id: "clube-cobranca",
    descricao:
      "Extrato de recebimentos de assinaturas: mensalidades pagas no crédito, com status Recebido, por assinante. Dados fictícios identificados.",
    proporcao: "4/3",
    pesoAlvoKb: 150,
    arquivoFinal: "/images/projeto-clube/clube-cobranca.webp",
    alt: "Extrato de recebimentos do clube: mensalidades pagas no cartão de crédito, com status recebido",
    status: "real",
  },
  // Recriação fiel do cadastro do plano do painel (dados fictícios): limite de
  // utilização e dias específicos ligados, segunda a quarta marcados.
  "clube-plano-regra": {
    id: "clube-plano-regra",
    descricao:
      "Cadastro do plano do clube com limite de utilização e dias específicos (segunda a quarta). Nomes e valores fictícios.",
    proporcao: "4/3",
    pesoAlvoKb: 150,
    arquivoFinal: "/images/projeto-clube/clube-plano-regra.webp",
    alt: "Cadastro de um plano de clube com limite de utilização e atendimento só de segunda a quarta",
    status: "real",
  },
  // Recriação fiel de «Detalhes da assinatura»: assinatura Vencida, com a fatura do mês
  // vencida e as anteriores pagas. Páginas: retentativa e bloqueio-na-agenda.
  "clube-assinatura-vencida": {
    id: "clube-assinatura-vencida",
    descricao:
      "Detalhes de uma assinatura com status Vencido: fatura do mês vencida, meses anteriores pagos. Dados fictícios.",
    proporcao: "4/3",
    pesoAlvoKb: 150,
    arquivoFinal: "/images/projeto-clube/clube-assinatura-vencida.webp",
    alt: "Detalhes de uma assinatura vencida: a fatura do mês não foi paga e as anteriores foram",
    status: "real",
  },
  // Recriação fiel de «Previsão de pagamentos de faturas»: pagas, vencidas e aguardando no
  // mês, por assinante. Páginas: sem-caderno e parceiro-seletto.
  "clube-previsao-faturas": {
    id: "clube-previsao-faturas",
    descricao:
      "Previsão de pagamentos por data de vencimento: faturas do mês pagas, vencidas e aguardando, por assinante. Dados fictícios.",
    proporcao: "4/3",
    pesoAlvoKb: 150,
    arquivoFinal: "/images/projeto-clube/clube-previsao-faturas.webp",
    alt: "Previsão de faturas do mês: quais assinantes pagaram, quais venceram e quais estão aguardando",
    status: "real",
  },
  // TODO(asset): clube-extrato-comissao — peças L004, L013, L051, L052, L054, L095
  "clube-extrato-comissao": {
    id: "clube-extrato-comissao",
    descricao:
      "Extrato de comissão por profissional, do atendimento ao valor a receber. Nomes fictícios.",
    proporcao: "4/3",
    pesoAlvoKb: 150,
    arquivoFinal: "/images/projeto-clube/clube-extrato-comissao.webp",
    alt: "Extrato de comissão por profissional, do atendimento ao valor a receber",
    status: "placeholder",
  },
  // TODO(asset): clube-adesao-cartao — transição «pedir comprovante» → «cobrança no cartão»
  "clube-adesao-cartao": {
    id: "clube-adesao-cartao",
    descricao:
      "Passo da adesão em que o cliente autoriza a assinatura no cartão. Tela do produto, dados fictícios, sem rosto identificável.",
    proporcao: "9/16",
    pesoAlvoKb: 120,
    arquivoFinal: "/images/projeto-clube/clube-adesao-cartao.webp",
    alt: "Passo da adesão ao clube em que a assinatura é autorizada no cartão",
    status: "placeholder",
  },
  // TODO(asset): app-marca-ficticia — peças L028 e L064
  "app-marca-ficticia": {
    id: "app-marca-ficticia",
    descricao:
      "App com a marca de uma barbearia FICTÍCIA na tela de escolher horário. As telas existentes no acervo trazem marca de parceiro e estão proibidas.",
    proporcao: "9/16",
    pesoAlvoKb: 120,
    arquivoFinal: "/images/projeto-clube/app-marca-ficticia.webp",
    alt: "Aplicativo de barbearia com marca fictícia aberto na tela de agendamento",
    status: "placeholder",
  },
  // TODO(asset): nfse-emitida — bloco de condições (NFS-e é feature real do produto)
  "nfse-emitida": {
    id: "nfse-emitida",
    descricao:
      "Nota fiscal de serviço emitida dentro do sistema, com o atendimento que a originou ao lado. Dados fictícios.",
    proporcao: "4/3",
    pesoAlvoKb: 120,
    arquivoFinal: "/images/projeto-clube/nfse-emitida.webp",
    alt: "Nota fiscal de serviço emitida a partir de um atendimento",
    status: "placeholder",
  },
  // TODO(asset): demo-capa — capa da demonstração de 60–90 s. Enquanto for placeholder,
  // TODA ponte «veja primeiro» do acervo cai para «como segue» (V9 / §6.3).
  "demo-capa": {
    id: "demo-capa",
    descricao:
      "Capa da demonstração de 60 a 90 segundos: tela do clube em primeiro plano, marca e dados fictícios, sem rosto identificável.",
    proporcao: "16/9",
    pesoAlvoKb: 150,
    arquivoFinal: "/images/projeto-clube/demo-capa.webp",
    alt: "Capa da demonstração do clube de assinaturas da BestBarbers",
    status: "placeholder",
  },

  /* ─── Ids que só o CONTROLE usa (produto inteiro, não só o clube) ─────────── */

  // TODO(asset): produto-app-marca — herói do controle
  "produto-app-marca": {
    id: "produto-app-marca",
    descricao:
      "Celular com o app de uma barbearia de marca FICTÍCIA aberto na tela de escolher horário. Logo fictícia visível, nomes de profissionais fictícios.",
    proporcao: "9/16",
    pesoAlvoKb: 120,
    arquivoFinal: "/images/projeto-clube/produto-app-marca.webp",
    alt: "Aplicativo de barbearia com marca fictícia aberto na tela de agendamento",
    status: "placeholder",
  },
  // TODO(asset): produto-agenda-dia — passo 1 do mecanismo do controle
  "produto-agenda-dia": {
    id: "produto-agenda-dia",
    descricao:
      "Agenda do dia no sistema, colunas por profissional, horários ocupados e livres. Nomes e serviços fictícios.",
    proporcao: "4/3",
    pesoAlvoKb: 150,
    arquivoFinal: "/images/projeto-clube/produto-agenda-dia.webp",
    alt: "Agenda do dia de uma barbearia dividida por profissional",
    status: "placeholder",
  },
  // TODO(asset): produto-financeiro-painel — declarado, ainda sem uso em tela
  "produto-financeiro-painel": {
    id: "produto-financeiro-painel",
    descricao:
      "Painel financeiro do mês: entradas, saídas e formas de pagamento. Valores fictícios identificados.",
    proporcao: "16/9",
    pesoAlvoKb: 150,
    arquivoFinal: "/images/projeto-clube/produto-financeiro-painel.webp",
    alt: "Painel financeiro de uma barbearia com entradas, saídas e formas de pagamento",
    status: "placeholder",
  },
  // TODO(asset): produto-totem — declarado, ainda sem uso em tela
  "produto-totem": {
    id: "produto-totem",
    descricao:
      "Totem de autoatendimento na recepção, tela de check-in aberta. Marca fictícia, sem rosto de pessoa identificável.",
    proporcao: "9/16",
    pesoAlvoKb: 120,
    arquivoFinal: "/images/projeto-clube/produto-totem.webp",
    alt: "Totem de autoatendimento com a tela de check-in aberta",
    status: "placeholder",
  },
};

export type PcArtefatoIdConhecido = keyof typeof PC_ARTEFATOS;

/** Quais ainda faltam. É a lista que vai para o André pedir a produção. */
export function pcArtefatosPendentes(): string[] {
  return Object.values(PC_ARTEFATOS)
    .filter((a) => a.status === "placeholder")
    .map((a) => a.id);
}
