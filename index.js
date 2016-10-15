'use strict'

/**
 * Middleware for creating flash messages in rill.
 *
 * @param {Object} opts
 * @return {Function}
 */
module.exports = function flashSetup (opts) {
  opts = opts || {}
  var namespace = 'key' in opts ? opts.key : '__rill_flash'

  return function flashMiddleware (ctx, next) {
    // Check for rill session.
    var session = ctx.session
    if (!session) throw new Error('@rill/flash requires a session to work. Check out @rill/session.')

    // We store flash messages in locals.
    // This allows them to be easily accessable in any view rendering middleware.
    var values = session.get(namespace)
    if (!values) session.set(namespace, values = {})

    /**
      * Flashes a value (using sessions) for the current request to the next one.
      */
    ctx.flash = function flash (key, val) {
      if (typeof key !== 'string') {
        throw new TypeError('@rill/flash: Key must be a string.')
      }

      if (arguments.length === 1) {
        var result = values[key]
        delete values[key]
        return result
      } else {
        values[key] = val
      }
    }

    return next()
  }
}
