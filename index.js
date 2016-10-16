'use strict'

var started = !process.browser

/**
 * Middleware for creating flash messages in rill.
 *
 * @param {Object} opts
 * @return {Function}
 */
module.exports = function flashSetup (opts) {
  opts = opts || {}
  var namespace = 'key' in opts ? opts.key : '@rill/flash/'
  var namespaceActive = namespace + 'active__'
  var namespaceInitial = namespace + 'initial__'

  return function flashMiddleware (ctx, next) {
    // Check for rill session.
    var session = ctx.session
    if (!session) throw new Error('@rill/flash requires a session to work. Check out @rill/session.')

    // Check if this is the initial render.
    var isStarted = started
    started = true

    /**
      * Flashes a value (using sessions) for the current request to the next one.
      */
    ctx.flash = function flash (key, val) {
      if (typeof key !== 'string') {
        throw new TypeError('@rill/flash: Key must be a string.')
      }

      var activeKey = namespaceActive + key
      var initialKey = namespaceInitial + key

      if (arguments.length === 1) {
        // Handle flash 'get'
        var result = session.get(activeKey)

        if (process.browser) {
          // When in the browser we check if it is the initial render.
          // The initial render will reuse expired flash data to facilitate bootstrapping.
          if (!isStarted) {
            result = result || session.get(initialKey)
          }

          // Then we delete the initial server cache.
          session.delete(initialKey)
        } else {
          // In the server we store a cached value of the flash message for the initial render in the browser.
          session.set(initialKey, result)
        }

        // Finally we delete the active key (since a flash is one use).
        session.delete(activeKey)

        // And send out the result.
        return result
      } else {
        // Handle flash 'set'
        session.set(activeKey, val)
      }
    }

    // Run next middleware
    return next()
  }
}
