import runWithFps from 'run-with-fps';
import { palette } from './drawNoise';
import { PIXEL_RATIO } from './constants';
import noiseShader from './noise.glsl';

const RESOLUTION = PIXEL_RATIO;

const bg = document.querySelector('.bg');
const canvas = document.getElementById('bg');

// document.documentElement.style.setProperty('--primary', colors.primary);
// document.documentElement.style.setProperty(
//   '--primary-fade',
//   `${colors.primary}AA`
// );
// document.documentElement.style.setProperty(
//   '--secondary',
//   lerp(colors.secondary, '#FFF', 0.6)
// );

bg.style.backgroundColor =
  palette[Math.round(Math.random() * (palette.length - 1))];

// mostly copy-pasted from glslsandbox

let gl;
let buffer;
let currentProgram;
let vertexPosition;
let screenVertexPosition;
const parameters = {
  startTime: Date.now(),
  timeOffset: Math.random() * 1000,
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
  height: 1,
  isPanning: false,
  isZooming: false,
  lastX: 0,
  lastY: 0
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
  const fragment = noiseShader;
  const vertex = document.getElementById('surfaceVertexShader').textContent;
  const vs = createShader(vertex, gl.VERTEX_SHADER);
  const fs = createShader(fragment, gl.FRAGMENT_SHADER);
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
  cacheUniformLocation(program, 'time');
  cacheUniformLocation(program, 'offset');
  cacheUniformLocation(program, 'resolution');
  cacheUniformLocation(program, 'backbuffer');
  cacheUniformLocation(program, 'surfaceSize');
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
  const fragment = document.getElementById('fragmentShader').textContent;
  const vertex = document.getElementById('vertexShader').textContent;
  const vs = createShader(vertex, gl.VERTEX_SHADER);
  const fs = createShader(fragment, gl.FRAGMENT_SHADER);
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

function onWindowResize() {
  canvas.width = window.innerWidth * RESOLUTION;
  canvas.height = window.innerHeight * RESOLUTION;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  parameters.screenWidth = canvas.width;
  parameters.screenHeight = canvas.height;
  computeSurfaceCorners();
  if (gl) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    createRenderTargets();
  }
}
function render() {
  if (!currentProgram) return;
  parameters.time = Date.now() - parameters.startTime;
  // Set uniforms for custom shader
  gl.useProgram(currentProgram);
  gl.uniform1f(
    currentProgram.uniformsCache['time'],
    parameters.time + parameters.timeOffset
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
const stop = runWithFps(render, 24);

// Handle hot module replacement
if (module.hot) {
  module.hot.dispose(() => {
    if (stop) {
      stop();
    }
  });
}
