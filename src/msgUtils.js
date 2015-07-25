function extractTags(msg) {
  var msgTags = msg.envelope.message.text.match(/ #\w+/g);
  var tags = [];

  if(msgTags) {
    msgTags.forEach(function(tag){
      tag = tag.trim();

      if(msgTags.indexOf(tag) === -1) {
        tags.push(tag);
      }

    }, tags);
  }

  return tags;
}

function extractLinks(msg) {
  //found on stackoverflow, do you have better suggestions?
  var urlRegex = new RegExp(
    "(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))" ,
    "g"
  );
  var links = msg.envelope.message.text.match(urlRegex);
  var link = links ? links[0].trim() : null;

  return link;
}

module.exports = {
  extractTags: extractTags,
  extractLinks: extractLinks
}
