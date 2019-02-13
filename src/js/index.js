import runWithFps from 'run-with-fps';
import { Vector } from 'v-for-vector';
import lerp from '@sunify/lerp-color';

import Point, { distFast } from './point';
import { PIXEL_RATIO, POINTS_TTL } from './constants';
import curves from './curves';
import renderPoints, { colors } from './renderPoints';
import emitPoints from './emitPoints';

const caption = document.getElementById('caption');

const width = window.innerWidth;
const height = window.innerHeight;

const atCenter = ([x, y]) => [x + width / 2, y + height / 2];

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

let track = [];
let points = [];
let { time = 0, dt, getPoint } = curve;
const center = Vector.cartesian(width / 2, height / 2);
const draw = () => {
  // canvas.width = canvas.width;
  points = points.filter(([_, t]) => Date.now() - t < POINTS_TTL);

  for (let i = 0; i < 3; i += 1) {
    points.push([
      new Point(
        Vector.polar(Math.PI * 2 * Math.random(), 2 * Math.random()).add(
          center
        ),
        Vector.polar(Math.PI * 2 * Math.random(), 0.1 * Math.random()),
        Vector.polar(Math.PI * 2 * Math.random(), 0.1)
      ),
      Date.now()
    ]);
  }
  // if (auto) {
  //   time += dt;
  //   track.push(Vector.cartesian(...atCenter(getPoint(time, width, height))));
  //   track = track.slice(-2);
  // }
  // points = points.concat(emitPoints(track, width, height));

  renderPoints(points, ctx, width, height);
};

const fireworks = (x, y) => {
  for (let i = 0; i < 40; i += 1) {
    const angle = Math.PI * 2 * Math.random();
    const len = 30 * Math.random() * PIXEL_RATIO;
    points.push([
      new Point(
        Vector.cartesian(x, y),
        Vector.polar(angle, len),
        Vector.cartesian(0.7 * Math.cos(angle), 0.5)
      ),
      Date.now() + Math.random() * 1000,
      angle
    ]);
  }
};

// document.addEventListener('click', e => {
//   fireworks(e.pageX, e.pageY);
// });

let trackTimeout;
let startPoint = null;
let drag = false;
let auto = true;
// document.addEventListener('mousedown', e => {
//   startPoint = {
//     x: e.pageX,
//     y: e.pageY
//   };
// });
// document.addEventListener('mousemove', e => {
//   if (startPoint && !drag) {
//     e.preventDefault();
//     if (
//       Math.abs(e.pageX - startPoint.x) > 10 ||
//       Math.abs(e.pageY - startPoint.Y) > 10
//     ) {
//       drag = true;

//       if (auto) {
//         canvas.width = canvas.width;
//         points = [];
//       }

//       auto = false;
//     }
//   }
//   if (drag) {
//     e.preventDefault();
//     track.push(Vector.cartesian(e.pageX, e.pageY));
//     track = track.slice(-2);
//     console.log(e.pageX, e.pageY);

//     clearTimeout(trackTimeout);
//     trackTimeout = setTimeout(() => {
//       console.log('clear');
//       track = [];
//     }, 300);
//   }
// });

// document.addEventListener('mouseup', () => {
//   drag = false;
//   startPoint = null;
// });

const stop = runWithFps(draw, 30);

// Handle hot module replacement
if (module.hot) {
  module.hot.dispose(() => {
    if (stop) {
      stop();
    }
  });
}
