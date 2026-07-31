"use client";

import { useState, useCallback } from "react";
import { LeadFormModal } from "@/components/sections/LeadFormModal";

interface FeatureCTAProps {
  children: React.ReactNode;
  originDesc: string;
  /** Origem padrão da página no Ploomes (fallback quando não há ?origin=/UTM). */
  originId?: number;
  className?: string;
}

export function FeatureCTA({ children, originDesc, originId, className }: FeatureCTAProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <button onClick={handleOpen} className={className}>
        {children}
      </button>
      <LeadFormModal
        isOpen={open}
        onClose={handleClose}
        originDesc={originDesc}
        originId={originId}
      />
    </>
  );
}
