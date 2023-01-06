const queryString = window.location.search;
const params = new URLSearchParams(queryString);

let showfr = false;
let fr = [];
let mspf = [];
let timer = new Timer();
let starfield;
let fade = .05;
let firstload = true;
let opts = {
	"count": 5000,
	"hsl": [332, 100, 52.94, 1],
	"size": 1,
	"speed": 3,
	"dSpeed": 0.98,
	"dZ": 0.01,
	"trailLen": 20,
	"maxAge": 96,
	"res": 4,
	"screenRatio": 0,
	"rainbow": false,
	"frozen": false
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
		case "maxAge":
			starfield.opts.maxAge = val;
		break;
		case "res":
			starfield.opts.res = val;
		break;
		case "color":
			var c = color(val);
			starfield.opts.hsl = [hue(c), saturation(c), lightness(c), 1];
			background(starfield.opts.hsl);
			for(var i = 0; i < 100; i++) {
				background(0, fade);
			}
		break;
		case "rainbow":
			starfield.opts.rainbow = val;
		break;
		case "frozen":
			starfield.opts.frozen = val;
		break;
		case "refresh":
			location.reload();
		break;
		case "showfr":
			showfr = val;
			if(!val && !firstload) {
				fill(opts.hsl);
				rect(0, 0, 302, 52);
				fill(0, fade);
				for(var i = 0; i < 100; i++) {
					rect(0, 0, 302, 52);
				}
				
			}
		break;
	};
}

function setup() {
  let canv = createCanvas(window.innerWidth, window.innerHeight);
	canv.elt.addEventListener("contextmenu", (e) => e.preventDefault());
  frameRate(12);
  noFill();
  noStroke();
  angleMode(DEGREES);
	colorMode(HSL);
	textSize(30);
	
	opts.screenRatio = width / height;
	starfield = new Starfield(opts);
  starfield.populate();
  
	background(starfield.opts.hsl);
	for(var i = 0; i < 100; i++) {
		background(0, fade);
	}
}

function draw() {
	background(0, fade);
	timer.start();
  
  starfield.update();
	
	// Show Framerate
	if(showfr && frameCount > 1) {
		fr.push(frameRate());
		if(fr.length > 100) fr.shift();
		mspf.push(timer.end());
		if(mspf.length > 100) mspf.shift();
		
		strokeWeight(2);
		fill(0);
		rect(0, 0, 300, 50);
		
		noStroke();
		fill(starfield.opts.hsl);
		var debug = (Math.round((fr.reduce((s, e) => s + e) / fr.length) * 100) / 100) + " fps / ";
		debug		 += Math.round(mspf.reduce((s, e) => s + e) / mspf.length) + " mspf";
		text(debug, 10, 35);
		noFill();
	}
	
	if(firstload) firstload = false;
}

//
// Timer
//
function Timer() {
	this.s = 0;
	this.e = 0;
	
	this.start = function() {
		this.s = Date.now();
		return this.s;
	}
	
	this.end = function() {
		this.e = Date.now();
		return this.results();
	}
	
	this.results = function() {
		return (this.e - this.s);
	}
}