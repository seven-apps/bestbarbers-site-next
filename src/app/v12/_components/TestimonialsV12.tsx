"use client";

const masterTestimonial = {
  quote: "Era R$15 mil. Montei o clube. Dobrei em 4 meses. Mesma equipe, mesmo ponto, mesma cidade. A diferença foi ter sistema.",
  name: "Barbearia em Embu das Artes/SP",
  detail: "4 cadeiras · 353 assinantes",
  result: "R$15K → R$31K/mês",
  initials: "BP",
};

const otherTestimonials = [
  {
    quote: "Hoje eu tenho mais de R$34 mil pra receber em assinatura. Todo mês. Sem precisar cobrar cliente manualmente.",
    name: "@omilenorocha",
    detail: "3 unidades · 521 assinantes",
    result: "R$101K/mês",
  },
  {
    quote: "Em 32 meses, R$1.222.716 faturados só com clube. Receita previsível mudou meu jogo.",
    name: "@joaoseletto",
    detail: "475 assinantes ativos",
    result: "R$1,2M acumulado",
  },
  {
    quote: "57% do meu faturamento vem de assinaturas. Cortar cabelo é só 23% do negócio. Sistema é o resto.",
    name: "@o_kaique_alves",
    detail: "469 assinantes ativos",
    result: "Top 5 da rede",
  },
  {
    quote: "Uma cadeira. Sozinha. R$12 mil por mês. Sem WhatsApp travado, sem agenda no papel.",
    name: "@thaisdantbarber",
    detail: "Solo · 1 cadeira",
    result: "R$12.589/mês",
  },
];

export function TestimonialsV12() {
  return (
    <section
      className="py-16 md:py-24 relative overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* Grain sutil */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
        }}
      />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] mb-5 border"
            style={{
              background: "rgba(235,173,4,0.1)",
              color: "#ebad04",
              borderColor: "rgba(235,173,4,0.2)",
              fontFamily: "var(--font-montserrat)",
            }}
          >
            ★ Resultados Reais
          </span>

          <h2
            className="leading-[1.05] max-w-2xl mx-auto"
            style={{
              fontFamily: "var(--font-vollkorn)",
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 48px)",
              color: "#ffffff",
            }}
          >
            A diferença não foi{" "}
            <span style={{ color: "#ebad04" }}>esforço.</span>
          </h2>
          <p
            className="text-sm md:text-base mt-4 max-w-xl mx-auto"
            style={{ color: "#ffffff", fontFamily: "var(--font-montserrat)", opacity: 0.9 }}
          >
            Foi sistema. Foi previsibilidade. Foi a marca certa.
          </p>
        </div>

        {/* Master Quote — editorial gigante */}
        <div
          className="max-w-4xl mx-auto mb-16 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-12 relative overflow-hidden text-center">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#ebad04]/10 blur-[80px] rounded-full pointer-events-none" />

            <div
              className="leading-none mb-6 select-none"
              style={{
                fontFamily: "var(--font-vollkorn)",
                fontWeight: 800,
                fontSize: "clamp(80px, 12vw, 120px)",
                color: "#ebad04",
                lineHeight: 0.8,
                opacity: 0.2,
              }}
            >
              &ldquo;
            </div>

            <p
              className="italic mb-10 leading-[1.4] relative z-10"
              style={{
                fontFamily: "var(--font-vollkorn)",
                fontWeight: 700,
                fontSize: "clamp(20px, 3vw, 32px)",
                color: "#ffffff",
              }}
            >
              &ldquo;{masterTestimonial.quote}&rdquo;
            </p>

            <div className="flex flex-col items-center gap-6 relative z-10">
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2 border-[#ebad04]/30"
                  style={{ background: "#ebad04" }}
                >
                  <span
                    className="font-extrabold text-xl"
                    style={{ color: "#1e1e1e", fontFamily: "var(--font-vollkorn)" }}
                  >
                    {masterTestimonial.initials}
                  </span>
                </div>
                <div>
                  <p
                    className="font-extrabold text-base"
                    style={{ color: "#ffffff", fontFamily: "var(--font-montserrat)" }}
                  >
                    {masterTestimonial.name}
                  </p>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "#ffffff", fontFamily: "var(--font-montserrat)", opacity: 0.8 }}
                  >
                    {masterTestimonial.detail}
                  </p>
                </div>
              </div>

              <div
                className="inline-flex items-center px-6 py-3 rounded-full"
                style={{
                  background: "rgba(235,173,4,0.15)",
                  border: "1px solid rgba(235,173,4,0.4)",
                }}
              >
                <span
                  className="font-black text-base md:text-lg"
                  style={{ color: "#ebad04", fontFamily: "var(--font-montserrat)" }}
                >
                  {masterTestimonial.result}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Outros testimonials — Removido box externo no mobile para fluidez */}
        <div 
          className="max-w-5xl mx-auto p-0 md:p-8 lg:p-10 rounded-none md:rounded-[40px] border-0 md:border border-white/5 bg-transparent md:bg-white/[0.02] relative"
        >
          {/* Decorative glow — Desktop only */}
          <div className="hidden md:block absolute -top-24 -right-24 w-64 h-64 bg-[#ebad04]/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="hidden md:block absolute -bottom-24 -left-24 w-64 h-64 bg-[#ebad04]/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-10">
            {otherTestimonials.map((t, idx) => (
              <div
                key={t.name}
                className="bg-white/[0.03] border border-white/10 rounded-[24px] p-5 md:p-8 animate-fade-in-up flex flex-col justify-between hover:bg-white/[0.07] transition-all duration-300 hover:md:translate-y-[-4px]"
                style={{
                  animationDelay: `${0.1 + idx * 0.08}s`,
                }}
              >
                <div>
                  <p
                    className="italic mb-6 leading-relaxed"
                    style={{
                      fontFamily: "var(--font-vollkorn)",
                      fontWeight: 700,
                      fontSize: "17px",
                      color: "#ffffff",
                    }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-5 border-t border-white/5">
                  <div>
                    <p
                      className="font-extrabold text-sm"
                      style={{ color: "#ebad04", fontFamily: "var(--font-montserrat)" }}
                    >
                      {t.name}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "#ffffff", fontFamily: "var(--font-montserrat)", opacity: 0.7 }}
                    >
                      {t.detail}
                    </p>
                  </div>

                  <span
                    className="flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-tight"
                    style={{
                      background: "rgba(235,173,4,0.15)",
                      color: "#ebad04",
                      border: "1px solid rgba(235,173,4,0.3)",
                      fontFamily: "var(--font-montserrat)",
                    }}
                  >
                    {t.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p
          className="text-sm font-medium mt-16 animate-fade-in text-center"
          style={{ color: "#ffffff", fontFamily: "var(--font-montserrat)", animationDelay: "0.5s" }}
        >
          Cinco barbeiros de referência.{" "}
          <span style={{ color: "#ebad04", fontWeight: 700 }}>Mais de 2.000 assinantes só entre eles.</span>
        </p>
      </div>
    </section>
  );
}
