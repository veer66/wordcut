
var expect = require("chai").expect
  , wordcut = require("../lib/wordcut");

describe("Wordcut", function() {

  beforeEach(function() {
    wordcut.init();
  });

  it("should segment a simple word", function() {
    expect(wordcut.cut("กากา")).to.deep.equal("กา|กา")
  });

  it("should segment a word the number", function() {
    expect(wordcut.cut("กา2ตัว")).to.deep.equal("กา|2|ตัว")
  });

  it("should segment text with English word", function() {
    var segmentedResult = wordcut.cut("กาDogมี");
    expect(segmentedResult).to.deep.equal("กา|Dog|มี")
  });

  it("should segment thai word with parenthesis", function() {
    var segmentedResult = wordcut.cut("อยู่ใน(วงเล็บ)");
    expect(segmentedResult).to.deep.equal("อยู่|ใน|(|วงเล็บ|)")
  });

  it("should segment english word with quotes", function() {
    var segmentedResult = wordcut.cut("ลอง\"prt\"");
    expect(segmentedResult).to.deep.equal("ลอง|\"|prt|\"")
  });

  it("should segment english word with prime", function() {
    var segmentedResult = wordcut.cut("ลอง`prt`");
    expect(segmentedResult).to.deep.equal("ลอง|`|prt|`")
  });

  it("should segment text with English word and space", function() {
    var segmentedResult = wordcut.cut("กา Dog มี");
    expect(segmentedResult).to.deep.equal("กา| |Dog| |มี")
  });

  it("should segment text with English word and repeated space", function() {
    var segmentedResult = wordcut.cut("NO BREAK SPACES        IS HERE นะครับ");
    expect(segmentedResult).to.deep.equal("NO| |BREAK| |SPACES|        |IS| |HERE| |นะ|ครับ")
  });

  it("should segment string with at sign", function(){
    var segmentedResult = wordcut.cut('ฉัน @รัก@ เธอมาก@mai@จริง')
    expect(segmentedResult).to.deep.equal('ฉัน| |@|รัก|@| |เธอ|มาก|@|mai|@|จริง')
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
    expect(segmentedResult).to.deep.equal("ไพลิน");
  });

  it("should split parenthesis", function() {
    var segmentedResult = wordcut.cut("(test)");
    expect(segmentedResult).to.deep.equal("(|test|)");
  });

  it("should split slash", function() {
    var segmentedResult = wordcut.cut("dog/cat");
    expect(segmentedResult).to.deep.equal("dog|/|cat");
  });

  it("should split dash", function() {
    var segmentedResult = wordcut.cut("รับ-ส่ง");
    expect(segmentedResult).to.deep.equal("รับ|-|ส่ง");
  });
  it("should not split เตอร์", function() {
    var segmentedResult = wordcut.cut("เตอร์");
    expect(segmentedResult).to.deep.equal("เตอร์");
  });

  it("should not split เตอร์", function() {
    var segmentedResult = wordcut.cut("เตอร์");
    expect(segmentedResult).to.deep.equal("เตอร์");
  });


  it("should not split energy energy", function() {
    var segmentedResult = wordcut.cut("energy");
    expect(segmentedResult).to.deep.equal("energy");
    var segmentedResult = wordcut.cut("energy");
    expect(segmentedResult).to.deep.equal("energy");
  });

  it("should split dot", function(){
    var segmentedResult = wordcut.cut("energy.");
    expect(segmentedResult).to.deep.equal("energy|.");   
  });

  it("should split into array", function(){
    var segmentedResult = wordcut.cutIntoArray("ฉันชอบกินข้าว");
    expect(segmentedResult).to.deep.equal(["ฉัน","ชอบ","กิน","ข้าว"])
  });


});
