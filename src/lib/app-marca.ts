/**
 * TEMA DO APP COM A MARCA DA BARBEARIA — as 8 cores que o dono configura no app de verdade.
 *
 * Extraído de `bestbarbers-web-cra`, branch `feat/whitelabel-app-config`,
 * `src/screens/AppWhitelabelConfig/index.jsx` (`defaultColors` + `colorsList` + `AppMockup`): é a
 * tela em que o dono troca cores, logo e fundo e vê o app mudar. Aqui fica só a parte que o site
 * precisa — o MODELO do tema e as paletas de demonstração —, sem Chakra, sem API, sem upload.
 * Quem desenha é `src/app/clube/_clube/telas.tsx` (tela `app-marca`, lida por variáveis CSS);
 * quem troca é `SimuladorApp.tsx`.
 *
 * Por que variáveis CSS: a tela é renderizada no servidor (HTML pronto, zero JS para aparecer) e
 * a troca de cor no simulador é só `style` no contêiner — instantânea, sem re-render.
 *
 * Módulo puro: roda no cliente, no servidor e no `node --test`.
 */

/** As chaves são as MESMAS do app (`colors.*` no whitelabel) — não renomear. */
export interface CoresApp {
  /** Botão «Agendar», ícones, setas, texto de destaque, aba ativa. */
  primary: string;
  /** Texto dentro do botão «Agendar». */
  secondary: string;
  /** Fundo de todas as telas. */
  background: string;
  /** Fundo dos cards de seleção. */
  component: string;
  /** Fundo alternativo de componentes. */
  backgroundComponent: string;
  /** Fundo da barra de navegação inferior. */
  backgroundBottomBar: string;
  /** Bordas e divisores. */
  border: string;
  /** Todos os textos. */
  white: string;
}

/** Os valores padrão do app (`defaultColors` do whitelabel). */
export const CORES_PADRAO_APP: CoresApp = {
  primary: "#45BBD7",
  secondary: "#111111",
  background: "#000000",
  component: "#1F1F1F",
  backgroundComponent: "#292929",
  backgroundBottomBar: "#1F1F1F",
  border: "#363D49",
  white: "#EBE9E1",
};

export interface PaletaApp {
  nome: string;
  cores: CoresApp;
}

/**
 * Paletas FICTÍCIAS de demonstração: nenhuma é de cliente real. A 1ª é a padrão do app; as outras
 * trocam só a cor principal (é o que a maioria das barbearias troca) — o resto do tema segue o app.
 */
export const PALETAS_APP: readonly PaletaApp[] = [
  { nome: "Azul", cores: CORES_PADRAO_APP },
  { nome: "Dourado", cores: { ...CORES_PADRAO_APP, primary: "#E4B53B" } },
  { nome: "Vermelho", cores: { ...CORES_PADRAO_APP, primary: "#E0524A" } },
  { nome: "Verde", cores: { ...CORES_PADRAO_APP, primary: "#3DBE7A" } },
  { nome: "Branco", cores: { ...CORES_PADRAO_APP, primary: "#F2F2F2" } },
];

const HEX = /^#[0-9a-f]{6}$/i;

export function ehHex(v: string): boolean {
  return HEX.test(v);
}

/** Luminância relativa (WCAG 2.x). */
function luminancia(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razão de contraste WCAG entre duas cores hex. */
export function contraste(a: string, b: string): number {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/**
 * Tema com a cor principal que o DONO escolheu. O texto do botão (`secondary`) vira escuro ou
 * claro, o que der mais contraste com a cor escolhida — senão um dono que escolhe azul-marinho
 * vê «Agendar» sumir dentro do próprio botão e acha que o app é feio.
 */
export function temaComPrincipal(primary: string, base: CoresApp = CORES_PADRAO_APP): CoresApp {
  if (!ehHex(primary)) return base;
  const escuro = "#111111";
  const claro = "#F5F5F5";
  const secondary = contraste(primary, escuro) >= contraste(primary, claro) ? escuro : claro;
  return { ...base, primary, secondary };
}

/** As variáveis CSS que a tela `app-marca` lê (`--app-<chave>`). */
export function variaveisDoTema(cores: CoresApp): Record<string, string> {
  return Object.fromEntries(Object.entries(cores).map(([k, v]) => [`--app-${k}`, v]));
}
