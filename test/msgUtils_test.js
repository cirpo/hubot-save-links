var chai = require('chai');
var assert = chai.assert;
var msgUtils = require('./../src/msgUtils');
chai.should();
chai.use(require('chai-things'));

describe('msgUtils - extractTags', function() {
  it('should extract tags from a message', function() {
    var msg = {
        envelope : {
          message: {
            text:  'http://google.com/#hello #tag #link #tag#intag'
          }
        }
    };

    var tags = msgUtils.extractTags(msg);

    assert(tags.length, 2);
    tags.should.include('#link');
    tags.should.not.include('#hello');
  });

});
