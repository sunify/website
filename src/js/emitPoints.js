import { Vector } from 'v-for-vector';
import Point, { distFast } from './point';
import { PIXEL_RATIO } from './constants';

export default function emitPoints(track, width, height) {
  if (track.length < 2) {
    return [];
  }

  const [, [x, y]] = track;
  if ((x < 0 || x > width) && (y < 0 || y > height)) {
    return;
  }

  const baseAngle = Math.atan2(
    track[1][1] - track[0][1],
    track[1][0] - track[0][0]
  );
  const baseLen = distFast(track[0][0], track[0][1], track[1][0], track[1][1]);

  const points = [];
  for (let i = 0; i < 15; i += 1) {
    const angle = baseAngle + (Math.PI / 4) * (0.5 - Math.random()); // spread particles a little
    const len = (Math.max(-10, -10 * (baseLen / 5)) * Math.random()) / 2;
    points.push([
      new Point(
        Vector.cartesian(x, y),
        Vector.polar(angle, len),
        Vector.polar(angle, -0.1)
      ),
      Date.now() + 100 * Math.random(),
      angle
    ]);
  }

  return points;
}
