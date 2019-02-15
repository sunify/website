import drawNoise, { palette } from './drawNoise';
import { PIXEL_RATIO } from './constants';

const width = window.innerWidth;
const height = window.innerHeight;

const canvas = document.getElementById('bg');
const isStatic = !('OffscreenCanvas' in window);
canvas.width = isStatic ? width * PIXEL_RATIO : width;
canvas.height = isStatic ? height * PIXEL_RATIO : width;
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';
console.log(isStatic, canvas.width, width);

// document.documentElement.style.setProperty('--primary', colors.primary);
// document.documentElement.style.setProperty(
//   '--primary-fade',
//   `${colors.primary}AA`
// );
// document.documentElement.style.setProperty(
//   '--secondary',
//   lerp(colors.secondary, '#FFF', 0.6)
// );

canvas.style.backgroundColor =
  palette[Math.round(Math.random() * (palette.length - 1))];

if (!isStatic) {
  const offscr = canvas.transferControlToOffscreen();
  const worker = new Worker('canvas-worker.js');
  worker.postMessage({ canvas: offscr }, [offscr]);
} else {
  setTimeout(() => {
    drawNoise(canvas, canvas.getContext('2d'));
  });
}

// Handle hot module replacement
if (module.hot) {
  module.hot.dispose(() => {});
}
