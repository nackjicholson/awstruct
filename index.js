'use strict'

var _ = require('lodash')
var util = require('util')
var awsPromised = require('aws-promised')
var awsExistence = require('aws-existence')
var awstructUtil = require('./util')
var resource = require('./resource');
var resourceManager = require('./resourceManager')

/**
 * awstruct module
 *
 * @type {{
 *  config: {
 *    region: undefined,
 *    system: undefined
 *  },
 *  region, region,
 *  system, system,
 *  ex: (*|exports),
 *  getResourceKey: Function,
 *  getResourceName: Function,
 *  resourceManager: (*|exports)
 *  sdk: exports,
 *  util: (*|exports)
 * }}
 */
module.exports = {
  /**
   * awstruct config
   */
  config: {
    region: undefined,
    system: undefined
  },

  /**
   * Accessor methods for region.
   */
  get region () {
    return this.config.region
  },

  set region (region) {
    this.config.region = region
  },

  /**
   * Accessor method for system.
   */
  get system () {
    return this.config.system
  },

  set system (system) {
    this.config.system = system
  },

  /**
   * Utility for checking existence of aws resources, provided by aws-existence
   */
  ex: awsExistence,

  /**
   * Composes a camel case key for the resource, using the fully
   * qualified name from getResourceName
   *
   * @param terminalName The terminal name of the resource.
   * @returns {string} A camelized key for the resource.
   */
  getResourceKey: function (terminalName) {
    return _.camelCase(this.getResourceName(terminalName))
  },

  /**
   * Composes fully qualified resource names, given the
   * terminal name of the resource.
   *
   * @param terminalName The terminal name of the resource.
   * @returns {string} The fully qualified resource name.
   */
  getResourceName: function (terminalName) {
    var region = _.camelCase(this.region)
    return util.format('%s-%s-%s', this.system, region, terminalName)
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
  resource: resource,

  /**
   * Resource manager factory function.
   */
  resourceManager: resourceManager,

  /**
   * The promisified aws-sdk, provided aws-promised module.
   */
  sdk: awsPromised,

  /**
   * awstruct utilities
   */
  util: awstructUtil
}
