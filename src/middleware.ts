import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_AB_CLUBE, DIAS_COOKIE_AB, bracoDoVisitante, bracoForcado, ehBracoSorteado, rotaDoBraco } from "@/lib/ab-clube";
import { buscaComCupom, cupomDoLinkNormal } from "@/lib/cupom-parceiro";
import { PREFIXO_ROTA, decidirIr } from "@/lib/ab-pagina";

/**
 * Split do A/B de página de `/clube/[peca]` (regra e motivo em `src/lib/ab-clube.ts`), o sorteio do endereço fixo
 * `/ir/<teste>` (`src/lib/ab-pagina.ts`) e, em `/parceiros`, o link normal que abre o cupom (`cupomDoLinkNormal` em
 * `src/lib/cupom-parceiro.ts`).
 * No /clube, REWRITE, nunca redirect: o navegador continua em `/clube/<slug>?<query inteira>` — o `clone()`
 * do `nextUrl` troca só o `pathname`, então UTMs, `?origin=`, url_tags e `fbclid` chegam
 * intactos à página servida, e o pixel dispara com a URL do anúncio.
 */
export function middleware(req: NextRequest) {
  // `/ir/<teste>`: o endereço fixo dos anúncios sorteia a página (regra e motivo em `src/lib/ab-pagina.ts`).
  // REDIRECT (307) com a query de entrada inteira, mais o `bb_ab` com o braço. `no-store`: nenhum cache guarda um braço.
  if (req.nextUrl.pathname === "/ir" || req.nextUrl.pathname.startsWith(PREFIXO_ROTA)) {
    const decisao = decidirIr(req.nextUrl.pathname, req.nextUrl.search, (nome) => req.cookies.get(nome)?.value, Math.random());
    const res = NextResponse.redirect(new URL(decisao.destino, req.nextUrl.origin), 307);
    res.headers.set("Cache-Control", "private, no-store");
    if (decisao.cookie) {
      res.cookies.set(decisao.cookie.nome, decisao.cookie.valor, { maxAge: decisao.cookie.maxAge, path: "/", sameSite: "lax" });
    }
    return res;
  }

  // `/parceiros`: o link NORMAL de quem tem `linkNormalComCupom` (o cartão do Araújo, out/26) vai para o mesmo link com
  // o cupom. REDIRECT (307), não rewrite: a página, o formulário e a atribuição leem o `?cupom=` da URL do navegador.
  if (req.nextUrl.pathname === "/parceiros") {
    const cupom = cupomDoLinkNormal(req.nextUrl.searchParams);
    if (!cupom) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.search = buscaComCupom(req.nextUrl.searchParams, cupom).toString();
    return NextResponse.redirect(url, 307);
  }

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

export const config = { matcher: ["/clube/:peca", "/parceiros", "/ir", "/ir/:teste*"] };
