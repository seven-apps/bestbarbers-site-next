#!/usr/bin/env node
/**
 * Confere, de fora, o sorteio do endereço fixo `/ir/<teste>` (`src/lib/ab-pagina.ts`) num site no ar:
 *   1. 307 sem página intermediária, `no-store`, destino = página do assunto ou home;
 *   2. TODOS os parâmetros da query da Meta chegam ao destino, na mesma ordem e com o mesmo valor, mais o `bb_ab`;
 *   3. o cookie de 30 dias fixa o braço (N voltas com o cookie = sempre a mesma página);
 *   4. sem cookie, a divisão fica perto do percentual (N sorteios);
 *   5. a página de destino responde 200.
 * Só GET; não cria lead nem toca no Ploomes.
 *
 * Uso: node scripts/verificar-ir.mjs [base] [n]
 *   base = https://www.bestbarbers.app (padrão) ou http://localhost:3000
 */

const base = (process.argv[2] || "https://www.bestbarbers.app").replace(/\/+$/, "");
const n = Number(process.argv[3] || 40);

// A query que a Meta entrega com os url_tags resolvidos (ids fictícios).
const QUERY =
  "utm_source=facebook&utm_medium=paid&utm_campaign=MORNO-AB-NOV26&utm_content=CLUBE-DAVID" +
  "&fase=MORNO&campanha=MORNO-AB-NOV26&publico=A-CLUBE&ad=CLUBE-DAVID&creative=CLUBE-DAVID&angulo=garantido" +
  "&campaign_id=120239999999990001&adset_id=120239999999990002&ad_id=120239999999990003" +
  "&fbclid=IwZXh0bgNhZW0BMABhZGlkAasZ_d3Jx-Ex&teste_verificacao=1";

const TESTES = { clube: "/clube", "agente-ia": "/agente-ia-whatsapp" };
let falhas = 0;
const ok = (cond, msg) => {
  console.log(`  ${cond ? "✓" : "✗"} ${msg}`);
  if (!cond) falhas++;
};

async function pedir(caminho, cookie) {
  const res = await fetch(base + caminho, { redirect: "manual", headers: cookie ? { cookie } : {} });
  return {
    status: res.status,
    location: res.headers.get("location") || "",
    cache: res.headers.get("cache-control") || "",
    setCookie: res.headers.get("set-cookie") || "",
  };
}

for (const [teste, assunto] of Object.entries(TESTES)) {
  console.log(`\n== ${base}/ir/${teste}`);
  const r = await pedir(`/ir/${teste}?${QUERY}`);
  const destino = new URL(r.location, base);
  const braco = destino.pathname === "/" ? "home" : destino.pathname === assunto ? "assunto" : null;
  ok(r.status === 307, `status ${r.status} (307)`);
  ok(/no-store/.test(r.cache), `cache-control: ${r.cache}`);
  ok(braco !== null, `destino ${destino.pathname} (braço ${braco})`);
  console.log(`    location: ${r.location}`);

  const antes = [...new URLSearchParams(QUERY)];
  const depois = [...destino.searchParams];
  ok(JSON.stringify(depois.slice(0, antes.length)) === JSON.stringify(antes), `os ${antes.length} parâmetros chegam na mesma ordem e com o mesmo valor`);
  ok(depois.length === antes.length + 1 && depois.at(-1)[0] === "bb_ab" && depois.at(-1)[1] === `ir-${teste}-${braco}`, `bb_ab=${destino.searchParams.get("bb_ab")}`);
  for (const k of ["ad_id", "campanha", "fbclid", "utm_source", "utm_content"]) ok(destino.searchParams.get(k) === new URLSearchParams(QUERY).get(k), `${k}=${destino.searchParams.get(k)}`);

  const nomeCookie = `bb_ab_ir_${teste.replace(/-/g, "_")}`;
  ok(r.setCookie.includes(`${nomeCookie}=${braco}`) && /Max-Age=2592000/i.test(r.setCookie), `set-cookie: ${r.setCookie.split(";").slice(0, 3).join(";")}`);

  let iguais = 0;
  let regravou = 0;
  for (let i = 0; i < n; i++) {
    const v = await pedir(`/ir/${teste}?${QUERY}`, `${nomeCookie}=${braco}`);
    if (new URL(v.location, base).pathname === destino.pathname) iguais++;
    if (v.setCookie.includes(nomeCookie)) regravou++;
  }
  ok(iguais === n, `com o cookie: ${iguais}/${n} voltas na mesma página`);
  ok(regravou === 0, `com o cookie: nenhum Set-Cookie novo (${regravou})`);

  let home = 0;
  for (let i = 0; i < n; i++) {
    const v = await pedir(`/ir/${teste}?${QUERY}`);
    if (new URL(v.location, base).pathname === "/") home++;
  }
  console.log(`    sem cookie: ${home}/${n} na home, ${n - home}/${n} no assunto`);
  ok(home > 0 && home < n, "sem cookie: os dois braços aparecem");

  for (const caminho of [assunto, "/"]) {
    const p = await fetch(`${base}${caminho}?${QUERY}&bb_ab=ir-${teste}-x`, { redirect: "manual" });
    ok(p.status === 200, `${caminho} responde ${p.status}`);
  }
}

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}`);
process.exit(falhas === 0 ? 0 : 1);
