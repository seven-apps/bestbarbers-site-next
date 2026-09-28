"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { CLUBE_FORK } from "@/lib/tracking/porta";
import { clubeV2Content } from "@/content/clube-v2";
import { FAQClube } from "@/components/clube/FAQClube";
import { FooterClube } from "@/components/clube/FooterClube";
import { LeadFormModal } from "@/components/sections/LeadFormModal";
import { NavbarV2 } from "@/components/clube-v2/NavbarV2";
import { PassosV2 } from "@/components/clube-v2/PassosV2";
import { HeroV2 } from "@/components/clube-v2/HeroV2";
import { ProvaV2 } from "@/components/clube-v2/ProvaV2";
import { MigracaoV2 } from "@/components/clube-v2/MigracaoV2";
import { SecaoTextoImagem } from "@/components/clube-v2/SecaoTextoImagem";

/** Marcos de funil observados pelo ScrollDepth (mesma intenção da /clube). */
const SCROLL_SECTIONS = [
  "prova-section",
  "tudo-section",
  "precificacao-section",
  "migracao-section",
  "passos-section",
  "faq-section",
] as const;

const ORIGEM = "[Site-Clube-V2]";
const BT_MIGRACAO = `${ORIGEM}BT-Migracao`;

/**
 * Página /clube-v2 — a v2 da copy do clube (28/Set/26), em rota própria para NÃO tocar na
 * `/clube`, que é o braço `longa` do ciclo 1. Ordem decidida com o André:
 * herói → prova → tudo em um só lugar → precificação → migração → planos com limite →
 * nota fiscal → notificações → passo a passo → perguntas frequentes.
 *
 * Reaproveitados SEM alteração: FAQClube,
 * FooterClube e o LeadFormModal. O card no Ploomes sai com `bb_lp_version = clube-v2`
 * (1º segmento do pathname) e o originDesc no padrão [Site-Clube-V2]BT-<Secao>.
 */
export function ClubeV2Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDesc, setModalDesc] = useState<string>("");
  const { trackCustomEvent, trackNonCatalogEvent } = useMetaPixel();
  const trackedSections = useRef<Set<string>>(new Set());

  // Fork criar × migrar como evento do pixel, igual à /clube. O `forkDoClube` de
  // `lib/tracking/porta.ts` compara com o originDesc da /clube; aqui a regra é local para
  // não mexer em código que a página do ciclo 1 usa.
  const openModal = useCallback(
    (desc: string) => {
      const lado = desc === BT_MIGRACAO ? CLUBE_FORK.migrar : CLUBE_FORK.criar;
      void trackNonCatalogEvent(lado.evento, { porta: lado.porta, secao: desc, pagina: "/clube-v2" });
      setModalDesc(desc);
      setModalOpen(true);
    },
    [trackNonCatalogEvent],
  );

  const closeModal = useCallback(() => setModalOpen(false), []);

  useEffect(() => {
    trackCustomEvent("ViewContent", {
      content_name: "LP Clube V2 - Clube de Assinaturas",
      content_category: "landing_page",
    });
  }, [trackCustomEvent]);

  const trackSection = useCallback(
    (sectionId: string) => {
      if (trackedSections.current.has(sectionId)) return;
      trackedSections.current.add(sectionId);
      void trackNonCatalogEvent("ScrollDepth", { section: sectionId, page: "clube-v2" });
    },
    [trackNonCatalogEvent],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    // threshold 0: a fração é do ELEMENTO, não da tela — seção alta nunca alcança 0,3.
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && trackSection(e.target.id)),
      { threshold: 0 },
    );
    SCROLL_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [trackSection]);

  const c = clubeV2Content;

  return (
    <main className="min-h-screen">
      <NavbarV2 onCtaClick={() => openModal(`${ORIGEM}BT-Header`)} />
      <HeroV2 onCtaClick={() => openModal(`${ORIGEM}BT-Hero`)} />

      <div id="prova-section">
        <ProvaV2 />
      </div>

      <div id="tudo-section">
        <SecaoTextoImagem
          titulo={c.tudoEmUmLugar.titulo}
          itens={c.tudoEmUmLugar.itens}
          cta={c.tudoEmUmLugar.cta}
          onCtaClick={() => openModal(`${ORIGEM}BT-Tudo`)}
          imagem={c.tudoEmUmLugar.image}
          imagemNa="direita"
          fundo="cinza"
          moldura="solta"
        />
      </div>

      <div id="precificacao-section">
        <SecaoTextoImagem
          titulo={c.precificacao.titulo}
          itens={c.precificacao.itens}
          cta={c.precificacao.cta}
          onCtaClick={() => openModal(`${ORIGEM}BT-Precificacao`)}
          imagem={c.precificacao.image}
          imagemNa="esquerda"
        />
      </div>

      <div id="migracao-section">
        <MigracaoV2 onCtaClick={() => openModal(BT_MIGRACAO)} />
      </div>

      <SecaoTextoImagem
        titulo={c.planosComLimite.titulo}
        itens={c.planosComLimite.itens}
        cta={c.planosComLimite.cta}
        onCtaClick={() => openModal(`${ORIGEM}BT-Planos`)}
        imagem={c.planosComLimite.image}
        imagemNa="direita"
        fundo="cinza"
        moldura="notebook"
        legenda={c.planosComLimite.legenda}
      />

      <SecaoTextoImagem
        titulo={c.notaFiscal.titulo}
        itens={c.notaFiscal.itens}
        cta={c.notaFiscal.cta}
        onCtaClick={() => openModal(`${ORIGEM}BT-Nota-fiscal`)}
        imagem={c.notaFiscal.image}
        imagemNa="esquerda"
        moldura="sombra"
      />

      <SecaoTextoImagem
        titulo={c.notificacoes.titulo}
        itens={c.notificacoes.itens}
        cta={c.notificacoes.cta}
        onCtaClick={() => openModal(`${ORIGEM}BT-Notificacoes`)}
        imagem={c.notificacoes.image}
        imagemNa="direita"
        moldura="solta"
      />

      <div id="passos-section">
        <PassosV2 onCtaClick={() => openModal(`${ORIGEM}BT-Passos`)} />
      </div>

      <div id="faq-section">
        <FAQClube />
      </div>
      <FooterClube />

      <LeadFormModal isOpen={modalOpen} onClose={closeModal} originDesc={modalDesc} />
    </main>
  );
}
