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
  var urlToSave = links ? links[0].trim() : null;

  if(urlToSave) {
    client.hget('hubot:links', urlToSave, function(err, reply){
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
        var urlToSaveInfo = {
          user: msg.envelope.user.name,
          date: Date.now(),
          parsedUrl: url.parse(urlToSave)
        }
        var info = JSON.stringify(urlToSaveInfo);
        debug('saving url: ' + urlToSave)
        debug('url info: ' + info);
        client.hset('hubot:links', urlToSave, info);
      }
    });
  }
}

module.exports = saveLink;