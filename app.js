import 'babel/polyfill';
import { run, addDot, clear } from './core';
import dot from './dot';
import presets from './presets/index';

const { sin, cos, round, random, min, PI } = Math;

let canvas = document.getElementById('cnv');
let ctx = canvas.getContext('2d');

// run(ctx, Object.values(presets)[5]);
run(ctx, Object.values(presets)[round(random() * 7)]);



















window.new_dots = [];
document.addEventListener('mousemove', (evt) => {
	if(evt.which === 1) {
		const d = dot(
			evt.pageX / window.innerWidth * 1000,
			evt.pageY / window.innerHeight * 700
		);
		addDot(d);
		window.new_dots.push(d);
	}
});

document.getElementById('clear').addEventListener('click', clear);

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth + 2;
	canvas.height = window.innerHeight + 2;
});

canvas.width = window.innerWidth + 2;
canvas.height = window.innerHeight + 2;