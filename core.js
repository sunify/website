import Voronoi from 'voronoi';
import raf from 'raf';

const { sin, cos, round, random, min, PI } = Math;

let voronoi = new Voronoi();
let options = {};
let diagram = null;

const currentPos = (time, dot) => {
	const speed = time / 200 / dot.speed * PI;
	const x1 = cos(speed) * 5;
	const y1 = sin(speed) * dot.ex * dot.reverse * 5;

	dot.x = dot._x / 1000 * window.innerWidth + (x1 * cos(dot.angle) - y1 * sin(dot.angle));
	dot.y = dot._y / 700 * window.innerHeight + (x1 * sin(dot.angle) + y1 * cos(dot.angle));
}
// 
function update(dots, ctx, time) {
	voronoi.recycle(diagram);

	for(let i = 0, max = options.dots.length; i < max; i += 1) {
		currentPos(time, options.dots[i]);
	}

	diagram = voronoi.compute(
		options.dots,
		{xl: 0, xr: options.ctx.canvas.width, yt: 0, yb: options.ctx.canvas.height}
	);

	options.draw.apply(options.ctx, [diagram]);
}

export function addDot(dot) {
	options.dots.push(dot);
}

export function run(dots, ctx, draw) {
	options = { dots, ctx, draw };

	function loop(time) {
		setTimeout(() => raf(loop), 1000/20);
		update(dots, ctx, time);
	}

	raf(loop);
}
