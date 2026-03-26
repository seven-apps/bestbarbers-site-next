import type { Metadata } from "next";
import Link from "next/link";
import { FeatureCTA } from "@/components/FeatureCTA";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Nota Fiscal Automatica para Barbearia (NFS-e 2026) | BestBarbers",
  description:
    "NFS-e automatica para barbearia — emissao apos cada atendimento, sem trabalho manual. Obrigatoria em 2026. Configure uma vez, o sistema faz o resto.",
  alternates: {
    canonical: "/nota-fiscal-barbearia",
  },
};

export default function NotaFiscalBarbearia() {
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
            <span className="text-white">Nota Fiscal Barbearia</span>
          </nav>
        </div>
      </section>

      {/* Hero */}
      <section className="bg-[#121212] py-16 md:py-24">
        <div className="container-custom">
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-4xl">
            Nota Fiscal Automatica para Barbearia{" "}
            <span className="text-[#ffaf02]">— NFS-e sem Trabalho Manual</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
            A emissao de NFS-e se tornou obrigatoria para barbearias em 2026.
            Com o BestBarbers, voce configura uma unica vez e o sistema emite a
            nota fiscal automaticamente apos cada atendimento — sem precisar
            lembrar, sem errar, sem atrasar.
          </p>
          <div className="mt-10">
            <FeatureCTA
              originDesc="[Site]BT-NF"
              className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              QUERO NOTA FISCAL AUTOMATICA
            </FeatureCTA>
          </div>
        </div>
      </section>

      {/* Timing: NFS-e obrigatoria em 2026 */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212]">
            NFS-e Obrigatoria em 2026 — Sua Barbearia Esta Pronta?
          </h2>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-3xl">
            A partir de 2026, todas as barbearias precisam emitir nota fiscal
            eletronica de servico (NFS-e) a cada atendimento. Quem nao se
            adequar corre risco de multas e problemas com a Receita. O
            BestBarbers ja esta preparado para isso — e faz tudo automaticamente
            para voce.
          </p>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-[#ffaf02]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">&#9888;</span>
              </div>
              <h3 className="text-lg font-bold text-[#121212] mb-2">
                Obrigatoriedade Legal
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                A NFS-e passou a ser obrigatoria para prestadores de servico,
                incluindo barbearias. Emitir manualmente nao e viavel com 20, 30
                atendimentos por dia.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-[#ffaf02]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">&#128176;</span>
              </div>
              <h3 className="text-lg font-bold text-[#121212] mb-2">
                Evite Multas
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Barbearias que nao emitem NFS-e podem receber autuacoes da
                prefeitura. O sistema automatico garante que nenhum atendimento
                fique sem nota.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="w-12 h-12 bg-[#ffaf02]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">&#9201;</span>
              </div>
              <h3 className="text-lg font-bold text-[#121212] mb-2">
                Zero Trabalho Extra
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Configure uma vez os dados fiscais no painel e pronto. Cada
                atendimento finalizado gera a NFS-e automaticamente — voce nao
                precisa fazer nada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="bg-[#121212] py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            Como Funciona a Emissao Automatica
          </h2>
          <div className="mt-10 space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-[#ffaf02] rounded-full flex items-center justify-center text-[#121212] font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Configure Seus Dados Fiscais
                </h3>
                <p className="mt-2 text-gray-400 leading-relaxed">
                  Insira CNPJ, inscricao municipal e certificado digital no
                  painel do BestBarbers. Isso e feito uma unica vez.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-[#ffaf02] rounded-full flex items-center justify-center text-[#121212] font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Atendimento Finalizado = Nota Emitida
                </h3>
                <p className="mt-2 text-gray-400 leading-relaxed">
                  Assim que o barbeiro finaliza o atendimento no sistema, a
                  NFS-e e gerada automaticamente e enviada para a prefeitura.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-[#ffaf02] rounded-full flex items-center justify-center text-[#121212] font-bold">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Exporte PDF e XML para o Contador
                </h3>
                <p className="mt-2 text-gray-400 leading-relaxed">
                  Todas as notas ficam organizadas no painel. Exporte em PDF ou
                  XML a qualquer momento — seu contador agradece.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integracao com Prefeituras */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212]">
            Integracao com Sistemas das Prefeituras
          </h2>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-3xl">
            O BestBarbers se conecta diretamente aos sistemas de NFS-e das
            prefeituras brasileiras. A nota e transmitida em tempo real, sem
            necessidade de acessar portais externos ou preencher formularios.
          </p>
          <div className="mt-8 bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-[#121212] mb-3">
                  O que esta incluso
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Emissao automatica apos cada atendimento
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Transmissao direta para a prefeitura
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Exportacao em PDF e XML
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Historico completo de notas emitidas
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#121212] mb-3">
                  Compativel com
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Padrao Nacional NFS-e (ABRASF)
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Principais municipios do Brasil
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Certificado digital A1 ou A3
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Suporte para MEI e Simples Nacional
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#121212] py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-10">
            Perguntas Frequentes sobre NFS-e para Barbearias
          </h2>
          <div className="space-y-6 max-w-3xl">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white">
                Minha barbearia realmente precisa emitir nota fiscal?
              </h3>
              <p className="mt-3 text-gray-400 leading-relaxed">
                Sim. A partir de 2026, a NFS-e e obrigatoria para prestadores de
                servico, incluindo barbearias e saloes. O descumprimento pode
                gerar multas e impedimentos fiscais.
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white">
                Preciso de certificado digital?
              </h3>
              <p className="mt-3 text-gray-400 leading-relaxed">
                Depende do municipio. Alguns exigem certificado digital A1 ou A3
                para a transmissao. O BestBarbers suporta ambos os tipos e te
                orienta na configuracao.
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white">
                A nota e emitida tambem para assinantes do clube?
              </h3>
              <p className="mt-3 text-gray-400 leading-relaxed">
                Sim. O sistema emite nota fiscal tanto para atendimentos avulsos
                quanto para servicos realizados dentro do{" "}
                <Link
                  href="/clube-de-assinaturas"
                  className="text-[#ffaf02] hover:underline"
                >
                  clube de assinaturas
                </Link>
                , mantendo tudo em conformidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212] mb-8">
            Faz Parte do Sistema Completo BestBarbers
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-3xl">
            A nota fiscal automatica e apenas uma das funcionalidades do{" "}
            <Link
              href="/sistema-para-barbearia"
              className="text-[#ffaf02] hover:underline font-semibold"
            >
              sistema completo para barbearias
            </Link>
            . Conheca tambem:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/app-proprio-barbearia"
              className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-[#ffaf02]/30 transition-colors group"
            >
              <h3 className="font-bold text-[#121212] group-hover:text-[#ffaf02] transition-colors">
                App Proprio Personalizado
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Seu app na App Store e Google Play
              </p>
            </Link>
            <Link
              href="/gestao-financeira-barbearia"
              className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-[#ffaf02]/30 transition-colors group"
            >
              <h3 className="font-bold text-[#121212] group-hover:text-[#ffaf02] transition-colors">
                Gestao Financeira
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Fluxo de caixa, comissoes e relatorios
              </p>
            </Link>
            <Link
              href="/gestao-comissoes-barbeiro"
              className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-[#ffaf02]/30 transition-colors group"
            >
              <h3 className="font-bold text-[#121212] group-hover:text-[#ffaf02] transition-colors">
                Gestao de Comissoes
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Calculo automatico por barbeiro
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#121212] py-16 md:py-20">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            Sua Barbearia em Dia com a{" "}
            <span className="text-[#ffaf02]">Nota Fiscal</span>
          </h2>
          <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
            Configure uma vez. O BestBarbers faz o resto — em cada atendimento,
            todos os dias.
          </p>
          <div className="mt-8">
            <FeatureCTA
              originDesc="[Site]BT-NF"
              className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              QUERO NOTA FISCAL AUTOMATICA
            </FeatureCTA>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
