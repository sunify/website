webpackHotUpdate(9,{

/***/ 24:
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n\tvalue: true\n});\nexports['default'] = draw;\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }\n\nvar _utilsDst = __webpack_require__(10);\n\nvar _utilsDst2 = _interopRequireDefault(_utilsDst);\n\nfunction draw(diagram) {\n\tfor (var i = 0, max = diagram.edges.length; i < max; i++) {\n\t\tvar _diagram$edges$i = diagram.edges[i];\n\t\tvar va = _diagram$edges$i.va;\n\t\tvar vb = _diagram$edges$i.vb;\n\n\t\tthis.beginPath();\n\t\tthis.lineWidth = 1;\n\t\tthis.strokeStyle = Math.random() > 0.5 ? 'rgba(50,' + Math.round(3.5 / (0, _utilsDst2['default'])(va, vb) * 255) + ',255, ' + 3.5 / (0, _utilsDst2['default'])(va, vb) + ')' : 'rgba(250,' + Math.round(3.5 / (0, _utilsDst2['default'])(va, vb) * 255) + ',50, ' + 3.5 / (0, _utilsDst2['default'])(va, vb) + ')';\n\t\tthis.moveTo(va.x, va.y);\n\t\tthis.lineTo(vb.x, vb.y);\n\t\tthis.stroke();\n\t}\n}\n\nmodule.exports = exports['default'];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/drawers/ice-fire.js\n ** module id = 24\n ** module chunks = 9\n **/\n//# sourceURL=webpack:///./src/drawers/ice-fire.js?");

/***/ }

})