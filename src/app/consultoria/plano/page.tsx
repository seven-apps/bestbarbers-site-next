// Fonte: 02-plano.md §3.2. O endereço carrega as respostas (sem o texto livre): o SDR manda este link no 1º toque.
import { Plano } from "../_components/Plano";
import { conteudoPublico } from "../_lib/content";
import { respostasDoEndereco } from "../_lib/plano";

export default async function PlanoPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const conteudo = conteudoPublico();
  const { respostas, nome } = respostasDoEndereco(conteudo, await searchParams);
  return <Plano conteudo={conteudo} respostas={respostas} nome={nome} />;
}
