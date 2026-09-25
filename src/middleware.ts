import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_AB_CLUBE, DIAS_COOKIE_AB, bracoDoVisitante, bracoForcado, ehBracoSorteado, rotaDoBraco } from "@/lib/ab-clube";

/**
 * Split do A/B de página de `/clube/[peca]` (regra e motivo em `src/lib/ab-clube.ts`).
 * REWRITE, nunca redirect: o navegador continua em `/clube/<slug>?<query inteira>` — o `clone()`
 * do `nextUrl` troca só o `pathname`, então UTMs, `?origin=`, url_tags e `fbclid` chegam
 * intactos à página servida, e o pixel dispara com a URL do anúncio.
 */
export function middleware(req: NextRequest) {
  const slug = req.nextUrl.pathname.replace(/^\/clube\//, "").replace(/\/+$/, "");
  // `?ab=curta|longa|cena` força o braço (QA do time e revisão do André). Braço em sorteio vira o
  // cookie do visitante; `cena` (fora do sorteio) é servido sem gravar cookie.
  const forcado = bracoForcado(req.nextUrl.searchParams.get("ab"));
  const cookie = req.cookies.get(COOKIE_AB_CLUBE)?.value;
  const braco = forcado ?? bracoDoVisitante(cookie, Math.random());

  const destino = rotaDoBraco(slug, braco);
  let res: NextResponse;
  if (destino) {
    const url = req.nextUrl.clone();
    url.pathname = destino;
    res = NextResponse.rewrite(url);
  } else {
    res = NextResponse.next();
  }
  // Sem cookie (bloqueado pelo navegador) o sorteio é por request; o card ainda registra o braço
  // visto, porque a página renderiza a `<meta name="bb-variante">` que a atribuição lê.
  if (ehBracoSorteado(braco) && cookie !== braco) {
    res.cookies.set(COOKIE_AB_CLUBE, braco, { maxAge: DIAS_COOKIE_AB * 86400, path: "/", sameSite: "lax" });
  }
  return res;
}

export const config = { matcher: "/clube/:peca" };
