var debug = require('debug')('save-links');
var client = require('./../redis')

var linksPerPage = 10;

function getLinks(req, res) {
  var page = req.query.page ? req.query.page : 1;
  page = parseInt(page, 10);
  page = isNaN(page) ? 1 : page;

  console.log('page', page);

  client.llen('hubot:links:list', function(err, totalLinks){
    debug('totalLinks: ' + totalLinks);

    if(totalLinks) {
      var totalPages = Math.ceil(totalLinks / linksPerPage);
      var endRange = (page * linksPerPage) - 1;
      var startRange= (page * linksPerPage) - linksPerPage

      client.lrange('hubot:links:list', startRange, endRange , function(err, result){
        debug(result);
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

        res.json(resBody);
      });
    }
  });
}

module.exports =  getLinks;