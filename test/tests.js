
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

  it("should split obvious pattern เด้", function() {
    var segmentedResult = wordcut.cut("เด้");
    expect(segmentedResult).to.deep.equal("เด้");
  });

  it("should split มั้ย", function() {
    var segmentedResult = wordcut.cut("มั้ย");
    expect(segmentedResult).to.deep.equal("มั้ย");
  });

  it("should split เชียง", function() {
    var segmentedResult = wordcut.cut("เชียง");
    expect(segmentedResult).to.deep.equal("เชียง");
  });

  it("should split แม่ง", function() {
    var segmentedResult = wordcut.cut("แม่ง");
    expect(segmentedResult).to.deep.equal("แม่ง");
  });

  it("should split ชาก", function() {
    var segmentedResult = wordcut.cut("ชาก");
    expect(segmentedResult).to.deep.equal("ชาก");
  });

  it("should split ง่วง", function() {
    var segmentedResult = wordcut.cut("ง่วง");
    expect(segmentedResult).to.deep.equal("ง่วง");
  });

  it("should not split ไพลิน", function() {
    var segmentedResult = wordcut.cut("ไพลิน");
    expect(segmentedResult).to.deep.equal("ไพ|ลิน");
  });

  it("should split parenthesis", function() {
    var segmentedResult = wordcut.cut("(test)");
    expect(segmentedResult).to.deep.equal("(|test|)");
  });

  it("should split slash", function() {
    var segmentedResult = wordcut.cut("dog/cat");
    expect(segmentedResult).to.deep.equal("dog|/|cat");
  });


});
