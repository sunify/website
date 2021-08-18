import runWithFps from 'run-with-fps';
import tweeen from 'tweeen';
import cubicIn from 'eases/cubic-in';
import cubicOut from 'eases/cubic-out';
import { PIXEL_RATIO } from './constants';

import noiseShader, { shuffle } from './shaders/noise.js';
import screenFrag from './shaders/screenFragment.glsl';
import vertexShader from './shaders/vertexShader.glsl';
import surfaceVertexShader from './shaders/surfaceVertex.glsl';

const canvas = document.getElementById('bg');
const bg = document.querySelector('.bg-wrapper');

// mostly copy-pasted from glslsandbox
let gl;
let buffer;
let currentProgram;
let vertexPosition;
let screenVertexPosition;

const niceSeeds = [
  -51216,
  266970,
  -327558,
  347327,
  353216,
  318628,
  292671,
  3173416
];
let seed = shuffle(niceSeeds)[0] + (0.5 - Math.random()) * 10000;
// seed = (0.5 - Math.random()) * 1000000;
const parameters = {
  startTime: Date.now(),
  timeOffset: seed,
  time: 0,
  offsetX: (0.5 - Math.random()) * 10,
  offsetY: (0.5 - Math.random()) * 10,
  screenWidth: 0,
  screenHeight: 0
};
const surface = {
  centerX: 0,
  centerY: 0,
  width: 1,
  height: 1
};
let frontTarget, backTarget, screenProgram;

// Initialise WebGL
try {
  gl = canvas.getContext('experimental-webgl', {
    preserveDrawingBuffer: true
  });
} catch (error) {}
if (gl) {
  // enable dFdx, dFdy, fwidth
  gl.getExtension('OES_standard_derivatives');
  // Create vertex buffer (2 triangles)
  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0
    ]),
    gl.STATIC_DRAW
  );
  // Create surface buffer (coordinates at screen corners)
  surface.buffer = gl.createBuffer();
}
// initialize code editor
compile();

onWindowResize();
window.addEventListener('resize', onWindowResize, false);
compileScreenProgram();

function computeSurfaceCorners() {
  if (gl) {
    surface.width =
      (surface.height * parameters.screenWidth) / parameters.screenHeight;

    var halfWidth = surface.width * 0.5,
      halfHeight = surface.height * 0.5;

    gl.bindBuffer(gl.ARRAY_BUFFER, surface.buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        surface.centerX - halfWidth,
        surface.centerY - halfHeight,
        surface.centerX + halfWidth,
        surface.centerY - halfHeight,
        surface.centerX - halfWidth,
        surface.centerY + halfHeight,
        surface.centerX + halfWidth,
        surface.centerY - halfHeight,
        surface.centerX + halfWidth,
        surface.centerY + halfHeight,
        surface.centerX - halfWidth,
        surface.centerY + halfHeight
      ]),
      gl.STATIC_DRAW
    );
  }
}

function compile() {
  const program = gl.createProgram();
  const vs = createShader(surfaceVertexShader, gl.VERTEX_SHADER);
  const fs = createShader(noiseShader, gl.FRAGMENT_SHADER);
  if (vs == null || fs == null) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program);
    console.error(error);
    console.error(
      'VALIDATE_STATUS: ' + gl.getProgramParameter(program, gl.VALIDATE_STATUS),
      'ERROR: ' + gl.getError()
    );
    return;
  }
  if (currentProgram) {
    gl.deleteProgram(currentProgram);
    setURL(fragment);
  }
  currentProgram = program;

  // Cache uniforms
  cacheUniformLocation(program, 'pixelSteps');
  cacheUniformLocation(program, 'time');
  cacheUniformLocation(program, 'offset');
  cacheUniformLocation(program, 'resolution');
  cacheUniformLocation(program, 'backbuffer');
  cacheUniformLocation(program, 'surfaceSize');
  cacheUniformLocation(program, 'pallete');
  // Load program into GPU
  gl.useProgram(currentProgram);
  // Set up buffers
  surface.positionAttribute = gl.getAttribLocation(
    currentProgram,
    'surfacePosAttrib'
  );
  gl.enableVertexAttribArray(surface.positionAttribute);
  vertexPosition = gl.getAttribLocation(currentProgram, 'position');
  gl.enableVertexAttribArray(vertexPosition);
}
function compileScreenProgram() {
  if (!gl) {
    return;
  }
  const program = gl.createProgram();
  const vs = createShader(vertexShader, gl.VERTEX_SHADER);
  const fs = createShader(screenFrag, gl.FRAGMENT_SHADER);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      'VALIDATE_STATUS: ' + gl.getProgramParameter(program, gl.VALIDATE_STATUS),
      'ERROR: ' + gl.getError()
    );
    return;
  }
  screenProgram = program;
  gl.useProgram(screenProgram);
  cacheUniformLocation(program, 'resolution');
  cacheUniformLocation(program, 'texture');
  screenVertexPosition = gl.getAttribLocation(screenProgram, 'position');
  gl.enableVertexAttribArray(screenVertexPosition);
}
function cacheUniformLocation(program, label) {
  if (program.uniformsCache === undefined) {
    program.uniformsCache = {};
  }

  if (label === 'palette') {
  }
  program.uniformsCache[label] = gl.getUniformLocation(program, label);
}

function createTarget(width, height) {
  const target = {};
  target.framebuffer = gl.createFramebuffer();
  target.renderbuffer = gl.createRenderbuffer();
  target.texture = gl.createTexture();
  // set up framebuffer
  gl.bindTexture(gl.TEXTURE_2D, target.texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    target.texture,
    0
  );
  // set up renderbuffer
  gl.bindRenderbuffer(gl.RENDERBUFFER, target.renderbuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
  gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER,
    gl.DEPTH_ATTACHMENT,
    gl.RENDERBUFFER,
    target.renderbuffer
  );
  // clean up
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return target;
}
function createRenderTargets() {
  frontTarget = createTarget(parameters.screenWidth, parameters.screenHeight);
  backTarget = createTarget(parameters.screenWidth, parameters.screenHeight);
}

function createShader(src, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader);
    console.error(error);

    return null;
  }
  return shader;
}

const BIG_AREA = 1600 * 1100 * 1.5;
const MEDIUM_AREA = 1600 * 1100;
function getScale() {
  const area = window.innerWidth * window.innerHeight;

  if (area > BIG_AREA) {
    return 0.5;
  }

  if (area > MEDIUM_AREA) {
    return 1;
  }

  if (PIXEL_RATIO === 1) {
    return 1;
  }

  return PIXEL_RATIO * 0.8;
}

function onWindowResize() {
  const scale = getScale();
  const bgWrap = document.querySelector('.bg-wrapper');
  const bgRect = bgWrap.getBoundingClientRect();
  canvas.width = bgRect.width * scale;
  canvas.height = bgRect.height * scale;

  if (Math.abs(canvas.height - parameters.screenHeight) > 100) {
    // ориентация или большой ресайз
    // canvas.width = 6144;
    // canvas.height = 3240;
    parameters.screenWidth = canvas.width;
    parameters.screenHeight = canvas.height;
  }
  computeSurfaceCorners();
  if (gl) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    createRenderTargets();
  }
}
function render() {
  if (!currentProgram) return;
  parameters.time = Date.now() - parameters.startTime;
  parameters.pixelSteps = Math.floor(
    Math.max(10, window.innerHeight - window.scrollY)
  );
  // Set uniforms for custom shader
  gl.useProgram(currentProgram);
  gl.uniform1f(
    currentProgram.uniformsCache['time'],
    (parameters.time + parameters.timeOffset) / 200000
  );
  gl.uniform1f(
    currentProgram.uniformsCache['pixelSteps'],
    parameters.pixelSteps
  );
  gl.uniform2f(
    currentProgram.uniformsCache['offset'],
    parameters.offsetX,
    parameters.offsetY
  );
  gl.uniform2f(
    currentProgram.uniformsCache['resolution'],
    parameters.screenWidth,
    parameters.screenHeight
  );
  gl.uniform1i(currentProgram.uniformsCache['backbuffer'], 0);
  gl.uniform2f(
    currentProgram.uniformsCache['surfaceSize'],
    surface.width,
    surface.height
  );
  gl.bindBuffer(gl.ARRAY_BUFFER, surface.buffer);
  gl.vertexAttribPointer(surface.positionAttribute, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, backTarget.texture);
  // Render custom shader to front buffer
  gl.bindFramebuffer(gl.FRAMEBUFFER, frontTarget.framebuffer);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  // Set uniforms for screen shader
  gl.useProgram(screenProgram);
  gl.uniform2f(
    screenProgram.uniformsCache['resolution'],
    parameters.screenWidth,
    parameters.screenHeight
  );
  gl.uniform1i(screenProgram.uniformsCache['texture'], 1);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(screenVertexPosition, 2, gl.FLOAT, false, 0, 0);

  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, frontTarget.texture);
  // Render front buffer to screen
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  // Swap buffers
  [frontTarget, backTarget] = [backTarget, frontTarget];
}
const stop = runWithFps(render, 30);

let stopScroll;
function scrollTo(y, { duration = 300, ...options } = {}) {
  if (stopScroll) {
    stopScroll();
  }

  stopScroll = tweeen(
    window.scrollY,
    y,
    y => {
      window.scrollTo(0, y);
    },
    {
      easing: cubicOut,
      duration,
      ...options
    }
  );
}

document.querySelectorAll('.js-goto').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const rect = target.getBoundingClientRect();
      scrollTo(rect.top, { duration: 800 });
    }
  });
});

let animationDelay = 400;
function prepareNode(node) {
  if (node.nodeName === '#text') {
    const partial = document.createElement('span');
    partial.innerHTML = node.data.split('').map((char) => {
      animationDelay += 30;
      const html = `<span class="c" style="animation-delay: ${animationDelay}ms">${char}</span>`;
      if ([',', '.', '!'].includes(char)) {
        animationDelay += 200;
      }
      return html;
    }).join('');
    node.parentNode.insertBefore(partial, node.nextSibling);
    node.parentNode.removeChild(node);
  } else if (node.childNodes) {
    node.childNodes.forEach(prepareNode);
  }
}
const wasAnimatedBefore = Boolean(Number(localStorage.getItem('wasAnimatedBefore') || 0));
if (window.scrollY < 100 && !wasAnimatedBefore) {
  prepareNode(document.querySelector('.header p'));
  localStorage.setItem('wasAnimatedBefore', '1');
}
setTimeout(() => {
  document.querySelector('footer').style.opacity = 1;
}, animationDelay + 200);

const content = document.querySelector('.content');
const handleScroll = () => {
  const opacity = cubicIn(
    Math.min(
      1,
      (window.scrollY - window.innerHeight / 2.5) / (window.innerHeight / 2.5)
    )
  );
  content.style.opacity = 1 - opacity;
  bg.style.opacity = (1 - opacity) * 0.5;
};
window.addEventListener('scroll', handleScroll);
handleScroll();

const downloadLink = document.createElement('a');
document.body.appendChild(downloadLink);
downloadLink.style = 'display: none';
function downloadCanvas(fn) {
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = `${fn}.png`;
    downloadLink.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

document.querySelector('.download').addEventListener('click', () => {
  downloadCanvas(`sunify-gold-${Date.now()}`);
});

// Handle hot module replacement
if (module.hot) {
  module.hot.dispose(() => {
    if (stop) {
      stop();
    }
  });
}
