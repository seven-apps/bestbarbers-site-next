'use client';

import Image from 'next/image';
import { useLeadForm } from '@/hooks';

export default function LandingPageAnuncio() {
  // Hook principal que gerencia todo o formulário
  const {
    formData,
    isSubmitting,
    submitError,
    handleInputChange,
    handleSubmit
  } = useLeadForm({
    onError: (error) => {
      console.error('Erro ao enviar formulário:', error);
      alert('Erro ao enviar formulário. Tente novamente.');
    }
  });

  const scrollToForm = () => {
    document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* Section 1 - Hero */}
      <section className="bg-[#ebad04] px-6 pt-8 pb-0 md:px-12 lg:px-24 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Logo */}
          <div className="mb-5 lg:mb-10">
            <Image 
              src="/images/bestbarbers-logo-black.png" 
              alt="BestBarbers" 
              width={140} 
              height={32}
              className="h-6 w-auto lg:h-8"
            />
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div>
              {/* Título Principal */}
              <h1 className="font-extrabold text-[32px] leading-[40px] tracking-[-0.96px] text-[#111111] mb-5 md:text-[40px] md:leading-[48px] lg:text-[48px] lg:leading-[56px] lg:tracking-[-1.44px]">
                Garanta{' '}
                <span className="text-white">receita recorrente</span>{' '}
                com assinaturas e um{' '}
                <span className="text-white">app personalizado</span>{' '}
                da sua barbearia
              </h1>

              {/* Descrição */}
              <p className="font-medium text-[16px] leading-[24px] tracking-[-0.16px] text-[#111111] mb-5 md:text-[18px] md:leading-[28px] lg:text-[20px] lg:leading-[32px]">
                Com o BestBarbers você cria o seu clube de assinaturas e tem um aplicativo personalizado 
                com o nome da sua marca, sua logo e toda a sua identidade visual, sem gastar uma fortuna.
              </p>

              {/* CTA Button */}
              <button 
                onClick={scrollToForm}
                className="w-full md:w-auto bg-[#111111] text-[#ebad04] font-extrabold text-[16px] leading-[24px] tracking-[-0.48px] px-2 py-4 rounded-[54px] hover:bg-[#222] transition-colors lg:text-[18px] lg:px-10 lg:py-5"
              >
                QUERO MEU APP PERSONALIZADO
              </button>
            </div>

            {/* Imagem do Mockup */}
            <div className="mt-5 lg:mt-0">
              <Image 
                src="/images/rapha_1.webp"
                alt="App personalizado para barbearias"
                width={1712}
                height={450}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - Problemas */}
      <section className="bg-[#181b20] px-6 py-8 md:px-12 md:py-12 lg:px-24 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-extrabold text-[32px] leading-[40px] tracking-[-0.96px] text-white mb-5 md:text-[40px] md:leading-[48px] lg:text-[48px] lg:leading-[56px] lg:tracking-[-1.44px] lg:mb-10">
            O que está te travando hoje?
          </h2>

          <div className="space-y-5 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
            {/* Problema 1 */}
            <div>
              <h3 className="font-extrabold text-[18px] leading-[24px] tracking-[-0.54px] text-white mb-1 md:text-[20px] md:leading-[28px] lg:text-[22px] lg:leading-[32px]">
                🚨 Gestão manual em planilhas
              </h3>
              <p className="font-medium text-[16px] leading-[24px] tracking-[-0.16px] text-white md:text-[18px] md:leading-[28px]">
                Perda de tempo, erros, falta de clareza
              </p>
            </div>

            {/* Problema 2 */}
            <div>
              <h3 className="font-extrabold text-[18px] leading-[24px] tracking-[-0.54px] text-white mb-1 md:text-[20px] md:leading-[28px] lg:text-[22px] lg:leading-[32px]">
                🚨 Receita irregular
              </h3>
              <p className="font-medium text-[16px] leading-[24px] tracking-[-0.16px] text-white md:text-[18px] md:leading-[28px]">
                Meses fracos derrubam seu caixa
              </p>
            </div>

            {/* Problema 3 */}
            <div>
              <h3 className="font-extrabold text-[18px] leading-[24px] tracking-[-0.54px] text-white mb-1 md:text-[20px] md:leading-[28px] lg:text-[22px] lg:leading-[32px]">
                🚨 Dificuldade em fidelizar clientes
              </h3>
              <p className="font-medium text-[16px] leading-[24px] tracking-[-0.16px] text-white md:text-[18px] md:leading-[28px]">
                Cada mês começa do zero
              </p>
            </div>
          </div>

          <p className="font-medium text-[16px] leading-[24px] tracking-[-0.16px] text-white mt-5 md:text-[18px] md:leading-[28px] lg:text-[20px] lg:leading-[32px] lg:mt-10 lg:max-w-3xl">
            Enquanto você depende de agenda lotada e planilhas complicadas, tem barbearia faturando 
            todo mês antes mesmo de abrir a porta.
          </p>
        </div>
      </section>

      {/* Section 3 - Solução */}
      <section className="bg-[#ebad04] px-6 py-8 md:px-12 md:py-12 lg:px-24 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-extrabold text-[32px] leading-[40px] tracking-[-0.96px] text-[#111111] mb-5 md:text-[40px] md:leading-[48px] lg:text-[48px] lg:leading-[56px] lg:tracking-[-1.44px] lg:mb-10">
            O sistema completo para escalar sua barbearia com{' '}
            <span className="text-white">assinaturas e app próprio</span>
          </h2>

          <div className="space-y-5 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
            {/* Feature 1 */}
            <div>
              <h3 className="font-extrabold text-[18px] leading-[24px] tracking-[-0.54px] text-[#111111] mb-1 md:text-[20px] md:leading-[28px] lg:text-[22px] lg:leading-[32px]">
                📱 App Personalizado
              </h3>
              <p className="font-medium text-[16px] leading-[24px] tracking-[-0.16px] text-[#111111] md:text-[18px] md:leading-[28px]">
                Seu nome, sua marca, na loja de apps. Cliente só enxerga você
              </p>
            </div>

            {/* Feature 2 */}
            <div>
              <h3 className="font-extrabold text-[18px] leading-[24px] tracking-[-0.54px] text-[#111111] mb-1 md:text-[20px] md:leading-[28px] lg:text-[22px] lg:leading-[32px]">
                💳 Clube de Assinaturas
              </h3>
              <p className="font-medium text-[16px] leading-[24px] tracking-[-0.16px] text-[#111111] md:text-[18px] md:leading-[28px]">
                Cobrança automática, upgrade de plano fácil, controle de agendamentos
              </p>
            </div>

            {/* Feature 3 */}
            <div>
              <h3 className="font-extrabold text-[18px] leading-[24px] tracking-[-0.54px] text-[#111111] mb-1 md:text-[20px] md:leading-[28px] lg:text-[22px] lg:leading-[32px]">
                📊 Gestão Inteligente
              </h3>
              <p className="font-medium text-[16px] leading-[24px] tracking-[-0.16px] text-[#111111] md:text-[18px] md:leading-[28px]">
                Dados e relatórios em 1 clique
              </p>
            </div>

            {/* Feature 4 */}
            <div>
              <h3 className="font-extrabold text-[18px] leading-[24px] tracking-[-0.54px] text-[#111111] mb-1 md:text-[20px] md:leading-[28px] lg:text-[22px] lg:leading-[32px]">
                ⏰ Agendamento Prático
              </h3>
              <p className="font-medium text-[16px] leading-[24px] tracking-[-0.16px] text-[#111111] md:text-[18px] md:leading-[28px]">
                Cliente marca em segundos, com notificações automáticas
              </p>
            </div>
          </div>

          <p className="font-medium text-[16px] leading-[24px] tracking-[-0.16px] text-[#111111] mt-5 md:text-[18px] md:leading-[28px] lg:text-[20px] lg:leading-[32px] lg:mt-10 lg:max-w-3xl">
            Com o BestBarbers você une tecnologia de gestão + fidelização de clientes + receita recorrente.
            <br /><br />
            É mais profissional, mais bonito, mais prático — e muito mais lucrativo.
          </p>

          {/* CTA Button */}
          <button 
            onClick={scrollToForm}
            className="w-full md:w-auto bg-[#111111] text-[#ebad04] font-extrabold text-[16px] leading-[24px] tracking-[-0.48px] px-2 py-4 rounded-[54px] hover:bg-[#222] transition-colors mt-5 lg:mt-8 lg:text-[18px] lg:px-10 lg:py-5"
          >
            QUERO MEU APP + ASSINATURA
          </button>
        </div>
      </section>

      {/* Section 4 - Formulário */}
      <section id="form-section" className="bg-[#181b20] px-6 py-8 md:px-12 md:py-12 lg:px-24 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-extrabold text-[32px] leading-[40px] tracking-[-0.96px] text-white mb-5 md:text-[40px] md:leading-[48px] lg:text-[48px] lg:leading-[56px] lg:tracking-[-1.44px]">
            Garanta já sua{' '}
            <span className="text-[#ebad04]">oferta exclusiva</span>{' '}
            para ter o app da sua barbearia
          </h2>

          <p className="font-medium text-[16px] leading-[24px] tracking-[-0.16px] text-white mb-5 md:text-[18px] md:leading-[28px] lg:mb-8">
            Você pode continuar no improviso, ou pode dar o próximo passo e ter seu app, sua marca e sua receita recorrente.
            <br /><br />
            O BestBarbers faz isso rápido, simples e sem custo absurdo.
          </p>

          {/* Exibição de erro */}
          {submitError && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm font-medium">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome da Barbearia */}
            <div className="space-y-1">
              <label className="block font-medium text-[14px] leading-[20px] tracking-[-0.14px] text-white">
                Nome da Barbearia
              </label>
              <input
                type="text"
                name="barbershopName"
                value={formData.barbershopName}
                onChange={handleInputChange}
                placeholder="Digite o nome da sua barbearia"
                required
                className="w-full bg-[#20242a] border-2 border-[#ebad04] rounded-[8px] px-4 py-4 text-white placeholder-[#aeb0b2] font-medium text-[14px] leading-[20px] tracking-[-0.14px] focus:outline-none focus:border-[#ebad04] transition-colors"
              />
            </div>

            {/* Nome do Dono */}
            <div className="space-y-1">
              <label className="block font-medium text-[14px] leading-[20px] tracking-[-0.14px] text-white">
                Nome do Dono da barbearia
              </label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                placeholder="Digite o nome do dono da barbearia"
                required
                className="w-full bg-[#20242a] border-2 border-[#ebad04] rounded-[8px] px-4 py-4 text-white placeholder-[#aeb0b2] font-medium text-[14px] leading-[20px] tracking-[-0.14px] focus:outline-none focus:border-[#ebad04] transition-colors"
              />
            </div>

            {/* WhatsApp */}
            <div className="space-y-1">
              <label className="block font-medium text-[14px] leading-[20px] tracking-[-0.14px] text-white">
                WhatsApp do Dono da barbearia
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                placeholder="Celular - whatsapp do dono da barbearia"
                required
                className="w-full bg-[#20242a] border-2 border-[#ebad04] rounded-[8px] px-4 py-4 text-white placeholder-[#aeb0b2] font-medium text-[14px] leading-[20px] tracking-[-0.14px] focus:outline-none focus:border-[#ebad04] transition-colors"
              />
            </div>

            {/* Faturamento */}
            <div className="space-y-1">
              <label className="block font-medium text-[14px] leading-[20px] tracking-[-0.14px] text-white">
                Faturamento médio mensal (R$)
              </label>
              <input
                type="text"
                name="monthlyRevenue"
                value={formData.monthlyRevenue}
                onChange={handleInputChange}
                placeholder="Quanto sua barbearia fatura por mês"
                required
                className="w-full bg-[#20242a] border-2 border-[#ebad04] rounded-[8px] px-4 py-4 text-white placeholder-[#aeb0b2] font-medium text-[14px] leading-[20px] tracking-[-0.14px] focus:outline-none focus:border-[#ebad04] transition-colors"
              />
            </div>

            {/* Colaboradores */}
            <div className="space-y-1">
              <label className="block font-medium text-[14px] leading-[20px] tracking-[-0.14px] text-white">
                Número de colaboradores
              </label>
              <input
                type="number"
                name="employeeCount"
                value={formData.employeeCount}
                onChange={handleInputChange}
                placeholder="Quantos colaboradores tem na barbearia"
                required
                className="w-full bg-[#20242a] border-2 border-[#ebad04] rounded-[8px] px-4 py-4 text-white placeholder-[#aeb0b2] font-medium text-[14px] leading-[20px] tracking-[-0.14px] focus:outline-none focus:border-[#ebad04] transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#ebad04] text-[#181b20] font-extrabold text-[16px] leading-[24px] tracking-[-0.48px] px-2 py-4 rounded-[54px] hover:bg-[#ebad04] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isSubmitting ? 'ENVIANDO...' : 'GARANTIR MINHA OFERTA'}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#ebad04] px-6 py-8 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-5">
            <Image 
              src="/images/bestbarbers-logo-black.png" 
              alt="BestBarbers" 
              width={140} 
              height={32}
              className="h-6 w-auto lg:h-8"
            />
          </div>
          
          <p className="font-medium text-[16px] leading-[24px] tracking-[-0.16px] text-[#111111]">
            Para saber mais, acesse:
            <br />
            <a 
              href="https://www.bestbarbers.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold hover:underline transition-all duration-200"
            >
              www.bestbarbers.app
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}