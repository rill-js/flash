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
		var req     = ctx.req;
		var res     = ctx.res;
		var session = req.session;

		if (!session) throw new Error("@rill/flash requires a session to work. Check out @rill/session.");

		// We store flash messages in locals.
		// This allows them to be easily accessable in any view rendering middleware.
		ctx.locals.flash = session.get(namespace) || {};
		session.delete(namespace);

		ctx.flash = function (key, val) {
			if (arguments.length === 0) return ctx.locals.flash;
			else if (arguments.length === 1) return ctx.locals.flash[key];
			else {
				if (!session.has(namespace)) session.set(namespace, ctx.locals.flash = {});
				ctx.locals.flash[key] = val;
			}
		}

		return next().then(function () {
			// Persist flashes on redirect.
			if (statuses.redirect[res.status] || res.get("Location")) {
				req.session.set(namespace, ctx.locals.flash);
			}
		})
	}
};