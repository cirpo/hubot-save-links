var redis = require('redis');
var url = require('url');
var debug = require('debug')('save-links');

var redisUrl = process.env.REDISTOGO_URL || 'redis://localhost:6379';
var redisInfo = url.parse(redisUrl, true);
var client = redis.createClient(redisInfo.port, redisInfo.hostname, {no_ready_check: true});

if (redisInfo.auth) {
  var pass = redisInfo.auth.split(':');
  client.auth(pass[1]);
}

client.on('connect', function() {
    debug('connected to redis');
});


module.exports = client;