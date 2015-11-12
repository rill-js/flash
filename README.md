# Rill Flash
Flash messages between requests for your Rill application.
A flashed message will persist for one more request from the same session.
If the request is redirected the flashed message will be saved again.

# Installation

#### Npm
```console
npm install @rill/flash
```

# Example

```javascript
const app = require("rill")();

// A session is required to use flash messages.
app.use(require("@rill/session")())
app.use(require("@rill/flash")());

app.use(function ({ req, res, flash })=> {
	if (req.method === "POST") {
		// Here we trigger an error in a post request
		// and wait to retreive the flashed message (usually rendering a view).
		flash("error", "This is a flash error message.");
	} else {
		res.body = flash("error") || "No flash message";
	}
});

app.listen(3000);
```

# API

**ctx.flash(key, value)** - Sets a value to be flashed.

**ctx.flash(key)** - Retrieves a flashed value.

**ctx.flash()** - Retrieve all flashed values.

**ctx.locals.flash** - A store of all flashed values for the request.


### Contributions

* Use gulp to run tests.

Please feel free to create a PR!
