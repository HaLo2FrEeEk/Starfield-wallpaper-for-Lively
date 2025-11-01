class Starfield {
	constructor(opts) {
		this.opts = opts;
		this.zoff = random(100, 200);
		this.stars = [];
	}
	
  populate(i = 0) {
    for(i; i < this.opts.count; i++) {
      this.stars[i] = new Star(i);
    }
  }
  
  update() {
		var c = this.opts.count;
		if(mspf > (1000 / framerate)) {
			c = ~~(c / (mspf / (1000 / framerate)));
		}
		for(var i = 0; i < c; i++) {
			this.stars[i].step();
		}
    
    this.zoff += this.opts.frozen ? 0 : this.opts.dZ;
  }
}

class Star {
	constructor(i) {
		this.index = i;
		this.spawn();
		this.move();
	}
	
	spawn() {
		this.pos = {x: random(0, width), y: random(0, height)};
		this.dir = {x: 0, y: 0};
		this.prevpos = 0;
		this.age = ~~random(0, starfield.opts.maxAge / 2);
		this.birthAge = this.age;
		this.noise = 0;
		this.oob = starfield.opts.trailLen;
	}
	
	step() {
		this.noise = this.noiseAt();
		this.draw();
		this.move();
		
		this.age++;
		if(this.age > starfield.opts.maxAge) this.spawn();
	}
	
	move() {
		this.prevpos = {x: this.pos.x, y: this.pos.y};
		this.dir.x += starfield.opts.speed * cos(this.noise * 360 * 3);
		this.dir.y += starfield.opts.speed * sin(this.noise * 360 * 3);
		this.dir.x *= this.noise;
		this.dir.y *= this.noise;
		this.pos.x += this.dir.x;
		this.pos.y += this.dir.y;
		
		if(this.pos.x < -starfield.opts.size ||	this.pos.x > width + starfield.opts.size ||
			this.pos.y < -starfield.opts.size || this.pos.y > height + starfield.opts.size)	{
			// Out-of-bounds, countdown
			this.oob--;
		}
		
		if(this.oob == 0) {
			this.spawn();
		}
	}
	
	draw() {
		let c = this.colorAt();		
		drawingContext.lineWidth = starfield.opts.size + this.speedNow() * this.noise;
		drawingContext.strokeStyle = `hsla(${c[0]}, ${c[1]}%, ${c[2]}%, ${c[3] * 100}%)`;
		drawingContext.beginPath();
		drawingContext.moveTo(this.prevpos.x, this.prevpos.y);
		drawingContext.lineTo(this.pos.x, this.pos.y);
		drawingContext.stroke();
	}
	
	noiseAt(a = 0, o = 0, x = this.pos.x, y = this.pos.y, zoff = starfield.zoff) {
		return noise(
			(x / (width / starfield.opts.res / starfield.opts.screenRatio)) + (cos(a) * o),
			(y / (height / starfield.opts.res)) + (sin(a) * o),
			zoff);
	}
	
	ageFalloff() {
		let ap = (this.age - this.birthAge) / (starfield.opts.maxAge - this.birthAge);
		return (ap < starfield.opts.fioThreshold)
			? ap / starfield.opts.fioThreshold
			: (1 - ap < starfield.opts.fioThreshold)
				? (1 - ap) / starfield.opts.fioThreshold
				: 1
	}
	
	colorAt() {
		let c = starfield.opts.color;
		let h = c.hsla[0] * 360;
		h = starfield.opts.rainbow
			? ((h - 180) + (720 * this.noise)) % 360
			: ((h + 60) - (120 * this.noise)) % 360
		let r = [h, c.hsla[1] * 100, c.hsla[2] * 100, (0.5 + 0.5 * this.noise) * this.ageFalloff()];
		return r;
	}
	
	speedNow() {
		return Math.sqrt(Math.pow(this.pos.x - this.prevpos.x, 2) + Math.pow(this.pos.y - this.prevpos.y, 2)) || 1;
	}
}




