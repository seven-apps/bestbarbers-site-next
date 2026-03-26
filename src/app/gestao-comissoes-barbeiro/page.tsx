import type { Metadata } from "next";
import Link from "next/link";
import { FeatureCTA } from "@/components/FeatureCTA";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title:
    "Gestão de Comissões de Barbeiro — Cálculo Automático | BestBarbers",
  description:
    "Calcule comissões de barbeiros automaticamente. Configure percentual ou valor fixo por serviço e profissional. Relatórios detalhados de quanto cada barbeiro tem a receber.",
  alternates: {
    canonical: "/gestao-comissoes-barbeiro",
  },
};

export default function GestaoComissoesBarbeiro() {
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
            <span className="text-white">Gestão de Comissões</span>
          </nav>
        </div>
      </section>

      {/* Hero */}
      <section className="bg-[#121212] py-16 md:py-24">
        <div className="container-custom">
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-4xl">
            Gestão de Comissões de Barbeiro{" "}
            <span className="text-[#ffaf02]">
              — Cálculo Automático e Transparente
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
            &ldquo;Vendi assinatura a R$200, o cliente cortou com 4 barbeiros
            diferentes no mês. Quanto pago pra cada um?&rdquo; Essa é uma das
            dores mais comuns de donos de barbearia. O BestBarbers resolve isso
            automaticamente.
          </p>
          <div className="mt-10">
            <FeatureCTA
              originDesc="[Site]BT-Comissoes"
              className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              QUERO GESTÃO DE COMISSÕES
            </FeatureCTA>
          </div>
        </div>
      </section>

      {/* A Dor */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212]">
            O Pesadelo de Calcular Comissão na Mão
          </h2>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-3xl">
            Quem tem barbearia sabe: calcular comissão manualmente é uma das
            tarefas mais demoradas e que mais gera conflito. Serviços avulsos,
            assinaturas divididas entre profissionais, produtos — tudo misturado.
          </p>
          <div className="mt-8 bg-[#121212] rounded-2xl p-8">
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <span className="text-red-400 text-lg mt-0.5">&#10007;</span>
                <p className="text-gray-300">
                  &ldquo;Fico 2 horas todo dia 30 calculando comissão de cada
                  barbeiro&rdquo;
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-red-400 text-lg mt-0.5">&#10007;</span>
                <p className="text-gray-300">
                  &ldquo;Barbeiro reclama que a comissão está errada — e eu não
                  consigo provar&rdquo;
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-red-400 text-lg mt-0.5">&#10007;</span>
                <p className="text-gray-300">
                  &ldquo;Assinatura de R$200, 4 barbeiros cortaram — como
                  dividir?&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Configuracao */}
      <section className="bg-[#121212] py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            Configure Uma Vez, Funciona Para Sempre
          </h2>
          <p className="mt-6 text-gray-300 text-lg leading-relaxed max-w-3xl">
            No painel do BestBarbers, você configura as regras de comissão uma
            única vez. Depois disso, cada atendimento registrado calcula a
            comissão automaticamente.
          </p>
          <div className="mt-10 grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">
                Percentual por Serviço
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Defina que o barbeiro ganha 40% do corte, 50% da barba e 30% da
                hidratação. Cada serviço pode ter um percentual diferente.
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">
                Valor Fixo por Serviço
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Prefere pagar R$15 por corte independente do preço? Também
                funciona. Configure valor fixo por serviço por profissional.
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">
                Regras por Profissional
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Barbeiro sênior ganha 50%, júnior ganha 35%? Sem problema. Cada
                profissional pode ter suas próprias regras de comissão.
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">
                Comissão sobre Produtos
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Barbeiro vendeu uma pomada? A comissão sobre venda de produtos
                também é calculada automaticamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Funciona com Clube */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212]">
            Funciona com o Clube de Assinaturas
          </h2>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-3xl">
            O maior desafio de comissão em barbearias com{" "}
            <Link
              href="/clube-de-assinaturas"
              className="text-[#ffaf02] hover:underline font-semibold"
            >
              clube de assinaturas
            </Link>{" "}
            é dividir o valor da assinatura entre os barbeiros que atenderam o
            cliente no mês. O BestBarbers faz isso automaticamente.
          </p>
          <div className="mt-8 bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <h3 className="text-lg font-bold text-[#121212] mb-4">
              Exemplo prático
            </h3>
            <div className="space-y-4 text-gray-600">
              <p>
                <strong>Assinatura:</strong> R$200/mês — cliente cortou 4 vezes
                no mês
              </p>
              <p>
                <strong>Barbeiro A:</strong> 2 cortes = R$100 da assinatura
                &#8594; 40% = R$40 de comissão
              </p>
              <p>
                <strong>Barbeiro B:</strong> 1 corte = R$50 da assinatura
                &#8594; 40% = R$20 de comissão
              </p>
              <p>
                <strong>Barbeiro C:</strong> 1 corte = R$50 da assinatura
                &#8594; 40% = R$20 de comissão
              </p>
              <p className="text-[#121212] font-semibold mt-4">
                Tudo calculado automaticamente. Sem briga, sem planilha, sem
                erro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Relatorios */}
      <section className="bg-[#121212] py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            Relatórios Detalhados por Barbeiro
          </h2>
          <p className="mt-6 text-gray-300 text-lg leading-relaxed max-w-3xl">
            Cada barbeiro pode ver exatamente quanto tem a receber — e como o
            cálculo foi feito. Transparência total que elimina conflitos.
          </p>
          <div className="mt-8 space-y-4 max-w-3xl">
            <div className="flex gap-4 items-start">
              <span className="text-[#ffaf02] text-xl mt-1">&#10003;</span>
              <div>
                <p className="text-white font-semibold">
                  Extrato por período
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Lista todos os atendimentos, valores e comissões de cada
                  barbeiro no período selecionado.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-[#ffaf02] text-xl mt-1">&#10003;</span>
              <div>
                <p className="text-white font-semibold">
                  Detalhamento por serviço
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Mostra quanto o barbeiro ganhou com corte, barba, hidratação e
                  produtos separadamente.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-[#ffaf02] text-xl mt-1">&#10003;</span>
              <div>
                <p className="text-white font-semibold">
                  Ranking de faturamento
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Veja quais barbeiros mais faturam e use como incentivo para a
                  equipe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212] mb-8">
            Parte do Controle Financeiro Completo
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-3xl">
            A gestão de comissões é uma das funcionalidades do{" "}
            <Link
              href="/gestao-financeira-barbearia"
              className="text-[#ffaf02] hover:underline font-semibold"
            >
              módulo financeiro completo
            </Link>{" "}
            do BestBarbers. Conheça também:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/gestao-financeira-barbearia"
              className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-[#ffaf02]/30 transition-colors group"
            >
              <h3 className="font-bold text-[#121212] group-hover:text-[#ffaf02] transition-colors">
                Gestão Financeira
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Fluxo de caixa, relatórios e pagamentos
              </p>
            </Link>
            <Link
              href="/nota-fiscal-barbearia"
              className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-[#ffaf02]/30 transition-colors group"
            >
              <h3 className="font-bold text-[#121212] group-hover:text-[#ffaf02] transition-colors">
                Nota Fiscal Automática
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                NFS-e emitida automaticamente
              </p>
            </Link>
            <Link
              href="/sistema-para-barbearia"
              className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-[#ffaf02]/30 transition-colors group"
            >
              <h3 className="font-bold text-[#121212] group-hover:text-[#ffaf02] transition-colors">
                Sistema Completo
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Todas as funcionalidades BestBarbers
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#121212] py-16 md:py-20">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            Acabe com a Dor de Cabeça das{" "}
            <span className="text-[#ffaf02]">Comissões</span>
          </h2>
          <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
            Configure as regras uma vez. O sistema calcula tudo
            automaticamente — cada atendimento, cada barbeiro, cada centavo.
          </p>
          <div className="mt-8">
            <FeatureCTA
              originDesc="[Site]BT-Comissoes"
              className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              QUERO GESTÃO DE COMISSÕES
            </FeatureCTA>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
