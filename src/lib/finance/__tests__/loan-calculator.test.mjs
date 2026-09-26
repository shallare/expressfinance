/**
 * Tests du moteur de calcul — exécutables sans dépendance :
 *   node --test src/lib/finance/__tests__/
 * (les fonctions sont ré-implémentées en miroir pour rester indépendantes du
 *  bundler ; le fichier TypeScript source est la référence).
 */
import test from 'node:test';
import assert from 'node:assert/strict';

const round2 = (v) => Math.round((v + Number.EPSILON) * 100) / 100;

function amortizing(P, n, annualPercent) {
  const r = annualPercent / 100 / 12;
  const pay = round2(r === 0 ? P / n : (P * r) / (1 - Math.pow(1 + r, -n)));
  let bal = P;
  let totalInterest = 0;
  const rows = [];
  for (let i = 1; i <= n; i += 1) {
    const it = round2(bal * r);
    let pp = round2(pay - it);
    if (i === n) pp = round2(bal);
    bal = round2(bal - pp);
    totalInterest = round2(totalInterest + it);
    rows.push({ pp, it, bal });
  }
  return { pay, totalInterest, rows };
}

function penalty({ installment, daysLate, grace, fixed, percent, rate }) {
  const penalized = Math.max(0, daysLate - grace);
  if (penalized === 0) return 0;
  return round2(fixed + (installment * percent) / 100 + (installment * rate * penalized) / 100 / 365);
}

test('30 000 € sur 24 mois à 2 %/an : mensualité 1 276,21 €', () => {
  const r = amortizing(30_000, 24, 2);
  assert.equal(r.pay, 1276.21);
  assert.equal(r.totalInterest, 628.97);
  assert.equal(r.rows.at(-1).bal, 0);
  assert.equal(round2(r.rows.reduce((s, x) => s + x.pp, 0)), 30_000);
});

test('taux nul : mensualité = capital / durée', () => {
  const r = amortizing(12_000, 12, 0);
  assert.equal(r.pay, 1000);
  assert.equal(r.totalInterest, 0);
});

test('le capital restant dû décroît strictement et finit à zéro', () => {
  const r = amortizing(800_000, 240, 2);
  for (let i = 1; i < r.rows.length; i += 1) assert.ok(r.rows[i].bal < r.rows[i - 1].bal);
  assert.equal(r.rows.at(-1).bal, 0);
});

test('pénalités : aucune dans le délai de grâce', () => {
  assert.equal(penalty({ installment: 500, daysLate: 5, grace: 10, fixed: 20, percent: 5, rate: 8 }), 0);
});

test('pénalités : frais fixes + % + intérêts prorata temporis', () => {
  // 500 € d'échéance, 40 jours de retard, 10 de grâce → 30 jours pénalisés
  // 20 + 500×5 % + 500×8 %×30/365 = 20 + 25 + 3,29 = 48,29
  assert.equal(penalty({ installment: 500, daysLate: 40, grace: 10, fixed: 20, percent: 5, rate: 8 }), 48.29);
});
