import Image from "next/image";

const benefits = [
  {
    title: "Clube de assinaturas",
    highlight: "Receita recorrente, todos os meses",
    subtitle: "Transforme clientes em assinantes e traga previsibilidade para o caixa da sua barbearia.",
    description: "Menos sazonalidade e mais estabilidade financeira",
    src: "/images/gerenciamento-de-assinaturas_1.webp",
    imageMaxWidth: "400px",
  },
  {
    title: "App próprio personalizado",
    highlight: "Ofereça uma experiência única para seus clientes",
    subtitle: "Faça o cliente voltar sem depender de promoções e ofertas.",
    description: "Um app da sua barbearia não é status. É retenção, relacionamento e mais faturamento com quem você já atende.",
    src: "/images/Passo-a-passo-mockup-hoonigans_1.webp",
    imageMaxWidth: "350px",
  },
  {
    title: "Totem de autoatendimento",
    highlight: "Inovação que impressiona, fideliza e reduz custos",
    subtitle: "O totem agiliza check-in e pagamento, organiza fluxo e profissionaliza a experiência.",
    description: "Menos tempo resolvendo rotina, mais tempo atendendo. Menos gargalo, mais eficiência.",
    src: "/images/totem.png",
    imageMaxWidth: "300px",
  },
  {
    title: "Notas fiscais + Relatórios",
    highlight: "Gestão financeira eficiente e livre de burocracias",
    subtitle: "Se você não enxerga o financeiro com clareza, você não controla a operação e não consegue aumentar seu lucro.",
    description: "Gerencie como uma empresa grande, emitindo notas fiscais de forma automática e acessando relatórios para tomar decisões estratégicas.",
    src: "/images/Nota-fiscal_1.webp",
    imageMaxWidth: "450px",
  },
];

export function BarbershopGrowthSection() {
  return (
    <section
      className="py-16 md:py-20 lg:py-24 overflow-x-hidden"
      style={{ backgroundColor: "#ffaf02" }}
    >
      <div className="container-custom">
        {/* Título da seção */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-extrabold text-neutral-bg2 mb-4">
            Tudo o que você precisa para{" "}
            <span className="text-white">lucrar mais</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-bg2 font-medium max-w-2xl mx-auto">
            Ferramentas completas para transformar sua barbearia em um negócio lucrativo
          </p>
        </div>

        {/* Layout flexível de benefícios */}
        <div className="flex flex-col gap-6 lg:gap-8">
          {/* Linha 1 - 2 cards */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {benefits.slice(0, 2).map((benefit, index) => (
              <div
                key={index}
                className="flex-1 bg-white rounded-2xl p-6 md:p-8 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.6)] hover:shadow-[0_35px_100px_-15px_rgba(0,0,0,0.7)] transition-shadow duration-300"
              >
                <div className="flex flex-col">
                  <div className="space-y-3 mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold leading-tight text-black">
                      {benefit.title}
                    </h3>
                    <span
                      className="block text-xl md:text-2xl font-bold"
                      style={{ color: "#ffaf02" }}
                    >
                      {benefit.highlight}
                    </span>
                    <p className="text-black font-semibold text-base md:text-lg">
                      {benefit.subtitle}
                    </p>
                    <p className="text-gray-600 font-normal text-sm md:text-base">
                      {benefit.description}
                    </p>
                  </div>
                  <div className="w-full flex justify-center">
                    <Image
                      src={benefit.src}
                      alt={benefit.title}
                      width={500}
                      height={400}
                      className="w-full h-auto rounded-lg"
                      style={{ maxWidth: benefit.imageMaxWidth }}
                      sizes="(max-width: 768px) 90vw, 400px"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Linha 2 - 2 cards */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {benefits.slice(2, 4).map((benefit, index) => (
              <div
                key={index}
                className="flex-1 bg-white rounded-2xl p-6 md:p-8 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.6)] hover:shadow-[0_35px_100px_-15px_rgba(0,0,0,0.7)] transition-shadow duration-300"
              >
                <div className="flex flex-col">
                  <div className="space-y-3 mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold leading-tight text-black">
                      {benefit.title}
                    </h3>
                    <span
                      className="block text-xl md:text-2xl font-bold"
                      style={{ color: "#ffaf02" }}
                    >
                      {benefit.highlight}
                    </span>
                    <p className="text-black font-semibold text-base md:text-lg">
                      {benefit.subtitle}
                    </p>
                    <p className="text-gray-600 font-normal text-sm md:text-base">
                      {benefit.description}
                    </p>
                  </div>
                  <div className="w-full flex justify-center">
                    <Image
                      src={benefit.src}
                      alt={benefit.title}
                      width={500}
                      height={400}
                      className="w-full h-auto rounded-lg"
                      style={{ maxWidth: benefit.imageMaxWidth }}
                      sizes="(max-width: 768px) 90vw, 400px"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
