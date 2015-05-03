import Bluebird from 'bluebird';
import chalk from 'chalk';

function resourceManager(componentList) {
  let results = {};

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
    let componentName = component.fullyQualifiedName;
    let stylishStatus = chalk[style](status);
    console.log(`${stylishStatus}: ${componentName}`);
  }

  return {
    down,
    getResults,
    up
  };
}

export default resourceManager;
