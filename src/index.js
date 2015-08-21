// Description:
//  This hubot script saves links posted in a chat, if a link is already saved
//  it sends a response containing when and who already posted that link
//
// Commands:
//   hubot <whatever>
//
// Examples:
//   hubot ciao //nothing get saved
//   hubot check this: http://webdebs.org // it will save the url

var saveLink = require('./hear/saveLink');
var getLinks = require('./api');
var migrate = require('./migrate')

module.exports = function(robot) {

  robot.hear(/[\s\S]*/, saveLink);
  robot.respond('/migrate/', migrate);

  robot.router.get('/links', getLinks);

}
