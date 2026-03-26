import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Gestao Financeira para Barbearia — Controle Completo | BestBarbers",
  description:
    "Controle financeiro completo para barbearia: fluxo de caixa, comissoes automaticas, relatorios gerenciais e gestao de pagamentos. Saiba exatamente quanto sua barbearia ganha.",
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
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Gestao Financeira Barbearia</span>
          </nav>
        </div>
      </section>

      {/* Hero */}
      <section className="bg-[#121212] py-16 md:py-24">
        <div className="container-custom">
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-4xl">
            Gestao Financeira para Barbearia{" "}
            <span className="text-[#ffaf02]">
              — Saiba Exatamente Quanto Sua Barbearia Ganha
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
            &ldquo;Nao sei quanto minha barbearia ganha de verdade.&rdquo; Essa
            e a dor numero 1 de donos de barbearia — mencionada 47 vezes nas
            nossas pesquisas. O BestBarbers resolve isso com controle financeiro
            automatico, em tempo real.
          </p>
          <div className="mt-10">
            <Link
              href="https://www.bestbarbers.app/form?source=site&desc=[Site]BT-Financeiro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              QUERO CONTROLE FINANCEIRO
            </Link>
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
            caderno, sem surpresa no final do mes.
          </p>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-[#ffaf02]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">&#128200;</span>
              </div>
              <h3 className="text-lg font-bold text-[#121212] mb-2">
                Entradas e Saidas
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Visualize receitas e despesas por dia, semana ou mes. Saiba
                exatamente o saldo disponivel a qualquer momento.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-[#ffaf02]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">&#128176;</span>
              </div>
              <h3 className="text-lg font-bold text-[#121212] mb-2">
                Registro Automatico
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Cada pagamento no sistema — Pix, cartao, dinheiro, assinatura —
                e registrado automaticamente no financeiro.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-[#ffaf02]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">&#128202;</span>
              </div>
              <h3 className="text-lg font-bold text-[#121212] mb-2">
                Previsao de Receita
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Com o{" "}
                <Link
                  href="/clube-de-assinaturas"
                  className="text-[#ffaf02] hover:underline"
                >
                  clube de assinaturas
                </Link>
                , voce sabe antecipadamente quanto vai receber no proximo mes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comissoes */}
      <section className="bg-[#121212] py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            Comissoes de Barbeiros — Calculo Automatico
          </h2>
          <p className="mt-6 text-gray-300 text-lg leading-relaxed max-w-3xl">
            Chega de calcular comissao na mao ou no Excel. O sistema calcula
            automaticamente quanto cada barbeiro tem a receber, baseado nos
            atendimentos realizados. Saiba mais na pagina de{" "}
            <Link
              href="/gestao-comissoes-barbeiro"
              className="text-[#ffaf02] hover:underline"
            >
              gestao de comissoes
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
                    Percentual ou valor fixo por servico
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Regras diferentes por profissional
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Comissao sobre produtos vendidos
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  Resultado automatico
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Relatorio de comissao por periodo
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Transparencia total para o barbeiro
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
            Relatorios Gerenciais Automaticos
          </h2>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-3xl">
            Relatorios que se geram sozinhos — diarios, semanais e mensais. Voce
            abre o painel e ja sabe como esta a saude financeira da barbearia.
          </p>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-[#121212] mb-3">
                Diario
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
                Comparativo com semanas anteriores, tendencias de receita,
                ocupacao por barbeiro.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-[#121212] mb-3">
                Mensal
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Resultado do mes, comissoes a pagar, receita de assinaturas vs.
                avulsos, ticket medio.
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
            Dinheiro, cartao de credito, debito, Pix e cobranca recorrente do
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
                Cartao Credito/Debito
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
            entra automaticamente no financeiro. Voce sabe quanto e receita
            recorrente previsivel e quanto e avulso — essencial para tomar
            decisoes de investimento.
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
                Gestao de Comissoes
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Calculo automatico por barbeiro e servico
              </p>
            </Link>
            <Link
              href="/nota-fiscal-barbearia"
              className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-[#ffaf02]/30 transition-colors group"
            >
              <h3 className="font-bold text-white group-hover:text-[#ffaf02] transition-colors">
                Nota Fiscal Automatica
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                NFS-e emitida apos cada atendimento
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
            Chega de surpresa no final do mes. Controle financeiro real, em
            tempo real.
          </p>
          <div className="mt-8">
            <Link
              href="https://www.bestbarbers.app/form?source=site&desc=[Site]BT-Financeiro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              QUERO CONTROLE FINANCEIRO
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
