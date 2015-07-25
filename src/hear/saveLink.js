var url = require('url');
var moment = require('moment');
var debug = require('debug')('save-links');
var client = require('./../redis');

//found on stackoverflow, do you have better suggestions?
var urlRegex = new RegExp(
  "(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))"
  ,"g"
);

function saveLink(msg){
  debug('msg received: ' + msg.envelope.message.text);
  var links = msg.envelope.message.text.match(urlRegex);
  var link = links ? links[0].trim() : null;

  if(link && (url.parse(link)).hostname !== 'slack.com') {
    isLinkAlreadySaved(link, msg, persist);
  }
}

function isLinkAlreadySaved(link, msg, callback) {
  client.hget('hubot:links:hash', link, function(err, result){
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

    callback(link, msg);
  });
}

function createLinkInfo(link, msg){
  return {
    link: link,
    postedBy: msg.envelope.user.name,
    date: Date.now(),
    parsedUrl: url.parse(link),
    msg: msg.envelope,
    tags: extractTags(msg),
  };
}

function persist(link, msg) {
  var linkInfo = JSON.stringify(createLinkInfo(link, msg));
  var multi = client.multi([
      ["hset", "hubot:links:hash", link, linkInfo],
      ["lpush", "hubot:links:list", linkInfo],
      ["zadd", "hubot:links:sorted-set", linkInfo.date, linkInfo]
    ]
  );

  multi.exec(function (err, replies) {
    if(err) {
      debug(err);
    }
    debug('link ' + link + ' saved');
    debug('link info: ' + linkInfo);
  });
}

function extractTags(msg) {
  return msg.envelope.message.text.match(/#\w+/g);
}

module.exports = saveLink;
