'use strict';

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _Object$defineProperties = require('babel-runtime/core-js/object/define-properties')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

var _camelCase = require('lodash');

var _ex = require('aws-existence');

var _ex2 = _interopRequireDefault(_ex);

var _sdk = require('aws-promised');

var _sdk2 = _interopRequireDefault(_sdk);

var _requireDir = require('require-dir');

var _requireDir2 = _interopRequireDefault(_requireDir);

var _resourceManager = require('./lib/resourceManager');

var _resourceManager2 = _interopRequireDefault(_resourceManager);

var util = _requireDir2['default']('./lib/util');

exports['default'] = _Object$defineProperties({
  /**
   * awstruct config
   */
  config: {
    region: undefined,
    system: undefined
  },

  /**
   * Utility for checking existence of aws resources, provided by aws-existence
   */
  ex: _ex2['default'],

  /**
   * Composes a camel case key for the resource, using the fully
   * qualified name from getResourceName
   *
   * @param terminalName The terminal name of the resource.
   * @returns {string} A camelized key for the resource.
   */
  getResourceKey: function getResourceKey(terminalName) {
    return _camelCase.camelCase(this.getResourceName(terminalName));
  },

  /**
   * Composes fully qualified resource names, given the
   * terminal name of the resource.
   *
   * @param terminalName The terminal name of the resource.
   * @returns {string} The fully qualified resource name.
   */
  getResourceName: function getResourceName(terminalName) {
    var system = _camelCase.camelCase(this.system);
    var region = _camelCase.camelCase(this.region);
    terminalName = _camelCase.camelCase(terminalName);
    return '' + system + '-' + region + '-' + terminalName;
  },

  /**
   * Resource closure. This function returns a factory function which can be
   * used to instantiate a new resource object. You pass a hash of properties
   * and a methodsFactory function to create "up" and "down" methods. The
   * properties and methods are mixed into the final resource object.
   *
   * @param {object} baseState
   * @param {function} methodsFactory
   *
   * @return {function} resource factory function.
   */
  resource: function resource(baseState, methodsFactory) {
    var _this = this;

    /**
     * Resource factory function. Instantiates new resource objects. Optional
     * "last-minute" instance state properties can be provided to extend or
     * override methods and properties of the resource.
     *
     * @param {object}
     *
     * @return {object} Resource object.
     */
    return function (instanceState) {
      var state = _Object$assign({}, baseState, instanceState);

      var attributes = _Object$assign(state, {
        fullyQualifiedName: _this.getResourceName(state.name),
        key: _this.getResourceKey(state.name)
      });

      var methods = methodsFactory(attributes);

      return _Object$assign(attributes, methods);
    };
  },

  /**
   * Resource manager factory function.
   */
  resourceManager: _resourceManager2['default'],

  /**
   * The promisified aws-sdk, provided aws-promised module.
   */
  sdk: _sdk2['default'],

  /**
   * awstruct utilities
   */
  util: util
}, {
  region: {

    /**
     * Accessor methods for region.
     */

    get: function () {
      return this.config.region;
    },
    set: function (region) {
      this.config.region = region;
    },
    configurable: true,
    enumerable: true
  },
  system: {

    /**
     * Accessor method for system.
     */

    get: function () {
      return this.config.system;
    },
    set: function (system) {
      this.config.system = system;
    },
    configurable: true,
    enumerable: true
  }
});
module.exports = exports['default'];