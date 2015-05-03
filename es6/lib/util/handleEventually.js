import Bluebird from 'bluebird';

/**
 * Retries a "then" handler on a delay if it errors.
 *
 * This is useful when dealing with an AWS eventually consistent resource.
 * It's possible for a resource to be created/deleted but not be truly
 * available. If a subsequent API call is made which depends on that resource
 * before it is truly available, it may fail. Wrapping it with handleEventually
 * and no argument overrides will by default retry that failing function (fn)
 * call once a second (1000ms) until it succeeds. If it hasn't
 * succeeded after the maximum number of retries (30), the handler returns
 * a rejected promise with the failure reason.
 *
 * @param fn
 * @param {object} options
 * @param context
 * @returns {Function}
 */
function handleEventually(fn, { maxRetries=30, ms=1000 } = {}, context = null) { // jshint ignore:line
  /**
   * Retry loop
   *
   * @param fn
   * @param retries
   * @returns {*}
   */
  function loop(fn, retries) {
    /**
     * Retries fn through the loop after the delay (ms).
     * If all retries have been exhausted the err is returned
     * as the reason for rejection of the promise.
     *
     * @param err
     *
     * @returns {Promise}
     */
    function retry (err) {
      if (retries < maxRetries) {
        return Bluebird
          .delay(ms)
          .then(function() {
            return loop(fn, retries + 1);
          });
      }

      return Bluebird.reject(err);
    }

    // Resolve non-promise and promise returns of fn()
    // Retry on any caught errors.
    return Bluebird.resolve(fn()).error(retry);
  }

  /**
   * The returned "then" handler for wherever you called handleEventually.
   * The handler binds it's arguments to the underlying fn, and kicks
   * off the retry loop.
   *
   * Binding arguments ensures all calls to fn() from within the loop will
   * be applied with the arguments to the handler.
   *
   * goGetData()
   *  .then(handleEventually(doSomethingWithData))
   *
   * The wrapped function expects a signature of (data).
   * fn.bind.apply and the argument trickery below ensures all calls to it will
   * have that argument.
   */
  return function handler(...args) {
    return loop(fn.bind.apply(fn, [context, ...args]), 0);
  };
}

export default handleEventually;
