// I/O
let context = false;
let speakerNode = false;
let recorderNode = false;

// Prefs
let shift = 1;
let type = "sine";

// View IDs
const display = '#display';
const indicator = '#indicator';
const player = '#player';
const record = '#record';
const stop = '#stop';
const refresh = '#refresh';
const raiseFreq = '#raise';
const lowerFreq = '#lower';
const sineWave = '#sine';
const squareWave = '#square';
const triangleWave = '#triangle';
const sawtoothWave = '#sawtooth';
const clSound = '#cl';
const csSound = '#cs';
const dSound = '#d';
const efSound = '#ef';
const eSound = '#e';
const fSound = '#f';
const fsSound = '#fs';
const gSound = '#g';
const gsSound = '#gs';
const aSound = '#a';
const bfSound = '#bf';
const bSound = '#b';
const chSound = '#ch';
const sound = '.sound-pad';

$(document).ready(function () {
  if (!context) {
    $(display).
    on('click', initializeAudioContext);
    $(document).
    on('keypress', initializeAudioContext);
  }
});

function initializeAudioContext(listener) {
  getAudioContext().
  then(
  value => {
    context = value;
    speakerNode = context.destination;
    recorderNode = context.createMediaStreamDestination();
    connectAudioDestination();
    $(display).text('\xA0');
    $(record).attr('disabled', false);
    $(stop).attr('disabled', false);
    $(document).
    off('keypress', initializeAudioContext);
  }).catch(
  reason => {
    console.log(reason);
  });
}

function getAudioContext() {
  return new Promise((resolve, reject) => {
    resolve(
    new (
    window.AudioContext ||
    window.webkitAudioContext)());

    reject(
    "Your browser rejected a request to access the Web Audio API, a required component");
  });
}

function connectAudioDestination() {

  $(record).on('click', () => {
    $(record).unbind();
    $(record).attr('disabled', true);
    captureMediaStream(recorderNode.stream);
  });

  $(sound).on('click', () => {
    let id = '#' + event.target.id;
    console.log(id);
    shift = idToShift(id);
    type = idToType(id);
    playPad(id);
  });

  $(document).keypress(e => {
    let key = e.which;
    console.log("press" + key);
    let id = keypressToId(key);
    type = idToType(id);
    playPad(id);
  });

  $(document).keydown(e => {
    let key = e.which;
    console.log("down" + key);
    let id = keyToId(key);
    $(id).addClass('active');
    shift = idToShift(id);
  });

  $(document).keyup(e => {
    let key = e.which;
    console.log("up" + key);
    let id = keyToId(key);
    $(id).removeClass('active');
    if (key == 186 || key == 222) shift = idToShift(key);
  });
}

function captureMediaStream(stream) {

  let recorder = new MediaRecorder(stream);
  let initial = 0;
  let chunks = [];
  let interval;

  console.log('start');
  recorder.start();
  initial = Date.now();

  $(indicator).text('0:00:00');
  interval = setInterval(() => {
    let elapsed = Date.now() - initial;
    let timer = new
    Date(Math.floor(elapsed)).
    toISOString().slice(12, -5);
    $(indicator).text(timer);
  }, 1000);

  $(stop).on('click',
  () => {
    console.log('stop');
    recorder.stop();
    clearInterval(interval);
  });

  recorder.onstop = e => {
    console.log('onstop');
    $(stop).attr('disabled', true);
    $(record).attr('disabled', false);
    $(record).text('↶');
    let blob = new Blob(
    chunks,
    { 'type': 'audio/ogg; codecs=opus' });

    chunks = [];
    let url = URL.createObjectURL(blob);
    $(player).attr('src', url);
    $(indicator).html(
    '<a style="display:inline-block; width:100%; height:100% font-weight: bold;" target=_blank download="recording.ogg" href="' + url + '">↧</a>');
    $(record).on('click', e => {
      if ($(record).text() != '↶') return;
      history.go(0);
    });
  };

  recorder.ondataavailable = e => {
    console.log('ondataavailable');
    chunks.push(e.data);
  };
}

function idToShift(id) {
  switch (id) {
    case raiseFreq:return 2;
    case lowerFreq:return 0.5;
    default:return shift;
  }
}

function idToType(id) {
  switch (id) {
    case sineWave:return "sine";
    case squareWave:return "square";
    case triangleWave:return "triangle";
    case sawtoothWave:return "sawtooth";
    default:return type;
  }
}

function keyToId(key) {
  switch (key) {
    case 65:return clSound;
    case 87:return csSound;
    case 83:return dSound;
    case 69:return efSound;
    case 68:return eSound;
    case 70:return fSound;
    case 82:return fsSound;
    case 74:return gSound;
    case 85:return gsSound;
    case 75:return aSound;
    case 73:return bfSound;
    case 76:return bSound;
    case 186:return chSound;
    case 72:return raiseFreq;
    case 80:return raiseFreq;
    case 71:return lowerFreq;
    case 81:return lowerFreq;
    case 67:return sineWave;
    case 86:return squareWave;
    case 78:return triangleWave;
    case 77:return sawtoothWave;
    case 79:return refresh;
    case 32:return refresh;
    default:return false;
  }
}

function keypressToId(key) {
  switch (key) {
    case 97:return clSound;
    case 119:return csSound;
    case 115:return dSound;
    case 101:return efSound;
    case 100:return eSound;
    case 102:return fSound;
    case 114:return fsSound;
    case 106:return gSound;
    case 117:return gsSound;
    case 107:return aSound;
    case 105:return bfSound;
    case 108:return bSound;
    case 59:return chSound;
    case 104:return raiseFreq;
    case 112:return raiseFreq;
    case 103:return lowerFreq;
    case 113:return lowerFreq;
    case 99:return sineWave;
    case 118:return squareWave;
    case 110:return triangleWave;
    case 109:return sawtoothWave;
    case 111:return refresh;
    case 32:return refresh;
    default:return false;
  }
}

function idToFrequency(id) {
  switch (id) {
    case clSound:return 1047;
    case csSound:return 1109;
    case dSound:return 1175;
    case efSound:return 1245;
    case eSound:return 1319;
    case fSound:return 1397;
    case fsSound:return 1480;
    case gSound:return 1568;
    case gsSound:return 1661;
    case aSound:return 1760;
    case bfSound:return 1865;
    case bSound:return 1976;
    case chSound:return 2093;
    default:return 0;
  }
}

function frequencyToSound(frequency) {

  let osc = context.createOscillator();
  let gain = context.createGain();
  gain.gain.exponentialRampToValueAtTime(
  0.00001, context.currentTime + 3.5);

  gain.connect(recorderNode);
  gain.connect(speakerNode);
  osc.connect(gain);
  osc.frequency.value = frequency;
  console.log(osc.frequency);
  osc.type = type;
  return osc;
}

function frequencyToPitch(frequency) {
  if (frequency >= 4186) return 5;
  if (frequency >= 2093) return 4;
  if (frequency >= 1046) return 3;
  return 2;
}

function idToNote(frequency) {
  switch (frequency) {
    case clSound:return 'C';
    case csSound:return 'C#';
    case dSound:return 'D';
    case efSound:return 'Eb';
    case eSound:return 'E';
    case fSound:return 'F';
    case fsSound:return 'F#';
    case gSound:return 'G';
    case gsSound:return 'G#';
    case aSound:return 'A';
    case bfSound:return 'Bb';
    case bSound:return 'B';
    case chSound:return 'C';
    default:return '';
  }
}

function typeAsSymbol() {
  switch (type) {
    case 'sine':return '∿';
    case 'square':return '⊓';
    case 'triangle':return 'v';
    case 'sawtooth':return 'ᴎ';
    default:return '';
  }
}

function playPad(id) {
  if (id == refresh) {
    shift = 1;
    type = 'sine';
    $(display).text('\xA0');
    return;
  }
  let frequency = Math.floor(idToFrequency(id) * shift);
  let sound = frequencyToSound(frequency);
  sound.start();
  if (frequency != 0)
  $(display).text(
  idToNote(id) + frequencyToPitch(frequency) + typeAsSymbol());

}
