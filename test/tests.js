
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
    console.log(segmentedResult);
    expect(segmentedResult).to.deep.equal("กา|Dog|มี")
  });

});
