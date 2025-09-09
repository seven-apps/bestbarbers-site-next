# Design Tokens - BestBarbers

Resumo completo dos tokens de design extraídos do Webflow e implementados no projeto Next.js.

## 🎨 Paleta de Cores

### Cores Primárias
```css
--primary: #ffaf02          /* Amarelo principal */
--primary-hover: #ffb921    /* Hover do amarelo */
--primary-gradient: #ebad04 /* Gradiente 1 */
--primary-gradient-2: #ffca00 /* Gradiente 2 */
```

### Cores Neutras
```css
--white: #ffffff            /* Branco */
--black: #20242a           /* Preto principal */
--black-01: #070707        /* Preto mais escuro */
--black-text: #0c0c0c      /* Texto preto */
--bg1: var(--white)        /* Background claro */
--bg2: #121212             /* Background escuro */
```

### Cores Secundárias
```css
--dark-grey: #aeb0b2       /* Cinza escuro */
--dim-grey: #4e5765        /* Cinza médio */
--grey: #dee0e2            /* Cinza claro */
--card-grey: #eaeaea       /* Cinza dos cards */
--green-zap: #70c270       /* Verde WhatsApp */
```

## 🔤 Tipografia

### Famílias de Fonte
```css
--font-primary: 'Montserrat', sans-serif    /* Títulos e destaques */
--font-secondary: 'Montserrat', sans-serif  /* Textos corridos */
```

### Tamanhos de Fonte
```css
--text-xs: 0.75rem     /* 12px - Botões */
--text-sm: 0.875rem    /* 14px - Descrições */
--text-base: 1rem      /* 16px - Texto padrão */
--text-lg: 1.125rem    /* 18px - Subtítulos */
--text-xl: 1.25rem     /* 20px - Títulos pequenos */
--text-2xl: 1.5rem     /* 24px - Títulos médios */
--text-3xl: 1.875rem   /* 30px - Títulos grandes */
--text-4xl: 2.5rem     /* 40px - Títulos principais */
--text-5xl: 3rem       /* 48px - Títulos hero */
```

### Pesos de Fonte
```css
--font-thin: 100       /* Montserrat Thin */
--font-light: 300      /* Light */
--font-normal: 400     /* Regular */
--font-medium: 500     /* Medium */
--font-semibold: 600   /* SemiBold */
--font-bold: 700       /* Bold */
--font-extrabold: 800  /* ExtraBold */
--font-black: 900      /* Black */
```

## 📏 Espaçamentos

### Sistema de Espaçamento (baseado em 4px)
```css
--space-1: 0.25rem     /* 4px */
--space-2: 0.5rem      /* 8px */
--space-3: 0.75rem     /* 12px */
--space-4: 1rem        /* 16px */
--space-5: 1.25rem     /* 20px */
--space-6: 1.5rem      /* 24px */
--space-8: 2rem        /* 32px */
--space-10: 2.5rem     /* 40px */
--space-12: 3rem       /* 48px */
--space-16: 4rem       /* 64px */
--space-20: 5rem       /* 80px */
--space-24: 6rem       /* 96px */
```

## 🔄 Bordas e Raios

```css
--radius-sm: 0.25rem    /* 4px - Elementos pequenos */
--radius-md: 0.5rem     /* 8px - Cards */
--radius-lg: 0.75rem    /* 12px - Botões */
--radius-xl: 1rem       /* 16px - Containers */
--radius-2xl: 2rem      /* 32px - Botões principais */
--radius-full: 9999px   /* Círculos perfeitos */
--radius-section: 100px /* Bordas de seções */
```

## 🌫️ Sombras

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
```

## 📱 Layout e Breakpoints

### Containers
```css
--container-sm: 640px
--container-md: 768px
--container-lg: 1024px
--container-xl: 1280px
--container-2xl: 1536px
--container-max: 1150px  /* Largura máxima do design */
```

### Alturas Específicas
```css
--navbar-height: 70px      /* Altura da navbar */
--section-padding: 60px    /* Padding padrão das seções */
```

## ⚡ Transições

```css
--transition-fast: 0.15s ease-in-out    /* Micro-interações */
--transition-normal: 0.3s ease-in-out   /* Hovers e estados */
--transition-slow: 0.5s ease-in-out     /* Animações complexas */
```

## 📚 Classes Utilitárias

### Container Personalizado
```css
.container-custom {
  width: 70%;
  max-width: var(--container-max);
  margin: 0 auto;
}
```

### Padding de Seção
```css
.section-padding {
  padding-top: var(--section-padding);
  padding-bottom: var(--section-padding);
}
```

### Botões
```css
.btn-primary {
  background-color: var(--primary);
  color: var(--bg2);
  border-radius: var(--radius-2xl);
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  transition: background-color var(--transition-normal);
}

.btn-ghost {
  border: 1px solid var(--white);
  color: var(--white);
  background-color: transparent;
  /* ... resto das propriedades */
}
```

### Seções com Background
```css
.section-primary {
  background-color: var(--primary);
  border-bottom-left-radius: var(--radius-section);
}

.section-white {
  background-color: var(--white);
  border-bottom-right-radius: var(--radius-section);
}

.section-dark {
  background-color: var(--bg2);
}
```

## 🎯 Uso no Tailwind

Os tokens são automaticamente disponibilizados no Tailwind através da configuração:

### Cores
```jsx
<div className="bg-primary text-neutral-bg2">
<div className="bg-neutral-dark-grey text-white">
```

### Espaçamentos
```jsx
<div className="p-6 m-8 space-y-4">
<div className="px-section py-section">
```

### Tipografia
```jsx
<h1 className="font-primary text-4xl font-bold">
<p className="font-primary text-base font-normal">
```

### Bordas
```jsx
<button className="rounded-2xl">
<div className="rounded-section">
```

## 📋 Mapeamento Webflow → Next.js

| Webflow Class | Next.js Equivalent | Token |
|---------------|-------------------|-------|
| `._2-0-title` | `text-4xl font-bold text-neutral-bg2` | `--text-4xl` |
| `._2-0-description` | `text-sm font-normal text-neutral-dark-grey` | `--text-sm` |
| `._2-0-button` | `btn-primary` | Custom class |
| `._2-0-section-1` | `section-primary` | Custom class |
| `.container-custom` | `container-custom` | Custom class |

## 🔧 Como Personalizar

### 1. Alterar Cores
Edite `src/styles/tokens.css`:
```css
:root {
  --primary: #your-new-color;
}
```

### 2. Adicionar Novos Tokens
```css
:root {
  --new-color: #123456;
  --new-spacing: 2.5rem;
}
```

### 3. Atualizar Tailwind
Adicione em `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      'new-color': 'var(--new-color)',
    },
    spacing: {
      'new': 'var(--new-spacing)',
    }
  }
}
```

## ✅ Validação dos Tokens

Para garantir consistência:

1. **Cores**: Teste contraste com [WebAIM](https://webaim.org/resources/contrastchecker/)
2. **Espaçamentos**: Verifique harmonia visual em diferentes telas
3. **Tipografia**: Teste legibilidade em vários dispositivos
4. **Responsividade**: Valide em breakpoints definidos

---

**Tokens extraídos e implementados com fidelidade pixel-perfect ao design original do Webflow.**
