'use strict'

var _ = require('lodash')
var util = require('util')
var awsPromised = require('aws-promised')
var awsExistence = require('aws-existence')
var awstructUtil = require('./util')

/**
 * awstruct module
 *
 * @type {{
 *   config: {
 *     region: undefined,
 *     system: undefined
 *   },
 *   region, region,
 *   system, system,
 *   getResourceName: Function, getResourceKey: Function
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
   * The promisified aws-sdk, provided aws-promised module.
   */
  sdk: awsPromised,

  /**
   * awstruct utilities
   */
  util: awstructUtil
}
