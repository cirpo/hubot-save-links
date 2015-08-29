var debug = require('debug')('save-links');
var rdebug = require('debug')('redis');
var client = require('./../redis');
var Pager = require('./../pager');

function getLatestLinks(req, res) {
  client.llen('hubot:saveLinks:links:id', function(err, totalLinks){
    if(totalLinks) {
      var pager = new Pager(totalLinks, {currentPage: req.query.page});

      client.lrange('hubot:saveLinks:links:id', pager.getStartRange(), pager.getEndRange() , function(err, linkIds){
        if (err) {
          debug(err);
          return;
        }
				getLinksByIds(linkIds).then(function(links){
          var resBody = createJSONResponse(links, totalLinks, pager);
					sendResponse(res, resBody);
				});

      });
    }
	});
}

function getLinksByTag(req, res) {
  var tag = req.params.tag;
  var resBody = { "hello": tag};

  client.llen('hubot:saveLinks:links:tag:#' + tag, function(err, totalLinks){
    if(totalLinks) {
      var pager = new Pager(totalLinks, {currentPage: req.query.page});

      client.lrange('hubot:saveLinks:links:tag:#' + tag, pager.getStartRange(), pager.getEndRange() , function(err, linkIds){
        if (err) {
          return;
        }

				getLinksById(linkIds).then(function(links){
          var resBody = createJSONResponse(links, totalLinks, pager);
					sendResponse(res, resBody);
				});
    });
  } else {
    res.status(404);
    res.json({"message": "no links found for " + tag});
  }
  });
}

function sendResponse(res, resBody) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', false);
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	res.json(resBody);
}

function createJSONResponse(links, totalLinks, pager) {
  return {
    data: links,
    totalLinks: totalLinks,
    pagination: pager.toObjectForRes()
  }
}

function getLinksByIds(linkIds) {
	return new Promise(function (resolve, reject) {
		client.hmget('hubot:saveLinks:links', linkIds, function(err, links){
			if(err){
				reject(err);
			}

			links.forEach(function(value, index, links){
				var link = JSON.parse(value);

				if(link.msg  && link.msg.room ) {
					link.room = link.msg.room;
				}

				delete(link['msg']);
				links[index] = link;
			});

			resolve(links);
		});
	});
}

module.exports =  {
    getLatestLinks: getLatestLinks,
    getLinksByTag: getLinksByTag,
}
