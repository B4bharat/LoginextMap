// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"../src/scss/app.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../node_modules/load-google-maps-api/index.js":[function(require,module,exports) {
const API_URL = 'https://maps.googleapis.com/maps/api/js'
const CALLBACK_NAME = '__googleMapsApiOnLoadCallback'

const optionsKeys = ['channel', 'client', 'key', 'language', 'region', 'v']

let promise = null

module.exports = function (options = {}) {
  promise =
    promise ||
    new Promise(function (resolve, reject) {
      // Reject the promise after a timeout
      const timeoutId = setTimeout(function () {
        window[CALLBACK_NAME] = function () {} // Set the on load callback to a no-op
        reject(new Error('Could not load the Google Maps API'))
      }, options.timeout || 10000)

      // Hook up the on load callback
      window[CALLBACK_NAME] = function () {
        if (timeoutId !== null) {
          clearTimeout(timeoutId)
        }
        resolve(window.google.maps)
        delete window[CALLBACK_NAME]
      }

      // Prepare the `script` tag to be inserted into the page
      const scriptElement = document.createElement('script')
      const params = [`callback=${CALLBACK_NAME}`]
      optionsKeys.forEach(function (key) {
        if (options[key]) {
          params.push(`${key}=${options[key]}`)
        }
      })
      if (options.libraries && options.libraries.length) {
        params.push(`libraries=${options.libraries.join(',')}`)
      }
      scriptElement.src = `${options.apiUrl || API_URL}?${params.join('&')}`

      // Insert the `script` tag
      document.body.appendChild(scriptElement)
    })
  return promise
}

},{}],"../src/data/locations.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.locations = void 0;
let locations = [{
  "key": "IN/110001",
  "place_name": "Connaught Place",
  "admin_name1": "New Delhi",
  "latitude": 28.6333,
  "longitude": 77.2167,
  "accuracy": 4
}, {
  "key": "IN/110002",
  "place_name": "Darya Ganj",
  "admin_name1": "New Delhi",
  "latitude": 28.6333,
  "longitude": 77.25,
  "accuracy": 4
}, {
  "key": "IN/110003",
  "place_name": "Aliganj",
  "admin_name1": "New Delhi",
  "latitude": 28.65,
  "longitude": 77.2167,
  "accuracy": ""
}, {
  "key": "IN/110004",
  "place_name": "Rashtrapati Bhawan",
  "admin_name1": "New Delhi",
  "latitude": 28.65,
  "longitude": 77.2167,
  "accuracy": ""
}, {
  "key": "IN/110005",
  "place_name": "Lower Camp Anand Parbat",
  "admin_name1": "New Delhi",
  "latitude": 28.65,
  "longitude": 77.2,
  "accuracy": ""
}, {
  "key": "IN/110006",
  "place_name": "Bara Tooti",
  "admin_name1": "New Delhi",
  "latitude": 28.65,
  "longitude": 77.2167,
  "accuracy": ""
}, {
  "key": "IN/110007",
  "place_name": "Birla Lines",
  "admin_name1": "New Delhi",
  "latitude": 28.6833,
  "longitude": 77.2,
  "accuracy": ""
}, {
  "key": "IN/110008",
  "place_name": "Patel Nagar",
  "admin_name1": "New Delhi",
  "latitude": 28.65,
  "longitude": 77.2167,
  "accuracy": ""
}, {
  "key": "IN/110010",
  "place_name": "Delhi Cantt",
  "admin_name1": "New Delhi",
  "latitude": 28.55,
  "longitude": 77.2667,
  "accuracy": ""
}, {
  "key": "IN/110011",
  "place_name": "Nirman Bhawan",
  "admin_name1": "New Delhi",
  "latitude": 28.55,
  "longitude": 77.2667,
  "accuracy": ""
}, {
  "key": "IN/110012",
  "place_name": "Inderpuri",
  "admin_name1": "New Delhi",
  "latitude": 28.55,
  "longitude": 77.2667,
  "accuracy": ""
}, {
  "key": "IN/110013",
  "place_name": "Hazrat Nizamuddin",
  "admin_name1": "New Delhi",
  "latitude": 28.55,
  "longitude": 77.2667,
  "accuracy": ""
}, {
  "key": "IN/110014",
  "place_name": "Jangpura",
  "admin_name1": "New Delhi",
  "latitude": 28.55,
  "longitude": 77.2667,
  "accuracy": ""
}, {
  "key": "IN/110015",
  "place_name": "Zakhira",
  "admin_name1": "New Delhi",
  "latitude": 28.55,
  "longitude": 77.2667,
  "accuracy": ""
}, {
  "key": "IN/110016",
  "place_name": "Hauz Khas",
  "admin_name1": "New Delhi",
  "latitude": 28.55,
  "longitude": 77.2667,
  "accuracy": ""
}, {
  "key": "IN/110017",
  "place_name": "Malviya Nagar",
  "admin_name1": "New Delhi",
  "latitude": 28.55,
  "longitude": 77.2667,
  "accuracy": ""
}, {
  "key": "IN/110018",
  "place_name": "Vishnu Garden",
  "admin_name1": "New Delhi",
  "latitude": 28.55,
  "longitude": 77.2667,
  "accuracy": ""
}, {
  "key": "IN/110019",
  "place_name": "Nehru Place",
  "admin_name1": "New Delhi",
  "latitude": 28.55,
  "longitude": 77.2667,
  "accuracy": ""
}, {
  "key": "IN/110020",
  "place_name": "Flatted Factories Complex",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110021",
  "place_name": "Malcha Marg",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110022",
  "place_name": "Postal Saving Bureau",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110023",
  "place_name": "Kidwai Nagar",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110024",
  "place_name": "Lajpat Nagar",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110025",
  "place_name": "Jamia Nagar",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110026",
  "place_name": "Punjabi Bagh",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110027",
  "place_name": "J 6block Rajouri Garden",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110028",
  "place_name": "Naraina Industrial Estate",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110029",
  "place_name": "Himayunpur Extn",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110030",
  "place_name": "T B Hospital",
  "admin_name1": "New Delhi",
  "latitude": 28.7556,
  "longitude": 77.1667,
  "accuracy": ""
}, {
  "key": "IN/110031",
  "place_name": "Gandhi Nagar",
  "admin_name1": "New Delhi",
  "latitude": 28.7556,
  "longitude": 77.1667,
  "accuracy": ""
}, {
  "key": "IN/110032",
  "place_name": "Shahdara",
  "admin_name1": "New Delhi",
  "latitude": 28.6667,
  "longitude": 77.3167,
  "accuracy": 4
}, {
  "key": "IN/110033",
  "place_name": "Adarsh Nagar",
  "admin_name1": "New Delhi",
  "latitude": 28.7556,
  "longitude": 77.1667,
  "accuracy": ""
}, {
  "key": "IN/110034",
  "place_name": "Pitampura",
  "admin_name1": "New Delhi",
  "latitude": 28.7556,
  "longitude": 77.1667,
  "accuracy": ""
}, {
  "key": "IN/110035",
  "place_name": "Inderlok",
  "admin_name1": "New Delhi",
  "latitude": 28.7556,
  "longitude": 77.1667,
  "accuracy": ""
}, {
  "key": "IN/110036",
  "place_name": "Alipur",
  "admin_name1": "New Delhi",
  "latitude": 28.8,
  "longitude": 77.15,
  "accuracy": 4
}, {
  "key": "IN/110037",
  "place_name": "Gurgaon Road",
  "admin_name1": "New Delhi",
  "latitude": 28.7556,
  "longitude": 77.1667,
  "accuracy": ""
}, {
  "key": "IN/110038",
  "place_name": "A F Rajokari",
  "admin_name1": "New Delhi",
  "latitude": 28.7556,
  "longitude": 77.1667,
  "accuracy": ""
}, {
  "key": "IN/110039",
  "place_name": "Bawana",
  "admin_name1": "New Delhi",
  "latitude": 28.8,
  "longitude": 77.0333,
  "accuracy": 4
}, {
  "key": "IN/110040",
  "place_name": "Sanoth",
  "admin_name1": "New Delhi",
  "latitude": 28.85,
  "longitude": 77.1,
  "accuracy": ""
}, {
  "key": "IN/110041",
  "place_name": "Nagloi",
  "admin_name1": "New Delhi",
  "latitude": 28.6092,
  "longitude": 77.1569,
  "accuracy": ""
}, {
  "key": "IN/110042",
  "place_name": "Badli",
  "admin_name1": "New Delhi",
  "latitude": 28.6092,
  "longitude": 77.1569,
  "accuracy": ""
}, {
  "key": "IN/110043",
  "place_name": "Najafgarh",
  "admin_name1": "New Delhi",
  "latitude": 28.6125,
  "longitude": 76.9847,
  "accuracy": 4
}, {
  "key": "IN/110044",
  "place_name": "Badarpur T P Station",
  "admin_name1": "New Delhi",
  "latitude": 28.5083,
  "longitude": 77.3,
  "accuracy": ""
}, {
  "key": "IN/110045",
  "place_name": "Palam Enclave",
  "admin_name1": "New Delhi",
  "latitude": 28.5667,
  "longitude": 77.1,
  "accuracy": ""
}, {
  "key": "IN/110046",
  "place_name": "Nangal Rava",
  "admin_name1": "New Delhi",
  "latitude": 28.6092,
  "longitude": 77.1569,
  "accuracy": ""
}, {
  "key": "IN/110047",
  "place_name": "Arjan Garh",
  "admin_name1": "New Delhi",
  "latitude": 28.6092,
  "longitude": 77.1569,
  "accuracy": ""
}, {
  "key": "IN/110048",
  "place_name": "Kailash",
  "admin_name1": "New Delhi",
  "latitude": 28.6092,
  "longitude": 77.1569,
  "accuracy": ""
}, {
  "key": "IN/110049",
  "place_name": "Andrews Ganj",
  "admin_name1": "New Delhi",
  "latitude": 28.6092,
  "longitude": 77.1569,
  "accuracy": ""
}, {
  "key": "IN/110051",
  "place_name": "Azad Nagar",
  "admin_name1": "New Delhi",
  "latitude": 28.6167,
  "longitude": 77.2167,
  "accuracy": ""
}, {
  "key": "IN/110052",
  "place_name": "Wazirpur Phase Iii",
  "admin_name1": "New Delhi",
  "latitude": 28.6167,
  "longitude": 77.2167,
  "accuracy": ""
}, {
  "key": "IN/110053",
  "place_name": "Zafrabad",
  "admin_name1": "New Delhi",
  "latitude": 28.6167,
  "longitude": 77.2167,
  "accuracy": ""
}, {
  "key": "IN/110054",
  "place_name": "Civil Lines",
  "admin_name1": "New Delhi",
  "latitude": 28.6167,
  "longitude": 77.2167,
  "accuracy": ""
}, {
  "key": "IN/110055",
  "place_name": "Paharganj",
  "admin_name1": "New Delhi",
  "latitude": 28.6167,
  "longitude": 77.2167,
  "accuracy": 4
}, {
  "key": "IN/110056",
  "place_name": "Shakurbasti",
  "admin_name1": "New Delhi",
  "latitude": 28.6167,
  "longitude": 77.2167,
  "accuracy": ""
}, {
  "key": "IN/110057",
  "place_name": "Munirka",
  "admin_name1": "New Delhi",
  "latitude": 28.6167,
  "longitude": 77.2167,
  "accuracy": ""
}, {
  "key": "IN/110058",
  "place_name": "Janakpuri",
  "admin_name1": "New Delhi",
  "latitude": 28.6167,
  "longitude": 77.2167,
  "accuracy": ""
}, {
  "key": "IN/110059",
  "place_name": "Uttam Nagar",
  "admin_name1": "New Delhi",
  "latitude": 28.6167,
  "longitude": 77.2167,
  "accuracy": ""
}, {
  "key": "IN/110060",
  "place_name": "New Rajinder Nagar",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110061",
  "place_name": "Bijwasan",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110062",
  "place_name": "Hamdard Nagar",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110063",
  "place_name": "Paschim Vihar",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110064",
  "place_name": "Hari Nagar Be Block",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110065",
  "place_name": "East Of Kailash",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110066",
  "place_name": "R K Puram",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110067",
  "place_name": "D D A Munirka",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110070",
  "place_name": "Vasant Kunj",
  "admin_name1": "New Delhi",
  "latitude": 28.6528,
  "longitude": 76.9539,
  "accuracy": ""
}, {
  "key": "IN/110071",
  "place_name": "Chhawla",
  "admin_name1": "New Delhi",
  "latitude": 28.6528,
  "longitude": 76.9539,
  "accuracy": ""
}, {
  "key": "IN/110072",
  "place_name": "Jharoda Kalan",
  "admin_name1": "New Delhi",
  "latitude": 28.6528,
  "longitude": 76.9539,
  "accuracy": 4
}, {
  "key": "IN/110073",
  "place_name": "Ujwa",
  "admin_name1": "New Delhi",
  "latitude": 28.6528,
  "longitude": 76.9539,
  "accuracy": ""
}, {
  "key": "IN/110081",
  "place_name": "Kanjhawala",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110082",
  "place_name": "Khera Kalan",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110083",
  "place_name": "Mangolpuri Block A",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110084",
  "place_name": "Kutubgarh",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110088",
  "place_name": "Shalimar Bagh",
  "admin_name1": "New Delhi",
  "latitude": 28.7165,
  "longitude": 77.1629,
  "accuracy": 6
}, {
  "key": "IN/110091",
  "place_name": "Himmatpuri",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110092",
  "place_name": "Shakarpur",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110093",
  "place_name": "Nand Nagri A Block",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110094",
  "place_name": "Gokulpuri",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/110096",
  "place_name": "Bhajan Pura",
  "admin_name1": "New Delhi",
  "latitude": 28.6488,
  "longitude": 77.1726,
  "accuracy": ""
}, {
  "key": "IN/121001",
  "place_name": "Faridabad",
  "admin_name1": "Uttar Pradesh",
  "latitude": 28.9915,
  "longitude": 76.2541,
  "accuracy": ""
}, {
  "key": "IN/121002",
  "place_name": "Faridabad",
  "admin_name1": "Uttar Pradesh",
  "latitude": 28.9915,
  "longitude": 76.2541,
  "accuracy": ""
}, {
  "key": "IN/121005",
  "place_name": "Faridabad Sector 22",
  "admin_name1": "Uttar Pradesh",
  "latitude": 28.9915,
  "longitude": 76.2541,
  "accuracy": ""
}, {
  "key": "IN/121006",
  "place_name": "Industrial Estate",
  "admin_name1": "Uttar Pradesh",
  "latitude": 28.9915,
  "longitude": 76.2541,
  "accuracy": ""
}, {
  "key": "IN/121007",
  "place_name": "Faridabad",
  "admin_name1": "Uttar Pradesh",
  "latitude": 28.9915,
  "longitude": 76.2541,
  "accuracy": ""
}, {
  "key": "IN/121101",
  "place_name": "Tigaon",
  "admin_name1": "Uttar Pradesh",
  "latitude": 28.9915,
  "longitude": 76.2541,
  "accuracy": ""
}, {
  "key": "IN/121102",
  "place_name": "Palwal",
  "admin_name1": "Uttar Pradesh",
  "latitude": 28.9915,
  "longitude": 76.2541,
  "accuracy": ""
}, {
  "key": "IN/122001",
  "place_name": "Gurgaon Kutchery",
  "admin_name1": "Haryana",
  "latitude": 28.09,
  "longitude": 76.9567,
  "accuracy": ""
}, {
  "key": "IN/122005",
  "place_name": "Air Force Gurgaon",
  "admin_name1": "Haryana",
  "latitude": 28.09,
  "longitude": 76.9567,
  "accuracy": ""
}, {
  "key": "IN/122015",
  "place_name": "Gurgaon Palampur Road",
  "admin_name1": "Haryana",
  "latitude": 28.09,
  "longitude": 76.9567,
  "accuracy": ""
}, {
  "key": "IN/122016",
  "place_name": "Dundahera",
  "admin_name1": "Haryana",
  "latitude": 28.09,
  "longitude": 76.9567,
  "accuracy": ""
}, {
  "key": "IN/122050",
  "place_name": "Manesar",
  "admin_name1": "Haryana",
  "latitude": 28.09,
  "longitude": 76.9567,
  "accuracy": ""
}, {
  "key": "IN/122101",
  "place_name": "Badshahpur",
  "admin_name1": "Haryana",
  "latitude": 28.4,
  "longitude": 77.05,
  "accuracy": 4
}, {
  "key": "IN/122103",
  "place_name": "Sohna(Gurgaon)",
  "admin_name1": "Haryana",
  "latitude": 28.09,
  "longitude": 76.9567,
  "accuracy": ""
}, {
  "key": "IN/122104",
  "place_name": "Ferozepur Jhirka",
  "admin_name1": "Haryana",
  "latitude": 27.8,
  "longitude": 76.95,
  "accuracy": 4
}, {
  "key": "IN/122105",
  "place_name": "Taura",
  "admin_name1": "Haryana",
  "latitude": 28.09,
  "longitude": 76.9567,
  "accuracy": ""
}, {
  "key": "IN/122106",
  "place_name": "Dharuhera",
  "admin_name1": "Haryana",
  "latitude": 28.2167,
  "longitude": 76.7833,
  "accuracy": 4
}, {
  "key": "IN/122107",
  "place_name": "Nuh",
  "admin_name1": "Haryana",
  "latitude": 28.1167,
  "longitude": 77.0167,
  "accuracy": 4
}, {
  "key": "IN/122108",
  "place_name": "Nagina",
  "admin_name1": "Haryana",
  "latitude": 27.9167,
  "longitude": 76.9833,
  "accuracy": 4
}, {
  "key": "IN/122109",
  "place_name": "Daulatabad (Gurgaon)",
  "admin_name1": "Haryana",
  "latitude": 28.09,
  "longitude": 76.9567,
  "accuracy": ""
}, {
  "key": "IN/122211",
  "place_name": "Palmar",
  "admin_name1": "Haryana",
  "latitude": 28.09,
  "longitude": 76.9567,
  "accuracy": ""
}, {
  "key": "IN/123001",
  "place_name": "Narnaul Kutchery",
  "admin_name1": "Haryana",
  "latitude": 28.5,
  "longitude": 76.2111,
  "accuracy": ""
}, {
  "key": "IN/123020",
  "place_name": "Sanwar",
  "admin_name1": "Haryana",
  "latitude": 28.5,
  "longitude": 76.2111,
  "accuracy": ""
}, {
  "key": "IN/123021",
  "place_name": "Mandi Ateli",
  "admin_name1": "Haryana",
  "latitude": 28.5,
  "longitude": 76.2111,
  "accuracy": ""
}, {
  "key": "IN/123023",
  "place_name": "Nangal Chaudhary",
  "admin_name1": "Haryana",
  "latitude": 28.5,
  "longitude": 76.2111,
  "accuracy": ""
}, {
  "key": "IN/123024",
  "place_name": "Satnali",
  "admin_name1": "Haryana",
  "latitude": 28.3833,
  "longitude": 75.9667,
  "accuracy": 4
}, {
  "key": "IN/123025",
  "place_name": "Baund",
  "admin_name1": "Haryana",
  "latitude": 28.7833,
  "longitude": 76.35,
  "accuracy": 4
}, {
  "key": "IN/123027",
  "place_name": "Kanina",
  "admin_name1": "Haryana",
  "latitude": 28.3333,
  "longitude": 76.3167,
  "accuracy": 4
}, {
  "key": "IN/123028",
  "place_name": "Nangal Sirohi",
  "admin_name1": "Haryana",
  "latitude": 28.5,
  "longitude": 76.2111,
  "accuracy": ""
}, {
  "key": "IN/123029",
  "place_name": "Mohindergarh",
  "admin_name1": "Haryana",
  "latitude": 28.5,
  "longitude": 76.2111,
  "accuracy": ""
}, {
  "key": "IN/123034",
  "place_name": "Bawania",
  "admin_name1": "Haryana",
  "latitude": 28.5,
  "longitude": 76.2111,
  "accuracy": ""
}, {
  "key": "IN/123035",
  "place_name": "Pahlawas",
  "admin_name1": "Haryana",
  "latitude": 28.5,
  "longitude": 76.2111,
  "accuracy": ""
}, {
  "key": "IN/123201",
  "place_name": "Loharu",
  "admin_name1": "Haryana",
  "latitude": 28.45,
  "longitude": 75.8167,
  "accuracy": 4
}, {
  "key": "IN/123301",
  "place_name": "Guriani",
  "admin_name1": "Haryana",
  "latitude": 28.35,
  "longitude": 76.5167,
  "accuracy": 4
}, {
  "key": "IN/123306",
  "place_name": "Charkhi Dadri Factory",
  "admin_name1": "Haryana",
  "latitude": 28.6,
  "longitude": 76.2667,
  "accuracy": ""
}, {
  "key": "IN/123307",
  "place_name": "Achina",
  "admin_name1": "Haryana",
  "latitude": 28.6833,
  "longitude": 76.3667,
  "accuracy": 4
}, {
  "key": "IN/123308",
  "place_name": "Badhra",
  "admin_name1": "Haryana",
  "latitude": 28.5444,
  "longitude": 76.3833,
  "accuracy": ""
}, {
  "key": "IN/123310",
  "place_name": "Jhoju Kalan",
  "admin_name1": "Haryana",
  "latitude": 28.5444,
  "longitude": 76.3833,
  "accuracy": ""
}, {
  "key": "IN/123401",
  "place_name": "Model Town Rewari",
  "admin_name1": "Haryana",
  "latitude": 28.1833,
  "longitude": 76.6167,
  "accuracy": ""
}, {
  "key": "IN/123411",
  "place_name": "Dahina",
  "admin_name1": "Uttar Pradesh",
  "latitude": 28.1833,
  "longitude": 76.6167,
  "accuracy": ""
}, {
  "key": "IN/123412",
  "place_name": "Dharan",
  "admin_name1": "Haryana",
  "latitude": 28.1833,
  "longitude": 76.6167,
  "accuracy": ""
}, {
  "key": "IN/123413",
  "place_name": "Akheri Madanpur",
  "admin_name1": "Haryana",
  "latitude": 28.1833,
  "longitude": 76.6167,
  "accuracy": ""
}, {
  "key": "IN/123414",
  "place_name": "Nanu Kalan",
  "admin_name1": "Haryana",
  "latitude": 28.1833,
  "longitude": 76.6167,
  "accuracy": ""
}, {
  "key": "IN/123501",
  "place_name": "Bawal",
  "admin_name1": "Haryana",
  "latitude": 28.0833,
  "longitude": 76.5833,
  "accuracy": 4
}, {
  "key": "IN/123502",
  "place_name": "Khalilpur",
  "admin_name1": "Haryana",
  "latitude": 28.2833,
  "longitude": 76.7667,
  "accuracy": ""
}, {
  "key": "IN/123503",
  "place_name": "Pataudi",
  "admin_name1": "Haryana",
  "latitude": 28.3167,
  "longitude": 76.7833,
  "accuracy": 4
}, {
  "key": "IN/123504",
  "place_name": "Haily Mandi",
  "admin_name1": "Haryana",
  "latitude": 28.2833,
  "longitude": 76.7667,
  "accuracy": ""
}, {
  "key": "IN/123505",
  "place_name": "Garhi Harsaru",
  "admin_name1": "Haryana",
  "latitude": 28.45,
  "longitude": 76.9333,
  "accuracy": 4
}, {
  "key": "IN/123506",
  "place_name": "Farrukh Nagar",
  "admin_name1": "Haryana",
  "latitude": 28.2833,
  "longitude": 76.7667,
  "accuracy": ""
}, {
  "key": "IN/123508",
  "place_name": "Jatauli",
  "admin_name1": "Haryana",
  "latitude": 28.2833,
  "longitude": 76.7667,
  "accuracy": ""
}, {
  "key": "IN/124001",
  "place_name": "Rohtak",
  "admin_name1": "Haryana",
  "latitude": 28.9,
  "longitude": 76.5667,
  "accuracy": 4
}, {
  "key": "IN/124003",
  "place_name": "Vaish High Schl Rohtak",
  "admin_name1": "Haryana",
  "latitude": 28.9,
  "longitude": 76.5667,
  "accuracy": ""
}, {
  "key": "IN/124004",
  "place_name": "G K Singhpur",
  "admin_name1": "Haryana",
  "latitude": 28.9,
  "longitude": 76.5667,
  "accuracy": ""
}, {
  "key": "IN/124005",
  "place_name": "Titauli",
  "admin_name1": "Haryana",
  "latitude": 28.9,
  "longitude": 76.5667,
  "accuracy": ""
}, {
  "key": "IN/124006",
  "place_name": "Makrauli Kalan",
  "admin_name1": "Haryana",
  "latitude": 28.9,
  "longitude": 76.5667,
  "accuracy": ""
}, {
  "key": "IN/124007",
  "place_name": "Samargopalpur",
  "admin_name1": "Haryana",
  "latitude": 28.9,
  "longitude": 76.5667,
  "accuracy": ""
}, {
  "key": "IN/124021",
  "place_name": "Asthal Bohar",
  "admin_name1": "Haryana",
  "latitude": 28.8667,
  "longitude": 76.45,
  "accuracy": ""
}, {
  "key": "IN/124022",
  "place_name": "Morkhra",
  "admin_name1": "Haryana",
  "latitude": 28.8667,
  "longitude": 76.45,
  "accuracy": ""
}, {
  "key": "IN/124024",
  "place_name": "Lahli",
  "admin_name1": "Haryana",
  "latitude": 28.8667,
  "longitude": 76.45,
  "accuracy": 4
}, {
  "key": "IN/124025",
  "place_name": "Kharawal",
  "admin_name1": "Haryana",
  "latitude": 28.8667,
  "longitude": 76.45,
  "accuracy": ""
}, {
  "key": "IN/124028",
  "place_name": "Basana",
  "admin_name1": "Haryana",
  "latitude": 28.8667,
  "longitude": 76.45,
  "accuracy": ""
}, {
  "key": "IN/124029",
  "place_name": "Baland",
  "admin_name1": "Haryana",
  "latitude": 28.8667,
  "longitude": 76.45,
  "accuracy": ""
}, {
  "key": "IN/124030",
  "place_name": "Gharauthi",
  "admin_name1": "Haryana",
  "latitude": 28.8833,
  "longitude": 76.5083,
  "accuracy": ""
}, {
  "key": "IN/124031",
  "place_name": "Maina",
  "admin_name1": "Haryana",
  "latitude": 28.8833,
  "longitude": 76.5083,
  "accuracy": ""
}, {
  "key": "IN/124101",
  "place_name": "Barhana",
  "admin_name1": "Haryana",
  "latitude": 28.62,
  "longitude": 76.67,
  "accuracy": ""
}, {
  "key": "IN/124102",
  "place_name": "Dujana",
  "admin_name1": "Haryana",
  "latitude": 28.6833,
  "longitude": 76.6167,
  "accuracy": 4
}, {
  "key": "IN/124103",
  "place_name": "Jhajar H O",
  "admin_name1": "Haryana",
  "latitude": 28.62,
  "longitude": 76.67,
  "accuracy": ""
}, {
  "key": "IN/124104",
  "place_name": "Jhajjar",
  "admin_name1": "Haryana",
  "latitude": 28.6167,
  "longitude": 76.65,
  "accuracy": 4
}, {
  "key": "IN/124105",
  "place_name": "Badli",
  "admin_name1": "Haryana",
  "latitude": 28.5833,
  "longitude": 76.8167,
  "accuracy": 4
}, {
  "key": "IN/124107",
  "place_name": "Dighal",
  "admin_name1": "Haryana",
  "latitude": 28.75,
  "longitude": 76.6167,
  "accuracy": 4
}, {
  "key": "IN/124108",
  "place_name": "Machhrauli",
  "admin_name1": "Haryana",
  "latitude": 28.4667,
  "longitude": 76.65,
  "accuracy": 4
}, {
  "key": "IN/124109",
  "place_name": "Dhakala",
  "admin_name1": "Haryana",
  "latitude": 28.62,
  "longitude": 76.67,
  "accuracy": ""
}, {
  "key": "IN/124110",
  "place_name": "Bahu Akbarpur",
  "admin_name1": "Haryana",
  "latitude": 28.8917,
  "longitude": 76.4167,
  "accuracy": ""
}, {
  "key": "IN/124111",
  "place_name": "Madina",
  "admin_name1": "Haryana",
  "latitude": 28.95,
  "longitude": 76.4333,
  "accuracy": 4
}, {
  "key": "IN/124112",
  "place_name": "Meham",
  "admin_name1": "Haryana",
  "latitude": 28.8917,
  "longitude": 76.4167,
  "accuracy": ""
}, {
  "key": "IN/124113",
  "place_name": "Kalanaur",
  "admin_name1": "Haryana",
  "latitude": 28.8333,
  "longitude": 76.4,
  "accuracy": 4
}, {
  "key": "IN/124114",
  "place_name": "Kharak Kalan",
  "admin_name1": "Haryana",
  "latitude": 28.8917,
  "longitude": 76.4167,
  "accuracy": ""
}, {
  "key": "IN/124118",
  "place_name": "Gochhi",
  "admin_name1": "Haryana",
  "latitude": 28.8917,
  "longitude": 76.4167,
  "accuracy": ""
}, {
  "key": "IN/124120",
  "place_name": "Bahlba",
  "admin_name1": "Haryana",
  "latitude": 28.7274,
  "longitude": 76.6286,
  "accuracy": ""
}, {
  "key": "IN/124121",
  "place_name": "Kharkhera",
  "admin_name1": "Haryana",
  "latitude": 28.7274,
  "longitude": 76.6286,
  "accuracy": ""
}, {
  "key": "IN/124124",
  "place_name": "Katesra",
  "admin_name1": "Haryana",
  "latitude": 28.7274,
  "longitude": 76.6286,
  "accuracy": ""
}, {
  "key": "IN/124125",
  "place_name": "Jhalri",
  "admin_name1": "Haryana",
  "latitude": 28.7274,
  "longitude": 76.6286,
  "accuracy": ""
}, {
  "key": "IN/124126",
  "place_name": "Kalinga",
  "admin_name1": "Haryana",
  "latitude": 28.7274,
  "longitude": 76.6286,
  "accuracy": ""
}, {
  "key": "IN/124127",
  "place_name": "Sisar Khas",
  "admin_name1": "Haryana",
  "latitude": 28.7274,
  "longitude": 76.6286,
  "accuracy": ""
}, {
  "key": "IN/124129",
  "place_name": "Saman",
  "admin_name1": "Haryana",
  "latitude": 28.7274,
  "longitude": 76.6286,
  "accuracy": ""
}, {
  "key": "IN/124130",
  "place_name": "Talao",
  "admin_name1": "Haryana",
  "latitude": 28.7274,
  "longitude": 76.6286,
  "accuracy": ""
}, {
  "key": "IN/124131",
  "place_name": "Jhazgarh",
  "admin_name1": "Haryana",
  "latitude": 28.7274,
  "longitude": 76.6286,
  "accuracy": ""
}, {
  "key": "IN/124132",
  "place_name": "Ritauli",
  "admin_name1": "Haryana",
  "latitude": 28.7274,
  "longitude": 76.6286,
  "accuracy": ""
}, {
  "key": "IN/124133",
  "place_name": "M P Majra",
  "admin_name1": "Haryana",
  "latitude": 28.7274,
  "longitude": 76.6286,
  "accuracy": ""
}, {
  "key": "IN/124135",
  "place_name": "Daura Raja",
  "admin_name1": "Haryana",
  "latitude": 28.7274,
  "longitude": 76.6286,
  "accuracy": ""
}, {
  "key": "IN/124136",
  "place_name": "Chimni",
  "admin_name1": "Haryana",
  "latitude": 28.7274,
  "longitude": 76.6286,
  "accuracy": ""
}, {
  "key": "IN/124138",
  "place_name": "Jahangirpur",
  "admin_name1": "Haryana",
  "latitude": 28.7274,
  "longitude": 76.6286,
  "accuracy": ""
}, {
  "key": "IN/124139",
  "place_name": "Mehrana",
  "admin_name1": "Haryana",
  "latitude": 28.7274,
  "longitude": 76.6286,
  "accuracy": ""
}, {
  "key": "IN/124140",
  "place_name": "Silana",
  "admin_name1": "Haryana",
  "latitude": 28.9356,
  "longitude": 76.8458,
  "accuracy": 4
}, {
  "key": "IN/124202",
  "place_name": "Dobaldhan",
  "admin_name1": "Haryana",
  "latitude": 28.9185,
  "longitude": 76.7051,
  "accuracy": ""
}, {
  "key": "IN/124203",
  "place_name": "Majra (Rohtak)",
  "admin_name1": "Haryana",
  "latitude": 28.9185,
  "longitude": 76.7051,
  "accuracy": ""
}, {
  "key": "IN/124204",
  "place_name": "Sewana",
  "admin_name1": "Haryana",
  "latitude": 28.9185,
  "longitude": 76.7051,
  "accuracy": ""
}, {
  "key": "IN/124205",
  "place_name": "Pilana",
  "admin_name1": "Haryana",
  "latitude": 28.9185,
  "longitude": 76.7051,
  "accuracy": ""
}, {
  "key": "IN/124301",
  "place_name": "Gohana H O",
  "admin_name1": "Haryana",
  "latitude": 29.3834,
  "longitude": 76.8126,
  "accuracy": ""
}, {
  "key": "IN/124303",
  "place_name": "Sanghi",
  "admin_name1": "Haryana",
  "latitude": 29.0167,
  "longitude": 76.6167,
  "accuracy": 4
}, {
  "key": "IN/124304",
  "place_name": "Baroda",
  "admin_name1": "Haryana",
  "latitude": 29.3834,
  "longitude": 76.8126,
  "accuracy": ""
}, {
  "key": "IN/124305",
  "place_name": "Khanpur",
  "admin_name1": "Haryana",
  "latitude": 29.9336,
  "longitude": 77.0544,
  "accuracy": 4
}, {
  "key": "IN/124306",
  "place_name": "Mundlana",
  "admin_name1": "Haryana",
  "latitude": 29.2,
  "longitude": 76.7667,
  "accuracy": 4
}, {
  "key": "IN/124307",
  "place_name": "Mehmoodpur",
  "admin_name1": "Haryana",
  "latitude": 29.3834,
  "longitude": 76.8126,
  "accuracy": ""
}, {
  "key": "IN/124308",
  "place_name": "Ahulana",
  "admin_name1": "Haryana",
  "latitude": 29.3834,
  "longitude": 76.8126,
  "accuracy": ""
}, {
  "key": "IN/124309",
  "place_name": "Madiana",
  "admin_name1": "Haryana",
  "latitude": 29.3834,
  "longitude": 76.8126,
  "accuracy": ""
}, {
  "key": "IN/124311",
  "place_name": "Barota",
  "admin_name1": "Haryana",
  "latitude": 29.3834,
  "longitude": 76.8126,
  "accuracy": ""
}, {
  "key": "IN/124314",
  "place_name": "Jassia",
  "admin_name1": "Haryana",
  "latitude": 29.3834,
  "longitude": 76.8126,
  "accuracy": ""
}, {
  "key": "IN/124315",
  "place_name": "Gangana",
  "admin_name1": "Haryana",
  "latitude": 29.3834,
  "longitude": 76.8126,
  "accuracy": ""
}, {
  "key": "IN/124316",
  "place_name": "Garhwal",
  "admin_name1": "Haryana",
  "latitude": 29.3834,
  "longitude": 76.8126,
  "accuracy": ""
}, {
  "key": "IN/124317",
  "place_name": "Glwana",
  "admin_name1": "Haryana",
  "latitude": 29.3834,
  "longitude": 76.8126,
  "accuracy": ""
}, {
  "key": "IN/124318",
  "place_name": "Jauli",
  "admin_name1": "Haryana",
  "latitude": 29.3834,
  "longitude": 76.8126,
  "accuracy": ""
}, {
  "key": "IN/124320",
  "place_name": "Kathura",
  "admin_name1": "Haryana",
  "latitude": 29.3834,
  "longitude": 76.8126,
  "accuracy": ""
}, {
  "key": "IN/124321",
  "place_name": "Lath",
  "admin_name1": "Haryana",
  "latitude": 29.3834,
  "longitude": 76.8126,
  "accuracy": ""
}, {
  "key": "IN/124322",
  "place_name": "Katwal",
  "admin_name1": "Haryana",
  "latitude": 29.3834,
  "longitude": 76.8126,
  "accuracy": ""
}, {
  "key": "IN/124324",
  "place_name": "Rabhra",
  "admin_name1": "Haryana",
  "latitude": 29.3834,
  "longitude": 76.8126,
  "accuracy": ""
}, {
  "key": "IN/124402",
  "place_name": "Kharkauda",
  "admin_name1": "Haryana",
  "latitude": 28.9397,
  "longitude": 76.8731,
  "accuracy": ""
}, {
  "key": "IN/124403",
  "place_name": "Rohat",
  "admin_name1": "Haryana",
  "latitude": 28.9344,
  "longitude": 76.975,
  "accuracy": 4
}, {
  "key": "IN/124404",
  "place_name": "Hassangarh",
  "admin_name1": "Haryana",
  "latitude": 28.9397,
  "longitude": 76.8731,
  "accuracy": ""
}, {
  "key": "IN/124406",
  "place_name": "Kansala",
  "admin_name1": "Haryana",
  "latitude": 28.9397,
  "longitude": 76.8731,
  "accuracy": ""
}, {
  "key": "IN/124407",
  "place_name": "Sisana",
  "admin_name1": "Haryana",
  "latitude": 28.9,
  "longitude": 76.8333,
  "accuracy": 4
}, {
  "key": "IN/124408",
  "place_name": "Farmana",
  "admin_name1": "Haryana",
  "latitude": 28.9847,
  "longitude": 76.8111,
  "accuracy": 4
}, {
  "key": "IN/124411",
  "place_name": "Aval",
  "admin_name1": "Haryana",
  "latitude": 28.8894,
  "longitude": 76.7123,
  "accuracy": ""
}, {
  "key": "IN/124412",
  "place_name": "Kahnaur",
  "admin_name1": "Haryana",
  "latitude": 28.75,
  "longitude": 76.4833,
  "accuracy": 4
}, {
  "key": "IN/124413",
  "place_name": "Khanda",
  "admin_name1": "Haryana",
  "latitude": 28.9194,
  "longitude": 76.8981,
  "accuracy": 4
}, {
  "key": "IN/124416",
  "place_name": "Baliana",
  "admin_name1": "Haryana",
  "latitude": 28.8894,
  "longitude": 76.7123,
  "accuracy": ""
}, {
  "key": "IN/124417",
  "place_name": "Paksma",
  "admin_name1": "Haryana",
  "latitude": 28.8894,
  "longitude": 76.7123,
  "accuracy": ""
}, {
  "key": "IN/124418",
  "place_name": "Dobh",
  "admin_name1": "Haryana",
  "latitude": 28.8894,
  "longitude": 76.7123,
  "accuracy": ""
}, {
  "key": "IN/124421",
  "place_name": "Asan",
  "admin_name1": "Haryana",
  "latitude": 29.4092,
  "longitude": 76.8781,
  "accuracy": 4
}, {
  "key": "IN/124423",
  "place_name": "Hamayunpur",
  "admin_name1": "Haryana",
  "latitude": 29.4092,
  "longitude": 76.8781,
  "accuracy": ""
}, {
  "key": "IN/124424",
  "place_name": "Dhamar",
  "admin_name1": "Haryana",
  "latitude": 29.4092,
  "longitude": 76.8781,
  "accuracy": ""
}, {
  "key": "IN/124425",
  "place_name": "Samchana",
  "admin_name1": "Haryana",
  "latitude": 29.4092,
  "longitude": 76.8781,
  "accuracy": ""
}, {
  "key": "IN/124426",
  "place_name": "Rurki (Rohtak)",
  "admin_name1": "Haryana",
  "latitude": 29.4092,
  "longitude": 76.8781,
  "accuracy": ""
}, {
  "key": "IN/124427",
  "place_name": "Chirana",
  "admin_name1": "Haryana",
  "latitude": 29.4092,
  "longitude": 76.8781,
  "accuracy": ""
}, {
  "key": "IN/124428",
  "place_name": "Rukhi",
  "admin_name1": "Haryana",
  "latitude": 29.4092,
  "longitude": 76.8781,
  "accuracy": ""
}, {
  "key": "IN/124429",
  "place_name": "Rithal",
  "admin_name1": "Haryana",
  "latitude": 29.4092,
  "longitude": 76.8781,
  "accuracy": ""
}, {
  "key": "IN/124430",
  "place_name": "Siwana Mall",
  "admin_name1": "Haryana",
  "latitude": 28.9852,
  "longitude": 76.8049,
  "accuracy": ""
}, {
  "key": "IN/124501",
  "place_name": "Sampla",
  "admin_name1": "Haryana",
  "latitude": 28.7764,
  "longitude": 76.7667,
  "accuracy": 4
}, {
  "key": "IN/124502",
  "place_name": "Rohad",
  "admin_name1": "Haryana",
  "latitude": 28.7299,
  "longitude": 76.8417,
  "accuracy": ""
}, {
  "key": "IN/124504",
  "place_name": "Chhara",
  "admin_name1": "Haryana",
  "latitude": 28.7299,
  "longitude": 76.8417,
  "accuracy": ""
}, {
  "key": "IN/124505",
  "place_name": "Assandah",
  "admin_name1": "Haryana",
  "latitude": 28.7299,
  "longitude": 76.8417,
  "accuracy": ""
}, {
  "key": "IN/124506",
  "place_name": "Mandothi",
  "admin_name1": "Haryana",
  "latitude": 28.7299,
  "longitude": 76.8417,
  "accuracy": ""
}, {
  "key": "IN/124507",
  "place_name": "Bahadurgarh",
  "admin_name1": "Haryana",
  "latitude": 28.6833,
  "longitude": 76.9167,
  "accuracy": 4
}, {
  "key": "IN/124508",
  "place_name": "Noona Majra",
  "admin_name1": "Haryana",
  "latitude": 28.7299,
  "longitude": 76.8417,
  "accuracy": ""
}, {
  "key": "IN/124509",
  "place_name": "Tandaheri",
  "admin_name1": "Haryana",
  "latitude": 28.7299,
  "longitude": 76.8417,
  "accuracy": ""
}];
exports.locations = locations;
},{}],"../src/utilities/initMap.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InitMap = void 0;

var _locations = require("../data/locations");

const loadGoogleMapsApi = require('load-google-maps-api');

let newlyCreatedMap;

class InitMap {
  static loadGoogleMapsApi() {
    return loadGoogleMapsApi({
      key: "AIzaSyDU8tMEexcHLYl-J5i_jVOil6Y14jNPjDk"
    });
  }

  static createMap(googleMaps, mapElement) {
    newlyCreatedMap = new googleMaps.Map(mapElement, {
      center: {
        lat: 28.6333,
        lng: 77.2167
      },
      zoom: 14
    }); // Shapes define the clickable region of the icon. The type defines an HTML
    // <area> element 'poly' which traces out a polygon as a series of X,Y points.
    // The final coordinate closes the poly by connecting to the first coordinate.

    let shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: 'poly'
    };

    for (let i = 0; i < _locations.locations.length; i++) {
      let location = _locations.locations[i];
      let marker = new googleMaps.Marker({
        position: {
          lat: location.latitude,
          lng: location.longitude
        },
        map: newlyCreatedMap,
        shape: shape,
        title: location.place_name
      });
    }

    return newlyCreatedMap;
  }

  static panToLocation(googleMaps, searchTerm) {
    let updatedLocations = _locations.locations.filter(location => {
      let searchPlaceName = location.place_name.toLowerCase().indexOf(searchTerm);
      let searchPostalCode = location.key.split('/')[1].indexOf(searchTerm);

      if (searchPlaceName !== -1 || searchPostalCode !== -1) {
        return true;
      }
    });

    if (updatedLocations.length === 1) {
      var latLng = new googleMaps.LatLng(updatedLocations[0].latitude, updatedLocations[0].longitude);
      newlyCreatedMap.panTo(latLng);
    }
  }

}

exports.InitMap = InitMap;
},{"load-google-maps-api":"../node_modules/load-google-maps-api/index.js","../data/locations":"../src/data/locations.js"}],"../src/components/Table.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _locations = require("../data/locations");

let state = {
  querySet: _locations.locations,
  currentPage: 1,
  defaultRows: 20
};
/**
  X- Lay the data in a table, create a template and append the data to it
  - pagination logic
    X- basic
    - improved buttons
  X- search
  - map
 */

function pagination(locs) {
  let trimStart = (state.currentPage - 1) * state.defaultRows;
  let trimEnd = trimStart + state.defaultRows;
  let trimmedData = locs.slice(trimStart, trimEnd);
  let pages = Math.ceil(locs.length / state.defaultRows);
  return {
    trimmedData,
    pages
  };
}

function createPageButtons(pages) {
  let buttonTemplate = ``;

  for (let page = 1; page <= pages; page++) {
    buttonTemplate += `
      <button value=${page} type="button" class="btn btn-info">${page}</button>
    `;
  }

  return buttonTemplate;
}

function createTableRows(locs) {
  if (locs.length >= 8000) {
    locs.length -= 8000; // TODO: 
  }

  let paginatedData = pagination(locs);
  let rows = [];

  for (let i = 0; i < paginatedData.trimmedData.length; i++) {
    let row = `
      <tr>
        <td>${paginatedData.trimmedData[i].place_name}</td>
        <td>${paginatedData.trimmedData[i].key.split('/')[1]}</td>
        <td>${paginatedData.trimmedData[i].latitude}</td>
        <td>${paginatedData.trimmedData[i].longitude}</td>
      </tr>
    `;
    rows.push(row);
  }

  return rows.join(" ");
}

const TableBody = rows => {
  const tableBody = `
    <tbody id="table-body">
      ${rows}
    </tbody>
  `;
  return tableBody;
};

function filterLocations(searchTerm) {
  let updatedLocations = _locations.locations.filter(location => {
    let searchPlaceName = location.place_name.toLowerCase().indexOf(searchTerm);
    let searchPostalCode = location.key.split('/')[1].indexOf(searchTerm);

    if (searchPlaceName !== -1 || searchPostalCode !== -1) {
      return true;
    }
  });

  return updatedLocations;
}

const Table = (paginationKey, searchTerm) => {
  // setting currentPage
  state.currentPage = paginationKey !== undefined ? paginationKey : 1; // Filter

  if (searchTerm) {
    state.querySet = filterLocations(searchTerm);
  } // Table Rows


  const tableRows = createTableRows(state.querySet); // Table Body

  const tableBody = TableBody(tableRows); // Pagination

  let paginatedData = pagination(state.querySet);
  const pageButtons = createPageButtons(paginatedData.pages); // Table Template

  const tableTemplate = `
    <table class="table table-dark" id="our-table">
      <thead>
        <tr>
          <th>Place</th>
          <th>Postal Code</th>
          <th>Latitude</th>
          <th>Longitude</th>
        </tr>
      </thead>
      ${tableBody}
    </table>
    <div class="pagination-container">
      ${pageButtons}
    </div>
  `;
  return tableTemplate;
};

var _default = Table;
exports.default = _default;
},{"../data/locations":"../src/data/locations.js"}],"../src/components/Search.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const Search = () => {
  const searchTemplate = `
    <div class="wrap">
      <div class="search">
        <input type="text" class="searchTerm" placeholder="Search for place or postal code">
      </div>
    </div>
  `;
  return searchTemplate;
};

var _default = Search;
exports.default = _default;
},{}],"../src/components/Map.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const Map = () => {
  const mapTemplate = `
    <div id="map"></div>
  `;
  return mapTemplate;
};

var _default = Map;
exports.default = _default;
},{}],"../src/App.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Table = _interopRequireDefault(require("./components/Table"));

var _Search = _interopRequireDefault(require("./components/Search"));

var _Map = _interopRequireDefault(require("./components/Map"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function App() {
  const template = document.createElement('template');
  template.innerHTML = `
    <div class="container">
      ${(0, _Search.default)()}
      ${(0, _Table.default)()}
    </div>
    <div class="maps-container">
      ${(0, _Map.default)()}
    </div>
  `; // Return a new node from template

  return template.content.cloneNode(true);
}

var _default = App;
exports.default = _default;
},{"./components/Table":"../src/components/Table.js","./components/Search":"../src/components/Search.js","./components/Map":"../src/components/Map.js"}],"../src/main.js":[function(require,module,exports) {
"use strict";

require("./scss/app.scss");

var _initMap = require("./utilities/initMap");

var _App = _interopRequireDefault(require("./App"));

var _Table = _interopRequireDefault(require("./components/Table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = async () => {
  document.getElementById('app').appendChild((await (0, _App.default)())); // Table Body container for updating pagination

  let tableBodyContainer = document.querySelector('#table-body');

  function alterTable(paginationKey, searchTerm) {
    while (tableBodyContainer.firstChild) {
      tableBodyContainer.removeChild(tableBodyContainer.firstChild);
    }

    let tableTemplate = (0, _Table.default)(paginationKey, searchTerm);
    const template = document.createElement('template');
    template.innerHTML = tableTemplate;
    template.innerHTML = template.content.querySelector('#table-body').innerHTML;
    tableBodyContainer.appendChild(template.content.cloneNode(true));
  }

  document.querySelector('.pagination-container').addEventListener('click', function (event) {
    alterTable(event.target.value, undefined);
  });
  document.addEventListener("DOMContentLoaded", function () {
    let mapElement = document.getElementById('map');

    _initMap.InitMap.loadGoogleMapsApi().then(function (googleMaps) {
      _initMap.InitMap.createMap(googleMaps, mapElement);

      document.querySelector('.searchTerm').addEventListener('keyup', function (e) {
        let term = e.target.value.toLowerCase();
        alterTable(undefined, term);

        _initMap.InitMap.panToLocation(googleMaps, term);
      });
    });
  });
}; // Load app


app();
},{"./scss/app.scss":"../src/scss/app.scss","./utilities/initMap":"../src/utilities/initMap.js","./App":"../src/App.js","./components/Table":"../src/components/Table.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54930" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../src/main.js"], null)
//# sourceMappingURL=/main.da4909e4.js.map