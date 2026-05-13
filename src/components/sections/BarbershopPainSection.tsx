"use client";

export function BarbershopPainSection() {
  const pain = {
    title: "Trabalhando muito e lucrando pouco?",
    subtitle: "A maioria dos donos de barbearia ficam presos no operacional e não conseguem ver a cor do dinheiro.",
    items: [
      {
        title: "Agenda Desorganizada",
        description: "Clientes faltando sem avisar e horários ociosos que custam caro para o seu negócio."
      },
      {
        title: "Controle Financeiro Manual",
        description: "Anotações em papel ou planilhas complexas que não mostram seu lucro real no fim do mês."
      },
      {
        title: "Problemas com Comissões",
        description: "Dores de cabeça constantes e horas perdidas calculando o repasse dos barbeiros."
      }
    ]
  };

  return (
    <section
      id="pain-section"
      className="py-20 md:py-32 overflow-hidden border-b border-white/5"
      style={{ background: "#0a0a0a" }}
    >
      <div className="container-custom">
        {/* Section Title estilo V12 */}
        <div className="text-center mb-16 md:mb-24 animate-fade-in-up">
          <h2 
            className="leading-[1.1] tracking-tight text-white mb-6"
            style={{ fontFamily: "var(--font-vollkorn)", fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 800 }}
          >
            {pain.title.split("lucrando pouco").map((part, i) => 
              i === 0 ? (
                <span key={i}>
                  {part}
                  <span className="text-[#ebad04]">lucrando pouco?</span>
                </span>
              ) : part
            )}
          </h2>
          <p 
            className="text-base md:text-lg text-white/60 font-medium max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {pain.subtitle}
          </p>
        </div>

        {/* Bento Grid estilo V12 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pain.items.map((item, index) => (
            <div
              key={index}
              className="group relative p-8 md:p-10 bg-white/[0.02] border border-white/10 rounded-[2.5rem] transition-all duration-500 hover:bg-white/[0.05] hover:border-[#ebad04]/30 hover:scale-[1.02] animate-fade-in-up"
              style={{ animationDelay: `${0.1 + index * 0.1}s`, backdropFilter: "blur(10px)" }}
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-1 bg-[#ebad04]/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 h-full flex flex-col">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-[#ebad04]/20 group-hover:border-[#ebad04]/50 transition-colors duration-500"
                  style={{ background: "rgba(235,173,4,0.1)" }}
                >
                  <span className="text-2xl" role="img" aria-label="icon">
                    {index === 0 ? "⚠️" : index === 1 ? "💸" : "📉"}
                  </span>
                </div>
                
                <h3 
                  className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight group-hover:text-[#ebad04] transition-colors duration-500"
                  style={{ fontFamily: "var(--font-vollkorn)" }}
                >
                  {item.title}
                </h3>
                
                <p 
                  className="text-white/50 text-sm md:text-base leading-relaxed"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
