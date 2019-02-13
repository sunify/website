import Voronoi from 'voronoi';
import lerp from '@sunify/lerp-color';
import eases from 'eases';
import { PIXEL_RATIO, POINTS_TTL } from './constants';

export const colors = {
  primary: '#00FFEE',
  secondary: '#7800FF'
};

const voronoi = new Voronoi();
let diagram = null;

function dst(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function dst2(p1, p2) {
  return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}

function memlerp(colors, steps = 10) {
  const cache = {};
  return t => {
    const step = Math.floor(t / (1 / steps));
    cache[step] = cache[step] || lerp(...colors, t);
    return cache[step];
  };
}

const voronoiLerp = memlerp(
  [
    `rgba(#F00, 0.1)`,
    `rgba(#FC0, 0.1)`,
    `rgba(#F00, 0.5)`,
    `rgba(#0FF, 0.02)`,
    `rgba(#000, 0)`
  ],
  30
);

export default function renderPoints(points, ctx, width, height) {
  voronoi.recycle(diagram);

  points.forEach(p => {
    p.update();
  });
  const boxPad = 1000;
  const bbox = {
    xl: -boxPad,
    xr: ctx.canvas.width / PIXEL_RATIO + boxPad,
    yt: -boxPad,
    yb: ctx.canvas.height / PIXEL_RATIO + boxPad
  };
  diagram = voronoi.compute(points, bbox);

  for (let i = 0, max = diagram.edges.length; i < max; i++) {
    const { va, vb } = diagram.edges[i];
    const d = dst2(va, vb);
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = voronoiLerp(Math.min(1, d / 900));
    ctx.moveTo(va.x * PIXEL_RATIO, va.y * PIXEL_RATIO);
    ctx.lineTo(vb.x * PIXEL_RATIO, vb.y * PIXEL_RATIO);
    ctx.stroke();
  }

  points.forEach(p => {
    ctx.fillStyle = `rgba(255, 255, 255, ${1 -
      (Date.now() - p.time) / POINTS_TTL})`;
    ctx.fillRect(p.pos.x * PIXEL_RATIO, p.pos.y * PIXEL_RATIO, 2, 2);
  });
}
