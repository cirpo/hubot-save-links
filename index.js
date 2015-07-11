var fs = require('fs');
var path = require('path');
var debug = require('debug')('save-links')

module.exports = function(robot) {
  var scriptsPath = path.resolve(__dirname, './src')
  console.log('scriptsPath', scriptsPath);
  var scripts = fs.readdirSync(scriptsPath);

  if(scripts.indexOf('save-links.js') > -1) {
    debug('loading hubot-save-links');
    robot.loadFile(scriptsPath, 'save-links.js');
  }
}
