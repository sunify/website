webpackJsonp([13],{

/***/ 10:
/***/ function(module, exports, __webpack_require__) {

	eval("\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\nexports[\"default\"] = dst;\n\nfunction dst(p1, p2) {\n\treturn Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));\n}\n\nmodule.exports = exports[\"default\"];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/utils/dst.js\n ** module id = 10\n ** module chunks = 9 10 11 12 13 14 15 16\n **/\n//# sourceURL=webpack:///./src/utils/dst.js?");

/***/ },

/***/ 17:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n\tvalue: true\n});\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }\n\nvar _drawersNeuro = __webpack_require__(18);\n\nvar _drawersNeuro2 = _interopRequireDefault(_drawersNeuro);\n\nvar _dot = __webpack_require__(7);\n\nvar _dot2 = _interopRequireDefault(_dot);\n\nvar dots = [];\nfor (var i = 0; i < 15; i += 1) {\n\tfor (var j = 0; j < 10; j += 1) {\n\t\tdots.push((0, _dot2['default'])(i * 70, j * 70));\n\t}\n}\n\nexports['default'] = { drawer: _drawersNeuro2['default'], dots: dots, time: 1000, offset: 20 };\nmodule.exports = exports['default'];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/presets/neuro.js\n ** module id = 17\n ** module chunks = 13\n **/\n//# sourceURL=webpack:///./src/presets/neuro.js?");

/***/ },

/***/ 18:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n\tvalue: true\n});\nexports['default'] = draw;\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }\n\nvar _utilsDst = __webpack_require__(10);\n\nvar _utilsDst2 = _interopRequireDefault(_utilsDst);\n\nfunction draw(diagram) {\n\tthis.canvas.width = this.canvas.width;\n\n\tfor (var i = 0, max = diagram.edges.length; i < max; i++) {\n\t\tvar _diagram$edges$i = diagram.edges[i];\n\t\tvar va = _diagram$edges$i.va;\n\t\tvar vb = _diagram$edges$i.vb;\n\n\t\tthis.beginPath();\n\t\tthis.lineWidth = 1;\n\t\tthis.strokeStyle = 'rgba(255,' + Math.round(3.5 / (0, _utilsDst2['default'])(va, vb) * 255) + ',0, ' + 3.5 / (0, _utilsDst2['default'])(va, vb) + ')';\n\t\tthis.moveTo(va.x, va.y);\n\t\tthis.lineTo(vb.x, vb.y);\n\t\tthis.stroke();\n\t}\n}\n\nmodule.exports = exports['default'];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/drawers/neuro.js\n ** module id = 18\n ** module chunks = 13\n **/\n//# sourceURL=webpack:///./src/drawers/neuro.js?");

/***/ }

});