var chai = require('chai');
var path = require('path');
var nock = require('nock');
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

    nock.cleanAll.bind(nock);
  });

  it('returns a message if a link was already inserted and env variable OLD_ENABLED set to true', function(done) {
    process.env['OLD_ENABLED'] = true;
    var link = 'http://example' + (new Date()).getTime() + '.com';
    nock(link).get('/').times(3).reply(200, 'OK');
    var totalOldMsgSent = 0;
    var user = {name: "gino", room: "#general"};
    adapter.receive(new TextMessage(user, link));

    adapter.on("send", function(envelope, strings) {
      try {
        assert(strings[0].match(/^#OLD/));
        totalOldMsgSent += 1;
      } catch (err) {
        done(err)
      }
    });

    setTimeout(function(){
      adapter.receive(new TextMessage(user, link));
    }, 200);

    setTimeout(function(){
      user.room = '#foo';
      adapter.receive(new TextMessage(user, link));
    }, 400);

    setTimeout(function(){
      assert.equal(totalOldMsgSent, 1, "Expecting  just one old message as the same link was posted twice in the #genaral channel and once in the #foo channel");
      done();
    }, 600);
  })
});
