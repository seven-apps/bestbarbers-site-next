/**
 * A marca do Spotify (o ícone circular com as três ondas), desenhada inline.
 *
 * POR QUE INLINE: não existe nenhum ativo do Spotify em public/ — a única imagem
 * de podcast do projeto é a capa da temporada. Um SVG inline evita mais uma
 * requisição, entra no bundle uma vez só e escala sem borrar em tela 3×.
 *
 * REGRA DA MARCA (guia oficial do Spotify): o ícone não pode ser distorcido nem
 * recolorido fora da paleta. Por isso o `viewBox` é quadrado e o componente não
 * aceita `width`/`height` separados — só uma classe de tamanho — e a cor padrão é
 * o verde oficial #1DB954. Fundo claro ou escuro, o verde é o mesmo.
 *
 * ACESSIBILIDADE: o ícone é sempre `aria-hidden`. Quem dá nome ao alvo é o
 * `aria-label` do link/botão que o contém — ícone sozinho, sem rótulo acessível,
 * é regressão, não refinamento.
 */

export const SPOTIFY_GREEN = "#1DB954";

interface SpotifyGlyphProps {
  /** Classes de tamanho e cor. O padrão pinta com o verde oficial. */
  className?: string;
}

export function SpotifyGlyph({ className = "h-5 w-5" }: SpotifyGlyphProps) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}
