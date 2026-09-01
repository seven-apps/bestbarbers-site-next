"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useMetaPixel } from "@/hooks/useMetaPixel";
import { NavbarClube } from "@/components/clube/NavbarClube";
import { HeroClube } from "@/components/clube/HeroClube";
import { ComparativoClube } from "@/components/clube/ComparativoClube";
import { MigracaoBandaClube } from "@/components/clube/MigracaoBandaClube";
import { AssinaturasClube } from "@/components/clube/AssinaturasClube";
import { NotasFiscaisClube } from "@/components/clube/NotasFiscaisClube";
import { FuncionalidadesClube } from "@/components/clube/FuncionalidadesClube";
import { TotemClube } from "@/components/clube/TotemClube";
import { NotificacoesClube } from "@/components/clube/NotificacoesClube";
import { ClientesClube } from "@/components/clube/ClientesClube";
import { DepoimentosClube } from "@/components/clube/DepoimentosClube";
import { PassosClube } from "@/components/clube/PassosClube";
import { BasicPlanSection } from "@/components/sections/BasicPlanSection";
import { FAQClube } from "@/components/clube/FAQClube";
import { FooterClube } from "@/components/clube/FooterClube";
import { LeadFormModal } from "@/components/sections/LeadFormModal";

/**
 * Seções observadas pelo ScrollDepth — marcos de funil, não a página inteira.
 * Mesma quantidade e mesma intenção da v6/v11/v12: cada uma responde a uma
 * pergunta diferente sobre quem rolou (entendeu a proposta → viu a oferta →
 * viu prova → quis saber como começa → foi tirar objeção).
 * Os `id` existem SÓ para o IntersectionObserver; nenhum link aponta para eles.
 */
const SCROLL_SECTIONS = [
  "comparativo-section",
  "assinaturas-section",
  "depoimentos-section",
  "passos-section",
  "faq-section",
] as const;

/**
 * Página /clube — destino de tráfego pago de clube de assinaturas.
 * Espelha o esqueleto da homepage (HomePage.tsx) trocando a narrativa
 * para clube; componentes clonados em src/components/clube/.
 * Cada seção abre o MESMO LeadFormModal com originDesc próprio
 * no padrão [Site-Clube]BT-<Secao>.
 */
export function ClubePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDesc, setModalDesc] = useState<string>("");
  const { trackCustomEvent, trackNonCatalogEvent } = useMetaPixel();
  const trackedSections = useRef<Set<string>>(new Set());

  const openModal = useCallback((desc: string) => {
    setModalDesc(desc);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  // ViewContent no load — dá visibilidade de topo de funil no Events Manager
  // e é o sinal de engajamento que hoje a /clube não manda (só PageView + Lead).
  // ViewContent é evento PADRÃO do catálogo Meta, então o `track` do
  // trackCustomEvent é o caminho certo aqui.
  useEffect(() => {
    trackCustomEvent("ViewContent", {
      content_name: "LP Clube - Clube de Assinaturas",
      content_category: "landing_page",
    });
  }, [trackCustomEvent]);

  // ScrollDepth por seção, disparo único por seção (padrão v6/v11/v12).
  // ATENÇÃO: ScrollDepth NÃO está no catálogo padrão da Meta — tem que sair por
  // fbq('trackCustom'); o trackCustomEvent do hook manda tudo por fbq('track').
  // Daí o trackNonCatalogEvent, que usa o verbo certo E manda o image pixel com o
  // mesmo eventID — as outras LPs chamam o fbq direto e perdem o evento inteiro
  // para quem usa ad-blocker (aqui o ViewContent sobrevive e o ScrollDepth morria,
  // deprimindo a razão entre os dois no gerenciador).
  const trackSection = useCallback((sectionId: string) => {
    if (trackedSections.current.has(sectionId)) return;
    trackedSections.current.add(sectionId);
    void trackNonCatalogEvent("ScrollDepth", {
      section: sectionId,
      page: "clube",
    });
  }, [trackNonCatalogEvent]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackSection(entry.target.id);
          }
        });
      },
      // threshold 0 = dispara quando QUALQUER pixel da seção entra na tela.
      // NÃO usar 0.3: o threshold é fração do ELEMENTO, não da tela — uma seção mais
      // alta que ~3,3× a viewport nunca alcança 0,3 e o evento MORRE EM SILÊNCIO.
      // Medido em 320×568: `comparativo-section` tem 2.074px, ratio máximo 0,27 → nunca
      // disparava (4 de 5 seções saíam). Em 375×667 dava 0,36 — e ~0,30 descontando a
      // barra do navegador, ou seja, no limite. Com 0 não há altura que quebre.
      { threshold: 0 }
    );

    SCROLL_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [trackSection]);

  return (
    <main className="min-h-screen">
      <NavbarClube onCtaClick={() => openModal("[Site-Clube]BT-Header")} />
      <HeroClube onCtaClick={() => openModal("[Site-Clube]BT-Hero")} />
      <div id="comparativo-section">
        <ComparativoClube
          onCtaClick={() => openModal("[Site-Clube]BT-Comparativo")}
        />
      </div>
      <div id="assinaturas-section">
        <AssinaturasClube
          onCtaClick={() => openModal("[Site-Clube]BT-Assinatura")}
        />
      </div>
      <NotasFiscaisClube
        onCtaClick={() => openModal("[Site-Clube]BT-Nota-fiscal")}
      />
      <FuncionalidadesClube
        onCtaClick={() => openModal("[Site-Clube]BT-Funcionalidades")}
      />
      <TotemClube onCtaClick={() => openModal("[Site-Clube]BT-Totem")} />
      <NotificacoesClube
        onCtaClick={() => openModal("[Site-Clube]BT-Notificacoes")}
      />
      <ClientesClube />
      <div id="depoimentos-section">
        <DepoimentosClube />
      </div>
      <MigracaoBandaClube
        onCtaClick={() => openModal("[Site-Clube]BT-Migracao")}
      />
      <div id="passos-section">
        <PassosClube onCtaClick={() => openModal("[Site-Clube]BT-Passos")} />
      </div>
      <BasicPlanSection />
      <div id="faq-section">
        <FAQClube />
      </div>
      <FooterClube />

      <LeadFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        originDesc={modalDesc}
      />
    </main>
  );
}
