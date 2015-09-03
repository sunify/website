// import './app.css';
import { run, addDot, clear } from './core';
import dot from './dot';

let canvas = document.getElementById('cnv');
let clearBtn = document.getElementById('clear');
let ctx = canvas.getContext('2d');

function start(preset) {
	run(ctx, preset);

	window.new_dots = [];
	function handleMouseMove(e) {
		if(e.which === 1 && Math.random() > 0.2) {
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
}

switch(Math.round(Math.random() * 8)) {
// switch(0) {
	case 0:
		require.ensure(['./presets/nebula'], (require) => start(require('./presets/nebula')));
		break;
	case 1:
		require.ensure(['./presets/blue_star'], (require) => start(require('./presets/blue_star')));
		break;
	case 2:
		require.ensure(['./presets/classic'], (require) => start(require('./presets/classic')));
		break;
	case 3:
		require.ensure(['./presets/fire_trap'], (require) => start(require('./presets/fire_trap')));
		break;
	case 4:
		require.ensure(['./presets/frozen'], (require) => start(require('./presets/frozen')));
		break;
	case 5:
		require.ensure(['./presets/neuro'], (require) => start(require('./presets/neuro')));
		break;
	case 6:
		require.ensure(['./presets/graph'], (require) => start(require('./presets/graph')));
		break;
	case 7:
		require.ensure(['./presets/cave'], (require) => start(require('./presets/cave')));
		break;
	case 8:
		require.ensure(['./presets/sun'], (require) => start(require('./presets/sun')));
		break;
}

