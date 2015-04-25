'use strict'

var _ = require('lodash')
var awstruct = require('./index.js')

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
function resource (baseState, methodsFactory) {
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
    var state = _.assign({}, baseState, instanceState)

    var attributes = _.assign(state, {
      fullyQualifiedName: awstruct.getResourceName(state.name),
      key: awstruct.getResourceKey(state.name),
      type: state.type
    })

    var methods = methodsFactory(awstruct, attributes)

    return _.assign(attributes, methods)
  }
}

module.exports = resource
