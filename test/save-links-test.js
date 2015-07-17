var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);
var expect = chai.expect;

describe('save-links', function() {
  var robot = {};
  var router = {};
  router.get = sinon.spy();
  robot.router = router;
  robot.hear = sinon.spy();

  beforeEach(function(){
    require('../src')(robot);
  });

  it('registers a hear listener', function(){
    expect(robot.hear).to.have.been.calledWith(/[\s\S]*/);
  })

});
