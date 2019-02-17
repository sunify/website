import runWithFps from 'run-with-fps';
import drawNoise, { palette } from './drawNoise';
import { PIXEL_RATIO } from './constants';

const width = window.innerWidth;
const height = window.innerHeight;

const bg = document.querySelector('.bg');
const canvas = document.getElementById('bg');
canvas.width = width * PIXEL_RATIO;
canvas.height = height * PIXEL_RATIO;
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';

// document.documentElement.style.setProperty('--primary', colors.primary);
// document.documentElement.style.setProperty(
//   '--primary-fade',
//   `${colors.primary}AA`
// );
// document.documentElement.style.setProperty(
//   '--secondary',
//   lerp(colors.secondary, '#FFF', 0.6)
// );

bg.style.backgroundColor =
  palette[Math.round(Math.random() * (palette.length - 1))];

if ('OffscreenCanvas' in window) {
  const offscr = canvas.transferControlToOffscreen();
  const worker = new Worker('canvas-worker.js');
  worker.postMessage({ canvas: offscr }, [offscr]);
  canvas.style.opacity = 1;
} else {
  setTimeout(() => {
    const ctx = canvas.getContext('2d');
    drawNoise(canvas, ctx);
    setTimeout(() => {
      canvas.style.opacity = 1;
    });
  }, 10);
}

// Handle hot module replacement
if (module.hot) {
  module.hot.dispose(() => {});
}
