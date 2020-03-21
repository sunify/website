import hexRgb from 'hex-rgb';

const crls = ['#67129b', '#832ed3', '#882be5', '#7329b5', '#530a93'];
const palettes = [
  ['#d71259', '#8e2d56', '#208381', '#eca639', '#73d2de'],
  [...crls],
  ['#832ed3', '#FC0', '#FFC', '#FC0', '#7329b5'],
  ['#820263', '#d90368', '#53dd6c', '#2e294e', '#ffd400']
];

// function shuffle(a) {
//   var j, x, i;
//   for (i = a.length - 1; i > 0; i--) {
//     j = Math.floor(Math.random() * (i + 1));
//     x = a[i];
//     a[i] = a[j];
//     a[j] = x;
//   }
//   return a;
// }

// const palette = shuffle(palettes[1]);

const printFloat = n => (n % 1 ? String(n) : `${n}.0`);
const colors = [...palettes[1]]
  .map(c => hexRgb(c, { format: 'array' }))
  .map(c =>
    c
      .slice(0, 3)
      .map(n => n / 255)
      .map(printFloat)
  );
const colors2 = [...palettes[2]]
  .map(c => hexRgb(c, { format: 'array' }))
  .map(c =>
    c
      .slice(0, 3)
      .map(n => n / 255)
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

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

bool inRange(float n, float base, float width) {
  return n > base && (n < base + width);
}

vec4 paletteColor(float n, float steps) {
  if (steps > 0.0) {
    float stepSize = 1.0 / steps;
    n = floor(n / stepSize) * stepSize;
  }

  ${colors
    .map(([r, g, b], i) => `vec4 c${i} = vec4(${r}, ${g}, ${b}, 1);`)
    .join('\n')}

  ${colors
    .map((_, i) => `float step${i} = ${printFloat(i / (colors.length - 1))};`)
    .join('\n')}

  vec4 color = mix(c0, c1, smoothstep(step0, step1, n));
  ${colors
    .slice(2)
    .map(
      (_, i) =>
        `color = mix(color, c${i + 2}, smoothstep(step${i + 1}, step${i +
          2}, n));`
    )
    .join('\n')}
  //color = mix(color, c2, smoothstep(step1, step2, n));
  //color = mix(color, c3, smoothstep(step2, step3, n));
  //color = mix(color, c4, smoothstep(step3, step4, n));

  return color;
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
        `color = mix(color, c${i + 2}, smoothstep(step${i + 1}, step${i +
          2}, n));`
    )
    .join('\n')}
  //color = mix(color, c2, smoothstep(step1, step2, n));
  //color = mix(color, c3, smoothstep(step2, step3, n));
  //color = mix(color, c4, smoothstep(step3, step4, n));

  return color;
}

float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
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
  vec2 position = (gl_FragCoord.xy / resolution.xy) + offset;
  float n1 = random(position + time);
  n1 = 1.0;
  position.x *= resolution.x/resolution.y;

  // scale — lower is closer
  position *= 0.4;

  // pixelize
  // float stepSize = 1.0 / pixelSteps;
  // position.x = floor(position.x / stepSize) * stepSize;
  // position.y = floor(position.y / stepSize) * stepSize;

  float palleteSteps = 1000.0;
  float n = (snoise(vec3(position, time + n1 / 100.0)) + 1.0) / 2.0;
  vec4 color = mix(paletteColor(n, palleteSteps), vec4(n1), 0.02);

  if (inRange(n, 0.3, 0.005)) {
    n = (n - 0.3) / 0.005;
    color = mix(paletteColor2(n, palleteSteps), vec4(n1), 0.02);
  }
  if (inRange(n, 0.7, 0.005)) {
    n = (n - 0.7) / 0.005;
    color = mix(paletteColor2(n, palleteSteps), vec4(n1), 0.02);
  }

  gl_FragColor = color;
}
`;
