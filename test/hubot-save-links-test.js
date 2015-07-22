var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var path = require('path');
var Robot = require("hubot/src/robot");
var TextMessage = require("hubot/src/message").TextMessage;

chai.use(sinonChai);
var expect = chai.expect;

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
    adapter.receive(new TextMessage({}, link));
    adapter.on("send", function(envelope, strings) {
      try {
        expect(strings[0]).match(/^#OLD/);
        done();
      } catch (err) {
        done(err)
      }
    });

    setTimeout(function(){
      adapter.receive(new TextMessage({}, link));
    }, 1000);
  })
});
