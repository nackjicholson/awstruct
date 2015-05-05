'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _interopRequireDefault = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports['default'] = consoleReporter;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function consoleReporter(component, message, _ref) {
  var style = _ref.style;

  var componentName = component.fullyQualifiedName;
  var stylishStatus = _chalk2['default'][style](message);
  console.log('' + stylishStatus + ': ' + componentName);
}

module.exports = exports['default'];