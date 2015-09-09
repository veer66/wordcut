
var expect = require("chai").expect
  , wordcut = require("../lib/wordcut");

describe("Wordcut with custom dictionary", function() {

  beforeEach(function() {
    wordcut.init(__dirname+'/customdict.txt', true);
  });

  it("should recognize word in custom dict", function(){
    var segmentedResult = wordcut.cutIntoArray("ฉันชอบกินข้าวอร่อยมากมาก");
    expect(segmentedResult).to.deep.equal(["ฉัน","ชอบ","กินข้าว","อร่อยมากมาก"])
  });


});
