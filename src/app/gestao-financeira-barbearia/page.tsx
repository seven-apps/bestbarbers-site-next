import type { Metadata } from "next";
import Link from "next/link";
import { FeatureCTA } from "@/components/FeatureCTA";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Gestão Financeira para Barbearia — Controle Completo | BestBarbers",
  description:
    "Controle financeiro completo para barbearia: fluxo de caixa, comissões automáticas, relatórios gerenciais e gestão de pagamentos. Saiba exatamente quanto sua barbearia ganha.",
  alternates: {
    canonical: "/gestao-financeira-barbearia",
  },
};

export default function GestaoFinanceiraBarbearia() {
  return (
    <main className="min-h-screen overflow-x-hidden max-w-[100vw] w-full">
      <Navbar />

      {/* Breadcrumb */}
      <section className="bg-[#121212] pt-28 pb-4">
        <div className="container-custom">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-400">
            <Link href="/" className="hover:text-[#ffaf02] transition-colors">
              Início
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Gestão Financeira Barbearia</span>
          </nav>
        </div>
      </section>

      {/* Hero */}
      <section className="bg-[#121212] py-16 md:py-24">
        <div className="container-custom">
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-4xl">
            Gestão Financeira para Barbearia{" "}
            <span className="text-[#ffaf02]">
              — Saiba Exatamente Quanto Sua Barbearia Ganha
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
            &ldquo;Não sei quanto minha barbearia ganha de verdade.&rdquo; Essa
            é a dor número 1 de donos de barbearia — mencionada 47 vezes nas
            nossas pesquisas. O BestBarbers resolve isso com controle financeiro
            automático, em tempo real.
          </p>
          <div className="mt-10">
            <FeatureCTA
              originDesc="[Site]BT-Financeiro"
              className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              QUERO CONTROLE FINANCEIRO
            </FeatureCTA>
          </div>
        </div>
      </section>

      {/* Fluxo de Caixa */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212]">
            Fluxo de Caixa em Tempo Real
          </h2>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-3xl">
            Cada atendimento, cada produto vendido, cada assinatura cobrada —
            tudo entra automaticamente no seu fluxo de caixa. Sem planilha, sem
            caderno, sem surpresa no final do mês.
          </p>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-[#ffaf02]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">&#128200;</span>
              </div>
              <h3 className="text-lg font-bold text-[#121212] mb-2">
                Entradas e Saídas
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Visualize receitas e despesas por dia, semana ou mês. Saiba
                exatamente o saldo disponível a qualquer momento.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-[#ffaf02]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">&#128176;</span>
              </div>
              <h3 className="text-lg font-bold text-[#121212] mb-2">
                Registro Automático
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Cada pagamento no sistema — Pix, cartão, dinheiro, assinatura —
                é registrado automaticamente no financeiro.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-[#ffaf02]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">&#128202;</span>
              </div>
              <h3 className="text-lg font-bold text-[#121212] mb-2">
                Previsão de Receita
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Com o{" "}
                <Link
                  href="/clube-de-assinaturas"
                  className="text-[#ffaf02] hover:underline"
                >
                  clube de assinaturas
                </Link>
                , você sabe antecipadamente quanto vai receber no próximo mês.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comissoes */}
      <section className="bg-[#121212] py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            Comissões de Barbeiros — Cálculo Automático
          </h2>
          <p className="mt-6 text-gray-300 text-lg leading-relaxed max-w-3xl">
            Chega de calcular comissão na mão ou no Excel. O sistema calcula
            automaticamente quanto cada barbeiro tem a receber, baseado nos
            atendimentos realizados. Saiba mais na página de{" "}
            <Link
              href="/gestao-comissoes-barbeiro"
              className="text-[#ffaf02] hover:underline"
            >
              gestão de comissões
            </Link>
            .
          </p>
          <div className="mt-8 bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  Configure uma vez
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Percentual ou valor fixo por serviço
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Regras diferentes por profissional
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Comissão sobre produtos vendidos
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  Resultado automático
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Relatório de comissão por período
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Transparência total para o barbeiro
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Funciona com assinaturas e avulsos
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Relatorios */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212]">
            Relatórios Gerenciais Automáticos
          </h2>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-3xl">
            Relatórios que se geram sozinhos — diários, semanais e mensais. Você
            abre o painel e já sabe como está a saúde financeira da barbearia.
          </p>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-[#121212] mb-3">
                Diário
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Faturamento do dia, atendimentos realizados, formas de pagamento
                utilizadas.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-[#121212] mb-3">
                Semanal
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Comparativo com semanas anteriores, tendências de receita,
                ocupação por barbeiro.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-[#121212] mb-3">
                Mensal
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Resultado do mês, comissões a pagar, receita de assinaturas vs.
                avulsos, ticket médio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formas de Pagamento */}
      <section className="bg-[#121212] py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            Todas as Formas de Pagamento em um Lugar
          </h2>
          <p className="mt-6 text-gray-300 text-lg leading-relaxed max-w-3xl">
            Dinheiro, cartão de crédito, débito, Pix e cobrança recorrente do
            clube — tudo registrado e conciliado automaticamente.
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
              <span className="text-3xl block mb-2">&#128181;</span>
              <p className="text-white font-semibold text-sm">Dinheiro</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
              <span className="text-3xl block mb-2">&#128179;</span>
              <p className="text-white font-semibold text-sm">
                Cartão Crédito/Débito
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
              <span className="text-3xl block mb-2">&#9889;</span>
              <p className="text-white font-semibold text-sm">Pix</p>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
              <span className="text-3xl block mb-2">&#128260;</span>
              <p className="text-white font-semibold text-sm">
                Recorrente (Clube)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integracao com Clube */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212]">
            Integrado com o Clube de Assinaturas
          </h2>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-3xl">
            A receita do{" "}
            <Link
              href="/clube-de-assinaturas"
              className="text-[#ffaf02] hover:underline font-semibold"
            >
              clube de assinaturas
            </Link>{" "}
            entra automaticamente no financeiro. Você sabe quanto é receita
            recorrente previsível e quanto é avulso — essencial para tomar
            decisões de investimento.
          </p>
        </div>
      </section>

      {/* Cross-links */}
      <section className="bg-[#121212] py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-8">
            Funcionalidades Relacionadas
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/gestao-comissoes-barbeiro"
              className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-[#ffaf02]/30 transition-colors group"
            >
              <h3 className="font-bold text-white group-hover:text-[#ffaf02] transition-colors">
                Gestão de Comissões
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Cálculo automático por barbeiro e serviço
              </p>
            </Link>
            <Link
              href="/nota-fiscal-barbearia"
              className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-[#ffaf02]/30 transition-colors group"
            >
              <h3 className="font-bold text-white group-hover:text-[#ffaf02] transition-colors">
                Nota Fiscal Automática
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                NFS-e emitida após cada atendimento
              </p>
            </Link>
            <Link
              href="/sistema-para-barbearia"
              className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-[#ffaf02]/30 transition-colors group"
            >
              <h3 className="font-bold text-white group-hover:text-[#ffaf02] transition-colors">
                Sistema Completo
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Todas as funcionalidades do BestBarbers
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212]">
            Saiba Exatamente Quanto Sua{" "}
            <span className="text-[#ffaf02]">Barbearia Ganha</span>
          </h2>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Chega de surpresa no final do mês. Controle financeiro real, em
            tempo real.
          </p>
          <div className="mt-8">
            <FeatureCTA
              originDesc="[Site]BT-Financeiro"
              className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              QUERO CONTROLE FINANCEIRO
            </FeatureCTA>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
