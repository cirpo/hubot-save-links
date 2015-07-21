
function Pager(totalLinks, options){
  this.totalLinks = totalLinks;
  this.maxPerPage = parseInt(options.maxPerPage, 10) || 10;
  this.totalPages = this.getTotalPages(totalLinks);
  var currentPage = parseInt(options.currentPage, 10) || 1;
  this.currentPage = currentPage > this.totalPages ? 1 : currentPage;
}

Pager.prototype.getTotalPages = function(){
  if(this.totalLinks > 0) {
    return Math.ceil(this.totalLinks / this.maxPerPage);
  }
};

Pager.prototype.toObjectForRes = function(){
  var pagination = {
    current: this.currentPage,
    total: this.totalPages
  };

  if((this.totalPages - this.currentPage) > 0 ){
    pagination.next = this.currentPage + 1;
  }

  return pagination;
}

Pager.prototype.getStartRange = function(){
  return (this.currentPage * this.maxPerPage) - this.maxPerPage;
};

Pager.prototype.getEndRange = function(){
  return (this.currentPage * this.maxPerPage) - 1;
};

module.exports = Pager;
