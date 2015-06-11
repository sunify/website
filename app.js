import 'babel/polyfill';
import { run, addDot, clear } from './core';
import dot from './dot';
import presets from './presets/index';

let canvas = document.getElementById('cnv');
let clearBtn = document.getElementById('clear');
let ctx = canvas.getContext('2d');

run(ctx, Object.values(presets)[Math.round(Math.random() * 7)]);

window.new_dots = [];
function handleMouseMove(e) {
	if(e.which === 1) {
		e.preventDefault();
		document.body.classList.add('st-dragging');
		const d = dot(
			e.pageX / window.innerWidth * 1000,
			e.pageY / window.innerHeight * 700
		);
		addDot(d);
		window.new_dots.push(d);
	}
}

function handleResize() {
	canvas.width = window.innerWidth + 2;
	canvas.height = window.innerHeight + 2;
}

function handleMouseUp() {
	document.body.classList.remove('st-dragging');
}

clearBtn.addEventListener('click', clear);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);
window.addEventListener('resize', handleResize);
handleResize();