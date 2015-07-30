var url = require('url');
var domainBlackList = ['slack.com', 'giphy.com']


function createParsedUrl(link) {
  var parsedUrl = url.parse(link, true, true);

  if (isValid(parsedUrl)) {
    return parsedUrl;
  }

  return;
}

function isValid(parsedUrl){
  return parsedUrl.host && domainBlackList.indexOf(parsedUrl.hostname) === -1;
}

module.exports = {
  createParsedUrl: createParsedUrl
}
