import runWithFps from 'run-with-fps';
import { Vector } from 'v-for-vector';
import lerp from '@sunify/lerp-color';
import SimplexNoise from 'simplex-noise';
import hexRgb from 'hex-rgb';
import eases from 'eases';

import Point from './point';
import { PIXEL_RATIO, POINTS_TTL } from './constants';
import renderPoints, { colors } from './renderPoints';

const width = window.innerWidth;
const height = window.innerHeight;

const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
canvas.width = width;
canvas.height = height;
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';

document.documentElement.style.setProperty('--primary', colors.primary);
document.documentElement.style.setProperty(
  '--primary-fade',
  `${colors.primary}AA`
);
document.documentElement.style.setProperty(
  '--secondary',
  lerp(colors.secondary, '#FFF', 0.6)
);

const content = document.querySelector('.content');
const overlay = document.querySelector('.projects-overlay');
document.addEventListener('click', e => {
  if (e.target.classList && e.target.classList.contains('projects-toggle')) {
    document.body.classList.toggle('st-show-projects');

    if (document.body.classList.contains('st-show-projects')) {
      overlay.setAttribute('tabindex', '0');
      content.setAttribute('tabindex', '-1');
      overlay.focus();
    } else {
      overlay.setAttribute('tabindex', '-1');
      content.setAttribute('tabindex', '0');
      content.focus();
    }
  }
});

document.addEventListener('keyup', e => {
  if (e.keyCode === 27) {
    document.body.classList.remove('st-show-projects');
  }
});

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

const points = [];
const center = Vector.cartesian(width / 2, height / 2);
const noise = new SimplexNoise(Math.random);
const colorMap = memlerp(
  ['#b1d6f8', '#8569e0', '#ec79cb', '#fdedb2', '#3e36e2', '#344477'],
  30
);
const sizeX = width;
const sizeY = height;
const drawNoise = () => {
  const data = ctx.getImageData(0, 0, sizeX, sizeY);
  for (let x = 0; x < sizeX; x += 1) {
    for (let y = 0; y < sizeY; y += 1) {
      const i = y * sizeX + x;
      const n = (noise.noise2D(x / 2000, y / 2000) + 1) / 2;
      const color = colorMap(eases.cubicOut(n));
      data.data[i * 4] = color[0];
      data.data[i * 4 + 1] = color[1];
      data.data[i * 4 + 2] = color[2];
      data.data[i * 4 + 3] = color[3] * 255;
    }
  }
  ctx.putImageData(data, 0, 0);
};

drawNoise();
const draw = () => {
  // points.forEach((p, i, source) => {
  //   if (!(Date.now() - p.time < POINTS_TTL)) {
  //     source.splice(i, 1);
  //   }
  // });
  // const angle = Math.PI * 2 * Math.random();
  // points.push(
  //   new Point(
  //     Vector.polar(angle, 2).add(center),
  //     Vector.polar(angle, 2 * Math.random()),
  //     Vector.polar(angle, 0.1)
  //   )
  // );
  // renderPoints(points, ctx, width, height);
};

const stop = runWithFps(draw, 0);

// Handle hot module replacement
if (module.hot) {
  module.hot.dispose(() => {
    if (stop) {
      stop();
    }
  });
}
