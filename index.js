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

    // Check for rill session.
    if (!session) throw new Error('@rill/flash requires a session to work. Check out @rill/session.')

    // We store flash messages in locals.
    // This allows them to be easily accessable in any view rendering middleware.
    locals.flash = session.get(namespace) || {}
    session.delete(namespace)

    /**
      * Flashes a value (using sessions) for the current request to the next one.
      */
    ctx.flash = function flash (key, val) {
      var locals = this.locals
      var session = this.session

      if (arguments.length === 0) return locals.flash
      else if (arguments.length === 1) return locals.flash[key]
      else {
        if (!session.has(namespace)) session.set(namespace, locals.flash = {})
        locals.flash[key] = val
      }
    }

    return next().then(function () {
      // Persist flashes on redirect.
      if (statuses.redirect[res.status] || res.get('Location')) {
        session.set(namespace, locals.flash)
      }
    })
  }
}
