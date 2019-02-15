import lerp from '@sunify/lerp-color';
import SimplexNoise from 'simplex-noise';
import eases from 'eases';
import hexRgb from 'hex-rgb';

const isStatic = self.document !== undefined;

export const noise = new SimplexNoise(Math.random);
export const palette = ['#b1d6f8', '#8569e0', '#ec79cb', '#fdedb2', '#3e36e2'];
export const colorMap = memlerp(palette, isStatic ? 50 : 2000);

function memlerp(colors, steps = 10) {
  const cache = {};
  return t => {
    const step = Math.floor(t / (1 / steps));
    cache[step] =
      cache[step] ||
      hexRgb(lerp(...colors, t), {
        format: 'array'
      });
    return cache[step];
  };
}

let t = 0;

const drawNoise = (canvas, ctx) => {
  const sizeX = canvas.width;
  const sizeY = canvas.height;
  t += 0.004;
  canvas.width = canvas.width;
  const data = ctx.getImageData(0, 0, sizeX, sizeY);
  for (let x = 0; x < sizeX; x += 1) {
    for (let y = 0; y < sizeY; y += 1) {
      const i = y * sizeX + x;
      const n = (noise.noise3D(x / sizeX / 4, y / sizeY / 4, t) + 1) / 2;
      // if (Math.round(n * 200) % 10 === 0) {
      const color = colorMap(eases.cubicOut(n));
      data.data[i * 4] = color[0];
      data.data[i * 4 + 1] = color[1];
      data.data[i * 4 + 2] = color[2];
      if (isStatic) {
        data.data[i * 4 + 3] = 240 + Math.random() * 15;
      } else {
        data.data[i * 4 + 3] = 255;
      }
      // }
    }
  }
  ctx.putImageData(data, 0, 0);
};

export default drawNoise;
