var url = require('url');

function createParsedUrl(link) {
  var parsedUrl = url.parse(link, true, true);

  if (isValid(parsedUrl)) {
    return parsedUrl;
  }

  return;
}

function isValid(parsedUrl){
  return parsedUrl.host && parsedUrl.hostname !== 'slack.com';
}

module.exports = {
  createParsedUrl: createParsedUrl
}
