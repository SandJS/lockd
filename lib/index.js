/**
 * Created by ajaso on 2/4/15.
 */

var SandGrain = require('sand-grain');
var lockd = require('lockd');
var _ = require('lodash');

module.exports = exports = SandGrain.extend({

  name: 'lockd',

  conn: null,
  locks: {},
  isDisconnecting: false,

  construct: function() {
    this.super();
    this.defaultConfig = require('./default');
    this.version = require('../package').version;
  },

  connect: function(callback) {
    if (this.conn) {
      return callback(null, this.conn)
    }

    var self = this;
    var conn = lockd.connect(this.config);

    conn.on('connect', function(err) {
      if (err) {
        return callback(err);
      }
      self.conn = conn;
      callback(null, self.conn);
    });

    return conn;
  },

  acquire: function(lockName, callback) {
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
  },

  release: function(lockName, callback) {
    if (!this.conn) {
      callback();
      return;
    }
    this.conn.release(lockName, callback);
  },

  shutdown: function(done) {
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

});