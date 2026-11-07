// O laudo /diagnostico (03/Nov/26) foi reprovado em 04/Nov; a consultoria é o diagnóstico que foi ao ar (07/Nov/26).
// Quem chegar pelo endereço antigo vai à consultoria, com os parâmetros do anúncio preservados.
import { redirect } from "next/navigation";

export default async function DiagnosticoPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = new URLSearchParams();
  for (const [chave, valor] of Object.entries(await searchParams)) {
    for (const v of Array.isArray(valor) ? valor : valor ? [valor] : []) params.append(chave, v);
  }
  const busca = params.toString();
  redirect(`/consultoria${busca ? `?${busca}` : ""}`);
}
