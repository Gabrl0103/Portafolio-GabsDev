/**
 * Texto con grano: dibuja el texto, lo desenfoca un poco y lo convierte en puntos sueltos,
 * como tinta sobre papel. Devuelve un canvas listo para copiar o convertir en imagen.
 */
export function grain(text: string, fs: number, rgb: [number, number, number]) {
  const family = getComputedStyle(document.body).getPropertyValue("--font-outfit").trim() || "Arial Black";
  const font = `800 ${fs}px ${family}, "Arial Black", system-ui, sans-serif`;
  const m = document.createElement("canvas").getContext("2d")!;
  m.font = font;
  const w = Math.ceil(m.measureText(text).width);
  const p = Math.ceil(fs * 0.16);
  const W = w + p * 2;
  const H = Math.ceil(fs * 1.2) + p * 2;

  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d")!;
  x.font = font;
  x.fillStyle = "#000";
  x.textBaseline = "alphabetic";
  x.fillText(text, p, p + fs * 0.9);

  const b = document.createElement("canvas");
  b.width = W;
  b.height = H;
  const bx = b.getContext("2d", { willReadFrequently: true })!;
  if ("filter" in bx) bx.filter = `blur(${(fs * 0.016).toFixed(2)}px)`;
  bx.drawImage(c, 0, 0);
  if ("filter" in bx) bx.filter = "none";

  const d = bx.getImageData(0, 0, W, H);
  const a = d.data;
  for (let i = 0; i < a.length; i += 4) {
    const q = a[i + 3] / 255;
    const keep = q > 0 && Math.random() < Math.pow(q, 0.8) * 1.14;
    a[i] = rgb[0];
    a[i + 1] = rgb[1];
    a[i + 2] = rgb[2];
    a[i + 3] = keep ? 255 * (0.8 + 0.2 * Math.random()) : 0;
  }
  bx.putImageData(d, 0, 0);
  return b;
}

/** "rgb(236, 233, 226)" → [236, 233, 226] */
export function rgbOf(s: string): [number, number, number] {
  const m = (s || "").match(/\d+(\.\d+)?/g) || ["236", "233", "226"];
  return [+m[0], +m[1], +m[2]];
}
