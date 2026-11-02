// Extrait le code d'analyse d'image de index.html pour le tester dans Node (sans navigateur).
// Le code est écrit dans un module temporaire : un eval() direct serait ~50x plus lent (V8 n'optimise pas).
const fs = require('fs'), path = require('path'), os = require('os');
const html = fs.readFileSync(path.join(__dirname, '..', '..', 'index.html'), 'utf8');

function fn(name){
  const i = html.indexOf('function ' + name + '(');
  if (i < 0) throw new Error('fonction introuvable dans index.html : ' + name);
  let d = 0;
  for (let k = html.indexOf('{', i); k < html.length; k++){
    if (html[k] === '{') d++; else if (html[k] === '}'){ d--; if (!d) return html.slice(i, k + 1); }
  }
}
function block(from, to){
  const i = html.indexOf(from), j = html.indexOf(to, i);
  if (i < 0 || j < 0) throw new Error('bloc introuvable : ' + from);
  return html.slice(i, j);
}

const src = [
  fn('detectCardsAt'), fn('detectCards'), fn('autoZones'),
  'const SW = 64, SH = 8;', fn('cardSig'), fn('sigDist'),
  block('const PCOLS', 'class Aligner {'),          // profileOf, shiftError, fineError, estimateShift, ShiftAligner
  'module.exports = {detectCards, autoZones, cardSig, sigDist, profileOf, estimateShift, fineError, ShiftAligner};'
].join('\n;\n');
const tmp = path.join(os.tmpdir(), 'page-' + process.pid + '-' + Date.now() + '.js');
fs.writeFileSync(tmp, src);
module.exports = require(tmp);
fs.unlinkSync(tmp);
