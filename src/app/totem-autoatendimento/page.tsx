import type { Metadata } from "next";
import Link from "next/link";
import { FeatureCTA } from "@/components/FeatureCTA";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title:
    "Totem de Autoatendimento para Barbearia — Check-in + Pagamento | BestBarbers",
  description:
    "Totem para barbearia: check-in automatico, comanda digital, pagamento e reagendamento. Sem filas no caixa. O cliente faz tudo sozinho.",
  alternates: {
    canonical: "/totem-autoatendimento",
  },
};

export default function TotemAutoatendimento() {
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
            <span className="text-white">Totem de Autoatendimento</span>
          </nav>
        </div>
      </section>

      {/* Hero */}
      <section className="bg-[#121212] py-16 md:py-24">
        <div className="container-custom">
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-4xl">
            Totem de Autoatendimento{" "}
            <span className="text-[#ffaf02]">para Barbearia</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
            Check-in automatico, comanda digital, pagamento e reagendamento — o
            cliente faz tudo sozinho, sem fila no caixa. Seu time foca no que
            importa: cortar cabelo.
          </p>
          <div className="mt-10">
            <FeatureCTA
              originDesc="[Site]BT-Totem-Page"
              className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              QUERO TOTEM NA MINHA BARBEARIA
            </FeatureCTA>
          </div>
        </div>
      </section>

      {/* O que e o Totem */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212]">
            O que e o Totem BestBarbers?
          </h2>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-3xl">
            O totem e um equipamento fisico instalado na sua barbearia — como os
            que voce ja viu no McDonald&apos;s, em aeroportos ou em
            estacionamentos. O cliente chega, faz check-in, adiciona produtos a
            comanda, paga e agenda o proximo corte. Tudo sozinho.
          </p>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
              <div className="w-14 h-14 bg-[#ffaf02]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">&#128100;</span>
              </div>
              <h3 className="text-lg font-bold text-[#121212] mb-2">
                Check-in Automatico
              </h3>
              <p className="text-gray-600 text-sm">
                Cliente confirma presenca ao chegar — sem precisar falar com
                ninguem.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
              <div className="w-14 h-14 bg-[#ffaf02]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">&#128203;</span>
              </div>
              <h3 className="text-lg font-bold text-[#121212] mb-2">
                Comanda Digital
              </h3>
              <p className="text-gray-600 text-sm">
                Adiciona produtos e servicos extras direto no totem durante a
                visita.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
              <div className="w-14 h-14 bg-[#ffaf02]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">&#128179;</span>
              </div>
              <h3 className="text-lg font-bold text-[#121212] mb-2">
                Pagamento
              </h3>
              <p className="text-gray-600 text-sm">
                Paga no totem com Pix, cartao ou debita do clube de assinaturas.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
              <div className="w-14 h-14 bg-[#ffaf02]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">&#128197;</span>
              </div>
              <h3 className="text-lg font-bold text-[#121212] mb-2">
                Reagendamento
              </h3>
              <p className="text-gray-600 text-sm">
                Antes de sair, ja agenda o proximo corte — aumenta a recorrencia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quebrando a objecao */}
      <section className="bg-[#121212] py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            &ldquo;Meu Cliente Nao Vai Usar Totem&rdquo;
          </h2>
          <p className="mt-6 text-gray-300 text-lg leading-relaxed max-w-3xl">
            O mercado mudou. Seu cliente ja usa totem de autoatendimento no
            McDonald&apos;s, no aeroporto, no estacionamento e no cinema. Ele ja
            sabe como funciona — e prefere a praticidade.
          </p>
          <div className="mt-10 bg-white/5 rounded-2xl p-8 border border-white/10 max-w-3xl">
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <span className="text-[#ffaf02] text-xl mt-1">&#10003;</span>
                <div>
                  <p className="text-white font-semibold">
                    Elimina filas no caixa
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    O barbeiro nao para de atender para cobrar. O cliente resolve
                    sozinho.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-[#ffaf02] text-xl mt-1">&#10003;</span>
                <div>
                  <p className="text-white font-semibold">
                    Aumenta o ticket medio
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Produtos na tela, sem pressao de vendedor. O cliente adiciona
                    o que quer.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="text-[#ffaf02] text-xl mt-1">&#10003;</span>
                <div>
                  <p className="text-white font-semibold">
                    Passa imagem profissional
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Barbearia com totem transmite modernidade. E diferente de
                    qualquer concorrente da regiao.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add-on ao plano */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212]">
            Como Funciona a Contratacao
          </h2>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-3xl">
            O totem e um add-on opcional ao{" "}
            <Link
              href="/sistema-para-barbearia"
              className="text-[#ffaf02] hover:underline font-semibold"
            >
              plano App Exclusivo
            </Link>{" "}
            do BestBarbers. Voce recebe o equipamento configurado e pronto para
            uso — basta ligar na tomada e conectar ao Wi-Fi.
          </p>
          <div className="mt-8 bg-[#121212] rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  O que esta incluso
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Equipamento totem (tablet industrial + suporte)
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Instalacao e configuracao remota
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Integracao com seu sistema BestBarbers
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ffaf02] mt-1">&#10003;</span>
                    Suporte tecnico dedicado
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  Funciona junto com
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/clube-de-assinaturas"
                      className="text-[#ffaf02] hover:underline"
                    >
                      Clube de Assinaturas
                    </Link>
                    <span className="text-gray-400">
                      {" "}
                      — debita direto do plano do cliente
                    </span>
                  </li>
                  <li>
                    <Link
                      href="/agendamento-online"
                      className="text-[#ffaf02] hover:underline"
                    >
                      Agendamento Online
                    </Link>
                    <span className="text-gray-400">
                      {" "}
                      — reagenda antes de sair
                    </span>
                  </li>
                  <li>
                    <Link
                      href="/nota-fiscal-barbearia"
                      className="text-[#ffaf02] hover:underline"
                    >
                      Nota Fiscal Automatica
                    </Link>
                    <span className="text-gray-400">
                      {" "}
                      — NFS-e emitida no pagamento
                    </span>
                  </li>
                  <li>
                    <Link
                      href="/gestao-financeira-barbearia"
                      className="text-[#ffaf02] hover:underline"
                    >
                      Gestao Financeira
                    </Link>
                    <span className="text-gray-400">
                      {" "}
                      — tudo registrado automaticamente
                    </span>
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
            Perguntas Frequentes sobre o Totem
          </h2>
          <div className="space-y-6 max-w-3xl">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white">
                Preciso de internet no local?
              </h3>
              <p className="mt-3 text-gray-400 leading-relaxed">
                Sim, o totem precisa de conexao Wi-Fi para se comunicar com o
                sistema BestBarbers em tempo real — check-in, pagamentos e
                agendamentos. Funciona com qualquer internet comercial.
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white">
                Posso usar o totem sem o plano App Exclusivo?
              </h3>
              <p className="mt-3 text-gray-400 leading-relaxed">
                O totem e um add-on do plano App Exclusivo porque depende das
                funcionalidades integradas — agendamento, clube, pagamentos e
                comanda. Sem essas funcionalidades, o totem nao teria o que
                oferecer ao cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212]">
            Modernize Sua Barbearia com{" "}
            <span className="text-[#ffaf02]">Autoatendimento</span>
          </h2>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Sem filas, sem confusao no caixa, sem perder tempo. O cliente faz
            tudo sozinho.
          </p>
          <div className="mt-8">
            <FeatureCTA
              originDesc="[Site]BT-Totem-Page"
              className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              QUERO TOTEM NA MINHA BARBEARIA
            </FeatureCTA>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
