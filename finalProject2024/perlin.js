let w; // Width of canvas
let h; // Height of canvas
let s; // Scale, min of w and h
let asp = 1 / 1.4; // Aspect ratio
let c; // Canvas
let pixelMapper; // Pixel coordinate mapper
let gfx;
let seed;
let pd;

let canvasExtent = [-1, 1, -1 / asp, 1 / asp];
let artExtent = addMargin(canvasExtent);
let extentWidth = canvasExtent[1] - canvasExtent[0];

let pointsPerFrame = 60;
let pds;
let grainImg;
let backgroundLightness;
let pointFill;

function setup() {
  pd = pixelDensity();
  
  seed = 5325*random();

  [w, h] = computeCanvasSize(windowWidth, windowHeight, asp);
  w = Math.round(w);
  h = Math.round(h);
  s = Math.min(w, h);

  pixelMapper = new PixelMapper(w, h);
  pixelMapper.setExtentWidth(extentWidth);

  c = createCanvas(w, h);
  gfx = createGraphics(w, h);

  noiseSeed(72*seed);
  xNoise = new Perlin(5631*seed, 0.5, 10, 0.5);
  yNoise = new Perlin(7242*seed, 0.5, 10, 0.5);

  const circles = generateCircles(artExtent, 0.25, 0.5, random);
  const nCircles = circles.length;
	
	const warpSizeX = random(0.1, 1);
	const warpSizeY = random(0.1, 1);
	const numWarps = floor(random(1, 10 + 1));

  function distanceFunction(p) {
    let [x, y] = p;
		let warpScale = 1;
		for (let i = 0; i < numWarps; i++) {
			const dx = -1 + 2*xNoise.ev(x, y);
    	const dy = -1 + 2*xNoise.ev(x, y);

    	x += warpScale*warpSizeX*dx;
    	y += warpScale*warpSizeY*dy;
			
			warpScale *= 0.5;
		}
    

    for (let i = 0; i < nCircles; i++) {
      const circ = circles[i];
      const [cX, cY] = circ.center;
      if (Math.hypot(cX - x, cY - y) < circ.radius) return circ.dist;
    }
    return 1;
  }

	const minDistance = random(0.004, 0.006);
	const maxDistance = minDistance*random(5, 10);
	
  pds = new Poisson2D({
    extent: artExtent,
    minDistance: minDistance,
    maxDistance: maxDistance,
    distanceFunction,
    tries: 10,
  }, random);

  grainImg = createImage(2*pd*w, 2*pd*h);
  addGrain(grainImg, 0.2, false, random);
  grainImg.resize(pd*w, pd*h);

	backgroundLightness = random();
	pointFill = backgroundLightness > 0.5 ? "#030203" : "#fcfdfc";
	
  gfx.colorMode(HSL, 1);
  gfx.background(random(), random(), backgroundLightness);

  image(gfx, 0, 0);
  blend(grainImg, 0, 0, pd*width, pd*height, 0, 0, width, height, DIFFERENCE);
	
	loop();
}

function draw() {

  stroke(pointFill);
  strokeWeight(s / 300);

  for (let i = 0; i < pointsPerFrame; i++) {
    let p = pds.next();
    if (!p) {
      noLoop();
      return;
    }
    point(...pixelMapper.toPixel(...p));
  }
  
}

window.addEventListener("keyup", (e) => {
	if (e.key === " ") {
		setup();
		draw();
	}
});

//////////////////////////////

function addGrain(img, fill = 0.05, color = false, rng = Math.random) {
    img.loadPixels();
    const w = img.width;
    const h = img.height;
    
    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        ind = 4*(i*w + j);
        let c;
        if (color) {
            c = Array(3).fill().map(_ => fill*255*rng());
        } else {
            const value = fill*255*rng();
            c = Array(3).fill().map(_ => value);
        }
        
      
        img.pixels[ind] = c[0];
        img.pixels[ind + 1] = c[1];
        img.pixels[ind + 2] = c[2];
        img.pixels[ind + 3] = 255;
      }
    }
    
    img.updatePixels();
  }

//////////////////////////////

function addMargin(extent, margin = 0.05) {
    let [xMin, xMax, yMin, yMax] = extent;
    const width = xMax - xMin;
    const height = yMax - yMin;

    const s = Math.min(width, height);

    xMin += margin*s;
    xMax -= margin*s;
    yMin += margin*s;
    yMax -= margin*s;
    return [xMin, xMax, yMin, yMax];
}

//////////////////////////////


function computeCanvasSize(windowWidth, windowHeight, aspectRatio, margin = 0.1) {
    let w, h;

    if (windowHeight*aspectRatio <= windowWidth) {
        [w, h] = [windowHeight*aspectRatio, windowHeight];
    } else {
        [w, h] = [windowWidth, windowWidth / aspectRatio];
    }
    return [(1 - margin)*w, (1 - margin)*h];
}

//////////////////////////////

function generateCircles(extent, minRadius = 0.1, maxRadius = 2, rng = Math.random) {
    const circles = [];

    const pds = new Poisson2D({ extent, minDistance: 0.1 }, rng);
    const centers = pds.fill();
    const n = centers.length;

    for (let i = 0; i < n; i++) {
        circles.push({
            center: centers[i],
            radius: minRadius + (maxRadius - minRadius)*rng(),
            dist: Math.pow(rng(), 3) // Using a power > 1 gives bias towards lower values
        });
    }
    return circles;
}

//////////////////////////////

class Perlin {
    constructor(seed, range = 1, octaves = 4, falloff = 0.5) {
      this.xOffset = random();
      this.yOffset = random();
      this.range = range;
      this.octaves = octaves;
      this.falloff = falloff;

      this.normConst = 0;
      let ampl = 0.5;
      for (let i = 0; i < octaves; i++) {
        this.normConst += ampl;
        ampl *= falloff;
      }
    }

    ev(x, y) {
      const r = this.range;
      noiseDetail(this.octaves, this.falloff);
      let v = noise((x + this.xOffset) / r, (y + this.yOffset) / r);
      return v / this.normConst;
    }
  }

//////////////////////////////

class PixelMapper {
    constructor(pixelWidth, pixelHeight) {
        this.size = [pixelWidth, pixelHeight];
        this.asp = pixelWidth / pixelHeight;
        this.setFlipY(true);
        this.setExtentWidth(2);
    }

    setFlipY(value) {
        this.ySign = value ? -1 : 1;
    }

    setExtentWidth(width) {
        this.width = width;
        this.height = width / this.asp;
    }

    setExtentHeight(height) {
        this.height = height;
        this.width = asp*height;
    }

    pixelToUnit(column, row) {
        const [w, h] = this.size;
        return [(column + 0.5) / w, (row + 0.5) / h];
    }

    unitToPixel(u, v) {
        const [w, h] = this.size;
        return [u*w - 0.5, v*h - 0.5];
    }

    fromPixel(column, row) {
        if (row === undefined) [column, row] = column;
        let [u, v] = this.pixelToUnit(column, row);
        const asp = this.asp;
        let x = (u - 0.5)*this.width;
        let y = (v - 0.5)*this.height*this.ySign;
        return [x, y];
    }

    toPixel(x, y) {
        if (y === undefined) [x, y] = x;
        let u = x / this.width + 0.5;
        let v = y * this.ySign / this.height + 0.5;
        return this.unitToPixel(u, v);
    }
}
