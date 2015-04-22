'use strict';

var Bluebird = require('bluebird');
var chalk = require('chalk');
var util = require('util');

function resourceManager(componentList) {
  var results = {};

  function down() {
    return Bluebird
      .resolve(componentList)
      .each(resourceDown);
  }

  function resourceDown(component) {
    return component
      .down()
      .then(function handleResponse(response) {
        storeResults(component.key, response);
        reportStatus(component, 'Down', 'magenta');
      });
  }

  function getResults() {
    return results;
  }

  function up() {
    return Bluebird
      .resolve(componentList)
      .each(resourceUp);
  }

  function resourceUp(component) {
    return component
      .up()
      .then(function handleResponse(response) {
        storeResults(component.key, response);
        reportStatus(component, 'Up', 'cyan');
      });
  }

  function storeResults(key, value) {
    results[key] = value;
  }

  function reportStatus(component, status, style) {
    var message = util.format(
      '%s: %s',
      chalk[style](status),
      component.fullyQualifiedName
    );
    console.log(message);
  }

  return {
    down: down,
    getResults: getResults,
    up: up
  };
}

module.exports = resourceManager;
