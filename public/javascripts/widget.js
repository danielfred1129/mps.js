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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services__ = __webpack_require__(1);

var supportedAPI = ['init', 'test', 'createhederaobject']; // enlist all methods supported by API (e.g. `mw('event', 'user-login');`)

/**
 The main entry of the application
 */

var production = false;

function app(window) {
  console.log(__WEBPACK_IMPORTED_MODULE_0__services__["a" /* ping */]);
  console.log('MPS-JS starting');
  var configurations = {
    paymentserver: production ? "https://mps.hashingsystems.com" : 'http://localhost:9999',
    extensionid: "ligpaondaabclfigagcifobaelemiena",
    error: "/no-extension",
    type: "article",
    time: Date.now(),
    redirect: '{ "nonPayingAccount": "/insufficient-amount/", "noAccount": "/account-not-paired/", "homePage": "/"}',
    // this might make a good default id for the content
    id: window.location.pathname,
    submissionnode: "0.0.11" //redirect:'{ "nonPayingAccount": "/insufficient-amount/", "noAccount": "/account-not-paired/", "homePage": "/" }',

  }; // all methods that were called till now and stored in queue
  // needs to be called now

  var globalObject = window[window['MPS-JS']];
  var queue = globalObject.q;

  if (queue) {
    for (var i = 0; i < queue.length; i++) {
      console.log('queue:');
      console.log(queue[i]);

      if (typeof queue[i][0] !== 'undefined' && queue[i][0].toLowerCase() == 'init') {
        configurations = extendObject(configurations, queue[i][1]);
        createHederaObject(configurations);
        console.log('MPS-JS started', configurations);
        checkForExtension(configurations);
      } else {
        return apiHandler(queue[i][0], queue[i][1]);
      }
    }
  } // override temporary (until the app loaded) handler
  // for widget's API calls


  globalObject = apiHandler;
  globalObject.configurations = configurations;
} // checkForExtension handles 3 scenarios
// returns true (hedera-micropayment tag is present and extension is installed)
// returns false (hedera-micropayment tag is present but extension is NOT installed)
// return null (hedera-micropayment is not present because this website does not implement hedera-micropayment)


function checkForExtension(configurations) {
  if (!isChrome()) {
    redirectToError('/isnotChrome');
  } else {
    var tags = configurations; // if tags.amount is null or undefined, we should assume that this is a free page and do nothing more

    if (tags.amount === null) return null;
    var EXTENSION_ID = tags.extensionid;
    detect(EXTENSION_ID, function () {
      redirectToError(tags.error);
    }, function (response) {
      console.log('detect: user has extension installed');
      recordResponse(response);
    }); //console.log(chrome.runtime.connect(EXTENSION_ID,'version'));

    /*chrome.runtime.sendMessage(EXTENSION_ID, 'version', response => {
        console.log(response)
        return;
        if (!response) {
            redirectToError(tags.error);
        } else {
            recordResponse(response);
        }
    })*/
  }
}

function detect(extensionId, notInstalledCallback, installedCallback) {
  var img = new Image();
  img.onerror = notInstalledCallback;
  img.onload = installedCallback('installed');
  img.src = 'chrome-extension://' + extensionId + '/icons/icon16.png';
}

function recordResponse(res) {
  if (typeof res != 'undefined') {
    var body = document.getElementById('messagediv');
    body.innerHTML += '<div style="width:100%;height:5%;opacity:0.3;z-index:100;background:yellow;">' + res + '</div>';
    return true;
  }

  return false;
}

function redirectToError(err) {
  if (window.location.pathname != err) {
    window.location.replace(window.origin + err);
  }
}

function isChrome() {
  return 'chrome' in window;
}
/**
 Method that handles all API calls
 */


function apiHandler(api, params) {
  if (!api) throw Error('API method required');
  api = api.toLowerCase();
  if (supportedAPI.indexOf(api) === -1) throw Error("Method ".concat(api, " is not supported"));
  console.log("Handling API call ".concat(api), params);

  switch (api) {
    // TODO: add API implementation
    case 'createhederaobject':
      return createHederaObject(params);

    case 'test':
      return params;

    default:
      console.warn("No handler defined for ".concat(api));
  }
}

function extendObject(a, b) {
  for (var key in b) {
    if (b.hasOwnProperty(key)) a[key] = b[key];
  }

  return a;
}

function createHederaObject(params) {
  var object = ['submissionnode', 'paymentserver', 'recipientlist', 'contentid', 'type', 'memo', 'extensionid', 'redirect', 'time'];
  console.log(object);
  var Hederaobject = '<hedera-micropayment ';

  for (var i in object) {
    var node = object[i];

    if (params.hasOwnProperty(node)) {
      Hederaobject += "data-" + node + "= '" + params[node] + "' , " + "\n";
    }
  }

  Hederaobject += '></hedera-micropayment>';
  console.log(Hederaobject);
  var body = document.getElementById(params['attrID']);
  body.innerHTML += Hederaobject; //console.log((Hederaobject))

  return Hederaobject; //callback(Hederaobject);
}

app(window);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = ping;
function ping() {
  return 'pong';
}

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODNlZTU0MTZhNzM2NTdlYTNhMTUiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2VzLmpzIl0sIm5hbWVzIjpbInN1cHBvcnRlZEFQSSIsInByb2R1Y3Rpb24iLCJhcHAiLCJ3aW5kb3ciLCJjb25zb2xlIiwibG9nIiwicGluZyIsImNvbmZpZ3VyYXRpb25zIiwicGF5bWVudHNlcnZlciIsImV4dGVuc2lvbmlkIiwiZXJyb3IiLCJ0eXBlIiwidGltZSIsIkRhdGUiLCJub3ciLCJyZWRpcmVjdCIsImlkIiwibG9jYXRpb24iLCJwYXRobmFtZSIsInN1Ym1pc3Npb25ub2RlIiwiZ2xvYmFsT2JqZWN0IiwicXVldWUiLCJxIiwiaSIsImxlbmd0aCIsInRvTG93ZXJDYXNlIiwiZXh0ZW5kT2JqZWN0IiwiY3JlYXRlSGVkZXJhT2JqZWN0IiwiY2hlY2tGb3JFeHRlbnNpb24iLCJhcGlIYW5kbGVyIiwiaXNDaHJvbWUiLCJyZWRpcmVjdFRvRXJyb3IiLCJ0YWdzIiwiYW1vdW50IiwiRVhURU5TSU9OX0lEIiwiZGV0ZWN0IiwicmVzcG9uc2UiLCJyZWNvcmRSZXNwb25zZSIsImV4dGVuc2lvbklkIiwibm90SW5zdGFsbGVkQ2FsbGJhY2siLCJpbnN0YWxsZWRDYWxsYmFjayIsImltZyIsIkltYWdlIiwib25lcnJvciIsIm9ubG9hZCIsInNyYyIsInJlcyIsImJvZHkiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiaW5uZXJIVE1MIiwiZXJyIiwicmVwbGFjZSIsIm9yaWdpbiIsImFwaSIsInBhcmFtcyIsIkVycm9yIiwiaW5kZXhPZiIsIndhcm4iLCJhIiwiYiIsImtleSIsImhhc093blByb3BlcnR5Iiwib2JqZWN0IiwiSGVkZXJhb2JqZWN0Iiwibm9kZSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtB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RCxFQUFrQixlQUFsQixFQUFrQyxlQUFsQyxFQUFrRCxXQUFsRCxFQUE4RCxNQUE5RCxFQUFxRSxNQUFyRSxFQUE0RSxhQUE1RSxFQUEwRixVQUExRixFQUFxRyxNQUFyRyxDQUFiO0FBQ0EzRCxTQUFPLENBQUNDLEdBQVIsQ0FBWTBELE1BQVo7QUFDQSxNQUFJQyxZQUFZLEdBQUksdUJBQXBCOztBQUNBLE9BQUksSUFBSXpDLENBQVIsSUFBYXdDLE1BQWIsRUFBb0I7QUFDaEIsUUFBSUUsSUFBSSxHQUFHRixNQUFNLENBQUN4QyxDQUFELENBQWpCOztBQUNBLFFBQUdnQyxNQUFNLENBQUNPLGNBQVAsQ0FBc0JHLElBQXRCLENBQUgsRUFBK0I7QUFDM0JELGtCQUFZLElBQUksVUFBUUMsSUFBUixHQUFjLEtBQWQsR0FBcUJWLE1BQU0sQ0FBQ1UsSUFBRCxDQUEzQixHQUFvQyxNQUFwQyxHQUE2QyxJQUE3RDtBQUNIO0FBQ0o7O0FBRURELGNBQVksSUFBSSx5QkFBaEI7QUFDQTVELFNBQU8sQ0FBQ0MsR0FBUixDQUFZMkQsWUFBWjtBQUVBLE1BQUlqQixJQUFJLEdBQUdDLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3Qk0sTUFBTSxDQUFDLFFBQUQsQ0FBOUIsQ0FBWDtBQUNBUixNQUFJLENBQUNHLFNBQUwsSUFBa0JjLFlBQWxCLENBZitCLENBZ0IvQjs7QUFDQSxTQUFPQSxZQUFQLENBakIrQixDQWtCL0I7QUFDSDs7QUFJVDlELEdBQUcsQ0FBQ0MsTUFBRCxDQUFILEM7Ozs7Ozs7QUM1SkE7QUFBTyxTQUFTRyxJQUFULEdBQWdCO0FBQ25CLFNBQU8sTUFBUDtBQUNILEMiLCJmaWxlIjoid2lkZ2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgODNlZTU0MTZhNzM2NTdlYTNhMTUiLCJpbXBvcnQge1xuICAgIHBpbmdcbn0gZnJvbSAnLi9zZXJ2aWNlcydcblxuY29uc3Qgc3VwcG9ydGVkQVBJID0gWydpbml0JywndGVzdCcsJ2NyZWF0ZWhlZGVyYW9iamVjdCddOyAvLyBlbmxpc3QgYWxsIG1ldGhvZHMgc3VwcG9ydGVkIGJ5IEFQSSAoZS5nLiBgbXcoJ2V2ZW50JywgJ3VzZXItbG9naW4nKTtgKVxuLyoqXG4gVGhlIG1haW4gZW50cnkgb2YgdGhlIGFwcGxpY2F0aW9uXG4gKi9cbmNvbnN0IHByb2R1Y3Rpb24gPSBmYWxzZTtcblxuZnVuY3Rpb24gYXBwKHdpbmRvdykge1xuICAgIGNvbnNvbGUubG9nKHBpbmcpO1xuICAgIGNvbnNvbGUubG9nKCdNUFMtSlMgc3RhcnRpbmcnKTtcbiAgICBsZXQgY29uZmlndXJhdGlvbnMgPSB7XG4gICAgICAgIHBheW1lbnRzZXJ2ZXI6IHByb2R1Y3Rpb24gPyBcImh0dHBzOi8vbXBzLmhhc2hpbmdzeXN0ZW1zLmNvbVwiIDogJ2h0dHA6Ly9sb2NhbGhvc3Q6OTk5OScsXG4gICAgICAgIGV4dGVuc2lvbmlkOiBcImxpZ3Bhb25kYWFiY2xmaWdhZ2NpZm9iYWVsZW1pZW5hXCIsXG4gICAgICAgIGVycm9yOiBcIi9uby1leHRlbnNpb25cIixcbiAgICAgICAgdHlwZTogXCJhcnRpY2xlXCIsXG4gICAgICAgIHRpbWU6IERhdGUubm93KCksXG4gICAgICAgIHJlZGlyZWN0Oid7IFwibm9uUGF5aW5nQWNjb3VudFwiOiBcIi9pbnN1ZmZpY2llbnQtYW1vdW50L1wiLCBcIm5vQWNjb3VudFwiOiBcIi9hY2NvdW50LW5vdC1wYWlyZWQvXCIsIFwiaG9tZVBhZ2VcIjogXCIvXCJ9JyxcbiAgICAgICAgLy8gdGhpcyBtaWdodCBtYWtlIGEgZ29vZCBkZWZhdWx0IGlkIGZvciB0aGUgY29udGVudFxuICAgICAgICBpZDogd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLFxuICAgICAgICBzdWJtaXNzaW9ubm9kZTogXCIwLjAuMTFcIixcbiAgICAgICAgLy9yZWRpcmVjdDoneyBcIm5vblBheWluZ0FjY291bnRcIjogXCIvaW5zdWZmaWNpZW50LWFtb3VudC9cIiwgXCJub0FjY291bnRcIjogXCIvYWNjb3VudC1ub3QtcGFpcmVkL1wiLCBcImhvbWVQYWdlXCI6IFwiL1wiIH0nLFxuICAgIH07XG4gICAgLy8gYWxsIG1ldGhvZHMgdGhhdCB3ZXJlIGNhbGxlZCB0aWxsIG5vdyBhbmQgc3RvcmVkIGluIHF1ZXVlXG4gICAgLy8gbmVlZHMgdG8gYmUgY2FsbGVkIG5vd1xuICAgIGxldCBnbG9iYWxPYmplY3QgPSB3aW5kb3dbd2luZG93WydNUFMtSlMnXV07XG4gICAgbGV0IHF1ZXVlID0gZ2xvYmFsT2JqZWN0LnE7XG4gICAgaWYgKHF1ZXVlKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdxdWV1ZTonKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHF1ZXVlW2ldKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcXVldWVbaV1bMF0gIT09J3VuZGVmaW5lZCcgJiYgcXVldWVbaV1bMF0udG9Mb3dlckNhc2UoKSA9PSAnaW5pdCcpIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9ucyA9IGV4dGVuZE9iamVjdChjb25maWd1cmF0aW9ucywgcXVldWVbaV1bMV0pO1xuICAgICAgICAgICAgICAgIGNyZWF0ZUhlZGVyYU9iamVjdChjb25maWd1cmF0aW9ucyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ01QUy1KUyBzdGFydGVkJywgY29uZmlndXJhdGlvbnMpO1xuICAgICAgICAgICAgICAgIGNoZWNrRm9yRXh0ZW5zaW9uKGNvbmZpZ3VyYXRpb25zKVxuICAgICAgICAgICAgfSBlbHNleyByZXR1cm4gYXBpSGFuZGxlcihxdWV1ZVtpXVswXSwgcXVldWVbaV1bMV0pO31cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBvdmVycmlkZSB0ZW1wb3JhcnkgKHVudGlsIHRoZSBhcHAgbG9hZGVkKSBoYW5kbGVyXG4gICAgLy8gZm9yIHdpZGdldCdzIEFQSSBjYWxsc1xuICAgIGdsb2JhbE9iamVjdCA9IGFwaUhhbmRsZXI7XG4gICAgZ2xvYmFsT2JqZWN0LmNvbmZpZ3VyYXRpb25zID0gY29uZmlndXJhdGlvbnM7XG59XG5cbi8vIGNoZWNrRm9yRXh0ZW5zaW9uIGhhbmRsZXMgMyBzY2VuYXJpb3Ncbi8vIHJldHVybnMgdHJ1ZSAoaGVkZXJhLW1pY3JvcGF5bWVudCB0YWcgaXMgcHJlc2VudCBhbmQgZXh0ZW5zaW9uIGlzIGluc3RhbGxlZClcbi8vIHJldHVybnMgZmFsc2UgKGhlZGVyYS1taWNyb3BheW1lbnQgdGFnIGlzIHByZXNlbnQgYnV0IGV4dGVuc2lvbiBpcyBOT1QgaW5zdGFsbGVkKVxuLy8gcmV0dXJuIG51bGwgKGhlZGVyYS1taWNyb3BheW1lbnQgaXMgbm90IHByZXNlbnQgYmVjYXVzZSB0aGlzIHdlYnNpdGUgZG9lcyBub3QgaW1wbGVtZW50IGhlZGVyYS1taWNyb3BheW1lbnQpXG5mdW5jdGlvbiBjaGVja0ZvckV4dGVuc2lvbihjb25maWd1cmF0aW9ucykge1xuICAgIGlmICghaXNDaHJvbWUoKSkge1xuICAgICAgICByZWRpcmVjdFRvRXJyb3IoJy9pc25vdENocm9tZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB0YWdzID0gY29uZmlndXJhdGlvbnM7XG4gICAgICAgIC8vIGlmIHRhZ3MuYW1vdW50IGlzIG51bGwgb3IgdW5kZWZpbmVkLCB3ZSBzaG91bGQgYXNzdW1lIHRoYXQgdGhpcyBpcyBhIGZyZWUgcGFnZSBhbmQgZG8gbm90aGluZyBtb3JlXG4gICAgICAgIGlmICh0YWdzLmFtb3VudCA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gICAgICAgIGNvbnN0IEVYVEVOU0lPTl9JRCA9IHRhZ3MuZXh0ZW5zaW9uaWQ7XG5cbiAgICAgICAgZGV0ZWN0KEVYVEVOU0lPTl9JRCwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJlZGlyZWN0VG9FcnJvcih0YWdzLmVycm9yKTtcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2RldGVjdDogdXNlciBoYXMgZXh0ZW5zaW9uIGluc3RhbGxlZCcpO1xuICAgICAgICAgICAgcmVjb3JkUmVzcG9uc2UocmVzcG9uc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvL2NvbnNvbGUubG9nKGNocm9tZS5ydW50aW1lLmNvbm5lY3QoRVhURU5TSU9OX0lELCd2ZXJzaW9uJykpO1xuICAgICAgICAvKmNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKEVYVEVOU0lPTl9JRCwgJ3ZlcnNpb24nLCByZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICByZWRpcmVjdFRvRXJyb3IodGFncy5lcnJvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlY29yZFJlc3BvbnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkqL1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZGV0ZWN0KGV4dGVuc2lvbklkLCBub3RJbnN0YWxsZWRDYWxsYmFjaywgaW5zdGFsbGVkQ2FsbGJhY2spIHtcbiAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgaW1nLm9uZXJyb3IgPSBub3RJbnN0YWxsZWRDYWxsYmFjaztcbiAgICBpbWcub25sb2FkID0gaW5zdGFsbGVkQ2FsbGJhY2soJ2luc3RhbGxlZCcpO1xuICAgIGltZy5zcmMgPSAnY2hyb21lLWV4dGVuc2lvbjovLycgKyBleHRlbnNpb25JZCArICcvaWNvbnMvaWNvbjE2LnBuZyc7XG59XG5cbmZ1bmN0aW9uIHJlY29yZFJlc3BvbnNlKHJlcykge1xuICAgIGlmICh0eXBlb2YgcmVzICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhciBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lc3NhZ2VkaXYnKTtcbiAgICAgICAgYm9keS5pbm5lckhUTUwgKz0gJzxkaXYgc3R5bGU9XCJ3aWR0aDoxMDAlO2hlaWdodDo1JTtvcGFjaXR5OjAuMzt6LWluZGV4OjEwMDtiYWNrZ3JvdW5kOnllbGxvdztcIj4nICsgcmVzICsgJzwvZGl2Pic7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHJlZGlyZWN0VG9FcnJvcihlcnIpIHtcbiAgICBpZiAod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICE9IGVycikge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSh3aW5kb3cub3JpZ2luICsgZXJyKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzQ2hyb21lKCkge1xuICAgIHJldHVybiAnY2hyb21lJyBpbiB3aW5kb3dcbn1cblxuLyoqXG4gTWV0aG9kIHRoYXQgaGFuZGxlcyBhbGwgQVBJIGNhbGxzXG4gKi9cbmZ1bmN0aW9uIGFwaUhhbmRsZXIoYXBpLCBwYXJhbXMpIHtcbiAgICBpZiAoIWFwaSkgdGhyb3cgRXJyb3IoJ0FQSSBtZXRob2QgcmVxdWlyZWQnKTtcbiAgICBhcGkgPSBhcGkudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoc3VwcG9ydGVkQVBJLmluZGV4T2YoYXBpKSA9PT0gLTEpIHRocm93IEVycm9yKGBNZXRob2QgJHthcGl9IGlzIG5vdCBzdXBwb3J0ZWRgKTtcbiAgICBjb25zb2xlLmxvZyhgSGFuZGxpbmcgQVBJIGNhbGwgJHthcGl9YCwgcGFyYW1zKTtcbiAgICBzd2l0Y2ggKGFwaSkge1xuICAgICAgICAvLyBUT0RPOiBhZGQgQVBJIGltcGxlbWVudGF0aW9uXG5cbiAgICAgICAgY2FzZSAnY3JlYXRlaGVkZXJhb2JqZWN0JzpcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVIZWRlcmFPYmplY3QocGFyYW1zKTtcblxuICAgICAgICBjYXNlICd0ZXN0JzpcbiAgICAgICAgICAgIHJldHVybiBwYXJhbXM7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYE5vIGhhbmRsZXIgZGVmaW5lZCBmb3IgJHthcGl9YCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBleHRlbmRPYmplY3QoYSwgYikge1xuICAgIGZvciAodmFyIGtleSBpbiBiKVxuICAgICAgICBpZiAoYi5oYXNPd25Qcm9wZXJ0eShrZXkpKSBhW2tleV0gPSBiW2tleV07XG4gICAgcmV0dXJuIGE7XG59XG5cblxuICAgICAgICBmdW5jdGlvbiBjcmVhdGVIZWRlcmFPYmplY3QocGFyYW1zKXtcbiAgICAgICAgICAgIGxldCBvYmplY3QgPSBbJ3N1Ym1pc3Npb25ub2RlJywncGF5bWVudHNlcnZlcicsJ3JlY2lwaWVudGxpc3QnLCdjb250ZW50aWQnLCd0eXBlJywnbWVtbycsJ2V4dGVuc2lvbmlkJywncmVkaXJlY3QnLCd0aW1lJ107XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhvYmplY3QpXG4gICAgICAgICAgICBsZXQgSGVkZXJhb2JqZWN0ID0gICc8aGVkZXJhLW1pY3JvcGF5bWVudCAnXG4gICAgICAgICAgICBmb3IodmFyIGkgaW4gb2JqZWN0KXtcbiAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IG9iamVjdFtpXTtcbiAgICAgICAgICAgICAgICBpZihwYXJhbXMuaGFzT3duUHJvcGVydHkobm9kZSkpe1xuICAgICAgICAgICAgICAgICAgICBIZWRlcmFvYmplY3QgKz0gXCJkYXRhLVwiK25vZGUgK1wiPSAnXCIrIHBhcmFtc1tub2RlXSArIFwiJyAsIFwiICsgXCJcXG5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEhlZGVyYW9iamVjdCArPSAnPjwvaGVkZXJhLW1pY3JvcGF5bWVudD4nO1xuICAgICAgICAgICAgY29uc29sZS5sb2coSGVkZXJhb2JqZWN0KTtcblxuICAgICAgICAgICAgdmFyIGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwYXJhbXNbJ2F0dHJJRCddKTtcbiAgICAgICAgICAgIGJvZHkuaW5uZXJIVE1MICs9IEhlZGVyYW9iamVjdDtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coKEhlZGVyYW9iamVjdCkpXG4gICAgICAgICAgICByZXR1cm4gSGVkZXJhb2JqZWN0O1xuICAgICAgICAgICAgLy9jYWxsYmFjayhIZWRlcmFvYmplY3QpO1xuICAgICAgICB9XG5cblxuXG5hcHAod2luZG93KTtcblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL21haW4uanMiLCJcbmV4cG9ydCBmdW5jdGlvbiBwaW5nKCkge1xuICAgIHJldHVybiAncG9uZyc7XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NlcnZpY2VzLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==