import Bluebird from 'bluebird';

function loadReporter(reporterType) {
  let reporter;

  try {
    // TODO In full es6 may be able to use System.import()
    reporter = require(`./reporters/${reporterType}`);
  } catch (err) {
    console.warn(`"${reporterType}" reporter not found or threw error\n`);
    console.warn(err.stack);

    throw new Error(`invalid reporter ${reporterType}`);
  }

  return reporter;
}

function resourceManager(resourceList=[], reporterType='console') {
  let results = {};
  let reporter = loadReporter(reporterType);

  function resourceDown(resource) {
    return resource
      .down()
      .then(function handleResponse(response) {
        storeResults(resource.key, response);
        reporter(resource, 'Down', { style: 'magenta' });
      });
  }

  function resourceUp(resource) {
    return resource
      .up()
      .then(function handleResponse(response) {
        storeResults(resource.key, response);
        reporter(resource, 'Up', {style: 'cyan'});
      });
  }

  function storeResults(key, value) {
    results[key] = value;
  }

  return {
    down() {
      return Bluebird
        .resolve(resourceList)
        .each(resourceDown);
    },

    get results() {
      return results;
    },

    up() {
      return Bluebird
        .resolve(resourceList)
        .each(resourceUp);
    }
  };
}

export default resourceManager;
