import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_AB_CLUBE, DIAS_COOKIE_AB, bracoDoVisitante, rotaDoBraco } from "@/lib/ab-clube";

/**
 * Split do A/B do herói de `/clube/[peca]` (regra e motivo em `src/lib/ab-clube.ts`).
 * Rewrite, nunca redirect: o navegador continua em `/clube/<slug>`.
 */
export function middleware(req: NextRequest) {
  const slug = req.nextUrl.pathname.replace(/^\/clube\//, "").replace(/\/+$/, "");
  // `?ab=base|cena` força o braço (QA do time e revisão do André); vira o cookie do visitante.
  const forcado = req.nextUrl.searchParams.get("ab");
  const cookie = forcado === "base" || forcado === "cena" ? undefined : req.cookies.get(COOKIE_AB_CLUBE)?.value;
  const braco = bracoDoVisitante(forcado ?? cookie, Math.random());

  const destino = rotaDoBraco(slug, braco);
  let res: NextResponse;
  if (destino) {
    const url = req.nextUrl.clone();
    url.pathname = destino;
    res = NextResponse.rewrite(url);
  } else {
    res = NextResponse.next();
  }
  if (cookie !== braco) {
    res.cookies.set(COOKIE_AB_CLUBE, braco, { maxAge: DIAS_COOKIE_AB * 86400, path: "/", sameSite: "lax" });
  }
  return res;
}

export const config = { matcher: "/clube/:peca" };
