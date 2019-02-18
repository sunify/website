import drawNoise from './drawNoise';

self.onmessage = function({ data: { canvas } }) {
  const ctx = canvas.getContext('2d');
  drawNoise(canvas, ctx);
};
