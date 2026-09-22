"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * V8 Nurture — LP educacional para leads <R$3K/mês de faturamento.
 *
 * Não desperdiça SDR humano com leads sem orçamento atual para nosso plano (R$299+),
 * mas mantém porta aberta com conteúdo que ajuda eles a crescerem — e voltarem
 * quando atingirem R$5K+ (potencial cliente futuro).
 *
 * Source: análise CRM (memória) — 9.7% dos leads perdem por "ICP - Investimento (sem grana)".
 * Esse fluxo recupera lead nurture sem gastar tempo do Igor (único SDR).
 */
export default function V8NutricaoPage() {
  return (
    <main className="min-h-screen bg-[#0C1120] flex flex-col items-center p-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/Logo-BestBarbers-branco_1.webp"
            alt="BestBarbers"
            width={200}
            height={45}
            priority
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
            Vamos crescer juntos
          </h1>
          <p className="text-[#FFAF02] font-semibold text-lg">
            Antes do plano, vem o crescimento
          </p>
        </div>

        <div className="bg-[#0f1015] border border-[#2a2d35] rounded-xl p-6 mb-6">
          <p className="text-white text-base leading-relaxed mb-4">
            Recebemos seu cadastro! 🎯
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Pra que o BestBarbers faça sentido pra ti, o investimento é a partir de
            <strong className="text-[#FFAF02]"> R$299/mês</strong>. Vimos que sua barbearia ainda está crescendo —
            o que é normal, todo dono passou por isso.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Em vez de te mandar uma proposta agora, queremos te ajudar a chegar lá.
            <strong className="text-white"> Te enviaremos por WhatsApp 3 conteúdos sobre como organizar a receita da barbearia</strong>:
          </p>
        </div>

        <ul className="space-y-3 mb-8">
          <li className="bg-[#0f1015] border border-[#2a2d35] rounded-xl p-4 flex gap-3 items-start">
            <span className="text-[#FFAF02] font-bold text-lg shrink-0">1</span>
            <div>
              <p className="text-white font-semibold mb-1">Como montar a primeira grade de preços que fecha a conta</p>
              <p className="text-gray-400 text-xs">
                O que entra no cálculo do corte antes de pensar em vender mais
              </p>
            </div>
          </li>
          <li className="bg-[#0f1015] border border-[#2a2d35] rounded-xl p-4 flex gap-3 items-start">
            <span className="text-[#FFAF02] font-bold text-lg shrink-0">2</span>
            <div>
              <p className="text-white font-semibold mb-1">A matemática da assinatura</p>
              <p className="text-gray-400 text-xs">
                Como calcular o preço do plano de clube a partir do seu próprio ticket
              </p>
            </div>
          </li>
          <li className="bg-[#0f1015] border border-[#2a2d35] rounded-xl p-4 flex gap-3 items-start">
            <span className="text-[#FFAF02] font-bold text-lg shrink-0">3</span>
            <div>
              <p className="text-white font-semibold mb-1">Os 5 erros que travam a barbearia pequena</p>
              <p className="text-gray-400 text-xs">
                Padrões que aparecem nas barbearias da plataforma — e como fugir deles
              </p>
            </div>
          </li>
        </ul>

        <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-4 mb-6 text-center">
          <p className="text-green-400 text-sm font-medium">
            ✓ Vamos te enviar os 3 conteúdos no WhatsApp em alguns minutos.
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Quando seu faturamento atingir R$5K, fale com a gente!
          </p>
        </div>

        {/*
          Apontava para `/v8` até 19/Set/26, e `/v8` é `_page.tsx` — o Next não serve. Quem
          clicava caía no 404 padrão, em inglês. A LP de origem foi despublicada e o link ficou
          para trás; agora leva à página do clube, que existe e é o próximo passo natural de
          quem está lendo isto.
        */}
        <Link
          href="/clube"
          className="block w-full py-3 text-center text-gray-500 text-sm hover:text-gray-300 transition-colors"
        >
          Conhecer o clube de assinaturas
        </Link>
      </div>
    </main>
  );
}
