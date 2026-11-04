// Fonte: protótipo aprovado da consultoria on-line gratuita (04/Nov/26); conteúdo em _data/consultoria-v1.json.
import { Consultoria } from "./_components/Consultoria";
import { conteudoPublico } from "./_lib/content";

export default function ConsultoriaPage() {
  return <Consultoria {...conteudoPublico()} />;
}
