'use strict'

var agent = require('supertest').agent
var Rill = require('rill')
var session = require('@rill/session')
var flashMiddleware = require('../')

describe('Rill/Flash', function () {
  it('should work on the server', function (done) {
    var request = agent(
      Rill()
        .use(session())
        .use(flashMiddleware())
        .get('/', respond(200, function (ctx) {
          ctx.res.body = ctx.flash()
        }))
        .post('/error', respond(200, function (ctx) {
          ctx.flash('Error', 'Not logged in.')
        }))
        .listen()
        .unref()
    )

    request
      .post('/error')
      .expect(200)
      .end(function (err) {
        if (err) return done(err)

        request
          .get('/')
          .expect(200, { Error: 'Not logged in.' })
          .end(function (err, res) {
            if (err) return done(err)

            request
              .get('/')
              .expect(200, {})
              .end(done)
          })
      })
  })
})

function respond (status, test) {
  return function (ctx) {
    ctx.res.status = status
    if (typeof test === 'function') test(ctx)
  }
}
