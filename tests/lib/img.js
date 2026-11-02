// Lecture des images de test (PNG) en niveaux de gris, au même format que toGray() de la page : {w, h, g: Float32Array}
const fs = require('fs'), {PNG} = require('pngjs');
function loadPNG(file){ const p = PNG.sync.read(fs.readFileSync(file)); return {w: p.width, h: p.height, data: p.data}; }
// Gris comme la page (moyenne R, V, B) ; crop = [x0, y0, x1, y1] optionnel
function gray(im, crop){
  const [x0, y0, x1, y1] = crop || [0, 0, im.w, im.h], w = x1 - x0, h = y1 - y0, g = new Float32Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++){
    const p = ((y0 + y) * im.w + x0 + x) * 4; g[y*w + x] = (im.data[p] + im.data[p+1] + im.data[p+2]) / 3;
  }
  return {w, h, g};
}
module.exports = {loadPNG, gray};
