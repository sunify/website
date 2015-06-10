import 'babel/polyfill';
import { run } from './core';
import dot from './dot';
import ice from './drawers/ice';

const { sin, cos, round, random, min, PI } = Math;

let canvas = document.getElementById('cnv');
let ctx = canvas.getContext('2d');

let dots = [];

// for(let i = 0; i < 15; i ++) {
// 	for(let j = 0; j < 8; j ++) {
// 		dots.push(dot(i * 140 * (random() * 0.3 + 0.3), j * 200 * (random() * 0.3 + 0.3)));
// 	}
// }

run(dots, ctx, ice);

window.new_dots = [];

let allowDraw = false;
document.addEventListener('mousedown', (evt) => {
	allowDraw = true;
});
document.addEventListener('mouseup', (evt) => {
	allowDraw = false;
});
document.addEventListener('mousemove', (evt) => {
	if(allowDraw) {
		const d = dot(
			evt.pageX / window.innerWidth * 1000,
			evt.pageY / window.innerHeight * 700
		);
		dots.push(d);
		window.new_dots.push(d);
	}
});

document.getElementById('clear').addEventListener('click', () => {
	dots = [];
	ctx.fillStyle = '#1E0E33';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
});

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth + 2;
	canvas.height = window.innerHeight + 2;
});

canvas.width = window.innerWidth + 2;
canvas.height = window.innerHeight + 2;