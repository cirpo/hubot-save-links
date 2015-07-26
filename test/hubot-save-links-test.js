var chai = require('chai');
var path = require('path');
var Robot = require("hubot/src/robot");
var TextMessage = require("hubot/src/message").TextMessage;
var assert = chai.assert;

describe('save-links', function() {
  var robot;
  var adapter;

  beforeEach(function(done) {
    robot = new Robot(null, "mock-adapter", true, "Hubot");
    robot.adapter.on("connected", function() {
      require("../index")(robot);
      adapter = robot.adapter;
      done();
    });
    robot.run();
  });

  it('returns a message if a link was already inserted and env variable OLD_ENABLED set to true', function(done) {
    process.env['OLD_ENABLED'] = true;
    var link = 'http://example' + (new Date()).getTime() + '.com';
    var totalMsgSent = 0;
    adapter.receive(new TextMessage({}, link));
    adapter.on("send", function(envelope, strings) {
      try {
        assert(strings[0].match(/^#OLD/));
        totalMsgSent += 1;
      //  done();
      } catch (err) {
        done(err)
      }
    });

    setTimeout(function(){
      adapter.receive(new TextMessage({}, link));
    }, 500);

    setTimeout(function(){
      adapter.receive(new TextMessage({}, link));
    }, 1000);

    setTimeout(function(){
      assert.equal(totalMsgSent, 2);
      done();
    }, 1500);
  })
});
