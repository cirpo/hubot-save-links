var debug = require('debug')('save-links');
var client = require('./../redis')

var linksPerPage = 10;

function getLinks(req, res) {
  var page = req.query.page ? req.query.page : 1;
  page = parseInt(page, 10);
  page = isNaN(page) ? 1 : page;

  client.llen('hubot:links:list', function(err, totalLinks){
    if(totalLinks) {
      var totalPages = Math.ceil(totalLinks / linksPerPage);
      var endRange = (page * linksPerPage) - 1;
      var startRange= (page * linksPerPage) - linksPerPage

      client.lrange('hubot:links:list', startRange, endRange , function(err, result){
        if (err) {
          debug(err);
        }

        result.forEach(function(value, index, result){
          var link = JSON.parse(value);
          if(link.msg.room) {
            link.room = link.msg.room;
            delete(link['msg']);
          }

          result[index] = link;
        });

        var pagination = {
            current: page,
            total: totalPages
        }

        if((totalPages - page) > 0 ){
          pagination.next = page + 1;
        }

        resBody = {
          data: result,
          totalLinks: totalLinks,
          linksPerPage: linksPerPage,
          pagination : pagination
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