var chai = require('chai');
var Pager = require('../src/pager');
var assert = chai.assert;
var expect = chai.expect;

describe('pager', function(){
  it('should be initalized with maxPerPage results', function() {
    var pager = new Pager(100, {});
    assert.equal(pager.maxPerPage, 10);

    pager = new Pager(100, {maxPerPage: 20});
    assert.equal(pager.maxPerPage, 20);

    pager = new Pager(100, {maxPerPage: "15"});
    assert.equal(pager.maxPerPage, 15);

    pager = new Pager(100, {maxPerPage: "foo"});
    assert.equal(pager.maxPerPage, 10);
  });

  it('should be initalized with current page number', function() {
    var pager = new Pager(100, {});
    assert.equal(pager.currentPage, 1);

    pager = new Pager(100, {maxPerPage: 20, currentPage: 3});
    assert.equal(pager.currentPage, 3);

    pager = new Pager(100, {maxPerPage: 20, currentPage: "3"});
    assert.equal(pager.currentPage, 3);

    pager = new Pager(100, {maxPerPage: 20, currentPage: 1000});
    assert.equal(pager.currentPage, 1);

    pager = new Pager(100, {currentPage: "bella!"});
    assert.equal(pager.currentPage, 1);
  });

  it('should give back the total number of pages given the total number of results', function() {
    var pager = new Pager(100, {});
    assert.equal(pager.totalPages, 10);

    pager = new Pager(20, {});
    assert.equal(pager.totalPages, 2);

    pager = new Pager(89, {});
    assert.equal(pager.totalPages, 9);

    pager = new Pager(91, {});
    assert.equal(pager.totalPages, 10);

    pager = new Pager(91, {maxPerPage: 20});
    assert.equal(pager.totalPages, 5);
  });

  it('should return object rappresentation used in the response', function() {
    var pager = new Pager(100, {});
    var pagerForRes = pager.toObjectForRes();
    expect(pagerForRes).to.deep.equal({ current: 1, total: 10, next: 2 });

    pager = new Pager(100, {currentPage: 10});
    pagerForRes = pager.toObjectForRes();
    expect(pagerForRes).to.deep.equal({ current: 10, total: 10});

    pager = new Pager(89, {currentPage: 9});
    pagerForRes = pager.toObjectForRes();
    expect(pagerForRes).to.deep.equal({ current: 9, total: 9});
  });

  it('should return the start range based on the current pager status', function() {
    var pager = new Pager(100, {});
    assert.equal(pager.getStartRange(), 0);

    pager = new Pager(100, {currentPage: 2});
    assert.equal(pager.getStartRange(), 10);

    pager = new Pager(89, {currentPage: 9});
    assert.equal(pager.getStartRange(), 80);
  });

  it('should return the end range based on the current pager status', function() {
    var pager = new Pager(100, {});
    assert.equal(pager.getEndRange(), 9);

    pager = new Pager(100, {currentPage: 2});
    assert.equal(pager.getEndRange(), 19);

    pager = new Pager(89, {currentPage: 9});
    assert.equal(pager.getEndRange(), 89);
  });

});
