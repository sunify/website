import lerp from '@sunify/lerp-color';
import SimplexNoise from 'simplex-noise';
import eases from 'eases';
import hexRgb from 'hex-rgb';
import tooloud from 'tooloud';

const fractalCallback = (x, y, z) => {
  return (1 + noise.noise3D(x, y, z)) / 2;
};

const isStatic = self.document !== undefined;
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export const noise = new SimplexNoise(Math.random);
export const palette = ['#b1d6f8', '#8569e0', '#ec79cb', '#fdedb2', '#3e36e2'];
export const colorMap = memlerp(palette, 20);

function memlerp(colors, steps = 10) {
  const cache = {};
  return t => {
    const stepSize = 1 / steps;
    const step = Math.floor(t / stepSize);
    cache[step] =
      cache[step] ||
      hexRgb(lerp(...colors, (step + 0.5) * stepSize), {
        format: 'array'
      });
    return cache[step];
  };
}

let t = 0;

const drawNoise = (canvas, ctx) => {
  const sizeX = canvas.width;
  const sizeY = canvas.height;
  t += 0.001;
  canvas.width = canvas.width;
  const imgData = ctx.getImageData(0, 0, sizeX, sizeY);
  const buf = new ArrayBuffer(imgData.data.length);
  const buf8 = new Uint8ClampedArray(buf);
  const bufData = new Uint32Array(buf);

  const setColor = (i, [r, g, b, a]) => {
    // imgData.data[i * 4] = r;
    // imgData.data[i * 4 + 1] = g;
    // imgData.data[i * 4 + 2] = b;
    // imgData.data[i * 4 + 3] = a;
    bufData[i] =
      (a << 24) | // alpha
      (b << 16) | // blue
      (g << 8) | // green
      r; // red
  };

  const scale = Math.max(sizeX, sizeY) * 1.5;
  for (let x = 0; x < imgData.width; x += 1) {
    for (let y = 0; y < imgData.height; y += 1) {
      const i = y * sizeX + x;
      // const n = tooloud.Fractal.noise(
      //   x / scale,
      //   y / scale,
      //   t,
      //   3,
      //   fractalCallback
      // );
      const n = (noise.noise3D(x / scale, y / scale, t) + 1) / 2;
      const color = colorMap(eases.cubicOut(n));
      setColor(i, [...color.slice(0, 3), 255]);

      // if (Math.round(n * 100) % 25 === 0) {
      //   setColor(i, [255, 255, 0, 235 + 20 * Math.random()]);
      // } else if (Math.round(n * 350) % 40 === 0) {
      //   setColor(i, [66, 255, 137, 235 + 20 * Math.random()]);
      // }
    }
  }

  imgData.data.set(buf8);
  ctx.putImageData(imgData, 0, 0);
};

export default drawNoise;
