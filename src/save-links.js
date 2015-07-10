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

var redis = require('redis');
var url = require('url');
var moment = require('moment');

var redisUrl = process.env.REDISTOGO_URL || 'redis://localhost:6379';
var redisInfo = url.parse(redisUrl, true);
var client = redis.createClient(redisInfo.port, redisInfo.hostname, {no_ready_check: true});

if (redisInfo.auth) {
  var pass = redisInfo.auth.split(':');
  client.auth(pass[1]);
}

client.on('connect', function() {
    console.log('connected');
});

//found on stackoverflow, do you have better suggestions?
var urlRegex = new RegExp(
  "(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))"
  ,"g"
);

module.exports = function(robot) {
  robot.hear(/[\s\S]*/, function(msg){
    console.log('msg received:', msg.envelope.message.text);

    var message = msg.envelope.message.text;
    var links = message.match(urlRegex);
    var urlToSave = links ? links[0].trim() : null;

    if(urlToSave) {
      client.hget('hubot:links', urlToSave, function(err, reply){
        if(err) {
          console.log(err);
          return;
        }

        if(reply) {
          var alreadySavedUrl =  JSON.parse(reply);
          var alreadySavedUrlMsg = '#OLD dude! Already posted on ' + moment(alreadySavedUrl.date).format('DD MMM YYYY HH:mm')+ ' by ' + alreadySavedUrl.user;

          console.log('msg received');
          msg.send(alreadySavedUrlMsg);
        } else {
          var urlToSaveInfo = {
            user: msg.envelope.user.name,
            date: Date.now(),
            parsedUrl: url.parse(urlToSave)
          }
          var info = JSON.stringify(urlToSaveInfo);
          console.log('saving url: ' + urlToSave, info);
          client.hset('hubot:links', urlToSave, info);
        }
      });
    }
  })
}
