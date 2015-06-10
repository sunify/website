import 'babel/polyfill';
import Voronoi from 'voronoi';
import raf from 'raf';
import area from '2d-polygon-area';

const { sin, cos, round, random, min, PI } = Math;

let voronoi = new Voronoi();
let diagram;
let canvas = document.getElementById('cnv');
let ctx = canvas.getContext('2d');

function dst(p1, p2) {
	return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

function lineLength(path) {
	if(path.length <= 1) {
		return 0;
	} else {
		return path.reduce((memo, point, i, path) => {
			if(path[i + 1]) {
				return memo + dst(point, path[i + 1]);
			} else {
				return memo;
			}
		}, 0);
	}
}

function drawCell(ctx, cell) {
	if(cell.halfedges.length > 2) {
		ctx.beginPath();
		let path = [];
		let v = cell.halfedges[0].getStartpoint();
		ctx.moveTo(v.x, v.y);
		path.push([v.x, v.y]);
		cell.halfedges.forEach((halfedge) => {
			let v = halfedge.getEndpoint();
			ctx.lineTo(v.x, v.y);
			path.push([v.x, v.y]);
		});
		ctx.fillStyle = cell.site.color(10 / lineLength(path));
		ctx.fill();
	}
}

function drawDot(ctx, dot) {
	ctx.beginPath();
	ctx.arc(dot.x, dot.y, dot.ex/2, 0, PI * 2);
	ctx.fillStyle = dot.color;
	ctx.fill();
}

let speed = 0, x1 = 0, y1 = 0;
const currentPos = (time, dot) => {
	speed = time / 1000 / dot.speed * PI;
	x1 = cos(speed) * 5;
	y1 = sin(speed) * dot.ex * dot.reverse * 5;

	dot.x = dot._x / 1000 * window.innerWidth + (x1 * cos(dot.angle) - y1 * sin(dot.angle));
	dot.y = dot._y / 700 * window.innerHeight + (x1 * sin(dot.angle) + y1 * cos(dot.angle));
}

function draw(dots, ctx, time) {
	voronoi.recycle(diagram);

	for(let i = 0, max = dots.length; i < max; i += 1) {
		currentPos(time, dots[i])
	}

	diagram = voronoi.compute(
		dots,
		{xl: 0, xr: ctx.canvas.width, yt: 0, yb: ctx.canvas.height}
	);
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	diagram.edges.forEach(({ va, vb }) => {
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = `rgba(74,20,140, ${3.5 / dst([va.x, va.y], [vb.x, vb.y])})`;
		ctx.moveTo(va.x, va.y);
		ctx.lineTo(vb.x, vb.y);
		ctx.stroke();
	});

	diagram.cells.forEach((cell) => {
		drawDot(ctx, cell.site);
		// drawCell(ctx, cell);
	});
}

function rndm(a, b) {
	return random() * (b - a) + a;
}

function dot(x, y) {
	return { x, y,
		_x: x,
		_y: y,
		ex: rndm(1, 5),
		angle: rndm(0, 10 * PI),
		reverse: round(random()) * 2 - 1,
		speed: rndm(1, 10),
		color: `rgb(${[rndm(100, 200), rndm(10, 150), rndm(10, 100)].map(round).join(',')})`
	};
}

let dots = [];

for(let i = 0; i < 15; i ++) {
	for(let j = 0; j < 8; j ++) {
		dots.push(dot(i * 140 * (random() * 0.3 + 0.3), j * 200 * (random() * 0.3 + 0.3)));
	}
}

function loop(time) {
	setTimeout(() => raf(loop), 1000/30);
	draw(dots, ctx, time);
}

raf(loop);

window.new_dots = [];

document.addEventListener('mousemove', (evt) => {
	if(evt.metaKey) {
		const d = dot(
			evt.pageX / window.innerWidth * 1000,
			evt.pageY / window.innerHeight * 700
		);
		dots.push(d);
		window.new_dots.push(d);
	}
});

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;