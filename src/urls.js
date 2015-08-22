var url = require('url');
var request = require('superagent');
var debug = require('debug')('url-utils');
var domainBlackList = ['slack.com', 'giphy.com'];

function createParsedUrl(link) {
  return isAvailable(link)
    .then(validate);
}

function validate(resolvedLink) {
  var parsedDestinationUrl = url.parse(resolvedLink.url, true, true);
  if (isValid(parsedDestinationUrl)) {
    return parsedDestinationUrl;
  } else {
    throw new Error('resolvedLink is not valid!');
  }
}

function isAvailable(link) {
  return new Promise(function(resolve, reject) {
    request
      .get(link)
      .end(function(err, res) {
        if (!err) {
          var lastRedirectUrl = link;
          debug('res.redirects', res.redirects);
          if (res.redirects.length > 0) {
            lastRedirectUrl = res.redirects.pop();
          }
          debug('parsedUrl is available at', lastRedirectUrl);
          resolve({
            url: lastRedirectUrl,
            body: res.body
          });
        } else {
          debug('parsedUrl is not available at', link);
          reject('parsedUrl is not available!');
        }
      });
  });
}

function isValid(parsedUrl){
  return !!parsedUrl.host && (domainBlackList.indexOf(parsedUrl.hostname) === -1);
}

module.exports = {
  createParsedUrl: createParsedUrl
};
