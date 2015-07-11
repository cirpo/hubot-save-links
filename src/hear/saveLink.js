var url = require('url');
var moment = require('moment');
var debug = require('debug')('save-links');

//found on stackoverflow, do you have better suggestions?
var urlRegex = new RegExp(
  "(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))"
  ,"g"
);

function saveLink(msg, client){
  debug('msg received: ' + msg.envelope.message.text);

  var message = msg.envelope.message.text;
  var links = message.match(urlRegex);
  var link = links ? links[0].trim() : null;

  if(link) {
    client.hget('hubot:links', link, function(err, reply){
      if(err) {
        debug(err);
        return;
      }

      if(reply) {
        var alreadySavedUrl =  JSON.parse(reply);
        var alreadySavedUrlMsg = '#OLD dude! Already posted on ' + moment(alreadySavedUrl.date).format('DD MMM YYYY HH:mm')+ ' by ' + alreadySavedUrl.user;

        debug(reply);
        msg.send(alreadySavedUrlMsg);
      } else {
        var linkInfo = {
          user: msg.envelope.user.name,
          date: Date.now(),
          parsedUrl: url.parse(link)
        }

        var info = JSON.stringify(linkInfo);
        var now = Date.now();

        var linkInfo = {
          url: link,
          user: msg.envelope.user.name,
          date: now,
          parsedUrl: url.parse(link)
        }
        var info = JSON.stringify(linkInfo);

        var multi = client.multi([
            ["hset", "hubot:links:hash", link, info],
            ["lpush", "hubot:links:list", info],
            ["zadd", "hubot:links:sorted-set", now, info ]
          ]
        );

        debug('saving url: ' + link);
        debug('url info: ' + info);

        multi.exec(function (err, replies) {
          if(err) {
            debug(err);
          }
          debug('link ' + link + ' saved');
          debug('link info: ' + info);
        });
      }
    });
  }
}

module.exports = saveLink;