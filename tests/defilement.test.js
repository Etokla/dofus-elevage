// Simulation d'un relevé complet : une bande verticale réelle (toute la liste, recollée) est parcourue par une fenêtre
// de 13 cartes, avec défilement irrégulier, retours en arrière, bruit, surbrillance au survol et curseur.
// Long (≈ 1 min par cas) : lancé par `npm run test:long`.
const test = require('node:test'), assert = require('node:assert'), path = require('path');
const P = require('./lib/page'), {loadPNG, gray} = require('./lib/img');

// Marge de fond sombre au-dessus et en dessous de la liste, comme dans la vraie zone (sinon la 1re carte touche le bord)
function pad(strip, n = 24){
  const {w, h, g} = strip, out = new Float32Array(w * (h + 2 * n));
  let gy = 0, gm = Infinity;   // ligne la plus sombre des premières cartes = séparation entre cartes
  for (let y = 0; y < Math.min(h, 120); y++){ let m = 0; for (let x = 0; x < w; x++) m += g[y*w + x]; if (m < gm){ gm = m; gy = y; } }
  for (let y = 0; y < n; y++){ out.set(g.subarray(gy*w, gy*w + w), y*w); out.set(g.subarray(gy*w, gy*w + w), (h + n + y)*w); }
  out.set(g, n * w);
  return {w, h: h + 2 * n, g: out};
}
function simulate(strip0, {seed = 1, hover = 12, inject = 0} = {}){
  const strip = pad(strip0), {w: W, h: HS, g: S0} = strip, H = 13 * 66 + 20;
  let s = seed; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const gauss = () => { const u = rnd() || 1e-9, v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const A = new P.ShiftAligner(); let pos = 0, nf = 0, gaps = 0;
  for (;;){
    const g = new Float32Array(W * H); g.set(S0.subarray(pos * W, (pos + H) * W));
    { const k = Math.floor((pos + rnd() * H) / 66), y = k * 66 - pos;            // surbrillance d'une carte au hasard
      for (let yy = Math.max(0, y); yy < Math.min(H, y + 54); yy++) for (let x = 0; x < W; x++) g[yy*W + x] += hover; }
    for (let i = 0; i < g.length; i += 7) g[i] += gauss() * 2.5;                  // bruit de compression
    if (rnd() < 0.6){ const cy = Math.floor(rnd() * (H - 24)), cx = Math.floor(rnd() * (W - 20));   // curseur
      for (let y = cy; y < cy + 22; y++) for (let x = cx; x < cx + 14; x++) g[y*W + x] = 255; }
    const img = {w: W, h: H, g};
    const S = P.detectCards(img).cards.map(([y0, y1]) => ({y0, y1, sig: P.cardSig(img, y0, y1)}));
    if (inject && nf % inject === inject - 1 && A.pitch) A.offset += (nf % 2 ? -1 : 1) * A.pitch;   // erreur de mesure forcée
    if (A.add(img, S) === 'gap') gaps++; nf++;
    if (pos + H >= HS) break;
    let step = Math.round(Math.min(45, Math.max(0, 18 + 10 * gauss())));
    if (rnd() < 0.03) step = -Math.floor(20 + rnd() * 100); if (rnd() < 0.3) step = 0;
    pos = Math.max(0, Math.min(HS - H, pos + step));   // la fenêtre peut atteindre le bas exact de la liste
  }
  return {cards: A.cards.size, missing: A.missing().length, gaps};
}
// Écart entre cartes non entier (Windows à 125 %) : la bande Mac rééchantillonnée verticalement
function stretch(strip, f){
  const {w, h, g} = strip, h2 = Math.floor(h * f), out = new Float32Array(w * h2);
  for (let y = 0; y < h2; y++){ const t = y / f, y0 = Math.floor(t), a = t - y0, y1 = Math.min(h - 1, y0 + 1);
    for (let x = 0; x < w; x++) out[y*w + x] = g[y0*w + x] * (1 - a) + g[y1*w + x] * a; }
  return {w, h: h2, g: out};
}
const mac = gray(loadPNG(path.join(__dirname, 'fixtures', 'strip-mac-440.png')));
const pc = gray(loadPNG(path.join(__dirname, 'fixtures', 'strip-pc-492.png')));

test('Mac 440 : surbrillance faible', () => { const r = simulate(mac, {seed: 2}); assert.deepStrictEqual([r.cards, r.missing, r.gaps], [440, 0, 0]); });
test('Mac 440 : surbrillance forte', () => { const r = simulate(mac, {seed: 4, hover: 30}); assert.deepStrictEqual([r.cards, r.missing, r.gaps], [440, 0, 0]); });
test('Mac 440 : écart non entier (pas de perte silencieuse)', () => { const r = simulate(stretch(mac, 0.9925), {seed: 2}); assert.deepStrictEqual([r.cards, r.missing], [440, 0]); });
test('PC 492', () => { const r = simulate(pc, {seed: 2}); assert.deepStrictEqual([r.cards, r.missing], [492, 0]); assert.ok(r.gaps <= 3); });
test('PC 492 : erreurs de mesure forcées rattrapées', () => { const r = simulate(pc, {seed: 2, inject: 97}); assert.strictEqual(r.missing, 0); assert.ok(Math.abs(r.cards - 492) <= 1, `cartes ${r.cards}`); });
