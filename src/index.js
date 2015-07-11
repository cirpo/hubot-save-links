// Description:
//  This hubot script saves links posted in a chat, if a link is already saved
//  it sends a response containing when and who already posted that link
//
// Commands:
//   hubot <whatever>
//
// Examples:
//   hubot ciao //nothing get saved
//   hubot check this: http://webdebs.org // it will save the url

var url = require('url');
var redis = require('redis');
var debug = require('debug')('save-links');
var saveLink = require('./hear/saveLink');
var redisUrl = process.env.REDISTOGO_URL || 'redis://localhost:6379';
var redisInfo = url.parse(redisUrl, true);
var client = redis.createClient(redisInfo.port, redisInfo.hostname, {no_ready_check: true});
var cirpoEvent = require('events').EventEmitter;

if (redisInfo.auth) {
  var pass = redisInfo.auth.split(':');
  client.auth(pass[1]);
}

client.on('connect', function() {
    debug('connected to redis');
});

module.exports = function(robot) {
  robot.hear(/[\s\S]*/, function(msg){
    saveLink(msg, client);
  });
}
