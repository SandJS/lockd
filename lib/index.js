/**
 * Created by ajaso on 2/4/15.
 */

"use strict";

var SandGrain = require('sand-grain');
var lockd = require('lockd');
var _ = require('lodash');

class Lockd extends SandGrain {
  constructor() {
    super();
    this.defaultConfig = require('./default');
    this.version = require('../package').version;

    this.conn = null;
    this.isDisconnecting = false;
    this.isConnected = false;
  }

  connect(callback) {
    if (this.conn) {
      return callback(null, this.conn)
    }

    var self = this;
    var conn = lockd.connect(this.config);

    conn.on('connect', function(err) {
      self.isConnected = true;
      if (err) {
        return callback(err);
      }
      self.conn = conn;
      callback(null, self.conn);
    });

    conn.on('close', function() {
      self.isConnected = false;
    });

    conn.on('error', function(err) {
      self.isConnected = false;
    });

    return conn;
  }

  acquire(lockName, callback) {
    var self = this;

    if (!this.conn) {

      this.connect(function(err) {
        if (err) {
          return callback(err);
        }
        getLock();
      });

    } else {
      getLock();
    }

    function getLock() {
      self.conn.get(lockName, callback);
    }
  }

  release(lockName, callback) {
    if (!this.conn) {
      callback();
      return;
    }
    this.conn.release(lockName, callback);
  }

  shutdown(done) {
    var self = this;
    if (this.conn && !this.isDisconnecting) {
      this.isDisconnecting = true;
      this.conn.disconnect(function() {
        self.conn = null;
        self.isDisconnecting = false;
        done();
      });
    }
  }
}

module.exports = Lockd;