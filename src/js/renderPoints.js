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

export default function renderPoints(points, ctx, width, height) {
  voronoi.recycle(diagram);

  points.forEach(([p, t]) => {
    p.update();
    // ctx.fillRect(p.pos.x * PIXEL_RATIO, p.pos.y * PIXEL_RATIO, 2, 2);
  });
  const boxPad = 1000;
  const bbox = {
    xl: -boxPad,
    xr: ctx.canvas.width / PIXEL_RATIO + boxPad,
    yt: -boxPad,
    yb: ctx.canvas.height / PIXEL_RATIO + boxPad
  };
  diagram = voronoi.compute(points.map(p => p[0].pos), bbox);

  for (let i = 0, max = diagram.edges.length; i < max; i++) {
    const { va, vb } = diagram.edges[i];
    const d = dst(va, vb);
    if (d < 1000) {
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = lerp(
        `rgba(#F00, 0.1)`,
        `rgba(#FC0, 0.1)`,
        `rgba(#F00, 0.5)`,
        `rgba(#0FF, 0.02)`,
        `rgba(#000, 0)`,
        Math.min(1, dst(va, vb) / 30)
      );
      ctx.moveTo(va.x * PIXEL_RATIO, va.y * PIXEL_RATIO);
      ctx.lineTo(vb.x * PIXEL_RATIO, vb.y * PIXEL_RATIO);
      ctx.stroke();
    }
  }

  points.forEach(([p, t]) => {
    ctx.fillStyle = `rgba(255, 255, 255, ${1 -
      (Date.now() - t) / (POINTS_TTL - 1000)})`;
    ctx.fillRect(p.pos.x * PIXEL_RATIO, p.pos.y * PIXEL_RATIO, 2, 2);
  });
}
