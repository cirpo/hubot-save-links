var debug = require('debug')('save-links');
var client = require('./../redis');
var Pager = require('./../pager');

function getLinks(req, res) {

  client.llen('hubot:links:list', function(err, totalLinks){
    if(totalLinks) {
      var pager = new Pager(totalLinks, {currentPage: req.query.page});

      client.lrange('hubot:links:list', pager.getStartRange(), pager.getEndRange() , function(err, result){
        if (err) {
          debug(err);
          return;
        }

        result.forEach(function(value, index, result){
          var link = JSON.parse(value);

          if(link.msg  && link.msg.room ) {
            link.room = link.msg.room;
          }

          delete(link['msg']);
          result[index] = link;
        });

        resBody = {
          data: result,
          totalLinks: totalLinks,
          pagination : pager.toObjectForRes()
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Credentials', false);
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.json(resBody);
      });
    }
  });
}

module.exports =  getLinks;
