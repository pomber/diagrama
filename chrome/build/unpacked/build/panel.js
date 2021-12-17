/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/panel.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/panel.js":
/*!**********************!*\
  !*** ./src/panel.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Portal target container.\nwindow.container = document.getElementById('container');\nlet hasInjectedStyles = false; // DevTools styles are injected into the top-level document head (where the main React app is rendered).\n// This method copies those styles to the child window where each panel (e.g. Elements, Profiler) is portaled.\n\nwindow.injectStyles = getLinkTags => {\n  if (!hasInjectedStyles) {\n    hasInjectedStyles = true;\n    const linkTags = getLinkTags(); // eslint-disable-next-line no-for-of-loops/no-for-of-loops\n\n    for (const linkTag of linkTags) {\n      document.head.appendChild(linkTag);\n    }\n  }\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFuZWwuanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvcGFuZWwuanM/MjIxMSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBQb3J0YWwgdGFyZ2V0IGNvbnRhaW5lci5cbndpbmRvdy5jb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJyk7XG5cbmxldCBoYXNJbmplY3RlZFN0eWxlcyA9IGZhbHNlO1xuXG4vLyBEZXZUb29scyBzdHlsZXMgYXJlIGluamVjdGVkIGludG8gdGhlIHRvcC1sZXZlbCBkb2N1bWVudCBoZWFkICh3aGVyZSB0aGUgbWFpbiBSZWFjdCBhcHAgaXMgcmVuZGVyZWQpLlxuLy8gVGhpcyBtZXRob2QgY29waWVzIHRob3NlIHN0eWxlcyB0byB0aGUgY2hpbGQgd2luZG93IHdoZXJlIGVhY2ggcGFuZWwgKGUuZy4gRWxlbWVudHMsIFByb2ZpbGVyKSBpcyBwb3J0YWxlZC5cbndpbmRvdy5pbmplY3RTdHlsZXMgPSBnZXRMaW5rVGFncyA9PiB7XG4gIGlmICghaGFzSW5qZWN0ZWRTdHlsZXMpIHtcbiAgICBoYXNJbmplY3RlZFN0eWxlcyA9IHRydWU7XG5cbiAgICBjb25zdCBsaW5rVGFncyA9IGdldExpbmtUYWdzKCk7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZm9yLW9mLWxvb3BzL25vLWZvci1vZi1sb29wc1xuICAgIGZvciAoY29uc3QgbGlua1RhZyBvZiBsaW5rVGFncykge1xuICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChsaW5rVGFnKTtcbiAgICB9XG4gIH1cbn07XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFFQTtBQUdBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/panel.js\n");

/***/ })

/******/ });