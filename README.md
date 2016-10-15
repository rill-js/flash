<h1 align="center">
  <!-- Logo -->
  <img src="https://raw.githubusercontent.com/rill-js/rill/master/Rill-Icon.jpg" alt="Rill"/>
  <br/>
  @rill/flash
	<br/>

  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-stable-brightgreen.svg?style=flat-square" alt="API stability"/>
  </a>
  <!-- Standard -->
  <a href="https://github.com/feross/standard">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="Standard"/>
  </a>
  <!-- NPM version -->
  <a href="https://npmjs.org/package/@rill/flash">
    <img src="https://img.shields.io/npm/v/@rill/flash.svg?style=flat-square" alt="NPM version"/>
  </a>
  <!-- Downloads -->
  <a href="https://npmjs.org/package/@rill/flash">
    <img src="https://img.shields.io/npm/dm/@rill/flash.svg?style=flat-square" alt="Downloads"/>
  </a>
  <!-- Gitter Chat -->
  <a href="https://gitter.im/rill-js/rill">
    <img src="https://img.shields.io/gitter/room/rill-js/rill.svg?style=flat-square" alt="Gitter Chat"/>
  </a>
</h1>

Flash messages between requests for your Rill application.

A flashed message will persist through multiple requests until it is read.
After a flashed message has been read it will be deleted.

# Installation

```console
npm install @rill/flash
```

# Example

```javascript
const app = require("rill")()

// A session is required to use flash messages.
app.use(require("@rill/session")())

// Setup the flash middleware.
app.use(require("@rill/flash")())

// Use it!
app.use(({ req, res, flash })=> {
	if (req.method === "POST") {
		// Here we trigger an error in a post request
		// and wait to retrieve the flashed message (usually rendering a view).
		flash("error", "This is a flash error message.")
	} else {
    // After we read the 'error' flash it is marked to be removed after the request is finished.
		res.body = flash("error") || "No flash message"
	}
})
```

# API

**ctx.flash(key, value)** - Sets a value to be flashed.

**ctx.flash(key)** - Retrieves a flashed value. (Marks a key as expired and removes it after the request)


### Contributions

* Use `npm test` to run tests.

Please feel free to create a PR!
