# BestBarbers - Site Next.js

Site oficial da BestBarbers reconstruído em **Next.js 14** com fidelidade pixel-perfect ao design original do Webflow, otimizado para performance, SEO e acessibilidade.

## 🚀 Tecnologias

- **Next.js 14** com App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes de interface
- **next/font** para carregamento otimizado de fontes
- **next/image** para otimização de imagens

## 📦 Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd bestbarbers-site

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev
```

O site estará disponível em [http://localhost:3000](http://localhost:3000).

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── layout.tsx         # Layout raiz com SEO e fontes
│   ├── page.tsx           # Página principal
│   ├── sitemap.ts         # Sitemap automático
│   └── robots.ts          # Robots.txt automático
├── components/
│   ├── sections/          # Componentes das seções
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── SubscriptionsSection.tsx
│   │   ├── InvoicesSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── TotemSection.tsx
│   │   ├── NotificationsSection.tsx
│   │   ├── ClientsSection.tsx
│   │   ├── StepsSection.tsx
│   │   ├── BasicPlanSection.tsx
│   │   └── Footer.tsx
│   └── ui/                # Componentes shadcn/ui
├── content/
│   └── home.ts            # Conteúdo textual centralizado
├── styles/
│   └── tokens.css         # Design tokens extraídos
└── lib/
    └── utils.ts           # Utilitários
```

## 🎨 Design System

### Cores Principais
- **Primary**: `#ffaf02` (Amarelo BestBarbers)
- **Primary Hover**: `#ffb921`
- **Background Dark**: `#121212`
- **Text**: `#0c0c0c`

### Tipografia
- **Primária**: Montserrat (100-900)
- **Secundária**: Montserrat (100-900)

### Tokens de Design
Todos os tokens estão centralizados em `src/styles/tokens.css`:
- Cores (primárias, neutras, secundárias)
- Tipografia (tamanhos, pesos, line-heights)
- Espaçamentos
- Bordas e raios
- Sombras
- Breakpoints

## 📝 Editando Conteúdo

Todo o conteúdo textual está centralizado em `src/content/home.ts`. Para alterar textos, links ou configurações:

```typescript
// Exemplo: Alterar título do hero
export const homeContent = {
  hero: {
    title: {
      main: "Novo Título",
      highlight: " Destaque",
      subtitle: "com subtítulo personalizado"
    },
    // ...
  }
}
```

### Seções Disponíveis:
- `navbar` - Cabeçalho e navegação
- `hero` - Seção principal
- `subscriptions` - Gerenciamento de assinaturas
- `invoices` - Emissão de notas fiscais
- `features` - Funcionalidades
- `totem` - Totem de autoatendimento
- `notifications` - Notificações personalizadas
- `clients` - Clientes/logos
- `steps` - Passo a passo
- `basicPlan` - Plano básico
- `footer` - Rodapé

## 🖼️ Gerenciando Imagens

As imagens estão em `public/images/`. Para otimização automática:

```tsx
import Image from "next/image";

<Image
  src="/images/sua-imagem.webp"
  alt="Descrição"
  width={800}
  height={600}
  className="w-full h-auto"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm run start

# Linting
npm run lint

# Análise de bundle
npm run analyze

# Lighthouse CI
npm run lighthouse:ci
```

## 📱 Responsividade

O site é totalmente responsivo com breakpoints:
- **Mobile**: ≤360px
- **Tablet**: ~768px  
- **Desktop**: ≥1280px

### Testando Responsividade:
1. Abra DevTools (F12)
2. Ative o modo responsivo
3. Teste nos breakpoints: 360px, 390px, 768px, 1024px, 1280px, 1440px

## ♿ Acessibilidade

Implementado seguindo WCAG 2.1 AA:
- HTML semântico
- Hierarquia correta de headings (h1, h2, h3...)
- Alt text em todas as imagens
- Contraste adequado (≥4.5:1)
- Foco visível em elementos interativos
- Navegação por teclado

### Testando Acessibilidade:
```bash
# Instalar axe-core
npm install -g @axe-core/cli

# Executar auditoria
axe http://localhost:3000
```

## 🚀 Performance

Otimizações implementadas:
- **Next/Image** com lazy loading e WebP/AVIF
- **Next/Font** com display: swap
- **Tree shaking** automático
- **Code splitting** por rota
- **Compressão** de assets

### Meta: Lighthouse Score ≥95
- Performance: ≥95
- Accessibility: ≥95  
- Best Practices: ≥95
- SEO: ≥95

## 🔍 SEO

Configurações SEO implementadas:
- Meta tags completas
- Open Graph e Twitter Cards
- Sitemap.xml automático
- Robots.txt configurado
- Schema markup (estruturado)
- URLs semânticas

### Metadados Configuráveis:
Edite em `src/app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: "Seu Título",
  description: "Sua Descrição",
  // ...
}
```

## 🌐 Deploy

### Vercel (Recomendado):
1. Conecte o repositório no Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas:
```bash
# Build para produção
npm run build

# Os arquivos estarão em .next/
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente:
Crie `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=https://www.bestbarbers.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Personalizando Tokens:
Edite `src/styles/tokens.css` e `tailwind.config.ts` para alterar cores, espaçamentos, etc.

## 📋 Checklist de QA

### ✅ Funcionalidade
- [ ] Todas as seções carregam corretamente
- [ ] Links funcionam (externos abrem em nova aba)
- [ ] Imagens carregam com lazy loading
- [ ] Slider de clientes funciona
- [ ] Botões têm hover states

### ✅ Responsividade
- [ ] Layout funciona em 360px (mobile pequeno)
- [ ] Layout funciona em 768px (tablet)
- [ ] Layout funciona em 1280px+ (desktop)
- [ ] Textos são legíveis em todos os tamanhos
- [ ] Imagens se ajustam adequadamente

### ✅ Performance
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 4s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Lighthouse Score ≥95 em todos os pilares

### ✅ Acessibilidade
- [ ] Navegação por teclado funciona
- [ ] Screen readers conseguem navegar
- [ ] Contraste adequado em todos os textos
- [ ] Foco visível em elementos interativos

## 🐛 Troubleshooting

### Build Falhando:
```bash
# Limpar cache
rm -rf .next node_modules
npm install
npm run build
```

### Imagens Não Carregam:
- Verifique se estão em `public/images/`
- Confirme o caminho no código (`/images/nome.ext`)
- Teste formatos suportados (JPG, PNG, WebP, AVIF)

### Fontes Não Carregam:
- Verifique `src/app/layout.tsx`
- Confirme arquivos em `public/fonts/`
- Teste fallbacks no CSS

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique este README
2. Consulte a documentação do Next.js
3. Abra uma issue no repositório

---

**Desenvolvido com ❤️ usando Next.js 14**