import assert from 'assert';
import Bluebird from 'bluebird';
import sinon from 'sinon';
import resourceManager from '../lib/resourceManager';

describe('lib/resourceManager', () => {
  let warnStub;
  let resourceAlpha;
  let resourceBravo;
  let resourceList;

  beforeEach(() => {
    resourceAlpha = {
      key: 'alpha',
      fullyQualifiedName: 'alpha',
      down: sinon.stub(),
      up: sinon.stub()
    };
    resourceBravo = {
      key: 'bravo',
      fullyQualifiedName: 'bravo',
      down: sinon.stub(),
      up: sinon.stub()
    };

    resourceList = [resourceAlpha, resourceBravo];

    sinon.stub(console, 'log');
    warnStub = sinon.stub(console, 'warn');
  });

  afterEach(() => {
    console.log.restore();
    console.warn.restore();
  });

  it('should warn and throw error if reporter loading fails', () => {
    let reporterType = 'missingReporter';

    function harness() {
      resourceManager([], reporterType);
    }

    assert.throws(harness, new RegExp(`invalid reporter ${reporterType}`));
    assert(console.warn.calledTwice);
    assert.equal(
      console.warn.args[0][0],
      `"${reporterType}" reporter not found or threw error\n`
    );
  });

  describe('down', () => {
    it('should do nothing with empty resource list', done => {
      let manager = resourceManager();
      manager.down()
        .then(() => {
          assert.ok(!resourceAlpha.down.called);
          assert.ok(!resourceBravo.down.called);
        })
        .done(done);
    });

    it('should tear each resource down', done => {
      let manager = resourceManager(resourceList);

      resourceAlpha.down.returns(Bluebird.resolve('alpha.down'));
      resourceBravo.down.returns(Bluebird.resolve('bravo.down'));

      manager.down()
        .then(() => {
          assert(resourceAlpha.down.calledOnce);
          assert(resourceBravo.down.calledOnce);
          assert.deepEqual(manager.results, {
            'alpha': 'alpha.down',
            'bravo': 'bravo.down'
          });
        })
        .done(done);
    });
  });

  describe('up', () => {
    it('should do nothing with empty resource list', done => {
      let manager = resourceManager();
      manager.up()
        .then(() => {
          assert.ok(!resourceAlpha.up.called);
          assert.ok(!resourceBravo.up.called);
        })
        .done(done);
    });

    it('should call up on each resource', done => {
      let manager = resourceManager(resourceList);

      resourceAlpha.up.returns(Bluebird.resolve('alpha.up'));
      resourceBravo.up.returns(Bluebird.resolve('bravo.up'));

      manager.up()
        .then(() => {
          assert(resourceAlpha.up.calledOnce);
          assert(resourceBravo.up.calledOnce);
          assert.deepEqual(manager.results, {
            'alpha': 'alpha.up',
            'bravo': 'bravo.up'
          });
        })
        .done(done);
    });
  });
});
