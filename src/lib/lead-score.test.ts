import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as modulo from './lead-score.ts';
const {
  calcularScoreV2,
  interesseLegado,
  faturamentoLegado,
  profissionaisLegado,
  CLUBE_OPCOES,
  FATURAMENTO_OPCOES,
  PROFISSIONAIS_OPCOES,
  SISTEMA_OPCOES,
  CORTE_ICP,
  temEquipe,
  EQUIPE_POR_OPCAO,
} = modulo as typeof import('./lead-score');

const QUER_CLUBE = CLUBE_OPCOES[2];

test('cenário supremo vale 100', () => {
  assert.equal(
    calcularScoreV2({ faturamento: 'Acima de R$ 30.000', clube: QUER_CLUBE, profissionais: '5 ou mais profissionais', sistema: 'AppBarber' }),
    100,
  );
});

test('o combo mínimo que o André descreveu vale 80 e é ICP', () => {
  const s = calcularScoreV2({ faturamento: 'De R$ 10.001 a R$ 30.000', clube: QUER_CLUBE, profissionais: '2 profissionais', sistema: 'Trinks' });
  assert.equal(s, 80);
  assert.ok(s !== null && s >= CORTE_ICP);
});

test('ninguém abaixo de R$ 10 mil chega ao ICP', () => {
  for (const faturamento of ['Até R$ 2.000', 'De R$ 2.001 a R$ 5.000', 'De R$ 5.001 a R$ 10.000'] as const) {
    for (const clube of CLUBE_OPCOES) {
      for (const profissionais of PROFISSIONAIS_OPCOES) {
        for (const sistema of SISTEMA_OPCOES) {
          const s = calcularScoreV2({ faturamento, clube, profissionais, sistema });
          assert.ok(s !== null && s < CORTE_ICP, `${faturamento} · ${profissionais} · ${sistema} deu ${s}`);
        }
      }
    }
  }
});

test('até R$ 2.000 é veto em qualquer combinação', () => {
  for (const clube of CLUBE_OPCOES) {
    for (const profissionais of PROFISSIONAIS_OPCOES) {
      const s = calcularScoreV2({ faturamento: 'Até R$ 2.000', clube, profissionais, sistema: 'Booksy' });
      assert.ok(s !== null && s < 0);
    }
  }
});

test('sem faturamento, clube ou profissionais o score é null, nunca 0', () => {
  assert.equal(calcularScoreV2({ clube: QUER_CLUBE, profissionais: '2 profissionais' }), null);
  assert.equal(calcularScoreV2({ faturamento: 'Acima de R$ 30.000', profissionais: '2 profissionais' }), null);
  assert.equal(calcularScoreV2({ faturamento: 'Acima de R$ 30.000', clube: QUER_CLUBE }), null);
});

test('sistema só desempata: soma 5 e nunca muda a faixa sozinho', () => {
  for (const faturamento of FATURAMENTO_OPCOES) {
    for (const clube of CLUBE_OPCOES) {
      for (const profissionais of PROFISSIONAIS_OPCOES) {
        const sem = calcularScoreV2({ faturamento, clube, profissionais, sistema: 'Não utilizo nenhum' })!;
        const com = calcularScoreV2({ faturamento, clube, profissionais, sistema: 'Fresha' })!;
        assert.ok(com - sem === 5 || sem === -100);
      }
    }
  }
});

test('as três respostas positivas de clube valem o mesmo', () => {
  const base = { faturamento: 'De R$ 10.001 a R$ 30.000', profissionais: '3 a 4 profissionais' } as const;
  const [a, b, c] = [CLUBE_OPCOES[0], CLUBE_OPCOES[1], CLUBE_OPCOES[2]].map((clube) => calcularScoreV2({ ...base, clube }));
  assert.equal(a, b);
  assert.equal(b, c);
});

test('"quero entender melhor" e "nenhum interesse" valem o mesmo hoje', () => {
  const base = { faturamento: 'De R$ 10.001 a R$ 30.000', profissionais: '3 a 4 profissionais' } as const;
  assert.equal(calcularScoreV2({ ...base, clube: CLUBE_OPCOES[3] }), calcularScoreV2({ ...base, clube: CLUBE_OPCOES[4] }));
});

test('todas as notas de 60 a 100 existem, de 5 em 5', () => {
  const notas = new Set<number>();
  for (const faturamento of FATURAMENTO_OPCOES) {
    for (const clube of CLUBE_OPCOES) {
      for (const profissionais of PROFISSIONAIS_OPCOES) {
        for (const sistema of SISTEMA_OPCOES) {
          const s = calcularScoreV2({ faturamento, clube, profissionais, sistema });
          if (s !== null && s >= 60) notas.add(s);
        }
      }
    }
  }
  assert.deepEqual([...notas].sort((x, y) => x - y), [60, 65, 70, 75, 80, 85, 90, 95, 100]);
});

test('tradução para os textos legados', () => {
  assert.equal(interesseLegado(CLUBE_OPCOES[0]), 'Meu Próprio App + Clube de Assinaturas e emissão de NFs');
  assert.equal(interesseLegado(CLUBE_OPCOES[3]), 'Agenda e Controle Financeiro');
  assert.equal(faturamentoLegado('De R$ 5.001 a R$ 10.000'), 'R$ 2.000 a R$ 10.000');
  assert.equal(profissionaisLegado('3 a 4 profissionais'), '2 a 4 colaboradores');
});

// ————— temEquipe: a variável que o A/B de set/26 compra (evento `LeadComEquipe`) —————

test('temEquipe: só "Sou apenas eu" é false entre as opções vivas do formulário', () => {
  assert.equal(temEquipe('Sou apenas eu'), false);
  for (const p of PROFISSIONAIS_OPCOES.filter((o) => o !== 'Sou apenas eu')) {
    assert.equal(temEquipe(p), true, p);
  }
});

test('temEquipe: toda opção do formulário tem decisão explícita (Record exaustivo)', () => {
  // Se uma quinta opção entrar em PROFISSIONAIS_OPCOES, o compilador cobra a entrada no
  // Record — e este teste cobra que ninguém a acrescente só no select. É o gate que a
  // negação `!== 'Sou apenas eu'` não teria: lá a opção nova viraria "equipe" em silêncio.
  assert.deepEqual(Object.keys(EQUIPE_POR_OPCAO).sort(), [...PROFISSIONAIS_OPCOES].sort());
});

test('temEquipe: campo vazio NÃO é equipe — ausência de resposta nunca vira valor', () => {
  // A regra é a mesma que calcularScoreV2 aplica devolvendo null em vez de 0. Com uma
  // negação simples, '' !== 'Sou apenas eu' daria TRUE e o evento que existe para separar
  // quem tem equipe dispararia justamente para quem não respondeu.
  assert.equal(temEquipe(''), false);
  assert.equal(temEquipe('   '), false);
  assert.equal(temEquipe(undefined), false);
});

test('temEquipe: vocabulário legado e número livre não viram equipe por acidente', () => {
  // Os três vocabulários convivem HOJE no mesmo useLeadForm: FormSectionV11 manda
  // "2 a 4 colaboradores", FormSectionV5/MultiStepForm mandam número livre ("4"). São os
  // mesmos valores que calcularScoreV2 já recusa pontuar (score null) — coerência, não
  // rigidez: nas LPs legadas o evento simplesmente não nasce, como o QualifiedLead60.
  for (const legado of ['2 a 4 colaboradores', '5 ou mais colaboradores', '4', '2', 'sou apenas eu']) {
    assert.equal(temEquipe(legado), false, legado);
    assert.equal(calcularScoreV2({ faturamento: 'Acima de R$ 30.000', clube: QUER_CLUBE, profissionais: legado }), null, legado);
  }
});

test('temEquipe: chave herdada de Object.prototype não vira equipe', () => {
  // Com `p in EQUIPE_POR_OPCAO`, 'constructor'/'toString' passariam e a função herdada
  // (truthy!) seria devolvida como se fosse `true` — a assinatura diz boolean e o runtime
  // devolve outra coisa. Daí `Object.hasOwn`. Exótico, mas o helper existe justamente
  // para prometer que desconhecido nunca dispara o evento.
  for (const herdada of ['constructor', 'toString', 'valueOf', 'hasOwnProperty', '__proto__']) {
    assert.equal(temEquipe(herdada), false, herdada);
  }
});
