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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/contentScript.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/contentScript.js":
/*!******************************!*\
  !*** ./src/contentScript.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* global chrome */\n\n\nlet backendDisconnected = false;\nlet backendInitialized = false;\n\nfunction sayHelloToBackend() {\n  window.postMessage({\n    source: 'react-devtools-content-script',\n    hello: true\n  }, '*');\n}\n\nfunction handleMessageFromDevtools(message) {\n  window.postMessage({\n    source: 'react-devtools-content-script',\n    payload: message\n  }, '*');\n}\n\nfunction handleMessageFromPage(evt) {\n  if (evt.source === window && evt.data && evt.data.source === 'react-devtools-bridge') {\n    backendInitialized = true;\n    port.postMessage(evt.data.payload);\n  }\n}\n\nfunction handleDisconnect() {\n  backendDisconnected = true;\n  window.removeEventListener('message', handleMessageFromPage);\n  window.postMessage({\n    source: 'react-devtools-content-script',\n    payload: {\n      type: 'event',\n      event: 'shutdown'\n    }\n  }, '*');\n} // proxy from main page to devtools (via the background page)\n\n\nconst port = chrome.runtime.connect({\n  name: 'content-script'\n});\nport.onMessage.addListener(handleMessageFromDevtools);\nport.onDisconnect.addListener(handleDisconnect);\nwindow.addEventListener('message', handleMessageFromPage);\nsayHelloToBackend(); // The backend waits to install the global hook until notified by the content script.\n// In the event of a page reload, the content script might be loaded before the backend is injected.\n// Because of this we need to poll the backend until it has been initialized.\n\nif (!backendInitialized) {\n  const intervalID = setInterval(() => {\n    if (backendInitialized || backendDisconnected) {\n      clearInterval(intervalID);\n    } else {\n      sayHelloToBackend();\n    }\n  }, 500);\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29udGVudFNjcmlwdC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb250ZW50U2NyaXB0LmpzP2JlYmUiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFsIGNocm9tZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmxldCBiYWNrZW5kRGlzY29ubmVjdGVkOiBib29sZWFuID0gZmFsc2U7XG5sZXQgYmFja2VuZEluaXRpYWxpemVkOiBib29sZWFuID0gZmFsc2U7XG5cbmZ1bmN0aW9uIHNheUhlbGxvVG9CYWNrZW5kKCkge1xuICB3aW5kb3cucG9zdE1lc3NhZ2UoXG4gICAge1xuICAgICAgc291cmNlOiAncmVhY3QtZGV2dG9vbHMtY29udGVudC1zY3JpcHQnLFxuICAgICAgaGVsbG86IHRydWUsXG4gICAgfSxcbiAgICAnKicsXG4gICk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2VGcm9tRGV2dG9vbHMobWVzc2FnZSkge1xuICB3aW5kb3cucG9zdE1lc3NhZ2UoXG4gICAge1xuICAgICAgc291cmNlOiAncmVhY3QtZGV2dG9vbHMtY29udGVudC1zY3JpcHQnLFxuICAgICAgcGF5bG9hZDogbWVzc2FnZSxcbiAgICB9LFxuICAgICcqJyxcbiAgKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlTWVzc2FnZUZyb21QYWdlKGV2dCkge1xuICBpZiAoXG4gICAgZXZ0LnNvdXJjZSA9PT0gd2luZG93ICYmXG4gICAgZXZ0LmRhdGEgJiZcbiAgICBldnQuZGF0YS5zb3VyY2UgPT09ICdyZWFjdC1kZXZ0b29scy1icmlkZ2UnXG4gICkge1xuICAgIGJhY2tlbmRJbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICBwb3J0LnBvc3RNZXNzYWdlKGV2dC5kYXRhLnBheWxvYWQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZURpc2Nvbm5lY3QoKSB7XG4gIGJhY2tlbmREaXNjb25uZWN0ZWQgPSB0cnVlO1xuXG4gIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgaGFuZGxlTWVzc2FnZUZyb21QYWdlKTtcblxuICB3aW5kb3cucG9zdE1lc3NhZ2UoXG4gICAge1xuICAgICAgc291cmNlOiAncmVhY3QtZGV2dG9vbHMtY29udGVudC1zY3JpcHQnLFxuICAgICAgcGF5bG9hZDoge1xuICAgICAgICB0eXBlOiAnZXZlbnQnLFxuICAgICAgICBldmVudDogJ3NodXRkb3duJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAnKicsXG4gICk7XG59XG5cbi8vIHByb3h5IGZyb20gbWFpbiBwYWdlIHRvIGRldnRvb2xzICh2aWEgdGhlIGJhY2tncm91bmQgcGFnZSlcbmNvbnN0IHBvcnQgPSBjaHJvbWUucnVudGltZS5jb25uZWN0KHtcbiAgbmFtZTogJ2NvbnRlbnQtc2NyaXB0Jyxcbn0pO1xucG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoaGFuZGxlTWVzc2FnZUZyb21EZXZ0b29scyk7XG5wb3J0Lm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcihoYW5kbGVEaXNjb25uZWN0KTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBoYW5kbGVNZXNzYWdlRnJvbVBhZ2UpO1xuXG5zYXlIZWxsb1RvQmFja2VuZCgpO1xuXG4vLyBUaGUgYmFja2VuZCB3YWl0cyB0byBpbnN0YWxsIHRoZSBnbG9iYWwgaG9vayB1bnRpbCBub3RpZmllZCBieSB0aGUgY29udGVudCBzY3JpcHQuXG4vLyBJbiB0aGUgZXZlbnQgb2YgYSBwYWdlIHJlbG9hZCwgdGhlIGNvbnRlbnQgc2NyaXB0IG1pZ2h0IGJlIGxvYWRlZCBiZWZvcmUgdGhlIGJhY2tlbmQgaXMgaW5qZWN0ZWQuXG4vLyBCZWNhdXNlIG9mIHRoaXMgd2UgbmVlZCB0byBwb2xsIHRoZSBiYWNrZW5kIHVudGlsIGl0IGhhcyBiZWVuIGluaXRpYWxpemVkLlxuaWYgKCFiYWNrZW5kSW5pdGlhbGl6ZWQpIHtcbiAgY29uc3QgaW50ZXJ2YWxJRCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICBpZiAoYmFja2VuZEluaXRpYWxpemVkIHx8IGJhY2tlbmREaXNjb25uZWN0ZWQpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxJRCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNheUhlbGxvVG9CYWNrZW5kKCk7XG4gICAgfVxuICB9LCA1MDApO1xufVxuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUZBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFGQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFFQTtBQUVBO0FBR0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/contentScript.js\n");

/***/ })

/******/ });