import runWithFps from 'run-with-fps';
import drawNoise from './drawNoise';

self.onmessage = function({ data: { canvas } }) {
  const ctx = canvas.getContext('2d');

  runWithFps(() => {
    drawNoise(canvas, ctx);
  }, 10);
};
// console.log('beforefill');
// console.log('fill');
