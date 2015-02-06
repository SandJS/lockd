/**
 * Created by ajaso on 2/4/15.
 */

var sand = require('sand');
sand({appPath: __dirname + '/..', log: '*'})
  .use(require('..'))
  .start();

var lockd = require('lockd');
var server = lockd.listen(global.sand.lockd.config);

global.sand.lockd.acquire('ddd', global.sand.lockd.log);