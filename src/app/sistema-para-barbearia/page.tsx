import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { FeatureCTA } from "@/components/FeatureCTA";

export const metadata: Metadata = {
  title:
    "Sistema para Barbearia Completo — App Próprio + Gestão | BestBarbers",
  description:
    "Sistema completo para barbearia: app próprio, clube de assinaturas, agendamento 24h, nota fiscal automática, comissões, financeiro e totem. 1.200+ barbearias confiam no BestBarbers.",
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
              Início
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
              — Tudo que Você Precisa para Gerenciar e Crescer
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
            O BestBarbers é a plataforma completa para barbearias que querem sair
            do improviso e crescer de verdade. App próprio na loja, clube de
            assinaturas, agendamento 24h, nota fiscal automática, controle
            financeiro, comissões, totem de autoatendimento e muito mais — tudo
            em um único sistema.
          </p>
          <p className="mt-4 text-gray-400 text-base max-w-3xl">
            Mais de 1.200 barbearias em todo o Brasil já confiam no BestBarbers
            para gerenciar suas operações e multiplicar seu faturamento.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <FeatureCTA
              originDesc="[Site]BT-Sistema"
              className="inline-flex items-center justify-center gap-2 bg-[#ffaf02] text-[#121212] px-8 py-4 rounded-full text-sm font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              QUERO UM APP PRÓPRIO PARA MINHA BARBEARIA
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
            Barbearia não é salão de beleza. Os sistemas genéricos de agenda não
            entendem a dinâmica de uma barbearia — o clube de assinaturas, a
            comissão dividida, o agendamento por cadeira, o barbeiro que trabalha
            em mais de uma unidade. O BestBarbers foi feito exclusivamente para
            barbearias, por quem entende o negócio.
          </p>
          <div className="mt-10 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ffaf02]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">&#128241;</span>
              </div>
              <h3 className="text-xl font-bold text-[#121212] mb-2">
                App Próprio na Loja
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
                Receita recorrente previsível. O cliente paga todo mês e você
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
            do agendamento à nota fiscal, da comissão ao totem de
            autoatendimento.
          </p>

          {/* App Próprio */}
          <div className="mb-12 bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">
              <Link
                href="/app-proprio-barbearia"
                className="hover:text-[#ffaf02] transition-colors"
              >
                App Próprio Personalizado
              </Link>
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-3xl">
              Seu app com a marca da sua barbearia, publicado na App Store e
              Google Play. O cliente baixa, faz login, vê a agenda do barbeiro
              preferido, agenda, paga e recebe notificações push. Não é um link
              genérico — é um app de verdade, com o nome e a identidade visual da
              sua barbearia. Seus clientes encontram você direto na loja de apps
              do celular.
            </p>
            <Link
              href="/app-proprio-barbearia"
              className="inline-block mt-4 text-[#ffaf02] hover:underline text-sm font-semibold"
            >
              Saiba mais sobre o App Próprio &#8594;
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
              cobra automaticamente via cartão ou Pix, controla quem está ativo,
              quem está inadimplente e quanto você vai receber no próximo mês.
              Barbearias com clube faturam em média 3x mais que barbearias só com
              atendimento avulso. É o que diferencia barbearia profissional de
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
              O cliente abre o app, escolhe o barbeiro, o serviço e o horário —
              tudo em menos de 30 segundos. Funciona 24 horas por dia, 7 dias
              por semana. Sem WhatsApp, sem ligação, sem &ldquo;tem horário pra
              hoje?&rdquo;. A agenda do barbeiro se atualiza em tempo real e
              notificações push lembram o cliente antes do horário. Resultado:
              menos faltas, mais atendimentos, zero confusão de agenda.
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
                Nota Fiscal Automática (NFS-e)
              </Link>
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-3xl">
              A NFS-e é obrigatória em 2026 para barbearias. Com o BestBarbers,
              você configura uma vez os dados fiscais e o sistema emite a nota
              automaticamente após cada atendimento. Exportação em PDF e XML para
              o contador. Sem trabalho manual, sem risco de multa, sem
              esquecimento.
            </p>
            <Link
              href="/nota-fiscal-barbearia"
              className="inline-block mt-4 text-[#ffaf02] hover:underline text-sm font-semibold"
            >
              Saiba mais sobre Nota Fiscal Automática &#8594;
            </Link>
          </div>

          {/* Gestão Financeira */}
          <div className="mb-12 bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">
              <Link
                href="/gestao-financeira-barbearia"
                className="hover:text-[#ffaf02] transition-colors"
              >
                Gestão Financeira
              </Link>
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-3xl">
              Fluxo de caixa em tempo real, relatórios gerenciais automáticos
              (diários, semanais, mensais) e conciliação de todos os meios de
              pagamento — dinheiro, cartão, Pix e recorrente. Saiba exatamente
              quanto sua barbearia ganha e gasta, sem planilha e sem surpresa no
              final do mês.
            </p>
            <Link
              href="/gestao-financeira-barbearia"
              className="inline-block mt-4 text-[#ffaf02] hover:underline text-sm font-semibold"
            >
              Saiba mais sobre Gestão Financeira &#8594;
            </Link>
          </div>

          {/* Gestão de Comissões */}
          <div className="mb-12 bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">
              <Link
                href="/gestao-comissoes-barbeiro"
                className="hover:text-[#ffaf02] transition-colors"
              >
                Gestão de Comissões
              </Link>
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-3xl">
              Configure percentual ou valor fixo por serviço e por profissional.
              O sistema calcula a comissão automaticamente — inclusive quando um
              assinante corta com barbeiros diferentes no mesmo mês. Relatórios
              detalhados por barbeiro eliminam conflitos e trazem transparência
              para a equipe.
            </p>
            <Link
              href="/gestao-comissoes-barbeiro"
              className="inline-block mt-4 text-[#ffaf02] hover:underline text-sm font-semibold"
            >
              Saiba mais sobre Gestão de Comissões &#8594;
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
              Equipamento físico para check-in, comanda digital, pagamento e
              reagendamento. O cliente faz tudo sozinho — sem fila no caixa, sem
              interromper o barbeiro. Aumenta o ticket médio com produtos na tela
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

          {/* Notificações Push */}
          <div className="mb-12 bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">
              Notificações Push
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-3xl">
              Envie lembretes automáticos de agendamento, avisos de promoção,
              mensagens de aniversário e alertas de vencimento de assinatura
              direto no celular do cliente. Notificações push têm taxa de
              abertura 5x maior que email e não dependem de WhatsApp. Você
              configura uma vez e o sistema dispara sozinho.
            </p>
          </div>

          {/* Multi-unidades */}
          <div className="mb-12 bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">
              Multi-unidades
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-3xl">
              Gerencie 2, 5 ou 20 unidades a partir de um único painel. Cada
              unidade tem sua própria agenda, seus barbeiros e seus relatórios —
              mas você tem visão consolidada de tudo. Ideal para redes e
              franquias que precisam de controle centralizado sem perder a
              autonomia de cada loja.
            </p>
          </div>

          {/* Relatórios Gerenciais */}
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-3">
              Relatórios Gerenciais
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-3xl">
              Dashboards em tempo real com faturamento, ocupação, ticket médio,
              taxa de retorno, assinantes ativos e inadimplentes. Relatórios
              automáticos diários, semanais e mensais que você recebe sem
              precisar pedir. Dados que transformam decisões de &ldquo;eu
              acho&rdquo; em &ldquo;os números mostram&rdquo;.
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
            Não são números inventados. São resultados reais de barbearias que
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
                  Barbearia de 4 cadeiras que saiu de R$15K/mês para mais de
                  R$31K/mês com clube de assinaturas e app próprio.
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
                  Rede que usa multi-unidades, clube de assinaturas e app próprio
                  para gerenciar todas as lojas de um único painel.
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
                  <p className="text-sm text-gray-600">única unidade</p>
                </div>
                <p className="text-xs text-gray-400 pt-2 border-t border-gray-200">
                  Mais de 700 assinantes em uma única barbearia. Prova de que
                  clube funciona em qualquer tamanho de operação.
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
            Dois planos pensados para estágios diferentes do seu negócio. Comece
            pelo básico e evolua quando estiver pronto.
          </p>
          <div className="mt-10 grid md:grid-cols-2 gap-8">
            {/* Plano Básico */}
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">
                Plano Básico
              </h3>
              <p className="text-[#ffaf02] font-bold text-lg mb-6">
                Grátis para começar
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Ideal para barbearias que estão começando a se organizar. Inclui
                gestão de agenda e controle financeiro básico.
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
                    Controle financeiro básico
                  </Link>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ffaf02] mt-1">&#10003;</span>
                  <Link
                    href="/gestao-comissoes-barbeiro"
                    className="hover:text-[#ffaf02] transition-colors"
                  >
                    Gestão de comissões
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
                A partir de R$299/mês
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Para barbearias que querem crescer de verdade. Tudo do básico
                mais app próprio, clube de assinaturas e funcionalidades
                avançadas.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-[#ffaf02] mt-1">&#10003;</span>
                  Tudo do Plano Básico
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ffaf02] mt-1">&#10003;</span>
                  <Link
                    href="/app-proprio-barbearia"
                    className="hover:text-[#ffaf02] transition-colors"
                  >
                    App próprio na App Store e Google Play
                  </Link>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ffaf02] mt-1">&#10003;</span>
                  <Link
                    href="/clube-de-assinaturas"
                    className="hover:text-[#ffaf02] transition-colors"
                  >
                    Clube de assinaturas com cobrança automática
                  </Link>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ffaf02] mt-1">&#10003;</span>
                  <Link
                    href="/nota-fiscal-barbearia"
                    className="hover:text-[#ffaf02] transition-colors"
                  >
                    Nota fiscal automática (NFS-e)
                  </Link>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ffaf02] mt-1">&#10003;</span>
                  Notificações push personalizadas
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
                  Relatórios gerenciais avançados
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
                O BestBarbers funciona só para barbearia ou também para salão?
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
                à{" "}
                <Link
                  href="/gestao-comissoes-barbeiro"
                  className="text-[#ffaf02] hover:underline"
                >
                  gestão de comissões
                </Link>{" "}
                — foram pensadas para a realidade de quem tem barbearia, não salão
                de beleza.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-[#121212]">
                Quanto tempo leva para começar a usar?
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                O plano básico você começa a usar no mesmo dia. O plano App
                Exclusivo, com{" "}
                <Link
                  href="/app-proprio-barbearia"
                  className="text-[#ffaf02] hover:underline"
                >
                  app próprio
                </Link>{" "}
                publicado nas lojas, leva em média 15 dias para ficar pronto. A
                equipe de onboarding acompanha você em cada etapa.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-[#121212]">
                Preciso trocar de maquininha de cartão?
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Não. O BestBarbers funciona com qualquer maquininha. O controle
                financeiro registra o pagamento independente da bandeira ou
                operadora que você usa.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-[#121212]">
                E se eu tiver mais de uma unidade?
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Perfeito. O BestBarbers suporta multi-unidades com visão
                consolidada. Você gerencia todas as barbearias de um único
                painel, com relatórios individuais e consolidados. Temos clientes
                gerenciando 6 unidades assim.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-[#121212]">
                Quanto custa o sistema?
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                O plano básico é gratuito para começar. O plano App Exclusivo,
                com{" "}
                <Link
                  href="/app-proprio-barbearia"
                  className="text-[#ffaf02] hover:underline"
                >
                  app próprio
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
                e todas as funcionalidades avançadas, começa a partir de
                R$299/mês. Fale com nossa equipe para um orçamento personalizado.
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
            Mais de 1.200 barbearias já confiam no BestBarbers. Fale com nossa
            equipe e descubra como o sistema pode transformar o seu negócio.
          </p>
          <div className="mt-10">
            <FeatureCTA
              originDesc="[Site]BT-Sistema"
              className="inline-flex items-center gap-2 bg-[#ffaf02] text-[#121212] px-10 py-5 rounded-full text-base font-bold transition-all duration-300 hover:bg-[#e69f00] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] shadow-[0_2px_10px_rgba(255,175,2,0.3)]"
            >
              QUERO UM APP PRÓPRIO PARA MINHA BARBEARIA
            </FeatureCTA>
          </div>
          <p className="mt-4 text-gray-500 text-sm">
            Sem compromisso. Fale com um especialista e tire todas as suas
            dúvidas.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
