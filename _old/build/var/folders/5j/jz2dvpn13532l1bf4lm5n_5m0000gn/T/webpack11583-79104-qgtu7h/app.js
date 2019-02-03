/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			modules[moduleId] = moreModules[moduleId];
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);

/******/ 	};
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "0db23a2a08b2e9baed06"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				fn[name] = __webpack_require__[name];
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 				else for(var i = 0; i < dep.length; i++)
/******/ 					hot._acceptedDependencies[dep[i]] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else for(var i = 0; i < dep.length; i++)
/******/ 					hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) { if(err) throw err; };
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			for(var chunkId in installedChunks) { // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(+id);
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) { if(err) throw err; };
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) { if(err) throw err; };
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = +id;
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		0:0
/******/ 	};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}

/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);

/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;

/******/ 			script.src = __webpack_require__.p + "" + chunkId + "./var/folders/5j/jz2dvpn13532l1bf4lm5n_5m0000gn/T/webpack11583-79104-qgtu7h/app.js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};

/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("module.exports = __webpack_require__(1);\n\n\n/*****************\n ** WEBPACK FOOTER\n ** multi main\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///multi_main?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("// import './app.css';\n'use strict';\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }\n\nvar _core = __webpack_require__(2);\n\nvar _dot = __webpack_require__(7);\n\nvar _dot2 = _interopRequireDefault(_dot);\n\nvar canvas = document.getElementById('cnv');\nvar clearBtn = document.getElementById('clear');\nvar ctx = canvas.getContext('2d');\n\nfunction start(preset) {\n\t(0, _core.run)(ctx, preset);\n\n\twindow.new_dots = [];\n\tfunction handleMouseMove(e) {\n\t\tif (e.which === 1) {\n\t\t\te.preventDefault();\n\t\t\tdocument.body.classList.add('st-dragging');\n\t\t\tvar d = (0, _dot2['default'])(e.pageX / window.innerWidth * 1000, e.pageY / window.innerHeight * 700);\n\t\t\t(0, _core.addDot)(d);\n\t\t\twindow.new_dots.push(d);\n\t\t}\n\t}\n\n\tfunction handleResize() {\n\t\tcanvas.width = window.innerWidth + 2;\n\t\tcanvas.height = window.innerHeight + 2;\n\t}\n\n\tfunction handleMouseUp() {\n\t\tdocument.body.classList.remove('st-dragging');\n\t}\n\n\tclearBtn.addEventListener('click', _core.clear);\n\tdocument.addEventListener('mousemove', handleMouseMove);\n\tdocument.addEventListener('mouseup', handleMouseUp);\n\twindow.addEventListener('resize', handleResize);\n\thandleResize();\n}\n\n// switch(Math.round(Math.random() * 7)) {\nswitch (0) {\n\tcase 0:\n\t\t__webpack_require__.e/* nsure */(1, function (require) {\n\t\t\treturn start(__webpack_require__(8));\n\t\t});\n\t\tbreak;\n\tcase 0:\n\t\t__webpack_require__.e/* nsure */(2, function (require) {\n\t\t\treturn start(__webpack_require__(11));\n\t\t});\n\t\tbreak;\n\tcase 1:\n\t\t__webpack_require__.e/* nsure */(3, function (require) {\n\t\t\treturn start(__webpack_require__(13));\n\t\t});\n\t\tbreak;\n\tcase 2:\n\t\t__webpack_require__.e/* nsure */(4, function (require) {\n\t\t\treturn start(__webpack_require__(16));\n\t\t});\n\t\tbreak;\n\tcase 3:\n\t\t__webpack_require__.e/* nsure */(5, function (require) {\n\t\t\treturn start(__webpack_require__(18));\n\t\t});\n\t\tbreak;\n\tcase 4:\n\t\t__webpack_require__.e/* nsure */(6, function (require) {\n\t\t\treturn start(__webpack_require__(19));\n\t\t});\n\t\tbreak;\n\tcase 5:\n\t\t__webpack_require__.e/* nsure */(7, function (require) {\n\t\t\treturn start(__webpack_require__(21));\n\t\t});\n\t\tbreak;\n\tcase 6:\n\t\t__webpack_require__.e/* nsure */(8, function (require) {\n\t\t\treturn start(__webpack_require__(23));\n\t\t});\n\t\tbreak;\n\tcase 7:\n\t\t__webpack_require__.e/* nsure */(9, function (require) {\n\t\t\treturn start(__webpack_require__(24));\n\t\t});\n\t\tbreak;\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/app.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/app.js?");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n\tvalue: true\n});\nexports.addDot = addDot;\nexports.clear = clear;\nexports.run = run;\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }\n\nvar _voronoi = __webpack_require__(3);\n\nvar _voronoi2 = _interopRequireDefault(_voronoi);\n\nvar _raf = __webpack_require__(4);\n\nvar _raf2 = _interopRequireDefault(_raf);\n\nvar sin = Math.sin;\nvar cos = Math.cos;\nvar round = Math.round;\nvar random = Math.random;\nvar min = Math.min;\nvar PI = Math.PI;\n\nvar _preset = undefined;\nvar _ctx = undefined;\nvar _dots = undefined;\n\nvar voronoi = new _voronoi2['default']();\nvar diagram = null;\n\nfunction currentPos(time, dot) {\n\tvar speed = time / (_preset.time || 400) / dot.speed * PI;\n\tvar x1 = cos(speed) * (_preset.offset || 5);\n\tvar y1 = sin(speed) * dot.ex * dot.reverse * (_preset.offset || 5);\n\n\tdot.x = dot._x / 1000 * window.innerWidth + (x1 * cos(dot.angle) - y1 * sin(dot.angle));\n\tdot.y = dot._y / 700 * window.innerHeight + (x1 * sin(dot.angle) + y1 * cos(dot.angle));\n}\n\nfunction update(dots, ctx, time) {\n\tvoronoi.recycle(diagram);\n\n\tfor (var i = 0, max = _dots.length; i < max; i += 1) {\n\t\tcurrentPos(time, _dots[i]);\n\t}\n\n\tdiagram = voronoi.compute(_dots, { xl: 0, xr: _ctx.canvas.width, yt: 0, yb: _ctx.canvas.height });\n\n\t_preset.drawer.apply(_ctx, [diagram]);\n}\n\nfunction addDot(dot) {\n\t_dots.push(dot);\n}\n\nfunction clear() {\n\t_dots = [];\n\t_ctx.canvas.width = _ctx.canvas.width;\n}\n\nfunction run(ctx, preset) {\n\t_ctx = ctx;\n\t_dots = preset.dots.slice();\n\t_preset = preset;\n\n\tfunction loop(time) {\n\t\tsetTimeout(function () {\n\t\t\treturn (0, _raf2['default'])(loop);\n\t\t}, 1000 / 20);\n\t\tupdate(_dots, _ctx, time);\n\t}\n\n\t(0, _raf2['default'])(loop);\n}\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/core.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/core.js?");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	eval("/*!\nCopyright (C) 2010-2013 Raymond Hill: https://github.com/gorhill/Javascript-Voronoi\nMIT License: See https://github.com/gorhill/Javascript-Voronoi/LICENSE.md\n*/\n/*\nAuthor: Raymond Hill (rhill@raymondhill.net)\nContributor: Jesse Morgan (morgajel@gmail.com)\nFile: rhill-voronoi-core.js\nVersion: 0.98\nDate: January 21, 2013\nDescription: This is my personal Javascript implementation of\nSteven Fortune's algorithm to compute Voronoi diagrams.\n\nLicense: See https://github.com/gorhill/Javascript-Voronoi/LICENSE.md\nCredits: See https://github.com/gorhill/Javascript-Voronoi/CREDITS.md\nHistory: See https://github.com/gorhill/Javascript-Voronoi/CHANGELOG.md\n\n## Usage:\n\n  var sites = [{x:300,y:300}, {x:100,y:100}, {x:200,y:500}, {x:250,y:450}, {x:600,y:150}];\n  // xl, xr means x left, x right\n  // yt, yb means y top, y bottom\n  var bbox = {xl:0, xr:800, yt:0, yb:600};\n  var voronoi = new Voronoi();\n  // pass an object which exhibits xl, xr, yt, yb properties. The bounding\n  // box will be used to connect unbound edges, and to close open cells\n  result = voronoi.compute(sites, bbox);\n  // render, further analyze, etc.\n\nReturn value:\n  An object with the following properties:\n\n  result.vertices = an array of unordered, unique Voronoi.Vertex objects making\n    up the Voronoi diagram.\n  result.edges = an array of unordered, unique Voronoi.Edge objects making up\n    the Voronoi diagram.\n  result.cells = an array of Voronoi.Cell object making up the Voronoi diagram.\n    A Cell object might have an empty array of halfedges, meaning no Voronoi\n    cell could be computed for a particular cell.\n  result.execTime = the time it took to compute the Voronoi diagram, in\n    milliseconds.\n\nVoronoi.Vertex object:\n  x: The x position of the vertex.\n  y: The y position of the vertex.\n\nVoronoi.Edge object:\n  lSite: the Voronoi site object at the left of this Voronoi.Edge object.\n  rSite: the Voronoi site object at the right of this Voronoi.Edge object (can\n    be null).\n  va: an object with an 'x' and a 'y' property defining the start point\n    (relative to the Voronoi site on the left) of this Voronoi.Edge object.\n  vb: an object with an 'x' and a 'y' property defining the end point\n    (relative to Voronoi site on the left) of this Voronoi.Edge object.\n\n  For edges which are used to close open cells (using the supplied bounding\n  box), the rSite property will be null.\n\nVoronoi.Cell object:\n  site: the Voronoi site object associated with the Voronoi cell.\n  halfedges: an array of Voronoi.Halfedge objects, ordered counterclockwise,\n    defining the polygon for this Voronoi cell.\n\nVoronoi.Halfedge object:\n  site: the Voronoi site object owning this Voronoi.Halfedge object.\n  edge: a reference to the unique Voronoi.Edge object underlying this\n    Voronoi.Halfedge object.\n  getStartpoint(): a method returning an object with an 'x' and a 'y' property\n    for the start point of this halfedge. Keep in mind halfedges are always\n    countercockwise.\n  getEndpoint(): a method returning an object with an 'x' and a 'y' property\n    for the end point of this halfedge. Keep in mind halfedges are always\n    countercockwise.\n\nTODO: Identify opportunities for performance improvement.\n\nTODO: Let the user close the Voronoi cells, do not do it automatically. Not only let\n      him close the cells, but also allow him to close more than once using a different\n      bounding box for the same Voronoi diagram.\n*/\n\n/*global Math */\n\n// ---------------------------------------------------------------------------\n\nfunction Voronoi() {\n    this.vertices = null;\n    this.edges = null;\n    this.cells = null;\n    this.toRecycle = null;\n    this.beachsectionJunkyard = [];\n    this.circleEventJunkyard = [];\n    this.vertexJunkyard = [];\n    this.edgeJunkyard = [];\n    this.cellJunkyard = [];\n    }\n\n// ---------------------------------------------------------------------------\n\nVoronoi.prototype.reset = function() {\n    if (!this.beachline) {\n        this.beachline = new this.RBTree();\n        }\n    // Move leftover beachsections to the beachsection junkyard.\n    if (this.beachline.root) {\n        var beachsection = this.beachline.getFirst(this.beachline.root);\n        while (beachsection) {\n            this.beachsectionJunkyard.push(beachsection); // mark for reuse\n            beachsection = beachsection.rbNext;\n            }\n        }\n    this.beachline.root = null;\n    if (!this.circleEvents) {\n        this.circleEvents = new this.RBTree();\n        }\n    this.circleEvents.root = this.firstCircleEvent = null;\n    this.vertices = [];\n    this.edges = [];\n    this.cells = [];\n    };\n\nVoronoi.prototype.sqrt = Math.sqrt;\nVoronoi.prototype.abs = Math.abs;\nVoronoi.prototype.ε = Voronoi.ε = 1e-9;\nVoronoi.prototype.invε = Voronoi.invε = 1.0 / Voronoi.ε;\nVoronoi.prototype.equalWithEpsilon = function(a,b){return this.abs(a-b)<1e-9;};\nVoronoi.prototype.greaterThanWithEpsilon = function(a,b){return a-b>1e-9;};\nVoronoi.prototype.greaterThanOrEqualWithEpsilon = function(a,b){return b-a<1e-9;};\nVoronoi.prototype.lessThanWithEpsilon = function(a,b){return b-a>1e-9;};\nVoronoi.prototype.lessThanOrEqualWithEpsilon = function(a,b){return a-b<1e-9;};\n\n// ---------------------------------------------------------------------------\n// Red-Black tree code (based on C version of \"rbtree\" by Franck Bui-Huu\n// https://github.com/fbuihuu/libtree/blob/master/rb.c\n\nVoronoi.prototype.RBTree = function() {\n    this.root = null;\n    };\n\nVoronoi.prototype.RBTree.prototype.rbInsertSuccessor = function(node, successor) {\n    var parent;\n    if (node) {\n        // >>> rhill 2011-05-27: Performance: cache previous/next nodes\n        successor.rbPrevious = node;\n        successor.rbNext = node.rbNext;\n        if (node.rbNext) {\n            node.rbNext.rbPrevious = successor;\n            }\n        node.rbNext = successor;\n        // <<<\n        if (node.rbRight) {\n            // in-place expansion of node.rbRight.getFirst();\n            node = node.rbRight;\n            while (node.rbLeft) {node = node.rbLeft;}\n            node.rbLeft = successor;\n            }\n        else {\n            node.rbRight = successor;\n            }\n        parent = node;\n        }\n    // rhill 2011-06-07: if node is null, successor must be inserted\n    // to the left-most part of the tree\n    else if (this.root) {\n        node = this.getFirst(this.root);\n        // >>> Performance: cache previous/next nodes\n        successor.rbPrevious = null;\n        successor.rbNext = node;\n        node.rbPrevious = successor;\n        // <<<\n        node.rbLeft = successor;\n        parent = node;\n        }\n    else {\n        // >>> Performance: cache previous/next nodes\n        successor.rbPrevious = successor.rbNext = null;\n        // <<<\n        this.root = successor;\n        parent = null;\n        }\n    successor.rbLeft = successor.rbRight = null;\n    successor.rbParent = parent;\n    successor.rbRed = true;\n    // Fixup the modified tree by recoloring nodes and performing\n    // rotations (2 at most) hence the red-black tree properties are\n    // preserved.\n    var grandpa, uncle;\n    node = successor;\n    while (parent && parent.rbRed) {\n        grandpa = parent.rbParent;\n        if (parent === grandpa.rbLeft) {\n            uncle = grandpa.rbRight;\n            if (uncle && uncle.rbRed) {\n                parent.rbRed = uncle.rbRed = false;\n                grandpa.rbRed = true;\n                node = grandpa;\n                }\n            else {\n                if (node === parent.rbRight) {\n                    this.rbRotateLeft(parent);\n                    node = parent;\n                    parent = node.rbParent;\n                    }\n                parent.rbRed = false;\n                grandpa.rbRed = true;\n                this.rbRotateRight(grandpa);\n                }\n            }\n        else {\n            uncle = grandpa.rbLeft;\n            if (uncle && uncle.rbRed) {\n                parent.rbRed = uncle.rbRed = false;\n                grandpa.rbRed = true;\n                node = grandpa;\n                }\n            else {\n                if (node === parent.rbLeft) {\n                    this.rbRotateRight(parent);\n                    node = parent;\n                    parent = node.rbParent;\n                    }\n                parent.rbRed = false;\n                grandpa.rbRed = true;\n                this.rbRotateLeft(grandpa);\n                }\n            }\n        parent = node.rbParent;\n        }\n    this.root.rbRed = false;\n    };\n\nVoronoi.prototype.RBTree.prototype.rbRemoveNode = function(node) {\n    // >>> rhill 2011-05-27: Performance: cache previous/next nodes\n    if (node.rbNext) {\n        node.rbNext.rbPrevious = node.rbPrevious;\n        }\n    if (node.rbPrevious) {\n        node.rbPrevious.rbNext = node.rbNext;\n        }\n    node.rbNext = node.rbPrevious = null;\n    // <<<\n    var parent = node.rbParent,\n        left = node.rbLeft,\n        right = node.rbRight,\n        next;\n    if (!left) {\n        next = right;\n        }\n    else if (!right) {\n        next = left;\n        }\n    else {\n        next = this.getFirst(right);\n        }\n    if (parent) {\n        if (parent.rbLeft === node) {\n            parent.rbLeft = next;\n            }\n        else {\n            parent.rbRight = next;\n            }\n        }\n    else {\n        this.root = next;\n        }\n    // enforce red-black rules\n    var isRed;\n    if (left && right) {\n        isRed = next.rbRed;\n        next.rbRed = node.rbRed;\n        next.rbLeft = left;\n        left.rbParent = next;\n        if (next !== right) {\n            parent = next.rbParent;\n            next.rbParent = node.rbParent;\n            node = next.rbRight;\n            parent.rbLeft = node;\n            next.rbRight = right;\n            right.rbParent = next;\n            }\n        else {\n            next.rbParent = parent;\n            parent = next;\n            node = next.rbRight;\n            }\n        }\n    else {\n        isRed = node.rbRed;\n        node = next;\n        }\n    // 'node' is now the sole successor's child and 'parent' its\n    // new parent (since the successor can have been moved)\n    if (node) {\n        node.rbParent = parent;\n        }\n    // the 'easy' cases\n    if (isRed) {return;}\n    if (node && node.rbRed) {\n        node.rbRed = false;\n        return;\n        }\n    // the other cases\n    var sibling;\n    do {\n        if (node === this.root) {\n            break;\n            }\n        if (node === parent.rbLeft) {\n            sibling = parent.rbRight;\n            if (sibling.rbRed) {\n                sibling.rbRed = false;\n                parent.rbRed = true;\n                this.rbRotateLeft(parent);\n                sibling = parent.rbRight;\n                }\n            if ((sibling.rbLeft && sibling.rbLeft.rbRed) || (sibling.rbRight && sibling.rbRight.rbRed)) {\n                if (!sibling.rbRight || !sibling.rbRight.rbRed) {\n                    sibling.rbLeft.rbRed = false;\n                    sibling.rbRed = true;\n                    this.rbRotateRight(sibling);\n                    sibling = parent.rbRight;\n                    }\n                sibling.rbRed = parent.rbRed;\n                parent.rbRed = sibling.rbRight.rbRed = false;\n                this.rbRotateLeft(parent);\n                node = this.root;\n                break;\n                }\n            }\n        else {\n            sibling = parent.rbLeft;\n            if (sibling.rbRed) {\n                sibling.rbRed = false;\n                parent.rbRed = true;\n                this.rbRotateRight(parent);\n                sibling = parent.rbLeft;\n                }\n            if ((sibling.rbLeft && sibling.rbLeft.rbRed) || (sibling.rbRight && sibling.rbRight.rbRed)) {\n                if (!sibling.rbLeft || !sibling.rbLeft.rbRed) {\n                    sibling.rbRight.rbRed = false;\n                    sibling.rbRed = true;\n                    this.rbRotateLeft(sibling);\n                    sibling = parent.rbLeft;\n                    }\n                sibling.rbRed = parent.rbRed;\n                parent.rbRed = sibling.rbLeft.rbRed = false;\n                this.rbRotateRight(parent);\n                node = this.root;\n                break;\n                }\n            }\n        sibling.rbRed = true;\n        node = parent;\n        parent = parent.rbParent;\n    } while (!node.rbRed);\n    if (node) {node.rbRed = false;}\n    };\n\nVoronoi.prototype.RBTree.prototype.rbRotateLeft = function(node) {\n    var p = node,\n        q = node.rbRight, // can't be null\n        parent = p.rbParent;\n    if (parent) {\n        if (parent.rbLeft === p) {\n            parent.rbLeft = q;\n            }\n        else {\n            parent.rbRight = q;\n            }\n        }\n    else {\n        this.root = q;\n        }\n    q.rbParent = parent;\n    p.rbParent = q;\n    p.rbRight = q.rbLeft;\n    if (p.rbRight) {\n        p.rbRight.rbParent = p;\n        }\n    q.rbLeft = p;\n    };\n\nVoronoi.prototype.RBTree.prototype.rbRotateRight = function(node) {\n    var p = node,\n        q = node.rbLeft, // can't be null\n        parent = p.rbParent;\n    if (parent) {\n        if (parent.rbLeft === p) {\n            parent.rbLeft = q;\n            }\n        else {\n            parent.rbRight = q;\n            }\n        }\n    else {\n        this.root = q;\n        }\n    q.rbParent = parent;\n    p.rbParent = q;\n    p.rbLeft = q.rbRight;\n    if (p.rbLeft) {\n        p.rbLeft.rbParent = p;\n        }\n    q.rbRight = p;\n    };\n\nVoronoi.prototype.RBTree.prototype.getFirst = function(node) {\n    while (node.rbLeft) {\n        node = node.rbLeft;\n        }\n    return node;\n    };\n\nVoronoi.prototype.RBTree.prototype.getLast = function(node) {\n    while (node.rbRight) {\n        node = node.rbRight;\n        }\n    return node;\n    };\n\n// ---------------------------------------------------------------------------\n// Diagram methods\n\nVoronoi.prototype.Diagram = function(site) {\n    this.site = site;\n    };\n\n// ---------------------------------------------------------------------------\n// Cell methods\n\nVoronoi.prototype.Cell = function(site) {\n    this.site = site;\n    this.halfedges = [];\n    this.closeMe = false;\n    };\n\nVoronoi.prototype.Cell.prototype.init = function(site) {\n    this.site = site;\n    this.halfedges = [];\n    this.closeMe = false;\n    return this;\n    };\n\nVoronoi.prototype.createCell = function(site) {\n    var cell = this.cellJunkyard.pop();\n    if ( cell ) {\n        return cell.init(site);\n        }\n    return new this.Cell(site);\n    };\n\nVoronoi.prototype.Cell.prototype.prepareHalfedges = function() {\n    var halfedges = this.halfedges,\n        iHalfedge = halfedges.length,\n        edge;\n    // get rid of unused halfedges\n    // rhill 2011-05-27: Keep it simple, no point here in trying\n    // to be fancy: dangling edges are a typically a minority.\n    while (iHalfedge--) {\n        edge = halfedges[iHalfedge].edge;\n        if (!edge.vb || !edge.va) {\n            halfedges.splice(iHalfedge,1);\n            }\n        }\n\n    // rhill 2011-05-26: I tried to use a binary search at insertion\n    // time to keep the array sorted on-the-fly (in Cell.addHalfedge()).\n    // There was no real benefits in doing so, performance on\n    // Firefox 3.6 was improved marginally, while performance on\n    // Opera 11 was penalized marginally.\n    halfedges.sort(function(a,b){return b.angle-a.angle;});\n    return halfedges.length;\n    };\n\n// Return a list of the neighbor Ids\nVoronoi.prototype.Cell.prototype.getNeighborIds = function() {\n    var neighbors = [],\n        iHalfedge = this.halfedges.length,\n        edge;\n    while (iHalfedge--){\n        edge = this.halfedges[iHalfedge].edge;\n        if (edge.lSite !== null && edge.lSite.voronoiId != this.site.voronoiId) {\n            neighbors.push(edge.lSite.voronoiId);\n            }\n        else if (edge.rSite !== null && edge.rSite.voronoiId != this.site.voronoiId){\n            neighbors.push(edge.rSite.voronoiId);\n            }\n        }\n    return neighbors;\n    };\n\n// Compute bounding box\n//\nVoronoi.prototype.Cell.prototype.getBbox = function() {\n    var halfedges = this.halfedges,\n        iHalfedge = halfedges.length,\n        xmin = Infinity,\n        ymin = Infinity,\n        xmax = -Infinity,\n        ymax = -Infinity,\n        v, vx, vy;\n    while (iHalfedge--) {\n        v = halfedges[iHalfedge].getStartpoint();\n        vx = v.x;\n        vy = v.y;\n        if (vx < xmin) {xmin = vx;}\n        if (vy < ymin) {ymin = vy;}\n        if (vx > xmax) {xmax = vx;}\n        if (vy > ymax) {ymax = vy;}\n        // we dont need to take into account end point,\n        // since each end point matches a start point\n        }\n    return {\n        x: xmin,\n        y: ymin,\n        width: xmax-xmin,\n        height: ymax-ymin\n        };\n    };\n\n// Return whether a point is inside, on, or outside the cell:\n//   -1: point is outside the perimeter of the cell\n//    0: point is on the perimeter of the cell\n//    1: point is inside the perimeter of the cell\n//\nVoronoi.prototype.Cell.prototype.pointIntersection = function(x, y) {\n    // Check if point in polygon. Since all polygons of a Voronoi\n    // diagram are convex, then:\n    // http://paulbourke.net/geometry/polygonmesh/\n    // Solution 3 (2D):\n    //   \"If the polygon is convex then one can consider the polygon\n    //   \"as a 'path' from the first vertex. A point is on the interior\n    //   \"of this polygons if it is always on the same side of all the\n    //   \"line segments making up the path. ...\n    //   \"(y - y0) (x1 - x0) - (x - x0) (y1 - y0)\n    //   \"if it is less than 0 then P is to the right of the line segment,\n    //   \"if greater than 0 it is to the left, if equal to 0 then it lies\n    //   \"on the line segment\"\n    var halfedges = this.halfedges,\n        iHalfedge = halfedges.length,\n        halfedge,\n        p0, p1, r;\n    while (iHalfedge--) {\n        halfedge = halfedges[iHalfedge];\n        p0 = halfedge.getStartpoint();\n        p1 = halfedge.getEndpoint();\n        r = (y-p0.y)*(p1.x-p0.x)-(x-p0.x)*(p1.y-p0.y);\n        if (!r) {\n            return 0;\n            }\n        if (r > 0) {\n            return -1;\n            }\n        }\n    return 1;\n    };\n\n// ---------------------------------------------------------------------------\n// Edge methods\n//\n\nVoronoi.prototype.Vertex = function(x, y) {\n    this.x = x;\n    this.y = y;\n    };\n\nVoronoi.prototype.Edge = function(lSite, rSite) {\n    this.lSite = lSite;\n    this.rSite = rSite;\n    this.va = this.vb = null;\n    };\n\nVoronoi.prototype.Halfedge = function(edge, lSite, rSite) {\n    this.site = lSite;\n    this.edge = edge;\n    // 'angle' is a value to be used for properly sorting the\n    // halfsegments counterclockwise. By convention, we will\n    // use the angle of the line defined by the 'site to the left'\n    // to the 'site to the right'.\n    // However, border edges have no 'site to the right': thus we\n    // use the angle of line perpendicular to the halfsegment (the\n    // edge should have both end points defined in such case.)\n    if (rSite) {\n        this.angle = Math.atan2(rSite.y-lSite.y, rSite.x-lSite.x);\n        }\n    else {\n        var va = edge.va,\n            vb = edge.vb;\n        // rhill 2011-05-31: used to call getStartpoint()/getEndpoint(),\n        // but for performance purpose, these are expanded in place here.\n        this.angle = edge.lSite === lSite ?\n            Math.atan2(vb.x-va.x, va.y-vb.y) :\n            Math.atan2(va.x-vb.x, vb.y-va.y);\n        }\n    };\n\nVoronoi.prototype.createHalfedge = function(edge, lSite, rSite) {\n    return new this.Halfedge(edge, lSite, rSite);\n    };\n\nVoronoi.prototype.Halfedge.prototype.getStartpoint = function() {\n    return this.edge.lSite === this.site ? this.edge.va : this.edge.vb;\n    };\n\nVoronoi.prototype.Halfedge.prototype.getEndpoint = function() {\n    return this.edge.lSite === this.site ? this.edge.vb : this.edge.va;\n    };\n\n\n\n// this create and add a vertex to the internal collection\n\nVoronoi.prototype.createVertex = function(x, y) {\n    var v = this.vertexJunkyard.pop();\n    if ( !v ) {\n        v = new this.Vertex(x, y);\n        }\n    else {\n        v.x = x;\n        v.y = y;\n        }\n    this.vertices.push(v);\n    return v;\n    };\n\n// this create and add an edge to internal collection, and also create\n// two halfedges which are added to each site's counterclockwise array\n// of halfedges.\n\nVoronoi.prototype.createEdge = function(lSite, rSite, va, vb) {\n    var edge = this.edgeJunkyard.pop();\n    if ( !edge ) {\n        edge = new this.Edge(lSite, rSite);\n        }\n    else {\n        edge.lSite = lSite;\n        edge.rSite = rSite;\n        edge.va = edge.vb = null;\n        }\n\n    this.edges.push(edge);\n    if (va) {\n        this.setEdgeStartpoint(edge, lSite, rSite, va);\n        }\n    if (vb) {\n        this.setEdgeEndpoint(edge, lSite, rSite, vb);\n        }\n    this.cells[lSite.voronoiId].halfedges.push(this.createHalfedge(edge, lSite, rSite));\n    this.cells[rSite.voronoiId].halfedges.push(this.createHalfedge(edge, rSite, lSite));\n    return edge;\n    };\n\nVoronoi.prototype.createBorderEdge = function(lSite, va, vb) {\n    var edge = this.edgeJunkyard.pop();\n    if ( !edge ) {\n        edge = new this.Edge(lSite, null);\n        }\n    else {\n        edge.lSite = lSite;\n        edge.rSite = null;\n        }\n    edge.va = va;\n    edge.vb = vb;\n    this.edges.push(edge);\n    return edge;\n    };\n\nVoronoi.prototype.setEdgeStartpoint = function(edge, lSite, rSite, vertex) {\n    if (!edge.va && !edge.vb) {\n        edge.va = vertex;\n        edge.lSite = lSite;\n        edge.rSite = rSite;\n        }\n    else if (edge.lSite === rSite) {\n        edge.vb = vertex;\n        }\n    else {\n        edge.va = vertex;\n        }\n    };\n\nVoronoi.prototype.setEdgeEndpoint = function(edge, lSite, rSite, vertex) {\n    this.setEdgeStartpoint(edge, rSite, lSite, vertex);\n    };\n\n// ---------------------------------------------------------------------------\n// Beachline methods\n\n// rhill 2011-06-07: For some reasons, performance suffers significantly\n// when instanciating a literal object instead of an empty ctor\nVoronoi.prototype.Beachsection = function() {\n    };\n\n// rhill 2011-06-02: A lot of Beachsection instanciations\n// occur during the computation of the Voronoi diagram,\n// somewhere between the number of sites and twice the\n// number of sites, while the number of Beachsections on the\n// beachline at any given time is comparatively low. For this\n// reason, we reuse already created Beachsections, in order\n// to avoid new memory allocation. This resulted in a measurable\n// performance gain.\n\nVoronoi.prototype.createBeachsection = function(site) {\n    var beachsection = this.beachsectionJunkyard.pop();\n    if (!beachsection) {\n        beachsection = new this.Beachsection();\n        }\n    beachsection.site = site;\n    return beachsection;\n    };\n\n// calculate the left break point of a particular beach section,\n// given a particular sweep line\nVoronoi.prototype.leftBreakPoint = function(arc, directrix) {\n    // http://en.wikipedia.org/wiki/Parabola\n    // http://en.wikipedia.org/wiki/Quadratic_equation\n    // h1 = x1,\n    // k1 = (y1+directrix)/2,\n    // h2 = x2,\n    // k2 = (y2+directrix)/2,\n    // p1 = k1-directrix,\n    // a1 = 1/(4*p1),\n    // b1 = -h1/(2*p1),\n    // c1 = h1*h1/(4*p1)+k1,\n    // p2 = k2-directrix,\n    // a2 = 1/(4*p2),\n    // b2 = -h2/(2*p2),\n    // c2 = h2*h2/(4*p2)+k2,\n    // x = (-(b2-b1) + Math.sqrt((b2-b1)*(b2-b1) - 4*(a2-a1)*(c2-c1))) / (2*(a2-a1))\n    // When x1 become the x-origin:\n    // h1 = 0,\n    // k1 = (y1+directrix)/2,\n    // h2 = x2-x1,\n    // k2 = (y2+directrix)/2,\n    // p1 = k1-directrix,\n    // a1 = 1/(4*p1),\n    // b1 = 0,\n    // c1 = k1,\n    // p2 = k2-directrix,\n    // a2 = 1/(4*p2),\n    // b2 = -h2/(2*p2),\n    // c2 = h2*h2/(4*p2)+k2,\n    // x = (-b2 + Math.sqrt(b2*b2 - 4*(a2-a1)*(c2-k1))) / (2*(a2-a1)) + x1\n\n    // change code below at your own risk: care has been taken to\n    // reduce errors due to computers' finite arithmetic precision.\n    // Maybe can still be improved, will see if any more of this\n    // kind of errors pop up again.\n    var site = arc.site,\n        rfocx = site.x,\n        rfocy = site.y,\n        pby2 = rfocy-directrix;\n    // parabola in degenerate case where focus is on directrix\n    if (!pby2) {\n        return rfocx;\n        }\n    var lArc = arc.rbPrevious;\n    if (!lArc) {\n        return -Infinity;\n        }\n    site = lArc.site;\n    var lfocx = site.x,\n        lfocy = site.y,\n        plby2 = lfocy-directrix;\n    // parabola in degenerate case where focus is on directrix\n    if (!plby2) {\n        return lfocx;\n        }\n    var hl = lfocx-rfocx,\n        aby2 = 1/pby2-1/plby2,\n        b = hl/plby2;\n    if (aby2) {\n        return (-b+this.sqrt(b*b-2*aby2*(hl*hl/(-2*plby2)-lfocy+plby2/2+rfocy-pby2/2)))/aby2+rfocx;\n        }\n    // both parabolas have same distance to directrix, thus break point is midway\n    return (rfocx+lfocx)/2;\n    };\n\n// calculate the right break point of a particular beach section,\n// given a particular directrix\nVoronoi.prototype.rightBreakPoint = function(arc, directrix) {\n    var rArc = arc.rbNext;\n    if (rArc) {\n        return this.leftBreakPoint(rArc, directrix);\n        }\n    var site = arc.site;\n    return site.y === directrix ? site.x : Infinity;\n    };\n\nVoronoi.prototype.detachBeachsection = function(beachsection) {\n    this.detachCircleEvent(beachsection); // detach potentially attached circle event\n    this.beachline.rbRemoveNode(beachsection); // remove from RB-tree\n    this.beachsectionJunkyard.push(beachsection); // mark for reuse\n    };\n\nVoronoi.prototype.removeBeachsection = function(beachsection) {\n    var circle = beachsection.circleEvent,\n        x = circle.x,\n        y = circle.ycenter,\n        vertex = this.createVertex(x, y),\n        previous = beachsection.rbPrevious,\n        next = beachsection.rbNext,\n        disappearingTransitions = [beachsection],\n        abs_fn = Math.abs;\n\n    // remove collapsed beachsection from beachline\n    this.detachBeachsection(beachsection);\n\n    // there could be more than one empty arc at the deletion point, this\n    // happens when more than two edges are linked by the same vertex,\n    // so we will collect all those edges by looking up both sides of\n    // the deletion point.\n    // by the way, there is *always* a predecessor/successor to any collapsed\n    // beach section, it's just impossible to have a collapsing first/last\n    // beach sections on the beachline, since they obviously are unconstrained\n    // on their left/right side.\n\n    // look left\n    var lArc = previous;\n    while (lArc.circleEvent && abs_fn(x-lArc.circleEvent.x)<1e-9 && abs_fn(y-lArc.circleEvent.ycenter)<1e-9) {\n        previous = lArc.rbPrevious;\n        disappearingTransitions.unshift(lArc);\n        this.detachBeachsection(lArc); // mark for reuse\n        lArc = previous;\n        }\n    // even though it is not disappearing, I will also add the beach section\n    // immediately to the left of the left-most collapsed beach section, for\n    // convenience, since we need to refer to it later as this beach section\n    // is the 'left' site of an edge for which a start point is set.\n    disappearingTransitions.unshift(lArc);\n    this.detachCircleEvent(lArc);\n\n    // look right\n    var rArc = next;\n    while (rArc.circleEvent && abs_fn(x-rArc.circleEvent.x)<1e-9 && abs_fn(y-rArc.circleEvent.ycenter)<1e-9) {\n        next = rArc.rbNext;\n        disappearingTransitions.push(rArc);\n        this.detachBeachsection(rArc); // mark for reuse\n        rArc = next;\n        }\n    // we also have to add the beach section immediately to the right of the\n    // right-most collapsed beach section, since there is also a disappearing\n    // transition representing an edge's start point on its left.\n    disappearingTransitions.push(rArc);\n    this.detachCircleEvent(rArc);\n\n    // walk through all the disappearing transitions between beach sections and\n    // set the start point of their (implied) edge.\n    var nArcs = disappearingTransitions.length,\n        iArc;\n    for (iArc=1; iArc<nArcs; iArc++) {\n        rArc = disappearingTransitions[iArc];\n        lArc = disappearingTransitions[iArc-1];\n        this.setEdgeStartpoint(rArc.edge, lArc.site, rArc.site, vertex);\n        }\n\n    // create a new edge as we have now a new transition between\n    // two beach sections which were previously not adjacent.\n    // since this edge appears as a new vertex is defined, the vertex\n    // actually define an end point of the edge (relative to the site\n    // on the left)\n    lArc = disappearingTransitions[0];\n    rArc = disappearingTransitions[nArcs-1];\n    rArc.edge = this.createEdge(lArc.site, rArc.site, undefined, vertex);\n\n    // create circle events if any for beach sections left in the beachline\n    // adjacent to collapsed sections\n    this.attachCircleEvent(lArc);\n    this.attachCircleEvent(rArc);\n    };\n\nVoronoi.prototype.addBeachsection = function(site) {\n    var x = site.x,\n        directrix = site.y;\n\n    // find the left and right beach sections which will surround the newly\n    // created beach section.\n    // rhill 2011-06-01: This loop is one of the most often executed,\n    // hence we expand in-place the comparison-against-epsilon calls.\n    var lArc, rArc,\n        dxl, dxr,\n        node = this.beachline.root;\n\n    while (node) {\n        dxl = this.leftBreakPoint(node,directrix)-x;\n        // x lessThanWithEpsilon xl => falls somewhere before the left edge of the beachsection\n        if (dxl > 1e-9) {\n            // this case should never happen\n            // if (!node.rbLeft) {\n            //    rArc = node.rbLeft;\n            //    break;\n            //    }\n            node = node.rbLeft;\n            }\n        else {\n            dxr = x-this.rightBreakPoint(node,directrix);\n            // x greaterThanWithEpsilon xr => falls somewhere after the right edge of the beachsection\n            if (dxr > 1e-9) {\n                if (!node.rbRight) {\n                    lArc = node;\n                    break;\n                    }\n                node = node.rbRight;\n                }\n            else {\n                // x equalWithEpsilon xl => falls exactly on the left edge of the beachsection\n                if (dxl > -1e-9) {\n                    lArc = node.rbPrevious;\n                    rArc = node;\n                    }\n                // x equalWithEpsilon xr => falls exactly on the right edge of the beachsection\n                else if (dxr > -1e-9) {\n                    lArc = node;\n                    rArc = node.rbNext;\n                    }\n                // falls exactly somewhere in the middle of the beachsection\n                else {\n                    lArc = rArc = node;\n                    }\n                break;\n                }\n            }\n        }\n    // at this point, keep in mind that lArc and/or rArc could be\n    // undefined or null.\n\n    // create a new beach section object for the site and add it to RB-tree\n    var newArc = this.createBeachsection(site);\n    this.beachline.rbInsertSuccessor(lArc, newArc);\n\n    // cases:\n    //\n\n    // [null,null]\n    // least likely case: new beach section is the first beach section on the\n    // beachline.\n    // This case means:\n    //   no new transition appears\n    //   no collapsing beach section\n    //   new beachsection become root of the RB-tree\n    if (!lArc && !rArc) {\n        return;\n        }\n\n    // [lArc,rArc] where lArc == rArc\n    // most likely case: new beach section split an existing beach\n    // section.\n    // This case means:\n    //   one new transition appears\n    //   the left and right beach section might be collapsing as a result\n    //   two new nodes added to the RB-tree\n    if (lArc === rArc) {\n        // invalidate circle event of split beach section\n        this.detachCircleEvent(lArc);\n\n        // split the beach section into two separate beach sections\n        rArc = this.createBeachsection(lArc.site);\n        this.beachline.rbInsertSuccessor(newArc, rArc);\n\n        // since we have a new transition between two beach sections,\n        // a new edge is born\n        newArc.edge = rArc.edge = this.createEdge(lArc.site, newArc.site);\n\n        // check whether the left and right beach sections are collapsing\n        // and if so create circle events, to be notified when the point of\n        // collapse is reached.\n        this.attachCircleEvent(lArc);\n        this.attachCircleEvent(rArc);\n        return;\n        }\n\n    // [lArc,null]\n    // even less likely case: new beach section is the *last* beach section\n    // on the beachline -- this can happen *only* if *all* the previous beach\n    // sections currently on the beachline share the same y value as\n    // the new beach section.\n    // This case means:\n    //   one new transition appears\n    //   no collapsing beach section as a result\n    //   new beach section become right-most node of the RB-tree\n    if (lArc && !rArc) {\n        newArc.edge = this.createEdge(lArc.site,newArc.site);\n        return;\n        }\n\n    // [null,rArc]\n    // impossible case: because sites are strictly processed from top to bottom,\n    // and left to right, which guarantees that there will always be a beach section\n    // on the left -- except of course when there are no beach section at all on\n    // the beach line, which case was handled above.\n    // rhill 2011-06-02: No point testing in non-debug version\n    //if (!lArc && rArc) {\n    //    throw \"Voronoi.addBeachsection(): What is this I don't even\";\n    //    }\n\n    // [lArc,rArc] where lArc != rArc\n    // somewhat less likely case: new beach section falls *exactly* in between two\n    // existing beach sections\n    // This case means:\n    //   one transition disappears\n    //   two new transitions appear\n    //   the left and right beach section might be collapsing as a result\n    //   only one new node added to the RB-tree\n    if (lArc !== rArc) {\n        // invalidate circle events of left and right sites\n        this.detachCircleEvent(lArc);\n        this.detachCircleEvent(rArc);\n\n        // an existing transition disappears, meaning a vertex is defined at\n        // the disappearance point.\n        // since the disappearance is caused by the new beachsection, the\n        // vertex is at the center of the circumscribed circle of the left,\n        // new and right beachsections.\n        // http://mathforum.org/library/drmath/view/55002.html\n        // Except that I bring the origin at A to simplify\n        // calculation\n        var lSite = lArc.site,\n            ax = lSite.x,\n            ay = lSite.y,\n            bx=site.x-ax,\n            by=site.y-ay,\n            rSite = rArc.site,\n            cx=rSite.x-ax,\n            cy=rSite.y-ay,\n            d=2*(bx*cy-by*cx),\n            hb=bx*bx+by*by,\n            hc=cx*cx+cy*cy,\n            vertex = this.createVertex((cy*hb-by*hc)/d+ax, (bx*hc-cx*hb)/d+ay);\n\n        // one transition disappear\n        this.setEdgeStartpoint(rArc.edge, lSite, rSite, vertex);\n\n        // two new transitions appear at the new vertex location\n        newArc.edge = this.createEdge(lSite, site, undefined, vertex);\n        rArc.edge = this.createEdge(site, rSite, undefined, vertex);\n\n        // check whether the left and right beach sections are collapsing\n        // and if so create circle events, to handle the point of collapse.\n        this.attachCircleEvent(lArc);\n        this.attachCircleEvent(rArc);\n        return;\n        }\n    };\n\n// ---------------------------------------------------------------------------\n// Circle event methods\n\n// rhill 2011-06-07: For some reasons, performance suffers significantly\n// when instanciating a literal object instead of an empty ctor\nVoronoi.prototype.CircleEvent = function() {\n    // rhill 2013-10-12: it helps to state exactly what we are at ctor time.\n    this.arc = null;\n    this.rbLeft = null;\n    this.rbNext = null;\n    this.rbParent = null;\n    this.rbPrevious = null;\n    this.rbRed = false;\n    this.rbRight = null;\n    this.site = null;\n    this.x = this.y = this.ycenter = 0;\n    };\n\nVoronoi.prototype.attachCircleEvent = function(arc) {\n    var lArc = arc.rbPrevious,\n        rArc = arc.rbNext;\n    if (!lArc || !rArc) {return;} // does that ever happen?\n    var lSite = lArc.site,\n        cSite = arc.site,\n        rSite = rArc.site;\n\n    // If site of left beachsection is same as site of\n    // right beachsection, there can't be convergence\n    if (lSite===rSite) {return;}\n\n    // Find the circumscribed circle for the three sites associated\n    // with the beachsection triplet.\n    // rhill 2011-05-26: It is more efficient to calculate in-place\n    // rather than getting the resulting circumscribed circle from an\n    // object returned by calling Voronoi.circumcircle()\n    // http://mathforum.org/library/drmath/view/55002.html\n    // Except that I bring the origin at cSite to simplify calculations.\n    // The bottom-most part of the circumcircle is our Fortune 'circle\n    // event', and its center is a vertex potentially part of the final\n    // Voronoi diagram.\n    var bx = cSite.x,\n        by = cSite.y,\n        ax = lSite.x-bx,\n        ay = lSite.y-by,\n        cx = rSite.x-bx,\n        cy = rSite.y-by;\n\n    // If points l->c->r are clockwise, then center beach section does not\n    // collapse, hence it can't end up as a vertex (we reuse 'd' here, which\n    // sign is reverse of the orientation, hence we reverse the test.\n    // http://en.wikipedia.org/wiki/Curve_orientation#Orientation_of_a_simple_polygon\n    // rhill 2011-05-21: Nasty finite precision error which caused circumcircle() to\n    // return infinites: 1e-12 seems to fix the problem.\n    var d = 2*(ax*cy-ay*cx);\n    if (d >= -2e-12){return;}\n\n    var ha = ax*ax+ay*ay,\n        hc = cx*cx+cy*cy,\n        x = (cy*ha-ay*hc)/d,\n        y = (ax*hc-cx*ha)/d,\n        ycenter = y+by;\n\n    // Important: ybottom should always be under or at sweep, so no need\n    // to waste CPU cycles by checking\n\n    // recycle circle event object if possible\n    var circleEvent = this.circleEventJunkyard.pop();\n    if (!circleEvent) {\n        circleEvent = new this.CircleEvent();\n        }\n    circleEvent.arc = arc;\n    circleEvent.site = cSite;\n    circleEvent.x = x+bx;\n    circleEvent.y = ycenter+this.sqrt(x*x+y*y); // y bottom\n    circleEvent.ycenter = ycenter;\n    arc.circleEvent = circleEvent;\n\n    // find insertion point in RB-tree: circle events are ordered from\n    // smallest to largest\n    var predecessor = null,\n        node = this.circleEvents.root;\n    while (node) {\n        if (circleEvent.y < node.y || (circleEvent.y === node.y && circleEvent.x <= node.x)) {\n            if (node.rbLeft) {\n                node = node.rbLeft;\n                }\n            else {\n                predecessor = node.rbPrevious;\n                break;\n                }\n            }\n        else {\n            if (node.rbRight) {\n                node = node.rbRight;\n                }\n            else {\n                predecessor = node;\n                break;\n                }\n            }\n        }\n    this.circleEvents.rbInsertSuccessor(predecessor, circleEvent);\n    if (!predecessor) {\n        this.firstCircleEvent = circleEvent;\n        }\n    };\n\nVoronoi.prototype.detachCircleEvent = function(arc) {\n    var circleEvent = arc.circleEvent;\n    if (circleEvent) {\n        if (!circleEvent.rbPrevious) {\n            this.firstCircleEvent = circleEvent.rbNext;\n            }\n        this.circleEvents.rbRemoveNode(circleEvent); // remove from RB-tree\n        this.circleEventJunkyard.push(circleEvent);\n        arc.circleEvent = null;\n        }\n    };\n\n// ---------------------------------------------------------------------------\n// Diagram completion methods\n\n// connect dangling edges (not if a cursory test tells us\n// it is not going to be visible.\n// return value:\n//   false: the dangling endpoint couldn't be connected\n//   true: the dangling endpoint could be connected\nVoronoi.prototype.connectEdge = function(edge, bbox) {\n    // skip if end point already connected\n    var vb = edge.vb;\n    if (!!vb) {return true;}\n\n    // make local copy for performance purpose\n    var va = edge.va,\n        xl = bbox.xl,\n        xr = bbox.xr,\n        yt = bbox.yt,\n        yb = bbox.yb,\n        lSite = edge.lSite,\n        rSite = edge.rSite,\n        lx = lSite.x,\n        ly = lSite.y,\n        rx = rSite.x,\n        ry = rSite.y,\n        fx = (lx+rx)/2,\n        fy = (ly+ry)/2,\n        fm, fb;\n\n    // if we reach here, this means cells which use this edge will need\n    // to be closed, whether because the edge was removed, or because it\n    // was connected to the bounding box.\n    this.cells[lSite.voronoiId].closeMe = true;\n    this.cells[rSite.voronoiId].closeMe = true;\n\n    // get the line equation of the bisector if line is not vertical\n    if (ry !== ly) {\n        fm = (lx-rx)/(ry-ly);\n        fb = fy-fm*fx;\n        }\n\n    // remember, direction of line (relative to left site):\n    // upward: left.x < right.x\n    // downward: left.x > right.x\n    // horizontal: left.x == right.x\n    // upward: left.x < right.x\n    // rightward: left.y < right.y\n    // leftward: left.y > right.y\n    // vertical: left.y == right.y\n\n    // depending on the direction, find the best side of the\n    // bounding box to use to determine a reasonable start point\n\n    // rhill 2013-12-02:\n    // While at it, since we have the values which define the line,\n    // clip the end of va if it is outside the bbox.\n    // https://github.com/gorhill/Javascript-Voronoi/issues/15\n    // TODO: Do all the clipping here rather than rely on Liang-Barsky\n    // which does not do well sometimes due to loss of arithmetic\n    // precision. The code here doesn't degrade if one of the vertex is\n    // at a huge distance.\n\n    // special case: vertical line\n    if (fm === undefined) {\n        // doesn't intersect with viewport\n        if (fx < xl || fx >= xr) {return false;}\n        // downward\n        if (lx > rx) {\n            if (!va || va.y < yt) {\n                va = this.createVertex(fx, yt);\n                }\n            else if (va.y >= yb) {\n                return false;\n                }\n            vb = this.createVertex(fx, yb);\n            }\n        // upward\n        else {\n            if (!va || va.y > yb) {\n                va = this.createVertex(fx, yb);\n                }\n            else if (va.y < yt) {\n                return false;\n                }\n            vb = this.createVertex(fx, yt);\n            }\n        }\n    // closer to vertical than horizontal, connect start point to the\n    // top or bottom side of the bounding box\n    else if (fm < -1 || fm > 1) {\n        // downward\n        if (lx > rx) {\n            if (!va || va.y < yt) {\n                va = this.createVertex((yt-fb)/fm, yt);\n                }\n            else if (va.y >= yb) {\n                return false;\n                }\n            vb = this.createVertex((yb-fb)/fm, yb);\n            }\n        // upward\n        else {\n            if (!va || va.y > yb) {\n                va = this.createVertex((yb-fb)/fm, yb);\n                }\n            else if (va.y < yt) {\n                return false;\n                }\n            vb = this.createVertex((yt-fb)/fm, yt);\n            }\n        }\n    // closer to horizontal than vertical, connect start point to the\n    // left or right side of the bounding box\n    else {\n        // rightward\n        if (ly < ry) {\n            if (!va || va.x < xl) {\n                va = this.createVertex(xl, fm*xl+fb);\n                }\n            else if (va.x >= xr) {\n                return false;\n                }\n            vb = this.createVertex(xr, fm*xr+fb);\n            }\n        // leftward\n        else {\n            if (!va || va.x > xr) {\n                va = this.createVertex(xr, fm*xr+fb);\n                }\n            else if (va.x < xl) {\n                return false;\n                }\n            vb = this.createVertex(xl, fm*xl+fb);\n            }\n        }\n    edge.va = va;\n    edge.vb = vb;\n\n    return true;\n    };\n\n// line-clipping code taken from:\n//   Liang-Barsky function by Daniel White\n//   http://www.skytopia.com/project/articles/compsci/clipping.html\n// Thanks!\n// A bit modified to minimize code paths\nVoronoi.prototype.clipEdge = function(edge, bbox) {\n    var ax = edge.va.x,\n        ay = edge.va.y,\n        bx = edge.vb.x,\n        by = edge.vb.y,\n        t0 = 0,\n        t1 = 1,\n        dx = bx-ax,\n        dy = by-ay;\n    // left\n    var q = ax-bbox.xl;\n    if (dx===0 && q<0) {return false;}\n    var r = -q/dx;\n    if (dx<0) {\n        if (r<t0) {return false;}\n        if (r<t1) {t1=r;}\n        }\n    else if (dx>0) {\n        if (r>t1) {return false;}\n        if (r>t0) {t0=r;}\n        }\n    // right\n    q = bbox.xr-ax;\n    if (dx===0 && q<0) {return false;}\n    r = q/dx;\n    if (dx<0) {\n        if (r>t1) {return false;}\n        if (r>t0) {t0=r;}\n        }\n    else if (dx>0) {\n        if (r<t0) {return false;}\n        if (r<t1) {t1=r;}\n        }\n    // top\n    q = ay-bbox.yt;\n    if (dy===0 && q<0) {return false;}\n    r = -q/dy;\n    if (dy<0) {\n        if (r<t0) {return false;}\n        if (r<t1) {t1=r;}\n        }\n    else if (dy>0) {\n        if (r>t1) {return false;}\n        if (r>t0) {t0=r;}\n        }\n    // bottom        \n    q = bbox.yb-ay;\n    if (dy===0 && q<0) {return false;}\n    r = q/dy;\n    if (dy<0) {\n        if (r>t1) {return false;}\n        if (r>t0) {t0=r;}\n        }\n    else if (dy>0) {\n        if (r<t0) {return false;}\n        if (r<t1) {t1=r;}\n        }\n\n    // if we reach this point, Voronoi edge is within bbox\n\n    // if t0 > 0, va needs to change\n    // rhill 2011-06-03: we need to create a new vertex rather\n    // than modifying the existing one, since the existing\n    // one is likely shared with at least another edge\n    if (t0 > 0) {\n        edge.va = this.createVertex(ax+t0*dx, ay+t0*dy);\n        }\n\n    // if t1 < 1, vb needs to change\n    // rhill 2011-06-03: we need to create a new vertex rather\n    // than modifying the existing one, since the existing\n    // one is likely shared with at least another edge\n    if (t1 < 1) {\n        edge.vb = this.createVertex(ax+t1*dx, ay+t1*dy);\n        }\n\n    // va and/or vb were clipped, thus we will need to close\n    // cells which use this edge.\n    if ( t0 > 0 || t1 < 1 ) {\n        this.cells[edge.lSite.voronoiId].closeMe = true;\n        this.cells[edge.rSite.voronoiId].closeMe = true;\n    }\n\n    return true;\n    };\n\n// Connect/cut edges at bounding box\nVoronoi.prototype.clipEdges = function(bbox) {\n    // connect all dangling edges to bounding box\n    // or get rid of them if it can't be done\n    var edges = this.edges,\n        iEdge = edges.length,\n        edge,\n        abs_fn = Math.abs;\n\n    // iterate backward so we can splice safely\n    while (iEdge--) {\n        edge = edges[iEdge];\n        // edge is removed if:\n        //   it is wholly outside the bounding box\n        //   it is looking more like a point than a line\n        if (!this.connectEdge(edge, bbox) ||\n            !this.clipEdge(edge, bbox) ||\n            (abs_fn(edge.va.x-edge.vb.x)<1e-9 && abs_fn(edge.va.y-edge.vb.y)<1e-9)) {\n            edge.va = edge.vb = null;\n            edges.splice(iEdge,1);\n            }\n        }\n    };\n\n// Close the cells.\n// The cells are bound by the supplied bounding box.\n// Each cell refers to its associated site, and a list\n// of halfedges ordered counterclockwise.\nVoronoi.prototype.closeCells = function(bbox) {\n    var xl = bbox.xl,\n        xr = bbox.xr,\n        yt = bbox.yt,\n        yb = bbox.yb,\n        cells = this.cells,\n        iCell = cells.length,\n        cell,\n        iLeft,\n        halfedges, nHalfedges,\n        edge,\n        va, vb, vz,\n        lastBorderSegment,\n        abs_fn = Math.abs;\n\n    while (iCell--) {\n        cell = cells[iCell];\n        // prune, order halfedges counterclockwise, then add missing ones\n        // required to close cells\n        if (!cell.prepareHalfedges()) {\n            continue;\n            }\n        if (!cell.closeMe) {\n            continue;\n            }\n        // find first 'unclosed' point.\n        // an 'unclosed' point will be the end point of a halfedge which\n        // does not match the start point of the following halfedge\n        halfedges = cell.halfedges;\n        nHalfedges = halfedges.length;\n        // special case: only one site, in which case, the viewport is the cell\n        // ...\n\n        // all other cases\n        iLeft = 0;\n        while (iLeft < nHalfedges) {\n            va = halfedges[iLeft].getEndpoint();\n            vz = halfedges[(iLeft+1) % nHalfedges].getStartpoint();\n            // if end point is not equal to start point, we need to add the missing\n            // halfedge(s) up to vz\n            if (abs_fn(va.x-vz.x)>=1e-9 || abs_fn(va.y-vz.y)>=1e-9) {\n\n                // rhill 2013-12-02:\n                // \"Holes\" in the halfedges are not necessarily always adjacent.\n                // https://github.com/gorhill/Javascript-Voronoi/issues/16\n\n                // find entry point:\n                switch (true) {\n\n                    // walk downward along left side\n                    case this.equalWithEpsilon(va.x,xl) && this.lessThanWithEpsilon(va.y,yb):\n                        lastBorderSegment = this.equalWithEpsilon(vz.x,xl);\n                        vb = this.createVertex(xl, lastBorderSegment ? vz.y : yb);\n                        edge = this.createBorderEdge(cell.site, va, vb);\n                        iLeft++;\n                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));\n                        nHalfedges++;\n                        if ( lastBorderSegment ) { break; }\n                        va = vb;\n                        // fall through\n\n                    // walk rightward along bottom side\n                    case this.equalWithEpsilon(va.y,yb) && this.lessThanWithEpsilon(va.x,xr):\n                        lastBorderSegment = this.equalWithEpsilon(vz.y,yb);\n                        vb = this.createVertex(lastBorderSegment ? vz.x : xr, yb);\n                        edge = this.createBorderEdge(cell.site, va, vb);\n                        iLeft++;\n                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));\n                        nHalfedges++;\n                        if ( lastBorderSegment ) { break; }\n                        va = vb;\n                        // fall through\n\n                    // walk upward along right side\n                    case this.equalWithEpsilon(va.x,xr) && this.greaterThanWithEpsilon(va.y,yt):\n                        lastBorderSegment = this.equalWithEpsilon(vz.x,xr);\n                        vb = this.createVertex(xr, lastBorderSegment ? vz.y : yt);\n                        edge = this.createBorderEdge(cell.site, va, vb);\n                        iLeft++;\n                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));\n                        nHalfedges++;\n                        if ( lastBorderSegment ) { break; }\n                        va = vb;\n                        // fall through\n\n                    // walk leftward along top side\n                    case this.equalWithEpsilon(va.y,yt) && this.greaterThanWithEpsilon(va.x,xl):\n                        lastBorderSegment = this.equalWithEpsilon(vz.y,yt);\n                        vb = this.createVertex(lastBorderSegment ? vz.x : xl, yt);\n                        edge = this.createBorderEdge(cell.site, va, vb);\n                        iLeft++;\n                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));\n                        nHalfedges++;\n                        if ( lastBorderSegment ) { break; }\n                        va = vb;\n                        // fall through\n\n                        // walk downward along left side\n                        lastBorderSegment = this.equalWithEpsilon(vz.x,xl);\n                        vb = this.createVertex(xl, lastBorderSegment ? vz.y : yb);\n                        edge = this.createBorderEdge(cell.site, va, vb);\n                        iLeft++;\n                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));\n                        nHalfedges++;\n                        if ( lastBorderSegment ) { break; }\n                        va = vb;\n                        // fall through\n\n                        // walk rightward along bottom side\n                        lastBorderSegment = this.equalWithEpsilon(vz.y,yb);\n                        vb = this.createVertex(lastBorderSegment ? vz.x : xr, yb);\n                        edge = this.createBorderEdge(cell.site, va, vb);\n                        iLeft++;\n                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));\n                        nHalfedges++;\n                        if ( lastBorderSegment ) { break; }\n                        va = vb;\n                        // fall through\n\n                        // walk upward along right side\n                        lastBorderSegment = this.equalWithEpsilon(vz.x,xr);\n                        vb = this.createVertex(xr, lastBorderSegment ? vz.y : yt);\n                        edge = this.createBorderEdge(cell.site, va, vb);\n                        iLeft++;\n                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));\n                        nHalfedges++;\n                        if ( lastBorderSegment ) { break; }\n                        // fall through\n\n                    default:\n                        throw \"Voronoi.closeCells() > this makes no sense!\";\n                    }\n                }\n            iLeft++;\n            }\n        cell.closeMe = false;\n        }\n    };\n\n// ---------------------------------------------------------------------------\n// Debugging helper\n/*\nVoronoi.prototype.dumpBeachline = function(y) {\n    console.log('Voronoi.dumpBeachline(%f) > Beachsections, from left to right:', y);\n    if ( !this.beachline ) {\n        console.log('  None');\n        }\n    else {\n        var bs = this.beachline.getFirst(this.beachline.root);\n        while ( bs ) {\n            console.log('  site %d: xl: %f, xr: %f', bs.site.voronoiId, this.leftBreakPoint(bs, y), this.rightBreakPoint(bs, y));\n            bs = bs.rbNext;\n            }\n        }\n    };\n*/\n\n// ---------------------------------------------------------------------------\n// Helper: Quantize sites\n\n// rhill 2013-10-12:\n// This is to solve https://github.com/gorhill/Javascript-Voronoi/issues/15\n// Since not all users will end up using the kind of coord values which would\n// cause the issue to arise, I chose to let the user decide whether or not\n// he should sanitize his coord values through this helper. This way, for\n// those users who uses coord values which are known to be fine, no overhead is\n// added.\n\nVoronoi.prototype.quantizeSites = function(sites) {\n    var ε = this.ε,\n        n = sites.length,\n        site;\n    while ( n-- ) {\n        site = sites[n];\n        site.x = Math.floor(site.x / ε) * ε;\n        site.y = Math.floor(site.y / ε) * ε;\n        }\n    };\n\n// ---------------------------------------------------------------------------\n// Helper: Recycle diagram: all vertex, edge and cell objects are\n// \"surrendered\" to the Voronoi object for reuse.\n// TODO: rhill-voronoi-core v2: more performance to be gained\n// when I change the semantic of what is returned.\n\nVoronoi.prototype.recycle = function(diagram) {\n    if ( diagram ) {\n        if ( diagram instanceof this.Diagram ) {\n            this.toRecycle = diagram;\n            }\n        else {\n            throw 'Voronoi.recycleDiagram() > Need a Diagram object.';\n            }\n        }\n    };\n\n// ---------------------------------------------------------------------------\n// Top-level Fortune loop\n\n// rhill 2011-05-19:\n//   Voronoi sites are kept client-side now, to allow\n//   user to freely modify content. At compute time,\n//   *references* to sites are copied locally.\n\nVoronoi.prototype.compute = function(sites, bbox) {\n    // to measure execution time\n    var startTime = new Date();\n\n    // init internal state\n    this.reset();\n\n    // any diagram data available for recycling?\n    // I do that here so that this is included in execution time\n    if ( this.toRecycle ) {\n        this.vertexJunkyard = this.vertexJunkyard.concat(this.toRecycle.vertices);\n        this.edgeJunkyard = this.edgeJunkyard.concat(this.toRecycle.edges);\n        this.cellJunkyard = this.cellJunkyard.concat(this.toRecycle.cells);\n        this.toRecycle = null;\n        }\n\n    // Initialize site event queue\n    var siteEvents = sites.slice(0);\n    siteEvents.sort(function(a,b){\n        var r = b.y - a.y;\n        if (r) {return r;}\n        return b.x - a.x;\n        });\n\n    // process queue\n    var site = siteEvents.pop(),\n        siteid = 0,\n        xsitex, // to avoid duplicate sites\n        xsitey,\n        cells = this.cells,\n        circle;\n\n    // main loop\n    for (;;) {\n        // we need to figure whether we handle a site or circle event\n        // for this we find out if there is a site event and it is\n        // 'earlier' than the circle event\n        circle = this.firstCircleEvent;\n\n        // add beach section\n        if (site && (!circle || site.y < circle.y || (site.y === circle.y && site.x < circle.x))) {\n            // only if site is not a duplicate\n            if (site.x !== xsitex || site.y !== xsitey) {\n                // first create cell for new site\n                cells[siteid] = this.createCell(site);\n                site.voronoiId = siteid++;\n                // then create a beachsection for that site\n                this.addBeachsection(site);\n                // remember last site coords to detect duplicate\n                xsitey = site.y;\n                xsitex = site.x;\n                }\n            site = siteEvents.pop();\n            }\n\n        // remove beach section\n        else if (circle) {\n            this.removeBeachsection(circle.arc);\n            }\n\n        // all done, quit\n        else {\n            break;\n            }\n        }\n\n    // wrapping-up:\n    //   connect dangling edges to bounding box\n    //   cut edges as per bounding box\n    //   discard edges completely outside bounding box\n    //   discard edges which are point-like\n    this.clipEdges(bbox);\n\n    //   add missing edges in order to close opened cells\n    this.closeCells(bbox);\n\n    // to measure execution time\n    var stopTime = new Date();\n\n    // prepare return values\n    var diagram = new this.Diagram();\n    diagram.cells = this.cells;\n    diagram.edges = this.edges;\n    diagram.vertices = this.vertices;\n    diagram.execTime = stopTime.getTime()-startTime.getTime();\n\n    // clean up\n    this.reset();\n\n    return diagram;\n    };\n\nif(true) module.exports = Voronoi;\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/voronoi/rhill-voronoi-core.js\n ** module id = 3\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/voronoi/rhill-voronoi-core.js?");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	eval("var now = __webpack_require__(5)\n  , global = typeof window === 'undefined' ? {} : window\n  , vendors = ['moz', 'webkit']\n  , suffix = 'AnimationFrame'\n  , raf = global['request' + suffix]\n  , caf = global['cancel' + suffix] || global['cancelRequest' + suffix]\n\nfor(var i = 0; i < vendors.length && !raf; i++) {\n  raf = global[vendors[i] + 'Request' + suffix]\n  caf = global[vendors[i] + 'Cancel' + suffix]\n      || global[vendors[i] + 'CancelRequest' + suffix]\n}\n\n// Some versions of FF have rAF but not cAF\nif(!raf || !caf) {\n  var last = 0\n    , id = 0\n    , queue = []\n    , frameDuration = 1000 / 60\n\n  raf = function(callback) {\n    if(queue.length === 0) {\n      var _now = now()\n        , next = Math.max(0, frameDuration - (_now - last))\n      last = next + _now\n      setTimeout(function() {\n        var cp = queue.slice(0)\n        // Clear queue here to prevent\n        // callbacks from appending listeners\n        // to the current frame's queue\n        queue.length = 0\n        for(var i = 0; i < cp.length; i++) {\n          if(!cp[i].cancelled) {\n            try{\n              cp[i].callback(last)\n            } catch(e) {\n              setTimeout(function() { throw e }, 0)\n            }\n          }\n        }\n      }, Math.round(next))\n    }\n    queue.push({\n      handle: ++id,\n      callback: callback,\n      cancelled: false\n    })\n    return id\n  }\n\n  caf = function(handle) {\n    for(var i = 0; i < queue.length; i++) {\n      if(queue[i].handle === handle) {\n        queue[i].cancelled = true\n      }\n    }\n  }\n}\n\nmodule.exports = function(fn) {\n  // Wrap in a new function to prevent\n  // `cancel` potentially being assigned\n  // to the native rAF function\n  return raf.call(global, fn)\n}\nmodule.exports.cancel = function() {\n  caf.apply(global, arguments)\n}\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/raf/index.js\n ** module id = 4\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/raf/index.js?");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	eval("/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.6.3\n(function() {\n  var getNanoSeconds, hrtime, loadTime;\n\n  if ((typeof performance !== \"undefined\" && performance !== null) && performance.now) {\n    module.exports = function() {\n      return performance.now();\n    };\n  } else if ((typeof process !== \"undefined\" && process !== null) && process.hrtime) {\n    module.exports = function() {\n      return (getNanoSeconds() - loadTime) / 1e6;\n    };\n    hrtime = process.hrtime;\n    getNanoSeconds = function() {\n      var hr;\n      hr = hrtime();\n      return hr[0] * 1e9 + hr[1];\n    };\n    loadTime = getNanoSeconds();\n  } else if (Date.now) {\n    module.exports = function() {\n      return Date.now() - loadTime;\n    };\n    loadTime = Date.now();\n  } else {\n    module.exports = function() {\n      return new Date().getTime() - loadTime;\n    };\n    loadTime = new Date().getTime();\n  }\n\n}).call(this);\n\n/*\n//@ sourceMappingURL=performance-now.map\n*/\n\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/raf/~/performance-now/lib/performance-now.js\n ** module id = 5\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/raf/~/performance-now/lib/performance-now.js?");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	eval("// shim for using process in browser\n\nvar process = module.exports = {};\nvar queue = [];\nvar draining = false;\nvar currentQueue;\nvar queueIndex = -1;\n\nfunction cleanUpNextTick() {\n    draining = false;\n    if (currentQueue.length) {\n        queue = currentQueue.concat(queue);\n    } else {\n        queueIndex = -1;\n    }\n    if (queue.length) {\n        drainQueue();\n    }\n}\n\nfunction drainQueue() {\n    if (draining) {\n        return;\n    }\n    var timeout = setTimeout(cleanUpNextTick);\n    draining = true;\n\n    var len = queue.length;\n    while(len) {\n        currentQueue = queue;\n        queue = [];\n        while (++queueIndex < len) {\n            currentQueue[queueIndex].run();\n        }\n        queueIndex = -1;\n        len = queue.length;\n    }\n    currentQueue = null;\n    draining = false;\n    clearTimeout(timeout);\n}\n\nprocess.nextTick = function (fun) {\n    var args = new Array(arguments.length - 1);\n    if (arguments.length > 1) {\n        for (var i = 1; i < arguments.length; i++) {\n            args[i - 1] = arguments[i];\n        }\n    }\n    queue.push(new Item(fun, args));\n    if (queue.length === 1 && !draining) {\n        setTimeout(drainQueue, 0);\n    }\n};\n\n// v8 likes predictible objects\nfunction Item(fun, array) {\n    this.fun = fun;\n    this.array = array;\n}\nItem.prototype.run = function () {\n    this.fun.apply(null, this.array);\n};\nprocess.title = 'browser';\nprocess.browser = true;\nprocess.env = {};\nprocess.argv = [];\nprocess.version = ''; // empty string to avoid regexp issues\nprocess.versions = {};\n\nfunction noop() {}\n\nprocess.on = noop;\nprocess.addListener = noop;\nprocess.once = noop;\nprocess.off = noop;\nprocess.removeListener = noop;\nprocess.removeAllListeners = noop;\nprocess.emit = noop;\n\nprocess.binding = function (name) {\n    throw new Error('process.binding is not supported');\n};\n\n// TODO(shtylman)\nprocess.cwd = function () { return '/' };\nprocess.chdir = function (dir) {\n    throw new Error('process.chdir is not supported');\n};\nprocess.umask = function() { return 0; };\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/node-libs-browser/~/process/browser.js\n ** module id = 6\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./~/node-libs-browser/~/process/browser.js?");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	eval("'use strict';\n\nObject.defineProperty(exports, '__esModule', {\n\tvalue: true\n});\nexports['default'] = dot;\nvar random = Math.random;\nvar round = Math.round;\nvar PI = Math.PI;\n\nfunction rndm(a, b) {\n\treturn random() * (b - a) + a;\n}\n\nfunction dot(x, y) {\n\treturn { x: x, y: y,\n\t\t_x: x,\n\t\t_y: y,\n\t\tex: rndm(1, 5),\n\t\tangle: rndm(0, 10 * PI),\n\t\treverse: round(random()) * 2 - 1,\n\t\tspeed: rndm(1, 10),\n\t\tcolor: 'rgb(' + [rndm(100, 200), rndm(10, 150), rndm(10, 100)].map(round).join(',') + ')'\n\t};\n}\n\nmodule.exports = exports['default'];\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/dot.js\n ** module id = 7\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/dot.js?");

/***/ }
/******/ ]);