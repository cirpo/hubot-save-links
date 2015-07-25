
var moment = require('moment');
var debug = require('debug')('save-links');
var client = require('./../redis');
var msgUtils = require('./../msgUtils');
var urlUtils = require('./../urlUtils');

function saveLink(msg){
  debug('msg received: ' + msg.envelope.message.text);
  var link = msgUtils.extractLinks(msg);
  var parsedUrl = urlUtils.createParsedUrl(link);

  if(parsedUrl) {
    isLinkAlreadySaved(parsedUrl, msg, persist);
  }
}

function isLinkAlreadySaved(parsedUrl, msg, callback) {
  client.hget('hubot:links:hash', parsedUrl.href, function(err, result){
    if(err) {
      debug(err);
      return;
    }

    if(result) {
      debug(result);
      var alreadySavedLink = JSON.parse(result);

      if (alreadySavedLink.msg.room === msg.envelope.room && process.env.OLD_ENABLED) {
        msg.send('#OLD dude! Already posted on ' + moment(alreadySavedLink.date).format('DD MMM YYYY HH:mm') + ' by ' + alreadySavedLink.postedBy);
      }

      return;
    }

    callback(parsedUrl, msg);
  });
}

function createLinkInfo(parsedUrl, msg){
  return {
    link: parsedUrl.href,
    postedBy: msg.envelope.user.name,
    date: Date.now(),
    parsedUrl: parsedUrl,
    msg: msg.envelope,
    tags: msgUtils.extractTags(msg)
  };
}

function persist(parsedUrl, msg) {
  var linkInfo = JSON.stringify(createLinkInfo(parsedUrl, msg));
  var multi = client.multi([
      ["hset", "hubot:links:hash", parsedUrl.href, linkInfo],
      ["lpush", "hubot:links:list", linkInfo],
      ["zadd", "hubot:links:sorted-set", linkInfo.date, linkInfo]
    ]
  );

  multi.exec(function (err, replies) {
    if(err) {
      debug(err);
    }
    debug('link ' + parsedUrl.href + ' saved');
    debug('link info: ' + linkInfo);
  });
}

module.exports = saveLink;
