/*
To Do:

Fade out on death, don't just disappear
Cache noise values...somehow
*/

function  Starfield(opts) {
  let _sf = this;
	_sf.opts = opts;
	_sf.zoff = random(100, 200);
	_sf.stars = [];
	
  _sf.populate = function(i = 0) {
    for(i; i < _sf.opts.count; i++) {
      _sf.stars[i] = new Star();
    }
  }
  
  _sf.update = function() {
		for(var i = 0; i < _sf.opts.count; i++) {
			_sf.stars[i].step();
		}
    
    _sf.zoff += _sf.opts.frozen ? 0 : _sf.opts.dZ;
  }
}

function Star() {
	Star.prototype.spawn = function() {
		this.pos = createVector(random(0, width), random(0, height));
		this.dir = createVector(0, 0);
		this.cd = starfield.opts.size;
		this.oob = starfield.opts.trailLen;
		this.age = random(0, starfield.opts.maxAge);
		this.prevpos = 0;
		this.noise = 0;
	}
	
	Star.prototype.step = function() {
		this.noise = this.noiseAt();
		
		if(this.cd > 0) {
			this.cd -= this.noise;
			if(this.cd < 0) this.cd = 0;
		}
		
		this.draw();
		this.move();
		
		this.age++;
		if(this.age > starfield.opts.maxAge) this.spawn();
	}
	
	Star.prototype.move = function() {
		this.dir.x += starfield.opts.speed * cos(this.noise * (360 + 180));
		this.dir.y += starfield.opts.speed * sin(this.noise * (360 + 180));
		this.dir.mult(starfield.opts.dSpeed * this.noise);
		
		this.prevpos = {x: this.pos.x, y: this.pos.y};
		this.pos.add(this.dir);
		
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
		var sw = (starfield.opts.size - this.cd) * this.noise;
		strokeWeight(sw);
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
	
	Star.prototype.colorAt = function(am = null) {
		var hue = Array.from(starfield.opts.hsl);
		if(starfield.opts.rainbow) {
			hue[0] = ((hue[0] - 180) + (360 * this.noise)) % 360;
		} else {
			hue[0] = ((hue[0] + 60) - (120 * this.noise)) % 360;
		}
		hue[3] = (hue[3] / 2) + (hue[3] / 2) * this.noise;
		hue[3] *= am || 1;
		return hue;
	}

	this.spawn();
	this.move();
	}




