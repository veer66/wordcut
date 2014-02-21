
var expect = require("chai").expect
  , wordcut = require("../lib/wordcut");

describe("Wordcut", function() {
  
  beforeEach(function() {
    wordcut.init();
  });
  
  it("should segment a simple word", function() {
    expect(wordcut.cut("กากา")).to.deep.equal("กา|กา")
  });
  

  it("should segment text with English word", function() {
    var segmentedResult = wordcut.cut("กาDogมี");
    expect(segmentedResult).to.deep.equal("กา|Dog|มี")
  });

  it("should segment text with English word and space", function() {
    var segmentedResult = wordcut.cut("กา Dog มี");
    expect(segmentedResult).to.deep.equal("กา| |Dog| |มี")
  });

  
  it("should split obvious pattern เหน็ด", function() {
    var segmentedResult = wordcut.cut("เหน็ด");
    expect(segmentedResult).to.deep.equal("เหน็ด")
  });

});
