import lerp from '@sunify/lerp-color';
import eases from 'eases';
import { PIXEL_RATIO, POINTS_TTL } from './constants';

export default function renderPoints(points, ctx) {
  points.forEach(([p, t]) => {
    const age = (Date.now() - t) / POINTS_TTL;
    ctx.strokeStyle = lerp(
      `rgba(255, 255, 120, 0.7)`,
      `rgba(255, 25, 0, 0.3)`,
      eases.quartInOut(age)
    );
    ctx.lineWidth = PIXEL_RATIO;
    p.update();
    const dx =
      ((Math.cos(p.vel.angle()) * p.vel.length() * 2) / PIXEL_RATIO) * 1.3;
    const dy =
      ((Math.sin(p.vel.angle()) * p.vel.length() * 2) / PIXEL_RATIO) * 1.3;
    ctx.beginPath();
    ctx.moveTo(p.pos.x + dx, p.pos.y + dy);
    ctx.lineTo(p.pos.x, p.pos.y);
    ctx.stroke();
  });
}
