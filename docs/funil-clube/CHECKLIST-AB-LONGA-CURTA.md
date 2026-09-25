# Checklist — cadastro de teste ponta a ponta do A/B curta × longa (`/clube/<peça>`)

Ciclo 1 do teste de tráfego (GO do André, 24/Set/2026, 23:05). Desenho:
`bestbarbers-ai/docs/operacional/trafego/analise-advantage-pagina-set26.md` §7–§10.
Regra do sorteio: `src/lib/ab-clube.ts`. Split: `src/middleware.ts`. Braço longo: `src/app/clube-longa/[peca]/`.

## O que está no ar (depois do deploy desta branch)

| Braço | O visitante vê | Servido por (interno) | Cookie `bb_ab_clube` | `bb_lp_version` no card |
|---|---|---|---|---|
| curta | `/clube/<slug>` como hoje (herói `base`, formulário de 2 passos) | a própria rota | `curta` (30 dias) | `clube-<slug>-curta` |
| longa | a página longa `/clube` (formulário antigo, modal) | rewrite para `/clube-longa/<slug>` | `longa` (30 dias) | `clube-<slug>-longa` |
| cena | FORA do sorteio; só por `?ab=cena` (7 páginas com foto) | rewrite para `/clube-cena/<slug>` | não grava | `clube-<slug>-cena` |

- O sorteio é 50/50 por cookie. Sem cookie (navegador bloqueando) o sorteio é por request, e o card
  ainda registra o braço visto, porque ele sai da `<meta name="bb-variante">` da página, não do cookie.
- A URL do navegador NUNCA muda (rewrite, não redirect): UTMs, `?origin=`, url_tags e `fbclid`
  chegam inteiros ao formulário e ao pixel. Cookie antigo (`base`/`cena`) ressorteia.
- `?ab=curta|longa|cena` força o braço para QA. Os dois primeiros gravam o cookie; `cena` não.

## URLs de teste (uma peça basta; troque `<slug>` por qualquer uma das 11)

Peça sugerida: `retentativa` (estático, porta 1). Query padrão do ciclo 1:

```
utm_source=meta&utm_campaign=TESTE-CICLO1&utm_content=TESTE-D0
```

| Braço | URL |
|---|---|
| curta | `https://www.bestbarbers.app/clube/retentativa?ab=curta&utm_source=meta&utm_campaign=TESTE-CICLO1&utm_content=TESTE-D0` |
| longa | `https://www.bestbarbers.app/clube/retentativa?ab=longa&utm_source=meta&utm_campaign=TESTE-CICLO1&utm_content=TESTE-D0` |
| sorteio | `https://www.bestbarbers.app/clube/retentativa?utm_source=meta&utm_campaign=TESTE-CICLO1&utm_content=TESTE-D0` (janela anônima; recarregue com o cookie apagado para ver o outro braço) |

Uma segunda peça para o braço longo, por segurança (vídeo, sem cena): `/clube/parceiro-guapo?ab=longa&...`.

## 1. No navegador (antes de cadastrar)

- [ ] A barra de endereço continua em `/clube/<slug>?...` com a query inteira (nenhum redirect).
- [ ] `ab=longa`: a página é a `/clube` longa (navbar, herói com o app, faixa de migração, FAQ, botão abre o modal).
- [ ] `ab=curta`: a página curta (logo só, título da peça, prova animada, formulário na 3ª tela).
- [ ] DevTools → Elements → `<head>`: `<meta name="bb-variante" content="longa">` (ou `curta`).
- [ ] DevTools → Application → Cookies: `bb_ab_clube` = `longa` (ou `curta`), validade 30 dias, `SameSite=Lax`.
- [ ] Recarregar SEM `?ab=`: o mesmo braço volta (o cookie manda). Apagar o cookie e recarregar até ver o outro braço.
- [ ] Cookies bloqueados (Chrome → Site settings → Cookies → Block): recarregar várias vezes alterna os braços; a meta sempre acompanha a página vista.
- [ ] Modal «Você é dono de barbearia?» (`PerguntaDono`): com `utm_campaign=TESTE-CICLO1` ele NÃO aparece (só campanhas `BB-TOPO-*` ou `fase=TOPO*`, regra em `src/lib/pergunta-dono.ts`). Para conferir o modal nos dois braços, use `utm_campaign=BB-TOPO-TESTE-CICLO1`: ele deve se comportar igual nas duas páginas (mesma regra, mesma URL).

## 2. No pixel (Events Manager → Test Events, ou DevTools → Network → `facebook.com/tr`)

Abrir o Test Events do pixel `1100195158903491` com o código de teste na URL (`&test_event_code=TESTxxxx`) ou ler as requisições `tr/?ev=...`.

- [ ] `PageView` na carga (do GTM/layout raiz, sem `variante`, como sempre).
- [ ] `ViewContent` na carga, com `cd[variante]=longa` (ou `curta`).
- [ ] Longa: `ScrollDepth` ao rolar (`cd[section]=comparativo-section`, `cd[variante]=longa`); `clube_bt_criar` (qualquer CTA) / `clube_bt_migrar` (faixa de migração) ao clicar, com `cd[variante]`.
- [ ] Curta: `clube_heroi_clique`, `clube_prova_vista` com `cd[variante]=curta`.
- [ ] Ao enviar o formulário: **`Lead`** com `cd[variante]=longa|curta`, `cd[content_id]=TESTE-D0`, `cd[tem_equipe]`, `cd[lead_score]`, `cd[porta]` (1 na retentativa). O `Lead` dispara em TODO envio (sem `publico=` na URL não há gate de score).
- [ ] Se marcou 2+ profissionais: `LeadComEquipe` com o mesmo `variante`; score ≥ 30 / ≥ 60: `QualifiedLead` / `QualifiedLead60`.
- [ ] GTM (Preview → dataLayer): evento `form_submit` com `custom_parameters.variante = "longa"|"curta"` e `lp_version` = `source` da página.
- [ ] Todo evento tem `dl=` (URL) começando em `/clube/<slug>?utm_source=meta...` — é o predicado da conversão personalizada.

## 3. No Ploomes (pipe Qualificação 40043772, ao vivo)

Cadastrar com nome do tipo `TESTE CICLO1 LONGA` / `TESTE CICLO1 CURTA` (telefone real seu; apagar o card depois).

- [ ] Card criado na **Qualificação**, origem **Tráfego Pago** (originId 40210173, porque `utm_source=meta`).
- [ ] Campo **`bb_lp_version`** = `clube-retentativa-longa` (braço longo) e `clube-retentativa-curta` (braço curto). Nos dois, o slug é o da PEÇA DE ORIGEM.
- [ ] Campo **`bb_utm_campaign`** = `TESTE-CICLO1` · `bb_utm_content` = `TESTE-D0` · `bb_utm_source` = `meta`.
- [ ] Descrição da Campanha (`originDesc`): com UTM simples cai no formato legado (`[SCORE: n] LP - Lead Machine | ... | TESTE-D0`). Com url_tags da Meta (`fase=`, `campanha=`, `publico=`, `ad=`, `ad_id=`) sai no formato de 8 segmentos, e o 1º segmento é o `bb_lp_version` com o sufixo do braço: `clube-retentativa-longa | TOPO-SET26 | BB-TOPO-... | ...`.
- [ ] Mesma pessoa cadastrando de novo (recadastro): card novo na Qualificação com o `bb_lp_version` do braço que ela viu na hora.
- [ ] Longa: o `originDesc` de visita direta leva a seção do botão (`[Site-Clube]BT-Hero`); curta: `lp_clube_retentativa`. Não é erro, é a diferença dos dois formulários.

## 4. Leitura do teste (Ploomes ao vivo, nunca tabela local)

- D+3 (instrumento): curta com ≥ 100 LPV e 0 cadastro → sorteio a 100% longa no site, sem tocar na Meta:
  `BRACOS_NO_SORTEIO = ["longa"]` em `src/lib/ab-clube.ts` + deploy (os testes cobram a lista; atualizar `ab-clube.test.ts`).
- D+9: cards COM EQUIPE por braço, filtrando `bb_lp_version` por sufixo `-longa` × `-curta`, cruzado com `bb_utm_campaign` (célula) e `bb_ad_id` (criativo). CTR e CPL não decidem.
- A `/clube` direta (remarketing M1, e-mail) não tem sufixo (`clube`): fica fora do teste por construção.

## Verificação local feita em 24/Set/2026 (build de produção, `next start`)

| Pedido | Resultado |
|---|---|
| `?ab=longa` | HTTP 200, sem `Location`; `<meta name="bb-variante" content="longa">` no `<head>`; título da `/clube`; cookie `longa` 30 d |
| `?ab=curta` | HTTP 200; meta `curta`; título da peça; cookie `curta` |
| `?ab=cena` | HTTP 200; meta `cena`; sem cookie |
| sem `?ab=`, sem cookie, 6 requests | cookies `curta, longa, curta, curta, longa, longa` (sorteio por request) |
| cookie `longa` em `/clube/parceiro-guapo` | página longa, sem novo `Set-Cookie` |
| cookie antigo `cena` | ressorteado (gravou `longa`) |
| `/clube/nao-existe?ab=longa` | 404 |
| `/clube?...` direta | sem meta (fora do teste) |
