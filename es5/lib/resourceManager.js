'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _Bluebird = require('bluebird');

var _Bluebird2 = _interopRequireDefault(_Bluebird);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function resourceManager(componentList) {
  var results = {};

  function down() {
    return _Bluebird2['default'].resolve(componentList).each(resourceDown);
  }

  function resourceDown(component) {
    return component.down().then(function handleResponse(response) {
      storeResults(component.key, response);
      reportStatus(component, 'Down', 'magenta');
    });
  }

  function getResults() {
    return results;
  }

  function up() {
    return _Bluebird2['default'].resolve(componentList).each(resourceUp);
  }

  function resourceUp(component) {
    return component.up().then(function handleResponse(response) {
      storeResults(component.key, response);
      reportStatus(component, 'Up', 'cyan');
    });
  }

  function storeResults(key, value) {
    results[key] = value;
  }

  function reportStatus(component, status, style) {
    var componentName = component.fullyQualifiedName;
    var stylishStatus = _chalk2['default'][style](status);
    console.log('' + stylishStatus + ': ' + componentName);
  }

  return {
    down: down,
    getResults: getResults,
    up: up
  };
}

exports['default'] = resourceManager;
module.exports = exports['default'];