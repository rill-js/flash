'use strict'

var statuses = require('statuses')

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
    var res = ctx.res
    var locals = ctx.locals
    var session = ctx.session
    var updated = {}

    // Check for rill session.
    if (!session) throw new Error('@rill/flash requires a session to work. Check out @rill/session.')

    // We store flash messages in locals.
    // This allows them to be easily accessable in any view rendering middleware.
    locals.flash = session.get(namespace)
    if (!locals.flash) session.set(namespace, locals.flash = {})

    /**
      * Flashes a value (using sessions) for the current request to the next one.
      */
    ctx.flash = function flash (key, val) {
      if (arguments.length === 0) return locals.flash
      else if (arguments.length === 1) return locals.flash[key]
      else locals.flash[key] = updated[key] = val
    }

    /**
     * After the response is sent, clear any old flash messages.
     */
    ctx.res.original.once('finish', function () {
      // Persist flashes on redirect.
      if (statuses.redirect[res.statuses]) return
      if (res.get('Location')) return

      // Clear old flashes.
      for (var key in locals.flash) {
        if (key in updated) continue
        delete locals.flash[key]
      }
    })

    return next()
  }
}
