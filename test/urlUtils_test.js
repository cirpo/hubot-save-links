var chai = require('chai');
var assert = chai.assert;
var urlUtils = require('./../src/urlUtils');
chai.should();
chai.use(require('chai-things'));

describe('urlUtils', function() {
  it('should return a parsedUrl object from a valid link', function() {
    var link = 'http://google.com';
    var parsedUrl = urlUtils.createParsedUrl(link);

    assert.equal(parsedUrl.host, 'google.com');
  });

  it('should not return a parsedUrl object from a slack.com link', function() {
    var link = 'http://slack.com/whatever';
    var parsedUrl = urlUtils.createParsedUrl(link);

    assert.equal(parsedUrl, null);
  });

  it('should not return a parsedUrl object from a invalid link', function() {
    var link = 'google.com';
    var parsedUrl = urlUtils.createParsedUrl(link);

    assert.equal(parsedUrl, null);
  });

  it('should not return a parsedUrl object from a invalid link', function() {
    var link = '/hello';
    var parsedUrl = urlUtils.createParsedUrl(link);

    assert.equal(parsedUrl, null);
  });
});
