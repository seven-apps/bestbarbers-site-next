import Image from "next/image";
import { CHAVES_TEMA_QUERO, temaDoParametro } from "@/lib/quero-stories";
import { FormularioQuero } from "../_components/FormularioQuero";

/**
 * /quero — página só de formulário, para o adesivo de link dos stories do Instagram (26/Nov/26).
 *
 * O link é `/quero?t=<tema>&origin=120004089&utm_…`; o rewrite de `next.config.ts` serve esta página estática
 * (`/quero/<tema>`) e o navegador continua em `/quero?…`, então a atribuição lê a URL inteira do link. Uma página
 * pré-gerada por tema: quem vem do celular recebe o título certo no primeiro HTML, sem troca de texto depois.
 * Regras do tema e da origem: `src/lib/quero-stories.ts`.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return CHAVES_TEMA_QUERO.map((tema) => ({ tema }));
}

export default async function QueroPage({ params }: { params: Promise<{ tema: string }> }) {
  const { tema } = await params;
  return (
    <main className="min-h-[100svh] bg-[#121212] px-4 pt-5 pb-8 flex flex-col items-center">
      <Image
        src="/images/Logo-BestBarbers-branco_1.webp"
        alt="BestBarbers"
        width={140}
        height={32}
        priority
        className="w-[112px] h-auto mb-4"
      />
      <FormularioQuero tema={temaDoParametro(tema)} />
    </main>
  );
}
