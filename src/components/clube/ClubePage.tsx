"use client";

import { useState, useCallback } from "react";
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
 * Página /clube — destino de tráfego pago de clube de assinaturas.
 * Espelha o esqueleto da homepage (HomePage.tsx) trocando a narrativa
 * para clube; componentes clonados em src/components/clube/.
 * Cada seção abre o MESMO LeadFormModal com originDesc próprio
 * no padrão [Site-Clube]BT-<Secao>.
 */
export function ClubePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDesc, setModalDesc] = useState<string>("");

  const openModal = useCallback((desc: string) => {
    setModalDesc(desc);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <main className="min-h-screen">
      <NavbarClube onCtaClick={() => openModal("[Site-Clube]BT-Header")} />
      <HeroClube onCtaClick={() => openModal("[Site-Clube]BT-Hero")} />
      <ComparativoClube
        onCtaClick={() => openModal("[Site-Clube]BT-Comparativo")}
      />
      <AssinaturasClube
        onCtaClick={() => openModal("[Site-Clube]BT-Assinatura")}
      />
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
      <DepoimentosClube />
      <MigracaoBandaClube
        onCtaClick={() => openModal("[Site-Clube]BT-Migracao")}
      />
      <PassosClube onCtaClick={() => openModal("[Site-Clube]BT-Passos")} />
      <BasicPlanSection />
      <FAQClube />
      <FooterClube />

      <LeadFormModal
        isOpen={modalOpen}
        onClose={closeModal}
        originDesc={modalDesc}
      />
    </main>
  );
}
