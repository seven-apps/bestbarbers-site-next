import { useEffect, useState } from 'react';
import {
  COOKIE_AB_FORM,
  DIAS_COOKIE_AB_FORM,
  PARAM_FORM,
  bracoDoForm,
  bracoFormForcado,
  lerCookie,
  type BracoForm,
} from '@/lib/form-progressivo';

/**
 * Braço do visitante no teste do formulário (`lib/form-progressivo.ts`).
 *
 * Resolvido no CLIENTE, depois de montar: o formulário só existe quando o modal abre, então
 * não há nada no HTML do servidor para divergir, e a página continua em cache estático.
 * `null` até resolver — quem abrir o modal nesse intervalo vê o formulário atual, fora do teste.
 *
 * `?form=atual|progressivo` força o braço para revisão e NÃO grava cookie: quem revisa não
 * pode ficar preso num braço nem entrar na conta do sorteio.
 */
export function useBracoForm(): BracoForm | null {
  const [braco, setBraco] = useState<BracoForm | null>(null);

  useEffect(() => {
    const forcado = bracoFormForcado(new URLSearchParams(window.location.search).get(PARAM_FORM));
    if (forcado) {
      setBraco(forcado);
      return;
    }
    let cookie: string | undefined;
    try {
      cookie = lerCookie(document.cookie, COOKIE_AB_FORM);
    } catch {
      cookie = undefined;
    }
    const sorteado = bracoDoForm(cookie, Math.random());
    try {
      document.cookie = `${COOKIE_AB_FORM}=${sorteado}; max-age=${DIAS_COOKIE_AB_FORM * 86400}; path=/; samesite=lax`;
    } catch {
      // Cookie bloqueado: o braço vale para esta visita, e o card registra o que a pessoa viu.
    }
    setBraco(sorteado);
  }, []);

  return braco;
}
