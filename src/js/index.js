import runWithFps from 'run-with-fps';

import { PIXEL_RATIO, POINTS_TTL } from './constants';
import curves from './curves';
import renderPoints from './renderPoints';
import emitPoints from './emitPoints';

const caption = document.getElementById('caption');

const width = window.innerWidth * 1.2;
const height = window.innerHeight * 1.2;

const atCenter = ([x, y]) => [x + width / 2, y + height / 2];

const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
canvas.width = width * PIXEL_RATIO;
canvas.height = height * PIXEL_RATIO;
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';

let track = [];
let points = [];

const curve = curves[Math.round(Math.random() * (curves.length - 1))];

caption.innerHTML = `<sup>*</sup> <a href="${curve.url}" target="_blank">${
  curve.title
}</a>`;

let { time = 0, dt, getPoint } = curve;
const draw = () => {
  points = points.filter(([_, t]) => Date.now() - t < POINTS_TTL);
  renderPoints(points, ctx);

  time += dt;

  track.push(atCenter(getPoint(time, width, height)));

  track = track.slice(-2);
  points = points.concat(emitPoints(track, width, height));
};

const stop = runWithFps(draw, 40);

// Handle hot module replacement
if (module.hot) {
  module.hot.dispose(() => {
    if (stop) {
      stop();
    }
  });
}
