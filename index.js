var statuses = require("statuses");

/**
 * Middleware for creating flash messages in rill.
 *
 * @param {Object} opts
 * @return {Function}
 */
module.exports = function (opts) {
	opts          = opts || {};
	var namespace = "key" in opts ? opts.key : "__rill_flash"

	return function flash (ctx, next) {
		var req = ctx.req;
		var res = ctx.res;

		if (!req.session) throw new Error("@rill/flash requires a session to work. Check out @rill/session.");

		// We store flash messages in locals.
		// This allows them to be easily accessable in any view rendering middleware.
		ctx.locals.flash = req.session[namespace] || {};
		delete req.session[namespace];

		ctx.flash = function (key, val) {
			if (arguments.length === 0) return ctx.locals.flash;
			else if (arguments.length === 1) return ctx.locals.flash[key];
			else {
				ctx.locals.flash      = req.session[namespace] = req.session[namespace] || {}
				ctx.locals.flash[key] = val;
			}
		}

		return next().then(function () {
			// Persist flashes on redirect.
			if (statuses.redirect[res.status] || res.get("Location")) {
				req.session[namespace] = ctx.locals.flash;
			}
		})
	}
};