"use client";

import { CTAButton } from "@/components/ui/cta-button";
import { Sparkles, BadgeCheck } from "lucide-react";
import { useUtmParams } from "@/hooks";
import { useMemo, useState, useEffect } from "react";

interface HeroV5Props {
  onCtaClick?: () => void;
}

/** Dynamic headline based on the ad angle (utm_content) */
function getHeroContent(utmContent: string | null) {
  const content = utmContent?.toLowerCase() || "";

  if (content.includes("story") || content.includes("caso") || content.includes("a1")) {
    return {
      headline: "De R$15K para R$31K.",
      highlight: "Mesmas 4 cadeiras.",
      sub: "Caso real. Clube de assinaturas com BestBarbers.",
    };
  }
  if (content.includes("agenda") || content.includes("whatsapp") || content.includes("a2")) {
    return {
      headline: "6 milhoes de agendamentos por mes.",
      highlight: "Sem WhatsApp.",
      sub: "1.200 barbearias pararam de perder cliente na mensagem.",
    };
  }
  if (content.includes("loss") || content.includes("prejuizo") || content.includes("a3")) {
    return {
      headline: "Descubra se sua barbearia esta lucrando",
      highlight: "ou pagando pra trabalhar.",
      sub: "Diagnostico gratuito em minutos. Sem compromisso.",
    };
  }
  if (content.includes("ferias") || content.includes("prisao") || content.includes("a4")) {
    return {
      headline: "1.200 donos pararam de ser prisioneiros",
      highlight: "da propria barbearia.",
      sub: "Sua barbearia roda sem voce na cadeira?",
    };
  }
  if (content.includes("roi") || content.includes("conta") || content.includes("a5") || content.includes("3clientes")) {
    return {
      headline: "3 assinantes pagam o sistema.",
      highlight: "Os outros 350? Lucro.",
      sub: "Sem taxa de implantacao. Sem fidelidade. Caso real.",
    };
  }
  if (content.includes("clube") || content.includes("assinatura") || content.includes("a6") || content.includes("receita")) {
    return {
      headline: "Clube de Assinaturas nao e desconto.",
      highlight: "E 2.8x mais receita.",
      sub: "Assinante paga R$128/mes. Avulso paga R$45. 353 assinantes = R$31.690/mes. Caso real.",
    };
  }

  // Wave 3 — Influencer-specific headlines (utm_content contains influencer name)
  if (content.includes("mileno")) {
    return {
      headline: "De 1 para 3 unidades. R$101K por mes.",
      highlight: "521 assinantes.",
      sub: "Mileno Rocha escalou com BestBarbers. Veja se voce pode fazer o mesmo.",
    };
  }
  if (content.includes("joao") || content.includes("seletto")) {
    return {
      headline: "R$1.222.716 faturados. 32 meses.",
      highlight: "475 assinantes.",
      sub: "Joao Seletto construiu receita previsivel com BestBarbers. Caso real.",
    };
  }
  if (content.includes("kaique") || content.includes("bagulho")) {
    return {
      headline: "469 assinantes. Uma barbearia.",
      highlight: "Top 5 da rede.",
      sub: "57% do faturamento vem de assinaturas. Kaique provou o modelo.",
    };
  }
  if (content.includes("thais")) {
    return {
      headline: "Uma cadeira. Sozinha. R$12K por mes.",
      highlight: "Sem WhatsApp.",
      sub: "Thais provou: tamanho nao importa. O que importa e gestao.",
    };
  }
  if (content.includes("expansao")) {
    return {
      headline: "3 influenciadores. 3 expansoes.",
      highlight: "R$2.8M faturados.",
      sub: "Mileno, Joao e Kaique escalaram com BestBarbers. Sua vez.",
    };
  }

  // Default — formula B-2 (unico criativo com vendas reais: 2 won, QS 23)
  return {
    headline: "De R$15.892 para R$31.690.",
    highlight: "Mesmas 4 cadeiras.",
    sub: "353 assinantes pagando todo mes. Sem taxa. Resultado real com BestBarbers.",
  };
}

export function HeroV5({ onCtaClick }: HeroV5Props) {
  const { getUtmParams } = useUtmParams();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Read UTM only after mount to avoid SSR/client mismatch (hydration error)
  const utmContent = useMemo(() => mounted ? getUtmParams().utm_content : null, [mounted, getUtmParams]);
  const hero = useMemo(() => getHeroContent(utmContent), [utmContent]);

  return (
    <section
      className="relative pt-24 md:pt-28 lg:pt-32 pb-14 md:pb-20 lg:pb-24 flex justify-center items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #ffaf02 0%, #ffbe33 50%, #ffaf02 100%)"
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-5 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/90 rounded-full text-white text-xs md:text-sm font-bold shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#ffaf02]" />
              1.200+ barbearias · 51K assinantes · R$5M+/mes
            </span>
          </div>

          {/* Dynamic Headline */}
          <h1
            className="text-[24px] md:text-[36px] lg:text-[44px] font-extrabold leading-[1.15] text-neutral-bg2 mb-4 animate-fade-in-up"
            style={{ animationDelay: '0.15s' }}
          >
            {hero.headline}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-black/90 to-black/70">
              {hero.highlight}
            </span>
          </h1>

          {/* Dynamic Sub */}
          <p
            className="text-[15px] md:text-[17px] lg:text-[19px] font-bold leading-relaxed text-neutral-bg2/90 max-w-2xl mb-6 animate-fade-in-up"
            style={{ animationDelay: '0.25s' }}
          >
            {hero.sub}
          </p>

          {/* Value Props */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
            <span className="text-white bg-black/80 px-3 py-1.5 rounded-lg font-bold text-sm">Sem taxa de implantacao</span>
            <span className="text-white bg-black/80 px-3 py-1.5 rounded-lg font-bold text-sm">A partir de R$299/mes</span>
            <span className="text-white bg-black/80 px-3 py-1.5 rounded-lg font-bold text-sm">Nota 5.0</span>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
            <div className="rounded-full animate-pulse-glow">
              <CTAButton
                onClick={onCtaClick}
                variant="secondary"
                size="lg"
                icon={true}
                className="w-full sm:w-auto !shadow-[0_8px_40px_rgba(2,171,21,0.5)] hover:!shadow-[0_12px_50px_rgba(2,171,21,0.6)]"
              >
                DESCOBRIR MEU POTENCIAL DE LUCRO
              </CTAButton>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-2 text-neutral-bg2/80 animate-fade-in" style={{ animationDelay: '0.55s' }}>
              <BadgeCheck className="w-4 h-4" />
              <span className="text-xs md:text-sm font-semibold">Sem taxa de implantacao — 3 assinantes ja pagam o sistema</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
