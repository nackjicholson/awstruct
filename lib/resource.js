'use strict';

var _ = require('lodash');
var awstruct = require('./awstruct');

function resource(baseState, methodsFactory) {
  return function(instanceState) {
    var state = _.assign({}, baseState, instanceState);

    var attributes = _.assign(state, {
      fullyQualifiedName: awstruct.getResourceName(state.name),
      key: awstruct.getResourceKey(state.name),
      type: state.type
    });

    var methods = methodsFactory(awstruct, attributes);

    return _.assign(attributes, methods);
  };
}

module.exports = resource;
