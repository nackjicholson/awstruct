'use strict';

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _Object$defineProperties = require('babel-runtime/core-js/object/define-properties')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _Bluebird = require('bluebird');

var _Bluebird2 = _interopRequireDefault(_Bluebird);

function loadReporter(reporterType) {
  var reporter = undefined;

  try {
    // TODO In full es6 may be able to use System.import()
    reporter = require('./reporters/' + reporterType);
  } catch (err) {
    console.warn('"' + reporterType + '" reporter not found or threw error\n');
    console.warn(err.stack);

    throw new Error('invalid reporter ' + reporterType);
  }

  return reporter;
}

function resourceManager() {
  var resourceList = arguments[0] === undefined ? [] : arguments[0];
  var reporterType = arguments[1] === undefined ? 'console' : arguments[1];

  var results = {};
  var reporter = loadReporter(reporterType);

  function resourceDown(resource) {
    return resource.down().then(function handleResponse(response) {
      storeResults(resource.key, response);
      reporter(resource, 'Down', { style: 'magenta' });
    });
  }

  function resourceUp(resource) {
    return resource.up().then(function handleResponse(response) {
      storeResults(resource.key, response);
      reporter(resource, 'Up', { style: 'cyan' });
    });
  }

  function storeResults(key, value) {
    results[key] = value;
  }

  return _Object$defineProperties({
    down: function down() {
      return _Bluebird2['default'].resolve(resourceList).each(resourceDown);
    },

    up: function up() {
      return _Bluebird2['default'].resolve(resourceList).each(resourceUp);
    }
  }, {
    results: {
      get: function () {
        return results;
      },
      configurable: true,
      enumerable: true
    }
  });
}

exports['default'] = resourceManager;
module.exports = exports['default'];