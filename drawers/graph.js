import dst from '../utils/dst';

export default function draw(diagram) {
	this.canvas.width = this.canvas.width;

	for(let i = 0, max = diagram.edges.length; i < max; i ++) {
		const { va, vb } = diagram.edges[i];
		this.beginPath();
		this.lineWidth = 2;
		this.strokeStyle = `rgba(255,255,255, ${3 / dst(va, vb)})`;
		this.moveTo(va.x, va.y);
		this.lineTo(vb.x, vb.y);
		this.stroke();
	}

	this.fillStyle = 'rgba(255,255,255,0.8)';
	diagram.vertices.forEach(v => {
		this.beginPath();
		this.arc(v.x, v.y, 2, 0, Math.PI * 2);
		this.fill();
	});
}
