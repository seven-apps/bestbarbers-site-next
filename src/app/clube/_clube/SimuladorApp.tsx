"use client";

/**
 * SIMULADOR DO APP COM A MARCA — a versão de página da tela de configuração do whitelabel
 * (bestbarbers-web-cra, `feat/whitelabel-app-config`): o dono troca a cor, põe a PRÓPRIA logo e
 * liga ou desliga a foto de fundo, e o app do cliente muda na hora.
 *
 * Do whitelabel veio o modelo (as 8 cores, os padrões, o que cada cor pinta) e o desenho da tela;
 * daqui saiu tudo o que é do painel (API, salvar, cores avançadas, background do login). Para o
 * dono que chegou pelo anúncio, basta o que ele reconhece em 5 segundos: a cor e a logo dele.
 *
 * PRIVACIDADE: a logo enviada vira um `blob:` local (URL.createObjectURL) e nunca sai do aparelho —
 * não há upload, e o texto embaixo do botão diz isso.
 *
 * A tela em si é server component (`telas.tsx`, tela `app-marca`); aqui só se trocam variáveis CSS
 * e dois atributos no contêiner, então o app muda sem re-render da tela.
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { PALETAS_APP, contraste, temaComPrincipal, variaveisDoTema } from "@/lib/app-marca";
import { usePcEventos } from "../../projeto-do-clube/_components/pc-eventos";
import type { PcPaginaConfig } from "../../projeto-do-clube/_components/pc.types";
import s from "./simulador.module.css";

export function SimuladorApp({ config, children }: { config: PcPaginaConfig; children: ReactNode }) {
  const eventos = usePcEventos(config);
  const [cor, setCor] = useState(PALETAS_APP[0].cores.primary);
  const [logo, setLogo] = useState<string | null>(null);
  const [comFoto, setComFoto] = useState(true);
  const arquivo = useRef<HTMLInputElement>(null);

  // Solta o blob da logo anterior (e o último, ao sair da página).
  useEffect(() => () => { if (logo) URL.revokeObjectURL(logo); }, [logo]);

  const usou = () => eventos.appSimulado();
  const tema = temaComPrincipal(cor);
  // Cor principal que some no fundo do app: é o que o app real mostraria com essa escolha, então a
  // tela não mascara — mas avisa, senão o dono conclui que o app é feio e não que a cor é escura.
  const someNoFundo = contraste(tema.primary, tema.background) < 3;
  const estilo = {
    ...variaveisDoTema(tema),
    ...(logo ? { "--app-logo": `url("${logo}")` } : {}),
    ...(comFoto ? {} : { "--app-foto": "none" }),
  } as CSSProperties;

  return (
    <div className={s.simulador}>
      <div style={estilo} data-com-logo={logo ? "" : undefined} className={s.palco}>
        {children}
      </div>

      <div className={s.controles}>
        <p className={s.rotulo}>Veja o app com a cor da sua barbearia</p>
        <div role="radiogroup" aria-label="Cor principal do app" className={s.cores}>
          {PALETAS_APP.map((p) => (
            <button
              key={p.nome}
              type="button"
              role="radio"
              aria-checked={cor === p.cores.primary}
              aria-label={p.nome}
              className={s.cor}
              style={{ background: p.cores.primary }}
              onClick={() => { setCor(p.cores.primary); usou(); }}
            />
          ))}
          <label className={`${s.cor} ${s.corLivre}`} aria-label="Outra cor">
            <input
              type="color"
              value={cor}
              onChange={(ev) => { setCor(ev.target.value); usou(); }}
            />
          </label>
        </div>

        {someNoFundo ? (
          <p className={s.aviso} role="status">
            Essa cor fica escura sobre o fundo preto. No app você também escolhe a cor do fundo e dos cartões.
          </p>
        ) : null}

        <div className={s.linha}>
          <button type="button" className={s.botao} onClick={() => arquivo.current?.click()}>
            {logo ? "Trocar a logo" : "Testar com a minha logo"}
          </button>
          {logo ? (
            <button type="button" className={s.link} onClick={() => setLogo(null)}>
              Tirar
            </button>
          ) : null}
          <input
            ref={arquivo}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            hidden
            onChange={(ev) => {
              const f = ev.target.files?.[0];
              if (f) { setLogo(URL.createObjectURL(f)); usou(); }
              ev.target.value = "";
            }}
          />
        </div>
        <p className={s.nota}>A imagem fica só no seu celular: nada é enviado.</p>

        <label className={s.alternar}>
          <input type="checkbox" checked={comFoto} onChange={(ev) => { setComFoto(ev.target.checked); usou(); }} />
          Foto de fundo na tela inicial
        </label>
      </div>
    </div>
  );
}
