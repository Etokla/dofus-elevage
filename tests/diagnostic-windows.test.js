// Rejoue un vrai « Diagnostic 2 s » Windows (60 images, défilement à la molette, souris sur la liste, échelle 125 %)
// Régressions couvertes : bips dès le début du défilement (cartes décalées d'1 px entre elles) et surbrillance au survol.
const test = require('node:test'), assert = require('node:assert'), path = require('path');
const P = require('./lib/page'), {loadPNG, gray} = require('./lib/img');

test('diagnostic Windows : 60 images sans alerte', () => {
  const im = loadPNG(path.join(__dirname, 'fixtures', 'diag-windows-60.png'));
  // grille de la page : 10 colonnes, case = (W + 4) × (H + 18 + 4), étiquette jaune de 18 px au-dessus de chaque image
  const W = Math.round(im.w / 10) - 4, H = Math.round(im.h / 6) - 22;
  const A = new P.ShiftAligner(); let kh = 0, gaps = 0;
  for (let i = 0; i < 60; i++){
    const x = (i % 10) * (W + 4), y = Math.floor(i / 10) * (H + 22) + 18;
    const img = gray(im, [x, y, x + W, y + H]);
    const det = P.detectCards(img, kh); if (!kh && det.cards.length >= 5) kh = det.cardH;
    const S = det.cards.map(([y0, y1]) => ({y0, y1, sig: P.cardSig(img, y0, y1)}));
    if (A.add(img, S) === 'gap') gaps++;
  }
  assert.strictEqual(gaps, 0, 'aucun bip');
  assert.strictEqual(A.cards.size, 14, '12 montures visibles + 2 révélées par le défilement');
});
