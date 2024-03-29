import hexRgb from 'hex-rgb';
import lerpColor from '@sunify/lerp-color';

const violetPalette = shuffle(['#000', '#000']);
const violetLerp = lerpColor(violetPalette);
const goldPalette = ['#360d2a', '#3e0f30', '#471137', '#51133f', '#5c1648', '#691952', '#771c5d', '#88206a', '#9d257a', '#b92c90', '#ff3cc7', '#fa748b', '#f98b73', '#f79c61', '#f6a952', '#f5b546', '#f4bf3b', '#f4c831', '#f3d029', '#f2d721', '#f2de1a', '#f1e414', '#f1e90e', '#f1ee09', '#f0f204', '#f0f600', '#c5f329', '#9ef04f', '#7cee70', '#5fec8d', '#45eaa5', '#30e8ba', '#1fe7ca', '#11e6d7', '#08e6e1', '#02e5e6', '#00e5e8'];

export function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

shuffle(goldPalette);

const sumColor = (color) => hexRgb(color, { format: 'array' }).slice(0, 3).reduce((a, b) => a + b);
const isTooBright = (color) => sumColor(color) > 340; // ToDo: improve algo (with hsl?)
const sortedPalette = goldPalette.slice(1, -1).sort((a, b) => sumColor(a) - sumColor(b));
const darkest = sortedPalette[0];
const bgColor = goldPalette[goldPalette.length - 1];
const frColor = isTooBright(bgColor) ? darkest : '#FFF';
const hoverColor = (() => {
  const p = sortedPalette.filter((c) => c !== frColor);
  return p[Math.round(p.length / 5) * (isTooBright(bgColor) ? 1 : 4)];
})();
document.documentElement.style.setProperty('--background', bgColor);
document.documentElement.style.setProperty('--foreground', frColor);
document.documentElement.style.setProperty('--hover', hoverColor);
document.body.style.backgroundColor = goldPalette[0];
document.body.style.color = isTooBright(goldPalette[0]) ? darkest : '#FFF';

// const palette = shuffle(palettes[1]);

const printFloat = (n) => (n % 1 ? String(n) : `${n}.0`);
const colors = [...violetPalette]
  .map((c) => hexRgb(c, { format: 'array' }))
  .map((c) =>
    c
      .slice(0, 3)
      .map((n) => n / 255)
      .map(printFloat)
  );
const colors2 = [...goldPalette]
  .map((c) => hexRgb(c, { format: 'array' }))
  .map((c) =>
    c
      .slice(0, 3)
      .map((n) => n / 255)
      .map(printFloat)
  );

export default `
precision highp float;

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform float pixelSteps;
uniform vec2 offset;
uniform vec2 resolution;

//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

vec4 permute(vec4 x) {
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

//	Classic Perlin 3D Noise
//	by Stefan Gustavson
//
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

bool inRange(float n, float base, float width) {
  return n > base && (n < base + width);
}

vec4 paletteColor2(float n, float steps) {
  if (steps > 0.0) {
    float stepSize = 1.0 / steps;
    n = floor(n / stepSize) * stepSize;
  }

  ${colors2
    .map(([r, g, b], i) => `vec4 c${i} = vec4(${r}, ${g}, ${b}, 1);`)
    .join('\n')}

  ${colors2
    .map((_, i) => `float step${i} = ${printFloat(i / (colors2.length - 1))};`)
    .join('\n')}

  vec4 color = mix(c0, c1, smoothstep(step0, step1, n));
  ${colors2
    .slice(2)
    .map(
      (_, i) =>
        `color = mix(color, c${i + 2}, smoothstep(step${i + 1}, step${
          i + 2
        }, n));`
    )
    .join('\n')}
  return color;
}


float bounceOut(float t) {
  float a = 4.0 / 11.0;
  float b = 8.0 / 11.0;
  float c = 9.0 / 10.0;

  float ca = 4356.0 / 361.0;
  float cb = 35442.0 / 1805.0;
  float cc = 16061.0 / 1805.0;

  float t2 = t * t;

  return t < a
    ? 7.5625 * t2
    : t < b
      ? 9.075 * t2 - 9.9 * t + 3.4
      : t < c
        ? ca * t2 - cb * t + cc
        : 10.8 * t * t - 20.52 * t + 10.72;
}

float bounceInOut(float t) {
  if (t < 0.335) {
    return t / 100.0;
  }
  // if (t > 0.69) {
  //   return 1.0;
  // }
  return t < 0.5
    ? 0.5 * (1.0 - bounceOut(1.0 - t * 2.0))
    : 0.5 * bounceOut(t * 2.0 - 1.0) + 0.5;
}

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                        vec2(12.9898,78.233)))*
        43758.5453123);
}

void main( void ) {
  vec2 position = (gl_FragCoord.xy / resolution.xy);
  position.x *= resolution.x/resolution.y;

  // scale — lower is closer
  position *= 1.8;

  float palleteSteps = 20000.0;
  float n = cnoise(vec3(position, time));
  float n1 = random(position + time / 10.0) / 15.0;
  position *= n * cos(n);
  n = cnoise(vec3(position, time));

  vec4 color = vec4(0.0, 0.0, 0.0, 1);
  color = paletteColor2(bounceInOut(n), palleteSteps);

  // if (inRange(n, 0.0, 0.2)) {
  //   color = paletteColor2(bounceInOut((n - 0.0) / 0.2), palleteSteps);
  // }
  // if (inRange(n, 0.3, 0.2)) {
  //   color = paletteColor2(bounceInOut((n - 0.3) / 0.2), palleteSteps);
  // }
  // if (inRange(n, 0.6, 0.2)) {
  //   color = paletteColor2(bounceInOut((n - 0.5) / 3.2), palleteSteps);
  // }
  color += n1;

  gl_FragColor = color;
}
`;
