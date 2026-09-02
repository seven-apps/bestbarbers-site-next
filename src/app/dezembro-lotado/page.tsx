import { EventoForm } from "./_components/EventoForm";

/**
 * /dezembro-lotado — LP da condição de evento (Projeto Dezembro Lotado, 06/09, BH).
 * Promessa ÚNICA: entrar na lista das 25 vagas de gratuidade no desenvolvimento do
 * app personalizado — a gratuidade se confirma FECHANDO durante o evento (a página
 * diz isso 3×: hero, passos e card do form; promessa e entrega precisam casar).
 * Lead cai no Ploomes com origem dedicada "Evento - Dezembro Lotado" (120004072),
 * form canônico com lead score (mesmos campos/values do V12).
 */
export default function DezembroLotado() {
  return (
    <main className="min-h-screen" style={{ background: "#0c0c0c" }}>
      <div className="container-custom py-10 md:py-16">
        {/* Eyebrow do evento */}
        <p
          className="text-center text-xs md:text-sm font-bold uppercase mb-8"
          style={{ color: "#ffaf02", letterSpacing: "3px", fontFamily: "var(--font-montserrat)" }}
        >
          Projeto Dezembro Lotado · 06/09 · Belo Horizonte
        </p>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 lg:gap-16">
          {/* Coluna do texto */}
          <div className="w-full max-w-xl text-center lg:text-left">
            <h1
              className="leading-tight mb-5"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "clamp(28px, 4.5vw, 44px)",
                color: "#ffffff",
              }}
            >
              <span style={{ color: "#ffaf02" }}>25 vagas de gratuidade</span> no
              desenvolvimento do app personalizado da sua barbearia
            </h1>
            <p
              className="text-base md:text-lg mb-8"
              style={{ color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-montserrat)" }}
            >
              Condição exclusiva para quem está no evento — válida para quem fechar
              durante o Dezembro Lotado. Entre na lista e o time da BestBarbers
              confirma com você no WhatsApp.
            </p>

            {/* O que é o app */}
            <ul className="space-y-4 mb-10 text-left inline-block">
              {[
                "Seu app com a SUA marca, publicado na App Store e na Google Play",
                "Seus clientes agendam e assinam o seu clube direto pelo app",
                "O desenvolvimento fica por nossa conta — essa é a condição do evento",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-extrabold"
                    style={{ background: "#ffaf02", color: "#121212" }}
                  >
                    ✓
                  </span>
                  <span
                    className="text-[15px] md:text-base"
                    style={{ color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-montserrat)" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* Como funciona */}
            <div
              className="rounded-2xl p-5 md:p-6 text-left"
              style={{ background: "#161616", border: "1px solid rgba(255,175,2,0.25)" }}
            >
              <p
                className="text-xs font-bold uppercase mb-4"
                style={{ color: "#ffaf02", letterSpacing: "2px", fontFamily: "var(--font-montserrat)" }}
              >
                Como funciona
              </p>
              <ol className="space-y-3">
                {[
                  "Preencha o formulário e entre na lista das 25 vagas",
                  "Nosso time confirma a sua vaga pelo WhatsApp",
                  "No evento, passe no estande da BestBarbers e feche com a condição garantida",
                ].map((passo, i) => (
                  <li key={passo} className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-extrabold"
                      style={{ background: "rgba(255,175,2,0.15)", color: "#ffaf02" }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="text-sm md:text-[15px]"
                      style={{ color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-montserrat)" }}
                    >
                      {passo}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Coluna do form */}
          <div className="w-full max-w-md lg:sticky lg:top-10">
            <EventoForm />
          </div>
        </div>

        <p
          className="text-center text-xs mt-12"
          style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-montserrat)" }}
        >
          BestBarbers — a plataforma de mais de 1.300 barbearias · Vagas por ordem de
          chegada, limitadas a 25, válidas para fechamento durante o evento de 06/09.
        </p>
      </div>
    </main>
  );
}
