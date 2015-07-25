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


module.exports = {
  extractTags: extractTags
}
