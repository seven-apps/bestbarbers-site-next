// Fonte: bestbarbers-ai/docs/operacional/marketing-vendas-nov26/estrategia-canais/diagnostico-v1/02-dados.json.
import { Diagnostic } from "./_components/Diagnostic";
import { getPublicContent } from "./_lib/content";

export default function DiagnosticPage() {
  return <Diagnostic {...getPublicContent()} />;
}
