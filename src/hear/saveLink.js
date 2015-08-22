var moment = require('moment');
var debug = require('debug')('save-links');
var rdebug = require('debug')('redis');
var client = require('./../redis');
var msgs = require('./../msgs');
var urls = require('./../urls');
var _ = require('lodash');

function saveLink(msg){
  debug(msg);
  debug('msg received: ' + msg.envelope.message.text);
  var links = msgs.extractLinks(msg);
  var savelinksPromises = [];

  links.forEach(function(link) {
    var savelinksPromise = urls
      .createParsedUrl(link)
      .then(function(parsedUrl) {
        parsedUrl.slack = { message : { room : msg.envelope.room } };
        return isUrlAlreadySaved(parsedUrl)
          .then(function(parsedUrl) {
            if (parsedUrl.alreadySavedLink === undefined) {
              return persist(createUrlInfo(parsedUrl, msg));
            }
            return  parsedUrl.alreadySavedLink;
          })
      })
      .catch(function(err){
        debug(err);
      });

    savelinksPromises.push(savelinksPromise);
  });

  Promise.all(savelinksPromises)
    .then(function(alreadySavedUrls) {
      _.remove(alreadySavedUrls, _.isUndefined);

      if(process.env.OLD_ENABLED) {
        alreadySavedUrls.forEach(function(alreadySavedUrl){
          msg.send('#OLD! ' + alreadySavedUrl.link + ' was already posted on '  + moment(alreadySavedUrl.date).format('DD MMM YYYY HH:mm') + ' by ' + alreadySavedUrl.postedBy);
        });
      }
    })
    .catch(function(err){
      debug(err);
    });
}

function isUrlAlreadySaved(parsedUrl) {
  return new Promise(function(resolve, reject) {
    client.hget('hubot:saveLinks:links', parsedUrl.href, function(err, linkId){
      if(err) {
        reject(err);
        return;
      }

      if(linkId) {
        client.hget('hubot:saveLinks:links', linkId, function(err, link){
          if(err) {
            reject(err);
            return;
          }
          var alreadySavedLink = JSON.parse(link);
          if(parsedUrl.slack.message.room === alreadySavedLink.msg.room) {
            parsedUrl.alreadySavedLink = alreadySavedLink;
          }
          debug('parsedUrl.alreadySavedLink', parsedUrl.alreadySavedLink);
          return resolve(parsedUrl);
        });
      } else {
        return resolve(parsedUrl);
      }
    });
  });
}

function createUrlInfo(parsedUrl, msg) {
  return {
    link: parsedUrl.href,
    postedBy: msg.envelope.user.name,
    date: Date.now(),
    parsedUrl: parsedUrl,
    msg: msg.envelope,
    tags: msgs.extractTags(msg)
  };
}

function persist(linkInfo) {
  rdebug(linkInfo.msg.user.name);
  var userId =  linkInfo.msg.user.id || 'none';
  var userEmail =  linkInfo.msg.user.email || 'none';
  var userName =  linkInfo.msg.user.name || 'none';
  var room = linkInfo.msg.room;
  var date = linkInfo.date;
  var link = linkInfo.link;

  client.incr('hubot:saveLinks:links:lastId', function(err,linkId) {
    rdebug(linkInfo);
    var redisCommands = [
        //links
        ["hset", "hubot:saveLinks:links",linkId, JSON.stringify(linkInfo)],
        ["hset", "hubot:saveLinks:links", link,linkId],
        ["lpush", "hubot:saveLinks:links:id",linkId],
        ["zadd", "hubot:saveLinks:links:date", date,linkId],
        //user
        ["lpush", "hubot:saveLinks:links:user:" + userId,linkId],
        ["hset", "hubot:saveLinks:links:user:name", userName, userId + '::' + userEmail],
        //room
        ["lpush", "hubot:saveLinks:links:room:" + room,linkId]
    ];

    linkInfo.tags.forEach(function(tag, index){
        redisCommands.push(["lpush", "hubot:saveLinks:links:tag:" + tag,linkId]);
    });

   debug(redisCommands);
    var multi = client.multi(redisCommands);

    multi.exec(function (err, replies) {
      if(err) {
        debug(err);
      }
      debug('link ' + linkInfo.link + ' saved');
      debug('link info: ' + linkInfo);
    });

  });
}

module.exports = saveLink;
