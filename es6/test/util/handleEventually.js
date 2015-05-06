import assert from 'assert';
import Bluebird from 'bluebird';
import handleEventually from '../../lib/util/handleEventually';

describe('lib/util/handleEventually', () => {
  it('should work like a normal handler if wrapped fn succeeds', done => {
    let data = 'test.data';
    let fn = response => response;
    let handler = handleEventually(fn);

    Bluebird
      .resolve(data)
      .then(handler)
      .then((result) => {
        assert.equal(result, data);
      })
      .done(done);
  });

  it('should retry until successful', done => {
    let callCount = 0;

    function fn() {
      if (callCount > 3) {
        return 'test.result';
      }

      callCount += 1;
      return Bluebird.reject('failure');
    }

    Bluebird
      .resolve()
      .then(handleEventually(fn, {ms: 10}))
      .then((result) => {
        assert.equal(result, 'test.result');
      })
      .done(done);
  });

  it('should reject if it keeps failing past the maxRetries limit', done => {
    let callCount = 0;

    function fn() {
      callCount += 1;
      return Bluebird.reject('failure');
    }

    Bluebird
      .resolve()
      .then(handleEventually(fn, {maxRetries: 2, ms: 10}))
      .catch((reason) => {
        assert.equal(reason, 'failure');
        assert.equal(callCount, 3);
      })
      .done(done);
  });

  it('should take a context argument', done => {
    let obj = {
      foo: 'test.response',

      fn() {
        return this.foo;
      }
    };

    Bluebird
      .resolve()
      .then(handleEventually(obj.fn, undefined, obj))
      .then((result) => {
        assert.equal(result, obj.foo);
      })
      .done(done);
  });
});
