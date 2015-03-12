/**
 * Created by ajaso on 2/4/15.
 */

"use strict";

var _ = require('lodash');
var lockdConfig = {tcp: '127.0.0.1:9999'};

var app = new (require('sand'))({appPath: __dirname + '/..', log: '*'})
  .use(require('..'), {all: lockdConfig})
  .start();

var server;

describe('sand.lockd', function() {

  var lockName = 'my-lock';

  before(function() {
    server = require('lockd').listen(lockdConfig)
  });

  after(function(done) {
    server.close();
    app.shutdown(done);
  });

  describe('acquire()', function() {

    it('should acquire a lock', function(done) {

      sand.lockd.acquire(lockName, function(err, count, status) {

        status.should.match(/get success/i);
        done();

      });

    });

  });

  describe('release()', function() {

    it('should release a lock', function(done) {

      sand.lockd.release(lockName, function(err, count, status) {

        status.should.match(/release success/i);
        done();

      });

    });

  });

});