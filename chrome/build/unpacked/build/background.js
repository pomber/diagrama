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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/background.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/background.js":
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* global chrome */\n\n\nconst ports = {};\nconst IS_FIREFOX = navigator.userAgent.indexOf('Firefox') >= 0;\nchrome.runtime.onConnect.addListener(function (port) {\n  let tab = null;\n  let name = null;\n\n  if (isNumeric(port.name)) {\n    tab = port.name;\n    name = 'devtools';\n    installContentScript(+port.name);\n  } else {\n    tab = port.sender.tab.id;\n    name = 'content-script';\n  }\n\n  if (!ports[tab]) {\n    ports[tab] = {\n      devtools: null,\n      'content-script': null\n    };\n  }\n\n  ports[tab][name] = port;\n\n  if (ports[tab].devtools && ports[tab]['content-script']) {\n    doublePipe(ports[tab].devtools, ports[tab]['content-script']);\n  }\n});\n\nfunction isNumeric(str) {\n  return +str + '' === str;\n}\n\nfunction installContentScript(tabId) {\n  chrome.tabs.executeScript(tabId, {\n    file: '/build/contentScript.js'\n  }, function () {});\n}\n\nfunction doublePipe(one, two) {\n  one.onMessage.addListener(lOne);\n\n  function lOne(message) {\n    two.postMessage(message);\n  }\n\n  two.onMessage.addListener(lTwo);\n\n  function lTwo(message) {\n    one.postMessage(message);\n  }\n\n  function shutdown() {\n    one.onMessage.removeListener(lOne);\n    two.onMessage.removeListener(lTwo);\n    one.disconnect();\n    two.disconnect();\n  }\n\n  one.onDisconnect.addListener(shutdown);\n  two.onDisconnect.addListener(shutdown);\n}\n\nfunction setIconAndPopup(reactBuildType, tabId) {\n  chrome.browserAction.setIcon({\n    tabId: tabId,\n    path: {\n      '16': 'icons/16-' + reactBuildType + '.png',\n      '32': 'icons/32-' + reactBuildType + '.png',\n      '48': 'icons/48-' + reactBuildType + '.png',\n      '128': 'icons/128-' + reactBuildType + '.png'\n    }\n  });\n  chrome.browserAction.setPopup({\n    tabId: tabId,\n    popup: 'popups/' + reactBuildType + '.html'\n  });\n}\n\nfunction isRestrictedBrowserPage(url) {\n  return !url || new URL(url).protocol === 'chrome:';\n}\n\nfunction checkAndHandleRestrictedPageIfSo(tab) {\n  if (tab && isRestrictedBrowserPage(tab.url)) {\n    setIconAndPopup('restricted', tab.id);\n  }\n} // update popup page of any existing open tabs, if they are restricted browser pages.\n// we can't update for any other types (prod,dev,outdated etc)\n// as the content script needs to be injected at document_start itself for those kinds of detection\n// TODO: Show a different popup page(to reload current page probably) for old tabs, opened before the extension is installed\n\n\nif (!IS_FIREFOX) {\n  chrome.tabs.query({}, tabs => tabs.forEach(checkAndHandleRestrictedPageIfSo));\n  chrome.tabs.onCreated.addListener((tabId, changeInfo, tab) => checkAndHandleRestrictedPageIfSo(tab));\n} // Listen to URL changes on the active tab and update the DevTools icon.\n\n\nchrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {\n  if (IS_FIREFOX) {\n    // We don't properly detect protected URLs in Firefox at the moment.\n    // However we can reset the DevTools icon to its loading state when the URL changes.\n    // It will be updated to the correct icon by the onMessage callback below.\n    if (tab.active && changeInfo.status === 'loading') {\n      setIconAndPopup('disabled', tabId);\n    }\n  } else {\n    // Don't reset the icon to the loading state for Chrome or Edge.\n    // The onUpdated callback fires more frequently for these browsers,\n    // often after onMessage has been called.\n    checkAndHandleRestrictedPageIfSo(tab);\n  }\n});\nchrome.runtime.onMessage.addListener((request, sender) => {\n  var _request$payload, _ports$id;\n\n  const tab = sender.tab;\n\n  if (tab) {\n    const id = tab.id; // This is sent from the hook content script.\n    // It tells us a renderer has attached.\n\n    if (request.hasDetectedReact) {\n      // We use browserAction instead of pageAction because this lets us\n      // display a custom default popup when React is *not* detected.\n      // It is specified in the manifest.\n      setIconAndPopup(request.reactBuildType, id);\n    } else {\n      switch ((_request$payload = request.payload) === null || _request$payload === void 0 ? void 0 : _request$payload.type) {\n        case 'fetch-file-with-cache-complete':\n        case 'fetch-file-with-cache-error':\n          // Forward the result of fetch-in-page requests back to the extension.\n          const devtools = (_ports$id = ports[id]) === null || _ports$id === void 0 ? void 0 : _ports$id.devtools;\n\n          if (devtools) {\n            devtools.postMessage(request);\n          }\n\n          break;\n      }\n    }\n  }\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvYmFja2dyb3VuZC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9iYWNrZ3JvdW5kLmpzP2ZlNzciXSwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFsIGNocm9tZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbmNvbnN0IHBvcnRzID0ge307XG5cbmNvbnN0IElTX0ZJUkVGT1ggPSBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0ZpcmVmb3gnKSA+PSAwO1xuXG5jaHJvbWUucnVudGltZS5vbkNvbm5lY3QuYWRkTGlzdGVuZXIoZnVuY3Rpb24ocG9ydCkge1xuICBsZXQgdGFiID0gbnVsbDtcbiAgbGV0IG5hbWUgPSBudWxsO1xuICBpZiAoaXNOdW1lcmljKHBvcnQubmFtZSkpIHtcbiAgICB0YWIgPSBwb3J0Lm5hbWU7XG4gICAgbmFtZSA9ICdkZXZ0b29scyc7XG4gICAgaW5zdGFsbENvbnRlbnRTY3JpcHQoK3BvcnQubmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgdGFiID0gcG9ydC5zZW5kZXIudGFiLmlkO1xuICAgIG5hbWUgPSAnY29udGVudC1zY3JpcHQnO1xuICB9XG5cbiAgaWYgKCFwb3J0c1t0YWJdKSB7XG4gICAgcG9ydHNbdGFiXSA9IHtcbiAgICAgIGRldnRvb2xzOiBudWxsLFxuICAgICAgJ2NvbnRlbnQtc2NyaXB0JzogbnVsbCxcbiAgICB9O1xuICB9XG4gIHBvcnRzW3RhYl1bbmFtZV0gPSBwb3J0O1xuXG4gIGlmIChwb3J0c1t0YWJdLmRldnRvb2xzICYmIHBvcnRzW3RhYl1bJ2NvbnRlbnQtc2NyaXB0J10pIHtcbiAgICBkb3VibGVQaXBlKHBvcnRzW3RhYl0uZGV2dG9vbHMsIHBvcnRzW3RhYl1bJ2NvbnRlbnQtc2NyaXB0J10pO1xuICB9XG59KTtcblxuZnVuY3Rpb24gaXNOdW1lcmljKHN0cjogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiArc3RyICsgJycgPT09IHN0cjtcbn1cblxuZnVuY3Rpb24gaW5zdGFsbENvbnRlbnRTY3JpcHQodGFiSWQ6IG51bWJlcikge1xuICBjaHJvbWUudGFicy5leGVjdXRlU2NyaXB0KFxuICAgIHRhYklkLFxuICAgIHtmaWxlOiAnL2J1aWxkL2NvbnRlbnRTY3JpcHQuanMnfSxcbiAgICBmdW5jdGlvbigpIHt9LFxuICApO1xufVxuXG5mdW5jdGlvbiBkb3VibGVQaXBlKG9uZSwgdHdvKSB7XG4gIG9uZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIobE9uZSk7XG4gIGZ1bmN0aW9uIGxPbmUobWVzc2FnZSkge1xuICAgIHR3by5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbiAgfVxuICB0d28ub25NZXNzYWdlLmFkZExpc3RlbmVyKGxUd28pO1xuICBmdW5jdGlvbiBsVHdvKG1lc3NhZ2UpIHtcbiAgICBvbmUucG9zdE1lc3NhZ2UobWVzc2FnZSk7XG4gIH1cbiAgZnVuY3Rpb24gc2h1dGRvd24oKSB7XG4gICAgb25lLm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcihsT25lKTtcbiAgICB0d28ub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKGxUd28pO1xuICAgIG9uZS5kaXNjb25uZWN0KCk7XG4gICAgdHdvLmRpc2Nvbm5lY3QoKTtcbiAgfVxuICBvbmUub25EaXNjb25uZWN0LmFkZExpc3RlbmVyKHNodXRkb3duKTtcbiAgdHdvLm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcihzaHV0ZG93bik7XG59XG5cbmZ1bmN0aW9uIHNldEljb25BbmRQb3B1cChyZWFjdEJ1aWxkVHlwZSwgdGFiSWQpIHtcbiAgY2hyb21lLmJyb3dzZXJBY3Rpb24uc2V0SWNvbih7XG4gICAgdGFiSWQ6IHRhYklkLFxuICAgIHBhdGg6IHtcbiAgICAgICcxNic6ICdpY29ucy8xNi0nICsgcmVhY3RCdWlsZFR5cGUgKyAnLnBuZycsXG4gICAgICAnMzInOiAnaWNvbnMvMzItJyArIHJlYWN0QnVpbGRUeXBlICsgJy5wbmcnLFxuICAgICAgJzQ4JzogJ2ljb25zLzQ4LScgKyByZWFjdEJ1aWxkVHlwZSArICcucG5nJyxcbiAgICAgICcxMjgnOiAnaWNvbnMvMTI4LScgKyByZWFjdEJ1aWxkVHlwZSArICcucG5nJyxcbiAgICB9LFxuICB9KTtcbiAgY2hyb21lLmJyb3dzZXJBY3Rpb24uc2V0UG9wdXAoe1xuICAgIHRhYklkOiB0YWJJZCxcbiAgICBwb3B1cDogJ3BvcHVwcy8nICsgcmVhY3RCdWlsZFR5cGUgKyAnLmh0bWwnLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gaXNSZXN0cmljdGVkQnJvd3NlclBhZ2UodXJsKSB7XG4gIHJldHVybiAhdXJsIHx8IG5ldyBVUkwodXJsKS5wcm90b2NvbCA9PT0gJ2Nocm9tZTonO1xufVxuXG5mdW5jdGlvbiBjaGVja0FuZEhhbmRsZVJlc3RyaWN0ZWRQYWdlSWZTbyh0YWIpIHtcbiAgaWYgKHRhYiAmJiBpc1Jlc3RyaWN0ZWRCcm93c2VyUGFnZSh0YWIudXJsKSkge1xuICAgIHNldEljb25BbmRQb3B1cCgncmVzdHJpY3RlZCcsIHRhYi5pZCk7XG4gIH1cbn1cblxuLy8gdXBkYXRlIHBvcHVwIHBhZ2Ugb2YgYW55IGV4aXN0aW5nIG9wZW4gdGFicywgaWYgdGhleSBhcmUgcmVzdHJpY3RlZCBicm93c2VyIHBhZ2VzLlxuLy8gd2UgY2FuJ3QgdXBkYXRlIGZvciBhbnkgb3RoZXIgdHlwZXMgKHByb2QsZGV2LG91dGRhdGVkIGV0Yylcbi8vIGFzIHRoZSBjb250ZW50IHNjcmlwdCBuZWVkcyB0byBiZSBpbmplY3RlZCBhdCBkb2N1bWVudF9zdGFydCBpdHNlbGYgZm9yIHRob3NlIGtpbmRzIG9mIGRldGVjdGlvblxuLy8gVE9ETzogU2hvdyBhIGRpZmZlcmVudCBwb3B1cCBwYWdlKHRvIHJlbG9hZCBjdXJyZW50IHBhZ2UgcHJvYmFibHkpIGZvciBvbGQgdGFicywgb3BlbmVkIGJlZm9yZSB0aGUgZXh0ZW5zaW9uIGlzIGluc3RhbGxlZFxuaWYgKCFJU19GSVJFRk9YKSB7XG4gIGNocm9tZS50YWJzLnF1ZXJ5KHt9LCB0YWJzID0+IHRhYnMuZm9yRWFjaChjaGVja0FuZEhhbmRsZVJlc3RyaWN0ZWRQYWdlSWZTbykpO1xuICBjaHJvbWUudGFicy5vbkNyZWF0ZWQuYWRkTGlzdGVuZXIoKHRhYklkLCBjaGFuZ2VJbmZvLCB0YWIpID0+XG4gICAgY2hlY2tBbmRIYW5kbGVSZXN0cmljdGVkUGFnZUlmU28odGFiKSxcbiAgKTtcbn1cblxuLy8gTGlzdGVuIHRvIFVSTCBjaGFuZ2VzIG9uIHRoZSBhY3RpdmUgdGFiIGFuZCB1cGRhdGUgdGhlIERldlRvb2xzIGljb24uXG5jaHJvbWUudGFicy5vblVwZGF0ZWQuYWRkTGlzdGVuZXIoKHRhYklkLCBjaGFuZ2VJbmZvLCB0YWIpID0+IHtcbiAgaWYgKElTX0ZJUkVGT1gpIHtcbiAgICAvLyBXZSBkb24ndCBwcm9wZXJseSBkZXRlY3QgcHJvdGVjdGVkIFVSTHMgaW4gRmlyZWZveCBhdCB0aGUgbW9tZW50LlxuICAgIC8vIEhvd2V2ZXIgd2UgY2FuIHJlc2V0IHRoZSBEZXZUb29scyBpY29uIHRvIGl0cyBsb2FkaW5nIHN0YXRlIHdoZW4gdGhlIFVSTCBjaGFuZ2VzLlxuICAgIC8vIEl0IHdpbGwgYmUgdXBkYXRlZCB0byB0aGUgY29ycmVjdCBpY29uIGJ5IHRoZSBvbk1lc3NhZ2UgY2FsbGJhY2sgYmVsb3cuXG4gICAgaWYgKHRhYi5hY3RpdmUgJiYgY2hhbmdlSW5mby5zdGF0dXMgPT09ICdsb2FkaW5nJykge1xuICAgICAgc2V0SWNvbkFuZFBvcHVwKCdkaXNhYmxlZCcsIHRhYklkKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gRG9uJ3QgcmVzZXQgdGhlIGljb24gdG8gdGhlIGxvYWRpbmcgc3RhdGUgZm9yIENocm9tZSBvciBFZGdlLlxuICAgIC8vIFRoZSBvblVwZGF0ZWQgY2FsbGJhY2sgZmlyZXMgbW9yZSBmcmVxdWVudGx5IGZvciB0aGVzZSBicm93c2VycyxcbiAgICAvLyBvZnRlbiBhZnRlciBvbk1lc3NhZ2UgaGFzIGJlZW4gY2FsbGVkLlxuICAgIGNoZWNrQW5kSGFuZGxlUmVzdHJpY3RlZFBhZ2VJZlNvKHRhYik7XG4gIH1cbn0pO1xuXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKHJlcXVlc3QsIHNlbmRlcikgPT4ge1xuICBjb25zdCB0YWIgPSBzZW5kZXIudGFiO1xuICBpZiAodGFiKSB7XG4gICAgY29uc3QgaWQgPSB0YWIuaWQ7XG4gICAgLy8gVGhpcyBpcyBzZW50IGZyb20gdGhlIGhvb2sgY29udGVudCBzY3JpcHQuXG4gICAgLy8gSXQgdGVsbHMgdXMgYSByZW5kZXJlciBoYXMgYXR0YWNoZWQuXG4gICAgaWYgKHJlcXVlc3QuaGFzRGV0ZWN0ZWRSZWFjdCkge1xuICAgICAgLy8gV2UgdXNlIGJyb3dzZXJBY3Rpb24gaW5zdGVhZCBvZiBwYWdlQWN0aW9uIGJlY2F1c2UgdGhpcyBsZXRzIHVzXG4gICAgICAvLyBkaXNwbGF5IGEgY3VzdG9tIGRlZmF1bHQgcG9wdXAgd2hlbiBSZWFjdCBpcyAqbm90KiBkZXRlY3RlZC5cbiAgICAgIC8vIEl0IGlzIHNwZWNpZmllZCBpbiB0aGUgbWFuaWZlc3QuXG4gICAgICBzZXRJY29uQW5kUG9wdXAocmVxdWVzdC5yZWFjdEJ1aWxkVHlwZSwgaWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzd2l0Y2ggKHJlcXVlc3QucGF5bG9hZD8udHlwZSkge1xuICAgICAgICBjYXNlICdmZXRjaC1maWxlLXdpdGgtY2FjaGUtY29tcGxldGUnOlxuICAgICAgICBjYXNlICdmZXRjaC1maWxlLXdpdGgtY2FjaGUtZXJyb3InOlxuICAgICAgICAgIC8vIEZvcndhcmQgdGhlIHJlc3VsdCBvZiBmZXRjaC1pbi1wYWdlIHJlcXVlc3RzIGJhY2sgdG8gdGhlIGV4dGVuc2lvbi5cbiAgICAgICAgICBjb25zdCBkZXZ0b29scyA9IHBvcnRzW2lkXT8uZGV2dG9vbHM7XG4gICAgICAgICAgaWYgKGRldnRvb2xzKSB7XG4gICAgICAgICAgICBkZXZ0b29scy5wb3N0TWVzc2FnZShyZXF1ZXN0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBRkE7QUFTQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQVJBO0FBVUE7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/background.js\n");

/***/ })

/******/ });