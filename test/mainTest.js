var assert          = require("assert");
var agent           = require("supertest");
var Rill            = require("rill");
var session         = require("@rill/session");
var flashMiddleware = require("../");
var sessionKey      = "__rill_session_id";

describe("Rill/Flash", function () {
	it("should work on the server", function (done) {
		var request = agent(
			Rill()
				.use(session())
				.use(flashMiddleware())
				.get("/", respond(200, function (ctx) {
					ctx.res.body = ctx.flash();
				}))
				.get("/session", respond(200, function (ctx) {
					// Allow for persisting cookies.
					assert.deepEqual(ctx.flash(), {});
					ctx.res.body = ctx.req.session.id;
				}))
				.post("/error", respond(200, function (ctx) {
					ctx.flash("Error", "Not logged in.");
				}))
				.listen()
		);

		return request
			.get("/session")
			.expect(200)
			.end(function (err, res) {
				if (err) return done(err);
				var sessionCookie = sessionKey + "=" + res.text;

				request
					.post("/error")
					.set("cookie", sessionCookie)
					.expect(200)
					.end(function (err) {
						if (err) return done(err);
						request
							.get("/")
							.set("cookie", sessionCookie)
							.expect(200, { Error: "Not logged in." })
							.end(function (err) {
								if (err) return done(err);

								request
									.get("/")
									.set("cookie", sessionCookie)
									.expect(200, {})
									.end(done)
							})
					});
			});

	});
});

function respond (status, test) {
	return function (ctx) {
		ctx.res.status = status;
		if (typeof test === "function") test(ctx);
	};
}