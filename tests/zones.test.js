// Détection automatique de la liste ETABLE et du panneau FILTRES sur des captures réelles
const test = require('node:test'), assert = require('node:assert'), path = require('path');
const P = require('./lib/page'), {loadPNG, gray} = require('./lib/img');
const F = f => path.join(__dirname, 'fixtures', f);

const cas = [
  // [image, zone de l'image à analyser (aperçu dans la page), montures visibles attendues]
  ['elevage-petit.png', null, 13],                                // petite fenêtre, liste complète
  ['mac-liste-apercu.png', [153, 129, 1901, 1190], 11],           // aperçu Mac avec cadres dessinés et infobulle par-dessus
  ['mac-reproducteurs.png', null, 5],                             // filtre Reproducteur : liste courte + liste Enclos plus longue à côté
  ['mac-reproducteurs-apercu.png', [243, 525, 2000, 1250], 5],    // idem, petite échelle
];
for (const [f, crop, n] of cas){
  test(`zones : ${f}`, () => {
    const r = P.autoZones(gray(loadPNG(F(f)), crop), P.detectCards);
    assert.ok(r.list, 'liste trouvée');
    assert.ok(r.cnt, 'panneau FILTRES trouvé');
    assert.strictEqual(r.nCards, n, 'montures visibles');
  });
}
