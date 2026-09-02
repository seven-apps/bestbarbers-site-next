import type { Metadata } from "next";
import { ISCAS, resolverIscaId } from "@/lib/iscas";
import ObrigadoContent from "./ObrigadoContent";

/**
 * A /obrigado serve VÁRIAS iscas e descobre qual pelo `?isca=`. O nome do guia na aba
 * do navegador é a primeira coisa que a pessoa lê depois de converter, então ele tem
 * que ser o nome do guia — não um rótulo genérico.
 *
 * Isto roda no SERVIDOR de propósito. A versão anterior ajustava `document.title` num
 * `useEffect` do client e perdia: o <title> que o Next monta a partir do metadata é
 * aplicado depois, e a aba terminava sempre em "Seu guia está aqui | BestBarbers" —
 * nome nenhum, para qualquer isca. Com `generateMetadata` o título já sai correto do
 * servidor e nada pode sobrescrevê-lo.
 *
 * O custo é a rota deixar de ser estática. É aceitável: a página é noindex, só é
 * aberta uma vez por lead e o conteúdo dela já era 100% renderizado no client.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ isca?: string | string[] }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const bruto = Array.isArray(params.isca) ? params.isca[0] : params.isca;
  const isca = ISCAS[resolverIscaId(bruto)];

  return {
    title: `Seu guia ${isca.titulo} está aqui | BestBarbers`,
    // A descrição não promete canal nenhum: a entrega é o download na própria página.
    description: "Obrigado! Baixe o seu guia em PDF agora, direto nesta página.",
  };
}

export default function ObrigadoPage() {
  return <ObrigadoContent />;
}
