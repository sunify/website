parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"VCqk":[function(require,module,exports) {
module.exports=function(n,e){var t=1e3/e,o=Date.now(),r=!1;return function e(){requestAnimationFrame(e);var a=Date.now(),u=a-o;u>t&&!r&&(o=a-u%t,n(a))}(),function(){r=!0}};
},{}],"FO+Z":[function(require,module,exports) {
"use strict";function t(t,a){return(a-t)*Math.random()+t}function a(t,a,r,e){return Math.hypot(t-r,a-e)}function r(t,a,r,e){var s=r-t,n=e-a;return 1.426776695*Math.min(.7071067812*(Math.abs(s)+Math.abs(n)),Math.max(Math.abs(s),Math.abs(n)))}Object.defineProperty(exports,"__esModule",{value:!0}),exports.random=t,exports.dist=a,exports.distFast=r;
},{}],"Focm":[function(require,module,exports) {
"use strict";var r=e(require("run-with-fps")),t=require("./utils");function e(r){return r&&r.__esModule?r:{default:r}}function n(r){return a(r)||o(r)||i()}function i(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function o(r){if(Symbol.iterator in Object(r)||"[object Arguments]"===Object.prototype.toString.call(r))return Array.from(r)}function a(r){if(Array.isArray(r)){for(var t=0,e=new Array(r.length);t<r.length;t++)e[t]=r[t];return e}}function u(r,t){return l(r)||s(r,t)||c()}function c(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function s(r,t){var e=[],n=!0,i=!1,o=void 0;try{for(var a,u=r[Symbol.iterator]();!(n=(a=u.next()).done)&&(e.push(a.value),!t||e.length!==t);n=!0);}catch(c){i=!0,o=c}finally{try{n||null==u.return||u.return()}finally{if(i)throw o}}return e}function l(r){if(Array.isArray(r))return r}var d=document.getElementById("gridSize"),f=document.getElementById("gridVisibility"),h=document.getElementById("gridSizeValue"),y=document.getElementById("canvas"),v=y.getContext("2d"),m=window.innerWidth,g=window.innerHeight,p={size:1,visible:f.checked,get cols(){return m/this.size},get rows(){return g/this.size}},x=function(r){p.size=Number(r.value),h.innerText="Grid: ".concat(p.size,"px")};x(d),d.addEventListener("input",function(r){x(r.target)}),f.addEventListener("change",function(r){p.visible=r.target.checked});var w=document.createElement("canvas"),b=w.getContext("2d");w.width=m,w.height=g;var z=document.createElement("canvas"),E=z.getContext("2d"),M=function(r){return(r>>>0).toString(2).padStart(4,"0")},S=Array.from(new Array(16),function(r,t){return M(t).split("").map(Number)}),A=[[0,0],[1,0],[1,1],[0,1]],I=[{color:[0,255,170],radius:50,x:m/2+30,y:g/2-30,vx:(0,t.random)(-2,2),vy:(0,t.random)(-2,2)},{color:[0,255,170],radius:40,x:m/2+100,y:g/2-30,vx:(0,t.random)(-5,2),vy:(0,t.random)(-2,5)},{color:[255,255,0],radius:75,x:m/2+40,y:g/2+40,vx:(0,t.random)(-5,2),vy:(0,t.random)(-2,5)},{color:[255,255,0],radius:60,x:m/2,y:g/2,vx:(0,t.random)(-2,2),vy:(0,t.random)(-2,2)}];function C(){v.fillStyle="#000",y.width=m,w.width=m,z.width=m,q(),j(),v.drawImage(w,0,0),v.globalCompositeOperation="source-in",O(),v.drawImage(z,0,0),v.globalCompositeOperation="source-over",p.visible&&P()}function k(){I.forEach(function(r){v.strokeStyle="#000",v.beginPath(),v.arc(r.x,r.y,r.radius,0,360),v.stroke()})}function j(){v.fillStyle="#000";var r=[];I.forEach(function(t){for(var e=4*t.radius,n=Math.max(0,Math.floor((t.x-e)/p.size)),i=Math.max(0,Math.floor((t.y-e)/p.size)),o=Math.min(p.cols,Math.floor((t.x+e)/p.size)),a=Math.min(p.cols,Math.floor((t.y+e)/p.size)),c=function(t){for(var e=function(e){var n=e*p.cols+t;if(!r[n]){var i=A.map(function(r){var n=u(r,2),i=n[0],o=n[1];return R((i+t)*p.size,(o+e)*p.size)}),o=N(i);o&&T(t,e,B(o,i)),r[n]=!0}},n=i;n<a;++n)e(n)},s=n;s<o;++s)c(s)})}function O(){I.forEach(function(r){E.globalCompositeOperation="source-over";var t=E.createRadialGradient(r.x,r.y,0*r.radius,r.x,r.y,2.5*r.radius);t.addColorStop(0,"rgba(".concat(r.color.join(", "),", 1)")),t.addColorStop(1,"rgba(".concat(r.color.join(", "),", 0)")),E.fillStyle=t,E.fillRect(r.x-2.5*r.radius,r.y-2.5*r.radius,5*r.radius,5*r.radius),E.fillRect(r.x-2.5*r.radius,r.y-2.5*r.radius,5*r.radius,5*r.radius)})}function T(r,t,e){b.strokeStyle="#0f0",e.forEach(function(e){b.beginPath(),b.moveTo((r+e[0])*p.size,(t+e[1])*p.size);for(var n=2;n<e.length;n+=2)b.lineTo((r+e[n])*p.size,(t+e[n+1])*p.size);b.fill()})}function B(r,t){return r.map(function(r){for(var e=0;e<r.length;e+=2){var i=r[e],o=r[e+1];(0!==i&&1!==i||0!==o&&1!==o)&&(0!==i&&1!==i||(r[e+1]=V.apply(void 0,n(0===i?[t[0],t[3]]:[t[1],t[2]]))),0!==o&&1!==o||(r[e]=V.apply(void 0,n(0===o?[t[0],t[1]]:[t[3],t[2]]))))}return r})}function P(){v.strokeStyle="#555",v.lineWidth=.1;for(var r=0;r<p.cols;++r)for(var t=0;t<p.rows;++t)v.beginPath(),v.rect(r*p.size,t*p.size,p.size,p.size),v.stroke()}function R(r,t){return I.reduce(function(e,n){return e+Math.pow(n.radius,2)/(Math.pow(n.x-r,2)+Math.pow(n.y-t,2))},0)}function q(){I.forEach(function(r){var t=Date.now()/1e3;r.ox=r.ox||r.x,r.oy=r.oy||r.y,r.x=r.ox+Math.cos(t)*r.radius*r.vx*.3,r.y=r.oy+Math.sin(t)*r.radius*r.vy+20*Math.cos(t)})}function G(r,t){return r.reduce(function(r,e,n){return r&&e===t[n]},!0)}function L(r){return M(S.findIndex(G.bind(null,r)))}function N(r){switch(L(r.map(function(r){return r>=1?1:0}))){case"0001":return[[0,.5,.5,1,0,1]];case"0010":return[[1,.5,.5,1,1,1]];case"0011":return[[0,.5,1,.5,1,1,0,1]];case"0100":return[[.5,0,1,.5,1,0]];case"0101":return[[0,.5,.5,0,1,0,1,.5,.5,1,0,1]];case"0110":return[[.5,0,.5,1,1,1,1,0]];case"0111":return[[0,.5,.5,0,1,0,1,1,0,1]];case"1000":return[[0,.5,.5,0,0,0]];case"1001":return[[.5,0,.5,1,0,1,0,0]];case"1010":return[[0,.5,.5,1,1,1,1,.5,.5,0,0,0]];case"1011":return[[.5,0,1,.5,1,1,0,1,0,0]];case"1100":return[[0,.5,1,.5,1,0,0,0]];case"1101":return[[.5,1,1,.5,1,0,0,0,0,1]];case"1110":return[[0,.5,.5,1,1,1,1,0,0,0]];case"1111":return[[0,0,1,0,1,1,0,1]]}}function V(r,t){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1;return r===t?null:e+(n-e)*(1-r)/(t-r)}y.width=m,y.height=g,z.width=m,z.height=g,(0,r.default)(C,30);
},{"run-with-fps":"VCqk","./utils":"FO+Z"}]},{},["Focm"], null)
//# sourceMappingURL=/metaballs-marching-squares.823d326d.map