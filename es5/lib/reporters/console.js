'use strict';

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function consoleReporter(component, message, _ref) {
  var style = _ref.style;

  var componentName = component.fullyQualifiedName;
  var stylishStatus = _chalk2['default'][style](message);
  console.log('' + stylishStatus + ': ' + componentName);
}

exports['default'] = consoleReporter;
module.exports = exports['default'];