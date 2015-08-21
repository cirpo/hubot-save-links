var chai = require('chai');
var assert = chai.assert;
var urls = require('./../src/urls');
var nock = require('nock');
chai.should();
chai.use(require('chai-things'));

describe('urls', function() {

  beforeEach(nock.cleanAll.bind(nock));

  it('should return a parsedUrl promise from a valid link', function(done) {
    var link = 'http://google.com';
    nock(link).get('/').reply(200, 'OK');
    urls.createParsedUrl(link)
      .then(function(parsedUrl) {
        assert.equal(parsedUrl.host, 'google.com');
        done();
      });
  });

  it('should not return a parsedUrl promise from a slack.com link', function(done) {
    var link = 'http://slack.com/whatever';
    nock(link).get('/').reply(200, 'OK');
    urls.createParsedUrl(link)
      .then(function() {
        done('test failed');
      })
      .catch(function(err) {
        done();
      });
  });

  it('should not return a parsedUrl promise from a giphy.com link', function(done) {
    var link = 'http://giphy.com/whatever';
    nock(link).get('/').reply(200, 'OK');
    urls.createParsedUrl(link)
      .then(function() {
        done('test failed');
      })
      .catch(function(err) {
        done();
      });
  });

  it('should not return a parsedUrl promise from a invalid link', function(done) {
    var link = 'imnotaalink';
    urls.createParsedUrl(link)
      .then(function() {
        done('test failed');
      })
      .catch(function(err) {
        done();
      });
  });

  it('should not return a parsedUrl promise from a invalid link', function(done) {
    var link = '/hello';
    urls.createParsedUrl(link)
      .then(function() {
        done('test failed');
      })
      .catch(function(err) {
        done();
      });
  });

  it('should return a parsedUrl promise for available links', function(done) {
    var link = 'http://www.webdebs.org';
    nock(link).get('/').reply(200, 'OK');
    urls.createParsedUrl(link)
      .then(function(parsedUrl) {
        assert.equal(parsedUrl.host, 'www.webdebs.org');
        done();
      });
  });

  it('should return a parsedUrl object for redirected links (follow redirects)', function(done) {
    var link = 'http://redirect.me';
    nock(link).get('/').reply(302, undefined, { 'Location': 'http://www.webdebs.org' });
    nock('http://www.webdebs.org').get('/').reply(200, 'OK');
    urls.createParsedUrl(link)
      .then(function(parsedUrl) {
        assert.equal(parsedUrl.host, 'www.webdebs.org');
        done();
      });
  });

  it('should not return a parsedUrl object for not available links', function(done) {
    var link = 'http://i-do-not-exist.com/';
    nock(link).get('/').reply(404);
    urls.createParsedUrl(link)
      .then(function() {
        done('test failed');
      })
      .catch(function(err) {
        done();
      });
  });

});
