import runWithFps from 'run-with-fps';
import { Vector } from 'v-for-vector';
import lerp from '@sunify/lerp-color';

import Point from './point';
import { PIXEL_RATIO, POINTS_TTL } from './constants';
import curves from './curves';
import renderPoints, { colors } from './renderPoints';

const caption = document.getElementById('caption');

const width = window.innerWidth;
const height = window.innerHeight;

const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
canvas.width = width * PIXEL_RATIO;
canvas.height = height * PIXEL_RATIO;
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';

const curveIndex = Math.round(Math.random() * (curves.length - 1));
const curve = curves[curveIndex];

caption.innerHTML = `<sup>*</sup> <a href="${curve.url}" target="_blank">${
  curve.title
}</a>`;

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

let points = [];
const center = Vector.cartesian(width / 2, height / 2);
const draw = () => {
  // canvas.width = canvas.width;
  points = points.filter(([_, t]) => Date.now() - t < POINTS_TTL);

  for (let i = 0; i < 1; i += 1) {
    const angle = Math.PI * 2 * Math.random();
    points.push([
      new Point(
        Vector.polar(angle, 2).add(center),
        Vector.polar(angle, 2 * Math.random()),
        Vector.polar(angle, 0.1)
      ),
      Date.now() + 1000 * Math.random()
    ]);
  }

  renderPoints(points, ctx, width, height);
};

const stop = runWithFps(draw, 24);

// Handle hot module replacement
if (module.hot) {
  module.hot.dispose(() => {
    if (stop) {
      stop();
    }
  });
}
