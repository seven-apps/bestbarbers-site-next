# Marca de demonstração — "BARBEARIA EXEMPLO"

Marca **fictícia** usada nas artes de produto do site. Existe para que o app apareça com
uma marca dentro (que é a promessa do produto: app com a cara da barbearia) **sem** usar a
marca de nenhum cliente ou ex-parceiro real.

**Regra:** arte nova que precise de marca de barbearia usa esta. Não inventar outra —
duas marcas fictícias no mesmo site leem como duas empresas diferentes.

Criada em 19/Set/2026, ao substituir três artes que traziam marca de ex-parceiro banido
**queimada no pixel** (nome de arquivo inocente e `alt` genérico: nenhuma varredura por
nome as encontrava — só abrindo a imagem).

---

## Tokens visuais

| Token | Valor | Onde |
|---|---|---|
| Ouro | `#ffaf02` | lettering "BARBEARIA", tesoura, botões, ícones ativos — é o `--primary` do site |
| Preto da marca | `#121212` | texto sobre ouro — é o `--bg2` do site |
| Creme | `#FBF8F3` | lettering "EXEMPLO" sobre fundo escuro |
| Fundo de tela | `#0A0A0B` | corpo da tela do app |
| Cartão / lista | `#1C1C1F` com borda `#2A2A2E` | linhas de escolha |
| Texto secundário | `#95959C` | subtítulos |

**Tipografia:** Montserrat (em `public/fonts/`, embutida em base64 no gerador — nada de
Google Fonts em render offline).
- `BARBEARIA` — peso **500**, `letter-spacing: 0.42em` (com `text-indent` igual ao
  spacing, senão a palavra desalinha à direita), em ouro.
- `EXEMPLO` — peso **900**, `letter-spacing: -0.015em`, em creme (ou em ouro quando o
  fundo já é claro/ouro).
- Texto corrido das artes (cards de notificação): Source Sans Pro **700**.

**Monograma — tesoura de barbeiro**, desenhada em traço, nunca emoji nem ícone de
terceiro. Duas lâminas cruzadas e duas argolas, `stroke-width` 3.2 no `viewBox` 48:

```svg
<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13 6 L33 34" stroke="#ffaf02" stroke-width="3.2" stroke-linecap="round"/>
  <path d="M35 6 L15 34" stroke="#ffaf02" stroke-width="3.2" stroke-linecap="round"/>
  <circle cx="12.5" cy="39" r="5.6" stroke="#ffaf02" stroke-width="3.2"/>
  <circle cx="35.5" cy="39" r="5.6" stroke="#ffaf02" stroke-width="3.2"/>
</svg>
```

**Logotipo (empilhado, centralizado):** tesoura → `BARBEARIA` → `EXEMPLO`.

**Ícone do app** (o quadradinho do push e da loja): quadrado com raio **22%** do lado,
fundo `linear-gradient(160deg,#1c1c1e,#0b0b0c 68%)`, anel interno
`inset 0 0 0 1.2% rgba(255,175,2,.28)`, e dentro a tesoura + `BARBEARIA` + `EXEMPLO`.
A palavra EXEMPLO **tem de ler inteira na ampliação** — era exatamente isso que denunciava
a marca do ex-parceiro na arte antiga.

**Nomes fictícios de apoio** (mantêm o mesmo universo): unidade = "Unidade Exemplo ·
Centro"; serviço = "Corte + Barba".

---

## Onde ela aparece

| Arquivo | Dimensão | O que mostra |
|---|---|---|
| `hero-app-proprio-sem-rosto.png` | 1080×434 | três celulares: clube, agendamento, avisos |
| `notifications-app-proprio.webp` | 1640×857 | três cards de push, ícone do app em cada |
| `app-dashboard-mockup-limpo.png` | 891×933 | celular + notebook; só a tela do celular é nova |

As três nasceram de HTML/CSS renderizado em Playwright, com os tokens acima em um módulo
comum (`marca.mjs`). Reaproveitar o módulo, não redesenhar a marca no olho.

### Cuidado ao editar a arte do clube

No cartão de plano da primeira arte o rótulo é **"Corte & Barba · 4 créditos no mês"**,
nunca "ilimitado": a `/clube` declara em código que o clube é por créditos ou dias de uso
(`src/components/clube/FAQClube.tsx`), e "ilimitado" contradiz a página. O preço
R$ 129,90/mês é o que a barbearia cobra do cliente dela — esse pode ficar.

### Marca fictícia concorrente (pendência para o André)

`v12-app-dashboard-mockup.png` usa outra marca fictícia, **"SUA BARBEARIA"**, em paleta
vermelha. É uma limpeza anterior da mesma arte de mockup. Enquanto as duas existirem, o
site tem duas marcas de demonstração diferentes. Unificar em "BARBEARIA EXEMPLO" é o
caminho — decisão do André.
