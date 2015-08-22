var debug = require('debug')('save-links');
var rdebug = require('debug')('redis');
var client = require('./../redis');
var Pager = require('./../pager');

function getLinks(req, res) {

  client.llen('hubot:saveLinks:links:id', function(err, totalLinks){
    if(totalLinks) {
      var pager = new Pager(totalLinks, {currentPage: req.query.page});

      client.lrange('hubot:saveLinks:links:id', pager.getStartRange(), pager.getEndRange() , function(err, linkIds){
        if (err) {
          debug(err);
          return;
        }

        rdebug('linkIds:')
        rdebug(linkIds)
        client.hmget('hubot:saveLinks:links', linkIds, function(err, links){
          rdebug(err);
          rdebug(links);
          links.forEach(function(value, index, links){
            var link = JSON.parse(value);

            if(link.msg  && link.msg.room ) {
              link.room = link.msg.room;
            }

            delete(link['msg']);
            links[index] = link;
          });

          resBody = {
            data: links,
            totalLinks: totalLinks,
            pagination : pager.toObjectForRes()
          }

          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Credentials', false);
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.json(resBody);
        });
    });
  }
  });
}

module.exports =  getLinks;
