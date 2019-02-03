import lerp from '@sunify/lerp-color';
import eases from 'eases';
import { PIXEL_RATIO, POINTS_TTL } from './constants';

export const colors = {
  primary: '#0FC',
  secondary: '#7800FF',
}

export default function renderPoints(points, ctx) {
  points.forEach(([p, t]) => {
    const age = (Date.now() - t) / POINTS_TTL;
    ctx.strokeStyle = lerp(
      `rgba(${colors.primary}, 0.7)`,
      `rgba(${colors.secondary}, 0.3)`,
      eases.sineInOut(age)
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
