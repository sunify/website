import { Vector } from 'v-for-vector';

export default class Point {
  constructor(pos, vel, acc, friction) {
    this.pos = pos;
    this.acc = acc || new Vector(0, 0);
    this.vel = vel || new Vector(0, 0);
    this.friction = friction || 0.9;
  }

  update(width, height) {
    this.acc.angle += 0.014;
    this.vel.add(this.acc).mult(this.friction);
    this.pos.add(this.vel);
  }
}
