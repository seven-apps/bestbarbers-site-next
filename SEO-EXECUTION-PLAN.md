# PLANO DE EXECUÇÃO SEO — BestBarbers

> Plano estratégico completo em: `SEO-MASTER-PLAN.md`
> Última atualização: 2026-03-26

---

## STATUS GERAL

| Fase | Status | URLs | Impacto |
|------|--------|------|---------|
| Quick Wins técnicos | ✅ CONCLUÍDO | — | Counter SSR, JSON-LD, metadata, FAQ, testimonials |
| 8 Feature Pages | ✅ CONCLUÍDO | 8 | Hub-and-spoke com internal linking |
| 30 City Pages (pSEO) | ✅ CONCLUÍDO | 30 | Oceano azul, nenhum SaaS BR faz |
| Redirects | ✅ CONCLUÍDO | — | 9 redirects permanentes |
| Sitemap | ✅ CONCLUÍDO | 46 | De 2 para 46 URLs (blog + artigos) |
| Google Search Console | ✅ CONCLUÍDO | — | Verificado + sitemap submetido |
| Blog infrastructure | ✅ CONCLUÍDO | 1 | Template + listagem + JSON-LD Article + FAQ |
| 5 Artigos (Tier 1) | ✅ CONCLUÍDO | 5 | NFS-e, Comparativo, Assinatura, Faltas, Comissão |
| 15 Artigos (Tier 2+3) | ⬜ PENDENTE | 15 | Conteúdo indexável, autoridade temática |
| Páginas de Cases | ⬜ PENDENTE | 4+ | Prova social indexável |
| Ferramentas interativas | ⬜ PENDENTE | 3-4 | Lead magnets + backlinks naturais |
| pSEO feature × cidade | ⬜ PENDENTE | 200+ | Expansão futura |
| Off-page SEO | ⬜ PENDENTE | — | Backlinks, ASO, Google Business |

**URLs indexáveis hoje: 46** | Meta: 100+ em 3 meses

---

## SPRINT 1 — Blog + Calculadora (maior impacto imediato)

### 1.1 Blog Infrastructure
**O que:** Criar estrutura `/blog` com MDX, template de artigo, página de listagem
**Arquivos:**
- `src/app/blog/page.tsx` — Listagem de artigos
- `src/app/blog/[slug]/page.tsx` — Template de artigo com generateStaticParams
- `src/content/blog/` — Artigos em MDX ou TS
- Sitemap atualizado com blog posts

**Padrão de cada artigo:**
- Metadata dinâmica (title, desc, canonical, OG)
- JSON-LD `Article` schema
- Breadcrumb (Home > Blog > Artigo)
- Heading hierarchy (H1 > H2 > H3)
- Internal links para feature pages
- CTA com FeatureCTA (abre modal)
- Seção "Artigos relacionados"
- Tempo de leitura estimado

### 1.2 Primeiros 5 Artigos (Tier 1 — BOFU/MOFU)

| # | Artigo | Keyword | Vol. Est. | Fonte de dados |
|---|--------|---------|-----------|----------------|
| 1 | **NFS-e 2026: O que Muda para Barbearias** | nota fiscal barbearia 2026 | ALTO (timing) | Feature existente + regulação |
| 2 | **Melhor Sistema para Barbearia 2026: Comparativo** | melhor sistema barbearia 2026 | ALTO | Competitive analysis |
| 3 | **Barbearia por Assinatura: Guia Definitivo** | barbearia por assinatura | 2K-5K | Copy Arsenal completo |
| 4 | **Como Reduzir Faltas na Barbearia** | como reduzir faltas barbearia | 1K-3K | 6M agendamentos + lembretes |
| 5 | **Como Calcular Comissão de Barbeiro** | comissão barbeiro calcular | 2K-5K | VOC freq 31 |

**Regras de conteúdo:**
- Mínimo 1.500 palavras por artigo
- Pelo menos 3 dados exclusivos BestBarbers por artigo (51K assinantes, 6M agendamentos, etc.)
- NUNCA citar nomes de barbearias clientes ou concorrentes
- Cada artigo deve linkar para pelo menos 2 feature pages
- CTA natural no meio e no final do artigo
- FAQ com schema JSON-LD no final

### 1.3 Calculadora de Faturamento para Barbearia

**URL:** `/calculadora-faturamento-barbearia`
**Keywords:** "quanto ganha dono de barbearia", "faturamento barbearia" (8K-15K/mês combinado)

**Inputs:** Quantas cadeiras? Ticket médio? Dias de funcionamento? % Assinantes?
**Output:** Faturamento estimado COM vs SEM clube de assinaturas

**Por que é poderoso:**
- Ferramentas interativas ganham backlinks naturais
- Lead capture no resultado (email para ver projeção completa)
- CTA natural: "Esse é o potencial. O BestBarbers ajuda a chegar lá."

---

## SPRINT 2 — Mais artigos + Cases + Simulador

### 2.1 Artigos 6-10 (Tier 2 — TOFU)

| # | Artigo | Keyword | Vol. Est. |
|---|--------|---------|-----------|
| 6 | **Como Montar uma Barbearia: Guia 2026** | como montar barbearia | 15K-30K |
| 7 | **Quanto Ganha um Dono de Barbearia** | quanto ganha dono barbearia | 8K-15K |
| 8 | **Marketing para Barbearia: 15 Estratégias** | marketing para barbearia | 5K-10K |
| 9 | **60 Nomes para Barbearia: Guia Completo** | nome para barbearia | 5K-10K |
| 10 | **Quanto Custa Montar uma Barbearia 2026** | quanto custa montar barbearia | 5K-10K |

### 2.2 Páginas de Cases

**URL:** `/cases` (hub) + subpáginas
**Conteúdo:** Dados reais anonimizados (sem nomes de barbearias)
- `/cases/barbearia-4-cadeiras-sp` — 353 assinantes, R$15K→R$31.690
- `/cases/rede-6-unidades` — 1.000 assinantes, R$440K/mês
- `/cases/single-unit-700-assinantes` — Maior single-unit do Brasil

### 2.3 Simulador de ROI

**URL:** `/simulador-roi-barbearia`
**Input:** Faturamento atual, nº barbeiros, nº clientes/mês
**Output:** Quanto está perdendo sem sistema + ROI em meses

---

## SPRINT 3 — Long tail + Ferramentas virais

### 3.1 Artigos 11-20 (Tier 3 — Long tail)

| # | Artigo | Keyword |
|---|--------|---------|
| 11 | Como Fidelizar Clientes na Barbearia | fidelizar clientes barbearia |
| 12 | Controle Financeiro para Barbearia | controle financeiro barbearia |
| 13 | Barbearia MEI: Guia Completo | barbearia MEI |
| 14 | Chatbot WhatsApp para Barbearia | chatbot barbearia whatsapp |
| 15 | Tabela de Preços para Barbearia | tabela preços barbearia |
| 16 | Franquia de Barbearia: Vale a Pena? | franquia barbearia |
| 17 | Google Meu Negócio para Barbearias | google meu negócio barbearia |
| 18 | Como Precificar Serviços na Barbearia | precificar serviços barbearia |
| 19 | Totem de Autoatendimento: Guia Completo | totem autoatendimento |
| 20 | App para Barbearia: Próprio vs Genérico | app barbearia próprio |

### 3.2 Gerador de Nome para Barbearia

**URL:** `/gerador-nome-barbearia`
**Potencial viral.** Ferramenta interativa supera artigos estáticos.

### 3.3 pSEO Feature × Cidade (expansão)

Quando city pages ganharem tração:
```
/agendamento-online/sao-paulo
/clube-de-assinaturas/rio-de-janeiro
/nota-fiscal-barbearia/belo-horizonte
```

---

## AÇÕES MANUAIS (paralelo)

### Google Business Profile
- Criar/otimizar perfil com categoria "Software company"
- Posts mensais
- Solicitar reviews de clientes

### App Store Optimization (ASO)
- Otimizar listing com keywords ("melhor app para barbearia", "agendamento fácil")
- Incentivar reviews com keywords específicas

### Backlinks
| Fonte | Como | Dificuldade |
|-------|------|-------------|
| Sebrae | Citação em artigos de barbearia | MÉDIA |
| Portais de franquia | Cases multi-unidade | BAIXA |
| Blogs empreendedorismo | Guest posts gestão barbearia | MÉDIA |
| Ferramentas interativas | Backlinks naturais da calculadora/gerador | ORGÂNICO |
| Cases em mídia | PR sobre resultados reais | MÉDIA |
| Parcerias fornecedores | Troca de links com produtos barbearia | BAIXA |

---

## MÉTRICAS DE ACOMPANHAMENTO

| Métrica | Hoje (baseline) | Meta 3 meses | Meta 6 meses |
|---------|----------------|--------------|--------------|
| URLs no sitemap | 40 | 100+ | 250+ |
| Páginas indexadas (GSC) | ~2 | 60+ | 150+ |
| Impressões orgânicas/mês | ~0 | 5.000+ | 30.000+ |
| Cliques orgânicos/mês | ~0 | 500+ | 3.000+ |
| Keywords top 100 | ~0 | 50+ | 200+ |
| Keywords top 10 | 0 | 5+ | 20+ |
| Backlinks | ~0 | 10+ | 50+ |

---

## REGRAS IMUTÁVEIS

1. **NUNCA citar nomes de barbearias clientes** — Usar descritivos genéricos
2. **NUNCA citar nomes de concorrentes** — Usar "apps genéricos", "outros sistemas"
3. **"A partir de R$299/mês"** obrigatório quando mencionar preço
4. **App = surpresa SDR** — Não revelar detalhes do app nas páginas (SDR faz isso na reunião)
5. **Sem UGC IA** — Fotos e vídeos reais, não gerados por IA
6. **CTAs abrem modal** — Usar FeatureCTA component, nunca Link para /form
7. **Dados exclusivos** — Cada artigo deve ter pelo menos 3 dados que nenhum concorrente pode copiar
