"use client";

import { useState, useCallback } from "react";
import { LeadFormModal } from "@/components/sections/LeadFormModal";

interface FeatureCTAProps {
  children: React.ReactNode;
  originDesc: string;
  className?: string;
}

export function FeatureCTA({ children, originDesc, className }: FeatureCTAProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <button onClick={handleOpen} className={className}>
        {children}
      </button>
      <LeadFormModal isOpen={open} onClose={handleClose} originDesc={originDesc} />
    </>
  );
}
