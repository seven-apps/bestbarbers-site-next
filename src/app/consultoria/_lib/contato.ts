// Validação do contato da ficha (veio de /diagnostico/_lib/validation.ts, que saiu com o laudo reprovado em 04/Nov/26).
export interface ContatoDigitado {
  name: string;
  whatsapp: string;
}

export function validarContato(contato: ContatoDigitado): Record<string, string> {
  const erros: Record<string, string> = {};
  if (!contato.name.trim()) erros.nome = "Preencha o seu nome.";
  if (!/^\d{10,11}$/.test(contato.whatsapp.replace(/\D/g, ""))) erros.whatsapp = "Informe o WhatsApp com DDD, com 10 ou 11 dígitos.";
  return erros;
}

export function mascaraTelefone(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
