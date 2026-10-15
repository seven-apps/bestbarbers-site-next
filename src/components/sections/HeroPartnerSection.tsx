"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { homeContent } from "@/content/home";
import { useMemo } from "react";
import type { StaticImageData } from "next/image";
import { Check } from "lucide-react";
import { CUPOM_VALIDO_ATE_TEXTO, CUPOM_VALOR, doParceiro, type CupomParceiro } from "@/lib/cupom-parceiro";

// Import partner images
import santiagoImg from "@/app/parceiros/assets/santiago.png";
import maurilioImg from "@/app/parceiros/assets/maurilio-sr-bigode.png";
import gabrielImg from "@/app/parceiros/assets/gabriel-gordovisk.png";
import edsonImg from "@/app/parceiros/assets/edson-lapa.png";
import henriqueImg from "@/app/parceiros/assets/henrique.png";
import kaleoImg from "@/app/parceiros/assets/kaleo.png";
import araujoSalvianoImg from "@/app/parceiros/assets/araujo-salviano.png";
import brunoEstevaoImg from "@/app/parceiros/assets/bruno-estevao.png";
import jamesImg from "@/app/parceiros/assets/james.png";
import igorBezerraImg from "@/app/parceiros/assets/igor-bezerra.png";
import kaiqueAlvesImg from "@/app/parceiros/assets/kaique-alves.png";
import thaisDantunesImg from "@/app/parceiros/assets/thais-dantunes.png";
import davidChampsImg from "@/app/parceiros/assets/david-champs.png";
import gladstoneImg from "@/app/parceiros/assets/gladstone.png";
import billyImg from "@/app/parceiros/assets/billy.png";
import gilbertoImg from "@/app/parceiros/assets/gilberto.png";
import gilbertoBarberProImg from "@/app/parceiros/assets/gilberto-barber-pro.png";
import jorginImg from "@/app/parceiros/assets/jorgin.png";
import joaoSelettoImg from "@/app/parceiros/assets/joao-seletto.png";
import ottoniImg from "@/app/parceiros/assets/ottoni.png";
import rafaelGuapoImg from "@/app/parceiros/assets/rafael-guapo.png";
import mauroEleganceImg from "@/app/parceiros/assets/mauro-elegance.png";
import gabrielReisImg from "@/app/parceiros/assets/gabriel-reis.png";
import jeffersonAuxImg from "@/app/parceiros/assets/jefferson-aux.png";
import vittorPallaceImg from "@/app/parceiros/assets/vittor-pallace.png";
import lucasStartImg from "@/app/parceiros/assets/lucas-start.png";
import isaacArtsImg from "@/app/parceiros/assets/isaac-arts.png";


interface HeroPartnerSectionProps {
  onCtaClick?: () => void;
  source?: string | null;
  /** Cupom válido do link (out/26): o topo vira a oferta do cupom; a foto do parceiro continua. */
  cupom?: CupomParceiro | null;
}

/**
 * Ex-parceiros com uso de imagem revogado. A arte deles já saiu do bundle (o
 * `import` foi removido acima), mas o link `?source=<slug>` continua circulando
 * por fora — parceiro compartilha o link, o link não expira. Esta trava existe
 * para que o slug caia SEMPRE no herói genérico, e para que a arte não volte a
 * renderizar se alguém reintroduzir o import no mapa: régua em código, não em
 * prosa. Não remover sem decisão do André sobre o destino desses links.
 */
const SOURCES_BANIDOS = new Set(["rapha", "mileno"]);

/** O que o app próprio faz, em 3 linhas de relance (voz da /clube: o produto, com as palavras do dono). */
const DESTAQUES_DO_APP = [
  "App com o nome e a logo da sua barbearia",
  "Seu cliente agenda e assina pelo app",
  "Um consultor configura tudo com você",
];

export function HeroPartnerSection({
  onCtaClick,
  source,
  cupom,
}: HeroPartnerSectionProps) {
  const { hero } = homeContent;

  // Map source to partner images
  const imageMap: Record<string, StaticImageData> = useMemo(() => ({
    santiago: santiagoImg,
    "maurilio-sr-bigode": maurilioImg,
    "gabriel-gordovisk": gabrielImg,
    "edson-lapa": edsonImg,
    "henrique-daniels": henriqueImg,
    kaleo: kaleoImg,
    "araujo-salviano": araujoSalvianoImg,
    "bruno-estevao": brunoEstevaoImg,
    james: jamesImg,
    "igor-bezerra": igorBezerraImg,
    "kaique-alves": kaiqueAlvesImg,
    "thais-dantunes": thaisDantunesImg,
    "david-champs": davidChampsImg,
    gladstone: gladstoneImg,
    billy: billyImg,
    gilberto: gilbertoImg,
    "gilberto-barber-pro": gilbertoBarberProImg,
    jorgin: jorginImg,
    "joao-seletto": joaoSelettoImg,
    ottoni: ottoniImg,
    "rafael-guapo": rafaelGuapoImg,
    "mauro-elegance": mauroEleganceImg,
    "gabriel-reis": gabrielReisImg,
    "jefferson-aux": jeffersonAuxImg,
    "vittor-pallace": vittorPallaceImg,
    "lucas-start": lucasStartImg,
    "isaac-arts": isaacArtsImg,
  }), []);

  // Slug desconhecido OU banido cai no herói genérico — fallback, nunca erro.
  const isPartnerImage = !!(
    source &&
    !SOURCES_BANIDOS.has(source.trim().toLowerCase()) &&
    imageMap[source]
  );
  const displayImage = isPartnerImage ? imageMap[source!] : hero.image.src;

  return (
    <section
      className={`section-primary ${cupom ? "pt-48 md:pt-56" : "pt-32"} pb-8 md:pb-12 lg:pb-0 flex justify-center items-end relative overflow-hidden`}
      style={{ backgroundColor: "#ffaf02" }}
    >
      <div className="container-custom relative">
        <div className={`flex flex-col lg:flex-row justify-between gap-0 w-full ${isPartnerImage ? 'items-center lg:gap-16' : 'items-end lg:min-h-[420px]'}`}>
          {/* Conteúdo textual */}
          <div id={cupom ? "cupom-hero" : undefined} className={`flex flex-col justify-center items-center lg:items-start space-y-4 lg:space-y-6 text-center lg:text-left relative z-10 ${isPartnerImage ? 'w-full lg:w-1/2 order-first mb-8 lg:mb-0 pb-0' : 'w-full lg:w-[35%] pb-8 md:pb-12 lg:pb-12'}`}>
            {cupom ? (
              <>
                {/* O selo "cupom ativado" saiu daqui em 15/Out: a faixa verde do menu já diz isso o tempo todo. */}
                {/* Pedido do André (15/Out/26): o título nomeia o que a pessoa ganha — o app próprio da barbearia. */}
                <h1 className="text-[34px] md:text-5xl lg:text-5xl font-extrabold leading-[1.1] text-neutral-bg2 max-w-lg lg:max-w-none">
                  <span className="text-white">R${CUPOM_VALOR} de desconto</span> para você ter o app próprio da sua barbearia
                </h1>
                <p className="text-medium font-semibold leading-normal text-neutral-bg2">
                  Com o cupom {doParceiro(cupom)}, você paga R${CUPOM_VALOR} a menos na 1ª mensalidade. Vale até {CUPOM_VALIDO_ATE_TEXTO}.
                </p>
                <ul className="flex flex-col gap-2 text-left">
                  {DESTAQUES_DO_APP.map((d) => (
                    <li key={d} className="flex items-center gap-3 text-[15px] md:text-base font-semibold text-neutral-bg2">
                      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full" style={{ backgroundColor: "#121212" }}>
                        <Check className="h-4 w-4" style={{ color: "#ffaf02" }} strokeWidth={3} />
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="rounded-2xl border-2 border-dashed px-6 py-3 text-center" style={{ borderColor: "#121212" }}>
                  <span className="block text-[11px] font-bold tracking-widest text-neutral-bg2/70">SEU CUPOM</span>
                  <span className="block text-3xl md:text-4xl font-extrabold tracking-wider text-neutral-bg2">{cupom.codigo}</span>
                </div>
                <Button
                  onClick={onCtaClick}
                  className="text-sm font-bold leading-tight px-8 py-5 rounded-2xl whitespace-pre-line text-center"
                  style={{ backgroundColor: "#121212", color: "#ffaf02" }}
                >
                  QUERO MEU APP COM DESCONTO
                </Button>
              </>
            ) : (
            <>
            <h1 className="text-4xl md:text-5xl lg:text-4xl font-extrabold leading-tight text-neutral-bg2 max-w-lg lg:max-w-none">
              {hero.title.main}
              <span className="text-white">{hero.title.highlight}</span>
              <br />
              {hero.title.subtitle}
            </h1>

            <p className="text-medium font-medium leading-normal text-neutral-bg2 ">
              {hero.description}
            </p>

            {onCtaClick ? (
              <Button
                onClick={onCtaClick}
                className="text-sm font-bold leading-tight px-8 py-5 rounded-2xl whitespace-pre-line text-center"
                style={{ backgroundColor: "#121212", color: "#ffaf02" }}
              >
                {hero.cta.text}
              </Button>
            ) : (
              <Button
                asChild
                className="text-sm font-bold leading-tight px-8 py-5 rounded-2xl whitespace-pre-line text-center"
                style={{ backgroundColor: "#121212", color: "#ffaf02" }}
              >
                <Link
                  href={hero.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {hero.cta.text}
                </Link>
              </Button>
            )}
            </>
            )}
          </div>

          {/* Mockup da imagem */}
          {isPartnerImage ? (
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end order-last -mb-8 lg:-mb-12 lg:self-end">
              <div className="relative w-full max-w-[100%] md:max-w-[95%] lg:max-w-full">
                <Image
                  src={displayImage}
                  alt={hero.image.alt}
                  width={hero.image.width}
                  height={hero.image.height}
                  className="w-full h-auto max-h-[65vh] md:max-h-[70vh] lg:max-h-[605px] object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                />
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center lg:justify-end -mb-8 md:-mb-12 lg:absolute lg:bottom-0 lg:-right-35 lg:mb-0">
              <Image
                src={displayImage}
                alt={hero.image.alt}
                width={hero.image.width}
                height={hero.image.height}
                className="w-[550px] md:w-[70%] lg:w-[55vw] max-w-[900px] h-auto"
                style={{ display: "block" }}
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
