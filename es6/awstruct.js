require('babel/polyfill');
import {camelCase} from 'lodash';
import ex from 'aws-existence';
import sdk from 'aws-promised';
import requireDir from 'require-directory';
import resourceManager from './lib/resourceManager';

let util = requireDir('./util');

export default {
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
    return this.config.region;
  },

  set region (region) {
    this.config.region = region;
  },

  /**
   * Accessor method for system.
   */
  get system () {
    return this.config.system;
  },

  set system (system) {
    this.config.system = system;
  },

  /**
   * Utility for checking existence of aws resources, provided by aws-existence
   */
  ex,

  /**
   * Composes a camel case key for the resource, using the fully
   * qualified name from getResourceName
   *
   * @param terminalName The terminal name of the resource.
   * @returns {string} A camelized key for the resource.
   */
  getResourceKey(terminalName) {
    return camelCase(this.getResourceName(terminalName));
  },

  /**
   * Composes fully qualified resource names, given the
   * terminal name of the resource.
   *
   * @param terminalName The terminal name of the resource.
   * @returns {string} The fully qualified resource name.
   */
  getResourceName(terminalName) {
    let system = camelCase(this.system);
    let region = camelCase(this.region);
    terminalName = camelCase(terminalName);
    return `${system}-${region}-${terminalName}`;
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
  resource(baseState, methodsFactory) {
    /**
     * Resource factory function. Instantiates new resource objects. Optional
     * "last-minute" instance state properties can be provided to extend or
     * override methods and properties of the resource.
     *
     * @param {object}
     *
     * @return {object} Resource object.
     */
    return (instanceState) => {
      let state = Object.assign({}, baseState, instanceState);

      let attributes = Object.assign(state, {
        fullyQualifiedName: this.getResourceName(state.name),
        key: this.getResourceKey(state.name)
      });

      let methods = methodsFactory(attributes);

      return Object.assign(attributes, methods);
    };
  },

  /**
   * Resource manager factory function.
   */
  resourceManager,

  /**
   * The promisified aws-sdk, provided aws-promised module.
   */
  sdk,

  /**
   * awstruct utilities
   */
  util
};
