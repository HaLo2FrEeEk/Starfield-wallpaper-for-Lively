let starfield,
		showtime = false,
		showseconds = false,
		showampm = false,
		time24 = false,
		fade = .05,
		framerate = 15,
		mspf = 0,
		mspf_arr = [],
		opts = {
			"count": 5000,
			"hex": "#AD0A56",
			"size": 1,
			"speed": 1,
			"maxAge": 96,
			"res": 4,
			"rainbow": false,
			"frozen": false,
			
			"fioThreshold": 0.21,
			"dSpeed": 0.98,
			"dZ": 0.01,
			"trailLen": 20,
			"screenRatio": 0
		};

function livelyPropertyListener(name, val) {
	switch(name) {
		case "count":
			var currentCount = starfield.opts.count;
			starfield.opts.count = val;
			if(val > currentCount) {
				starfield.populate(currentCount);
			} else if(val < currentCount) {
				starfield.stars.slice(val, currentCount - val);
			}
		break;
		case "speed":
			starfield.opts.speed = val;
		break;
		case "size":
			starfield.opts.size = val;
		break;
		case "fade":
			fade = val;
		break;
		case "maxAge":
			starfield.opts.maxAge = val;
		break;
		case "res":
			starfield.opts.res = val;
		break;
		case "color":
			starfield.opts.hex = val;
			starfield.opts.color = color(val);
			hue(starfield.opts.color);
			saturation(starfield.opts.color);
			lightness(starfield.opts.color)
		break;
		case "rainbow":
			starfield.opts.rainbow = val;
		break;
		case "frozen":
			starfield.opts.frozen = val;
		break;
		case "showtime":
			showtime = val;
		break;
		case "showseconds":
			showseconds = val;
		break;
		case "24hr":
			time24 = val;
		break;
		case "showampm":
			showampm = val;
		break;
		case "reload":
			window.location.reload();
		break;
	};
}

function setup() {
  var canv = createCanvas(window.innerWidth, window.innerHeight);
	canv.elt.addEventListener("contextmenu", (e) => e.preventDefault());
  frameRate(framerate);
  noFill();
  noStroke();
  angleMode(DEGREES);
	colorMode(HSL);
	drawingContext.lineCap = "round";
	
	opts.screenRatio = width / height;
	opts.color = color(opts.hex);
	hue(opts.color);
	saturation(opts.color);
	lightness(opts.color);
	background(opts.color);
	drawingContext.globalAlpha = fade;
	for(var i = 0; i < 70; i++) {
		background(0);
	}
	starfield = new Starfield(opts);
  starfield.populate();
}

function draw() {
	var date = Date.now();
	drawingContext.globalAlpha = fade;
	background(0);
	drawingContext.globalAlpha = 1.0;
  
  starfield.update();
	
	// Show time
	if(showtime) drawTime();
	
	if(mspf_arr.unshift(Date.now() - date) > framerate) mspf_arr.pop();
	mspf = mspf_arr.reduce((a, e) => a + e, 0) / mspf_arr.length;
}

function drawTime() {
	let d = new Date();
	let h = time24 ? d.getHours() : (d.getHours() % 12) || 12;
	if(time24) h = h.toString().padStart(2, '0');
	let time = `${h}:${d.getMinutes().toString().padStart(2, '0')}`;
	rectMode(CORNERS);
	textAlign(RIGHT, BOTTOM);
	textSize(98);
	noStroke();
	fill(64, fade);
	text(time, 0, 0, width - 98, height - 49);
	
	if(showampm && !time24) {
		time = d.getHours() - 12 < 0 ? "AM" : "PM";
		textSize(35);
		text(time, 0, 0, width - 38, height - 84 - 24);
	}
	
	if(showseconds) {
		let min = d.getMinutes() % 2;
		let angle = (d.getSeconds() || (min ? 0 : 60)) * 6;
		let start_angle = (min ? 0 : angle) - 90;
		let end_angle = (min ? angle : 0) - 90;
		let center_x = width - 63;
		let center_y = height - (time24 ? 105 : 89);
		let size = 35 + (time24 ? 21 : 0);
		arc(center_x, center_y, size, size, start_angle, end_angle);
	}
}