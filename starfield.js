function  Starfield(opts) {
	this.opts = opts;
	this.zoff = random(100, 200);
	this.stars = [];
	
  this.populate = function(i = 0) {
    for(i; i < this.opts.count; i++) {
      this.stars[i] = new Star();
    }
  }
  
  this.update = function() {
		for(var i = 0; i < this.opts.count; i++) {
			this.stars[i].step();
		}
    
    this.zoff += this.opts.frozen ? 0 : this.opts.dZ;
  }
}

function Star() {
	Star.prototype.spawn = function() {
		this.pos = {x: random(0, width), y: random(0, height)};
		this.dir = {x: 0, y: 0};
		this.oob = starfield.opts.trailLen;
		this.age = random(0, starfield.opts.maxAge);
		this.prevpos = 0;
		this.noise = 0;
	}
	
	Star.prototype.step = function() {
		this.noise = this.noiseAt();
		
		this.draw();
		this.move();
		
		this.age++;
		if(this.age > starfield.opts.maxAge) this.spawn();
	}
	
	Star.prototype.move = function() {
		this.prevpos = {x: this.pos.x, y: this.pos.y};
		this.dir.x += starfield.opts.speed * cos(this.noise * (360 + 180));
		this.dir.y += starfield.opts.speed * sin(this.noise * (360 + 180));
		this.dir.x *= this.noise;
		this.dir.y *= this.noise;
		this.pos.x += this.dir.x;
		this.pos.y += this.dir.y;
		
		if(this.pos.x < -starfield.opts.size ||	this.pos.x > width + starfield.opts.size ||
			this.pos.y < -starfield.opts.size || this.pos.y > height + starfield.opts.size)	{
			// Out-of-bounds, countdown
			this.oob--;
		} else {
			// Reset if in-bounds
			this.oob = starfield.opts.trailLen;
		}
		
		if(this.oob == 0) {
			this.spawn();
		}
	}
	
	Star.prototype.draw = function() {
		strokeWeight(starfield.opts.size * this.noise);
		stroke(this.colorAt());
		beginShape();
		vertex(this.pos.x, this.pos.y);
		vertex(this.prevpos.x, this.prevpos.y);
		endShape();
	}
	
	Star.prototype.noiseAt = function(a = 0, o = 0, x = this.pos.x, y = this.pos.y, zoff = starfield.zoff) {
		return noise(
			1 + (x / (width / starfield.opts.res / starfield.opts.screenRatio)) + (cos(a) * o),
			1 + (y / (height / starfield.opts.res)) + (sin(a) * o),
			zoff);
	}
	
	Star.prototype.colorAt = function() {
		var hue = Array.from(starfield.opts.hsl);
		if(starfield.opts.rainbow) {
			hue[0] = ((hue[0] - 180) + (720 * this.noise)) % 360;
		} else {
			hue[0] = ((hue[0] + 60) - (120 * this.noise)) % 360;
		}
		hue[3] = (hue[3] / 2) + (hue[3] / 2) * this.noise;
		return hue;
	}

	this.spawn();
	this.move();
	}
