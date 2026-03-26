import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FeatureCTA } from "@/components/FeatureCTA";

export const metadata: Metadata = {
  title:
    "Sistema para Barbearia Completo — App Proprio + Gestao | BestBarbers",
  description:
    "Sistema completo para barbearia: app proprio, clube de assinaturas, agendamento 24h, nota fiscal automatica, comissoes, financeiro e totem. 1.200+ barbearias confiam no BestBarbers.",
  alternates: {
    canonical: "/sistema-para-barbearia",
  },
};

export default function SistemaParaBarbearia() {
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
            <span className="text-white">Sistema para Barbearia</span>
          </nav>
        </div>
      </section>

      {/* Hero */}
      <section className="bg-[#121212] py-16 md:py-24">
        <div className="container-custom">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-5xl">
            Sistema para Barbearia{" "}
            <span className="text-[#ffaf02]">
              — Tudo que Voce Precisa para Gerenciar e Crescer
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
            O BestBarbers e a plataforma completa para barbearias que querem sair
            do improviso e crescer de verdade. App proprio na loja, clube de
            assinaturas, agendamento 24h, nota fiscal automatica, controle
            financeiro, comissoes, totem de autoatendimento e muito mais — tudo
            em um unico sistema.
          </p>
          <p className="mt-4 text-gray-400 text-base max-w-3xl">
            Mais de 1.200 barbearias em todo o Brasil ja confiam no BestBarbers
            para gerenciar suas operacoes e multiplicar seu faturamento.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <FeatureCTA
              originDesc="[Site]BT-Sistema"
              className="inline-flex items-center justify-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              QUERO UM APP PROPRIO PARA MINHA BARBEARIA
            </FeatureCTA>
          </div>
        </div>
      </section>

      {/* Por que 1.200+ barbearias */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212]">
            Por que 1.200+ Barbearias Escolheram o BestBarbers
          </h2>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-3xl">
            Barbearia nao e salao de beleza. Os sistemas genericos de agenda nao
            entendem a dinamica de uma barbearia — o clube de assinaturas, a
            comissao dividida, o agendamento por cadeira, o barbeiro que trabalha
            em mais de uma unidade. O BestBarbers foi feito exclusivamente para
            barbearias, por quem entende o negocio.
          </p>
          <div className="mt-10 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ffaf02]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">&#128241;</span>
              </div>
              <h3 className="text-xl font-bold text-[#121212] mb-2">
                App Proprio na Loja
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Seu app com a sua marca na App Store e Google Play. O cliente
                baixa, agenda, paga e se fideliza — tudo no seu app.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ffaf02]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">&#128260;</span>
              </div>
              <h3 className="text-xl font-bold text-[#121212] mb-2">
                Clube de Assinaturas
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Receita recorrente previsivel. O cliente paga todo mes e voce
                sabe exatamente quanto vai faturar.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ffaf02]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">&#128197;</span>
              </div>
              <h3 className="text-xl font-bold text-[#121212] mb-2">
                Agendamento 24h
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                O cliente agenda a qualquer hora, de qualquer lugar. Sua
                barbearia recebe agendamentos mesmo de madrugada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades Completas */}
      <section className="bg-[#121212] py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Funcionalidades Completas
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-3xl">
            Tudo que uma barbearia precisa para funcionar de forma profissional —
            do agendamento a nota fiscal, da comissao ao totem de
            autoatendimento.
          </p>

          {/* App Proprio */}
          <div className="mb-12 bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">
              <Link
                href="/app-proprio-barbearia"
                className="hover:text-[#ffaf02] transition-colors"
              >
                App Proprio Personalizado
              </Link>
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-3xl">
              Seu app com a marca da sua barbearia, publicado na App Store e
              Google Play. O cliente baixa, faz login, ve a agenda do barbeiro
              preferido, agenda, paga e recebe notificacoes push. Nao e um link
              generico — e um app de verdade, com o nome e a identidade visual da
              sua barbearia. Seus clientes encontram voce direto na loja de apps
              do celular.
            </p>
            <Link
              href="/app-proprio-barbearia"
              className="inline-block mt-4 text-[#ffaf02] hover:underline text-sm font-semibold"
            >
              Saiba mais sobre o App Proprio &#8594;
            </Link>
          </div>

          {/* Clube de Assinaturas */}
          <div className="mb-12 bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">
              <Link
                href="/clube-de-assinaturas"
                className="hover:text-[#ffaf02] transition-colors"
              >
                Clube de Assinaturas
              </Link>
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-3xl">
              Crie planos mensais personalizados para seus clientes. O sistema
              cobra automaticamente via cartao ou Pix, controla quem esta ativo,
              quem esta inadimplente e quanto voce vai receber no proximo mes.
              Barbearias com clube faturam em media 3x mais que barbearias so com
              atendimento avulso. E o que diferencia barbearia profissional de
              barbearia de bairro.
            </p>
            <Link
              href="/clube-de-assinaturas"
              className="inline-block mt-4 text-[#ffaf02] hover:underline text-sm font-semibold"
            >
              Saiba mais sobre o Clube de Assinaturas &#8594;
            </Link>
          </div>

          {/* Agendamento Online */}
          <div className="mb-12 bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">
              <Link
                href="/agendamento-online"
                className="hover:text-[#ffaf02] transition-colors"
              >
                Agendamento Online 24h
              </Link>
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-3xl">
              O cliente abre o app, escolhe o barbeiro, o servico e o horario —
              tudo em menos de 30 segundos. Funciona 24 horas por dia, 7 dias
              por semana. Sem WhatsApp, sem ligacao, sem &ldquo;tem horario pra
              hoje?&rdquo;. A agenda do barbeiro se atualiza em tempo real e
              notificacoes push lembram o cliente antes do horario. Resultado:
              menos faltas, mais atendimentos, zero confusao de agenda.
            </p>
            <Link
              href="/agendamento-online"
              className="inline-block mt-4 text-[#ffaf02] hover:underline text-sm font-semibold"
            >
              Saiba mais sobre Agendamento Online &#8594;
            </Link>
          </div>

          {/* Nota Fiscal */}
          <div className="mb-12 bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">
              <Link
                href="/nota-fiscal-barbearia"
                className="hover:text-[#ffaf02] transition-colors"
              >
                Nota Fiscal Automatica (NFS-e)
              </Link>
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-3xl">
              A NFS-e e obrigatoria em 2026 para barbearias. Com o BestBarbers,
              voce configura uma vez os dados fiscais e o sistema emite a nota
              automaticamente apos cada atendimento. Exportacao em PDF e XML para
              o contador. Sem trabalho manual, sem risco de multa, sem
              esquecimento.
            </p>
            <Link
              href="/nota-fiscal-barbearia"
              className="inline-block mt-4 text-[#ffaf02] hover:underline text-sm font-semibold"
            >
              Saiba mais sobre Nota Fiscal Automatica &#8594;
            </Link>
          </div>

          {/* Gestao Financeira */}
          <div className="mb-12 bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">
              <Link
                href="/gestao-financeira-barbearia"
                className="hover:text-[#ffaf02] transition-colors"
              >
                Gestao Financeira
              </Link>
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-3xl">
              Fluxo de caixa em tempo real, relatorios gerenciais automaticos
              (diarios, semanais, mensais) e conciliacao de todos os meios de
              pagamento — dinheiro, cartao, Pix e recorrente. Saiba exatamente
              quanto sua barbearia ganha e gasta, sem planilha e sem surpresa no
              final do mes.
            </p>
            <Link
              href="/gestao-financeira-barbearia"
              className="inline-block mt-4 text-[#ffaf02] hover:underline text-sm font-semibold"
            >
              Saiba mais sobre Gestao Financeira &#8594;
            </Link>
          </div>

          {/* Gestao de Comissoes */}
          <div className="mb-12 bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">
              <Link
                href="/gestao-comissoes-barbeiro"
                className="hover:text-[#ffaf02] transition-colors"
              >
                Gestao de Comissoes
              </Link>
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-3xl">
              Configure percentual ou valor fixo por servico e por profissional.
              O sistema calcula a comissao automaticamente — inclusive quando um
              assinante corta com barbeiros diferentes no mesmo mes. Relatorios
              detalhados por barbeiro eliminam conflitos e trazem transparencia
              para a equipe.
            </p>
            <Link
              href="/gestao-comissoes-barbeiro"
              className="inline-block mt-4 text-[#ffaf02] hover:underline text-sm font-semibold"
            >
              Saiba mais sobre Gestao de Comissoes &#8594;
            </Link>
          </div>

          {/* Totem */}
          <div className="mb-12 bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">
              <Link
                href="/totem-autoatendimento"
                className="hover:text-[#ffaf02] transition-colors"
              >
                Totem de Autoatendimento
              </Link>
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-3xl">
              Equipamento fisico para check-in, comanda digital, pagamento e
              reagendamento. O cliente faz tudo sozinho — sem fila no caixa, sem
              interromper o barbeiro. Aumenta o ticket medio com produtos na tela
              e passa uma imagem profissional que diferencia sua barbearia de
              qualquer concorrente.
            </p>
            <Link
              href="/totem-autoatendimento"
              className="inline-block mt-4 text-[#ffaf02] hover:underline text-sm font-semibold"
            >
              Saiba mais sobre o Totem &#8594;
            </Link>
          </div>

          {/* Notificacoes Push */}
          <div className="mb-12 bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">
              Notificacoes Push
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-3xl">
              Envie lembretes automaticos de agendamento, avisos de promocao,
              mensagens de aniversario e alertas de vencimento de assinatura
              direto no celular do cliente. Notificacoes push tem taxa de
              abertura 5x maior que email e nao dependem de WhatsApp. Voce
              configura uma vez e o sistema dispara sozinho.
            </p>
          </div>

          {/* Multi-unidades */}
          <div className="mb-12 bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">
              Multi-unidades
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-3xl">
              Gerencie 2, 5 ou 20 unidades a partir de um unico painel. Cada
              unidade tem sua propria agenda, seus barbeiros e seus relatorios —
              mas voce tem visao consolidada de tudo. Ideal para redes e
              franquias que precisam de controle centralizado sem perder a
              autonomia de cada loja.
            </p>
          </div>

          {/* Relatorios Gerenciais */}
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">
              Relatorios Gerenciais
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-3xl">
              Dashboards em tempo real com faturamento, ocupacao, ticket medio,
              taxa de retorno, assinantes ativos e inadimplentes. Relatorios
              automaticos diarios, semanais e mensais que voce recebe sem
              precisar pedir. Dados que transformam decisoes de &ldquo;eu
              acho&rdquo; em &ldquo;os numeros mostram&rdquo;.
            </p>
          </div>
        </div>
      </section>

      {/* Resultados Reais */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212]">
            Resultados Reais de Quem Usa
          </h2>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-3xl">
            Nao sao numeros inventados. Sao resultados reais de barbearias que
            usam o BestBarbers no dia a dia.
          </p>
          <div className="mt-10 grid md:grid-cols-3 gap-8">
            {/* Barbearia 4 cadeiras */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-lg font-bold text-[#121212] mb-1">
                Barbearia com 4 cadeiras
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Grande São Paulo/SP
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-[#ffaf02]">353</p>
                  <p className="text-sm text-gray-600">assinantes ativos</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#ffaf02]">
                    R$31.690
                  </p>
                  <p className="text-sm text-gray-600">faturamento mensal</p>
                </div>
                <p className="text-xs text-gray-400 pt-2 border-t border-gray-200">
                  Barbearia de 4 cadeiras que saiu de R$15K/mes para mais de
                  R$31K/mes com clube de assinaturas e app proprio.
                </p>
              </div>
            </div>

            {/* Rede 6 unidades */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-lg font-bold text-[#121212] mb-1">
                Rede com 6 unidades
              </h3>
              <p className="text-sm text-gray-500 mb-6">Minas Gerais</p>
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-[#ffaf02]">6</p>
                  <p className="text-sm text-gray-600">
                    unidades gerenciadas no BestBarbers
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#ffaf02]">R$440K</p>
                  <p className="text-sm text-gray-600">faturamento mensal</p>
                </div>
                <p className="text-xs text-gray-400 pt-2 border-t border-gray-200">
                  Rede que usa multi-unidades, clube de assinaturas e app proprio
                  para gerenciar todas as lojas de um unico painel.
                </p>
              </div>
            </div>

            {/* Single-unit recordista */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-lg font-bold text-[#121212] mb-1">
                Barbearia single-unit
              </h3>
              <p className="text-sm text-gray-500 mb-6">São Paulo/SP</p>
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-[#ffaf02]">700+</p>
                  <p className="text-sm text-gray-600">assinantes ativos</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#ffaf02]">1</p>
                  <p className="text-sm text-gray-600">unica unidade</p>
                </div>
                <p className="text-xs text-gray-400 pt-2 border-t border-gray-200">
                  Mais de 700 assinantes em uma unica barbearia. Prova de que
                  clube funciona em qualquer tamanho de operacao.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="bg-[#121212] py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            Planos BestBarbers
          </h2>
          <p className="mt-6 text-gray-300 text-lg leading-relaxed max-w-3xl">
            Dois planos pensados para estagios diferentes do seu negocio. Comece
            pelo basico e evolua quando estiver pronto.
          </p>
          <div className="mt-10 grid md:grid-cols-2 gap-8">
            {/* Plano Basico */}
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">
                Plano Basico
              </h3>
              <p className="text-[#ffaf02] font-bold text-lg mb-6">
                Gratis para comecar
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Ideal para barbearias que estao comecando a se organizar. Inclui
                gestao de agenda e controle financeiro basico.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-[#ffaf02] mt-1">&#10003;</span>
                  <Link
                    href="/agendamento-online"
                    className="hover:text-[#ffaf02] transition-colors"
                  >
                    Agendamento online
                  </Link>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ffaf02] mt-1">&#10003;</span>
                  <Link
                    href="/gestao-financeira-barbearia"
                    className="hover:text-[#ffaf02] transition-colors"
                  >
                    Controle financeiro basico
                  </Link>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ffaf02] mt-1">&#10003;</span>
                  <Link
                    href="/gestao-comissoes-barbeiro"
                    className="hover:text-[#ffaf02] transition-colors"
                  >
                    Gestao de comissoes
                  </Link>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ffaf02] mt-1">&#10003;</span>
                  Cadastro de clientes
                </li>
              </ul>
            </div>

            {/* Plano App Exclusivo */}
            <div className="bg-[#ffaf02]/10 rounded-2xl p-8 border-2 border-[#ffaf02]/30 relative">
              <div className="absolute -top-3 left-6 bg-[#ffaf02] text-[#121212] text-xs font-bold px-4 py-1 rounded-full">
                MAIS POPULAR
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Plano App Exclusivo
              </h3>
              <p className="text-[#ffaf02] font-bold text-lg mb-6">
                A partir de R$299/mes
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Para barbearias que querem crescer de verdade. Tudo do basico
                mais app proprio, clube de assinaturas e funcionalidades
                avancadas.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-[#ffaf02] mt-1">&#10003;</span>
                  Tudo do Plano Basico
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ffaf02] mt-1">&#10003;</span>
                  <Link
                    href="/app-proprio-barbearia"
                    className="hover:text-[#ffaf02] transition-colors"
                  >
                    App proprio na App Store e Google Play
                  </Link>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ffaf02] mt-1">&#10003;</span>
                  <Link
                    href="/clube-de-assinaturas"
                    className="hover:text-[#ffaf02] transition-colors"
                  >
                    Clube de assinaturas com cobranca automatica
                  </Link>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ffaf02] mt-1">&#10003;</span>
                  <Link
                    href="/nota-fiscal-barbearia"
                    className="hover:text-[#ffaf02] transition-colors"
                  >
                    Nota fiscal automatica (NFS-e)
                  </Link>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ffaf02] mt-1">&#10003;</span>
                  Notificacoes push personalizadas
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ffaf02] mt-1">&#10003;</span>
                  <Link
                    href="/totem-autoatendimento"
                    className="hover:text-[#ffaf02] transition-colors"
                  >
                    Totem de autoatendimento (opcional)
                  </Link>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ffaf02] mt-1">&#10003;</span>
                  Multi-unidades
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ffaf02] mt-1">&#10003;</span>
                  Relatorios gerenciais avancados
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-4xl font-bold text-[#121212] mb-10">
            Perguntas Frequentes sobre Sistema para Barbearia
          </h2>
          <div className="space-y-6 max-w-3xl">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-[#121212]">
                O BestBarbers funciona so para barbearia ou tambem para salao?
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                O BestBarbers foi criado exclusivamente para barbearias. Todas as
                funcionalidades — do{" "}
                <Link
                  href="/clube-de-assinaturas"
                  className="text-[#ffaf02] hover:underline"
                >
                  clube de assinaturas
                </Link>{" "}
                a{" "}
                <Link
                  href="/gestao-comissoes-barbeiro"
                  className="text-[#ffaf02] hover:underline"
                >
                  gestao de comissoes
                </Link>{" "}
                — foram pensadas para a realidade de quem tem barbearia, nao salao
                de beleza.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-[#121212]">
                Quanto tempo leva para comecar a usar?
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                O plano basico voce comeca a usar no mesmo dia. O plano App
                Exclusivo, com{" "}
                <Link
                  href="/app-proprio-barbearia"
                  className="text-[#ffaf02] hover:underline"
                >
                  app proprio
                </Link>{" "}
                publicado nas lojas, leva em media 15 dias para ficar pronto. A
                equipe de onboarding acompanha voce em cada etapa.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-[#121212]">
                Preciso trocar de maquininha de cartao?
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Nao. O BestBarbers funciona com qualquer maquininha. O controle
                financeiro registra o pagamento independente da bandeira ou
                operadora que voce usa.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-[#121212]">
                E se eu tiver mais de uma unidade?
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Perfeito. O BestBarbers suporta multi-unidades com visao
                consolidada. Voce gerencia todas as barbearias de um unico
                painel, com relatorios individuais e consolidados. Temos clientes
                gerenciando 6 unidades assim.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-[#121212]">
                Quanto custa o sistema?
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                O plano basico e gratuito para comecar. O plano App Exclusivo,
                com{" "}
                <Link
                  href="/app-proprio-barbearia"
                  className="text-[#ffaf02] hover:underline"
                >
                  app proprio
                </Link>
                ,{" "}
                <Link
                  href="/clube-de-assinaturas"
                  className="text-[#ffaf02] hover:underline"
                >
                  clube de assinaturas
                </Link>
                ,{" "}
                <Link
                  href="/nota-fiscal-barbearia"
                  className="text-[#ffaf02] hover:underline"
                >
                  nota fiscal
                </Link>{" "}
                e todas as funcionalidades avancadas, comeca a partir de
                R$299/mes. Fale com nossa equipe para um orcamento personalizado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#121212] py-16 md:py-24">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white max-w-3xl mx-auto">
            Sua Barbearia Merece um{" "}
            <span className="text-[#ffaf02]">Sistema de Verdade</span>
          </h2>
          <p className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto">
            Mais de 1.200 barbearias ja confiam no BestBarbers. Fale com nossa
            equipe e descubra como o sistema pode transformar o seu negocio.
          </p>
          <div className="mt-10">
            <FeatureCTA
              originDesc="[Site]BT-Sistema"
              className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-10 py-5 rounded-full text-base font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              QUERO UM APP PROPRIO PARA MINHA BARBEARIA
            </FeatureCTA>
          </div>
          <p className="mt-4 text-gray-500 text-sm">
            Sem compromisso. Fale com um especialista e tire todas as suas
            duvidas.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
