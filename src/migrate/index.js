var debug = require('debug')('save-links');
var rdebug = require('debug')('redis');
var client = require('./../redis');

module.exports = function(){

  client.lrange('hubot:links:list', 0,  -1, function(err, links){
    if (err) {
      debug(err);
      return;
    }

    links.forEach(function(link){
      var linkInfo = JSON.parse(link);
      client.hget('hubot:saveLinks:links',linkInfo.href , function(err, linkId){
        if(err) {
          reject(err);
          return;
        }

        if(linkId) {
          return;
        }

        client.incr('hubot:saveLinks:links:lastId', function(err, linkId) {
          var userId =  linkInfo.msg.user.id;
          var userEmail =  linkInfo.msg.user.email || 'none';
          var userName = '';
          if (linkInfo.msg.user && linkInfo.msg.user.name) {
            userName = linkInfo.msg.user.name;
          }
          var room = linkInfo.msg.room;
          var date = linkInfo.date;
        //  rdebug(linkInfo);
          var redisCommands = [
              //links
              ["hset", "hubot:saveLinks:links",linkId, linkInfo],
              ["hset", "hubot:saveLinks:links", linkInfo.link,linkId],
              ["lpush", "hubot:saveLinks:links:id",linkId],
              ["zadd", "hubot:saveLinks:links:date", date,linkId],
              //user

          ];

          if (room) {
            redisCommands.push(["lpush", "hubot:saveLinks:links:room:" + room,linkId]);
          }

          if (userName && userId) {
            redisCommands.push(["lpush", "hubot:saveLinks:links:user:" + userId,linkId]);
            redisCommands.push(["hset", "hubot:saveLinks:links:user:name", userName + ":hash", userId + '::' + userEmail]);
          }

          if (linkInfo.tags) {
            linkInfo.tags.forEach(function(tag, index){
              redisCommands.push(["lpush", "hubot:saveLinks:links:tag:" + tag,linkId]);
            });
          }

          var multi = client.multi(redisCommands);

          multi.exec(function (err, replies) {
            if(err) {
              debug(err);
            }
            debug('link ' + linkInfo.link + ' saved');
            // debug('link info: ' + linkInfo);
          });
        });
    });
  });
  });
}
