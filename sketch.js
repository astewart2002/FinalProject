



//  sort of reacting to frequency but colours look shit  and not rlly
// WHY DO IS IT ONLY WORK SOMETIMES HELLO???? is my mic broken idk i swear this should work
let video;
let poseNet;
let poses = [];
let rightWristX = 0;
let rightWristY = 0;
let smoothedRightWristX = 0;
let smoothedRightWristY = 0;
let NB_FRAMES = 100;
let frame_count = 0;
let curSeed = 11;
let NB = 150;
let Objects = [];
let mic, fft;

let notes = [
  { note: "C0", freq: 16.35 },
  { note: "C#0", freq: 17.32 },
  { note: "D0", freq: 18.35 },
  { note: "D#0", freq: 19.45 },
  { note: "E0", freq: 20.6 },
  { note: "F0", freq: 21.83 },
  { note: "F#0", freq: 23.12 },
  { note: "G0", freq: 24.5 },
  { note: "G#0", freq: 25.96 },
  { note: "A0", freq: 27.5 },
  { note: "A#0", freq: 29.14 },
  { note: "B0", freq: 30.87 },
  { note: "C1", freq: 32.7 },
  { note: "C#1", freq: 34.65 },
  { note: "D1", freq: 36.71 },
  { note: "D#1", freq: 38.89 },
  { note: "E1", freq: 41.2 },
  { note: "F1", freq: 43.65 },
  { note: "F#1", freq: 46.25 },
  { note: "G1", freq: 49 },
  { note: "G#1", freq: 51.91 },
  { note: "A1", freq: 55 },
  { note: "A#1", freq: 58.27 },
  { note: "B1", freq: 61.74 },
  { note: "C2", freq: 65.41 },
  { note: "C#2", freq: 69.3 },
  { note: "D2", freq: 73.42 },
  { note: "D#2", freq: 77.78 },
  { note: "E2", freq: 82.41 },
  { note: "F2", freq: 87.31 },
  { note: "F#2", freq: 92.5 },
  { note: "G2", freq: 98 },
  { note: "G#2", freq: 103.83 },
  { note: "A2", freq: 110 },
  { note: "A#2", freq: 116.54 },
  { note: "B2", freq: 123.47 },
  { note: "C3", freq: 130.81 },
  { note: "C#3", freq: 138.59 },
  { note: "D3", freq: 146.83 },
  { note: "D#3", freq: 155.56 },
  { note: "E3", freq: 164.81 },
  { note: "F3", freq: 174.61 },
  { note: "F#3", freq: 185 },
  { note: "G3", freq: 196 },
  { note: "G#3", freq: 207.65 },
  { note: "A3", freq: 220 },
  { note: "A#3", freq: 233.08 },
  { note: "B3", freq: 246.94 },
  { note: "C4", freq: 261.63 },
  { note: "C#4", freq: 277.18 },
  { note: "D4", freq: 293.66 },
  { note: "D#4", freq: 311.13 },
  { note: "E4", freq: 329.63 },
  { note: "F4", freq: 349.23 },
  { note: "F#4", freq: 369.99 },
  { note: "G4", freq: 392 },
  { note: "G#4", freq: 415.3 },
  { note: "A4", freq: 440 },
  { note: "A#4", freq: 466.16 },
  { note: "B4", freq: 493.88 },
  { note: "C5", freq: 523.25 },
  { note: "C#5", freq: 554.37 },
  { note: "D5", freq: 587.33 },
  { note: "D#5", freq: 622.25 },
  { note: "E5", freq: 659.25 },
  { note: "F5", freq: 698.46 },
  { note: "F#5", freq: 739.99 },
  { note: "G5", freq: 783.99 },
  { note: "G#5", freq: 830.61 },
  { note: "A5", freq: 880 },
  { note: "A#5", freq: 932.33 },
  { note: "B5", freq: 987.77 },
  { note: "C6", freq: 1046.5 },
  { note: "C#6", freq: 1108.73 },
  { note: "D6", freq: 1174.66 },
  { note: "D#6", freq: 1244.51 },
  { note: "E6", freq: 1318.51 },
  { note: "F6", freq: 1396.91 },
  { note: "F#6", freq: 1479.98 },
  { note: "G6", freq: 1567.98 },
  { note: "G#6", freq: 1661.22 },
  { note: "A6", freq: 1760 },
  { note: "A#6", freq: 1864.66 },
  { note: "B6", freq: 1975.53 },
  { note: "C7", freq: 2093 },
  { note: "C#7", freq: 2217.46 },
  { note: "D7", freq: 2349.32 },
  { note: "D#7", freq: 2489.02 },
  { note: "E7", freq: 2637.02 },
  { note: "F7", freq: 2793.83 },
  { note: "F#7", freq: 2959.96 },
  { note: "G7", freq: 3135.96 },
  { note: "G#7", freq: 3322.44 },
  { note: "A7", freq: 3520 },
  { note: "A#7", freq: 3729.31 },
  { note: "B7", freq: 3951.07 },
  { note: "C8", freq: 4186.01 },
  { note: "C#8", freq: 4434.92 },
  { note: "D8", freq: 4698.63 },
  { note: "D#8", freq: 4978.03 },
  { note: "E8", freq: 5274.04 },
  { note: "F8", freq: 5587.65 },
  { note: "F#8", freq: 5919.91 },
  { note: "G8", freq: 6271.93 },
  { note: "G#8", freq: 6644.88 },
  { note: "A8", freq: 7040 },
  { note: "A#8", freq: 7458.62 },
  { note: "B8", freq: 7902.13 },
];

function activation(t) {
  return ((1 - cos(2 * PI * t)) / 2) ** 1;
}

function setup() {
  createCanvas(windowWidth, windowHeight, SVG);
  noiseSeed(curSeed);
  randomSeed(1);
  noFill();
  background(0);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function (results) {
    poses = results;
  });

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);


  for (var i = 0; i < NB; i++) {
    Objects[i] = new object(i);
  }
}

function modelReady() {
  console.log('Model Loaded');
}

function object(id) {
    this.id = id;
  
    this.draw = function (spectrum) {
      var t = ((frame_count) % NB_FRAMES) / NB_FRAMES;
      var x0 = lerp(0, windowWidth, this.id / NB);
      var theta = PI / 2;
      var xx = x0;
      var yy = 0;
      var Nt = 40;
      var step = windowHeight / Nt;
      var turn = lerp(0, 0.4, activation((this.id / NB + 0 * t) % 1));
  
      let amp = spectrum[int(map(this.id, 0, NB, 0, spectrum.length - 1))];
      let freq = map(amp, 0, 255, 16.35, 7902.13);  // Map amplitude to frequency range
  
      let closestNote = getClosestNote(freq); // Get the closest note for the current frequency
      let col = noteToColor(closestNote.note);  

      stroke(255, 0, 0);  
      noFill();
      beginShape();
      vertex(xx, yy);
  
      for (var i = 0; i <= Nt; i++) {
        let influence = map(dist(xx, yy, smoothedRightWristX, smoothedRightWristY), 0, width / 2, 1, 0);
        theta += turn * sin(100 * noise(1000) + 2 * PI * (15 * noise(0.2 * this.id / NB, 0.02 * i) + t)) * influence * 2.5;
        xx += step * cos(theta);
        yy += step * sin(theta);
  
        var xx2 = lerp(xx, x0, (i / Nt) * (i / Nt) * (i / Nt) );
        var yy2 = lerp(yy, lerp(0, windowHeight, i / Nt), max((i / Nt), 1 - sqrt(i / Nt)));
  
        // stroke weight changing with distance to wrist with threshold idk if this works
        let distToWrist = dist(xx2, yy2, smoothedRightWristX, smoothedRightWristY);
        let threshold = 200;  // Adjust threshold distance for the effect
        let sw = distToWrist < threshold ? map(distToWrist, 0, threshold, 10, 1) : 1.5; // Thicker stroke only if within threshold distance
        strokeWeight(sw);
        // stroke(300)        
        vertex(xx2, yy2);
      }
      endShape();
    }
    
  }

function getClosestNote (freq) {
  let closestNote = notes[0];
  let recordDiff = Infinity;

  for (let i = 0; i < notes.length; i++) {
    let diff = freq - notes[i].freq;
    if (abs(diff) < abs(recordDiff)) {
      closestNote = notes[i];
      recordDiff = diff;
    }
  }
  return closestNote;
}

// mapping the colours that the composer w synesthesia had allegedly
function noteToColor(note) {
  switch (note.charAt(0)) { 
    case "C":
      return color(255,0,0); // red
    case "C#":
      return color(255, 140, 0); // orange
    case "D":
      return color(255, 215, 0); // yellow
    case "D#":
      return color(46, 139, 87); // Green
    case "E":
      return color(127, 255, 212); // aqua
    case "F":
      return color(135, 206, 250); // light sky blue
    case "F#":
      return color(100, 149, 237); // Indigo (cornflower blue though)
    case "G":
      return color(148, 0, 211); // Violet
    case "G#":
      return color(128, 0, 128); // Purple
    case "A":
      return color(255, 192, 203); // Pink
    case "A#":
      return color(147, 112, 219); // Magenta (m edium purp)
    case "B":
      return color(255, 192, 203); // Light Pink
    default:
      return color(300); 
  }
}



function mousePressed() {
  curSeed = floor(random() * 10000);
  noiseSeed(curSeed);
  console.log(curSeed);
}

function draw() {
  background(0);


  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  if (poses.length > 0) {
    let pose = poses[0].pose;
    rightWristX = width - pose.rightWrist.x;  
    rightWristY = pose.rightWrist.y;


    smoothedRightWristX = lerp(smoothedRightWristX, rightWristX, 0.2);
    smoothedRightWristY = lerp(smoothedRightWristY, rightWristY, 0.2);
  }

  var t = ((frame_count) % NB_FRAMES) / NB_FRAMES;

  let spectrum = fft.analyze();
  if (spectrum.length === 0) {
    console.error("FFT analysis is not returning data. Check microphone input and permissions.");
  } else {
    console.log("FFT spectrum:", spectrum); 
  }
  for (var i = 0; i < NB; i++) Objects[i].draw(spectrum);

  noStroke();
  fill(255);
  frame_count++;


  
}













