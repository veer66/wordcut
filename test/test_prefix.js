var expect = require("chai").expect,
    PrefixTree = require("../lib/prefixtree.js")

describe("PrefixTree", () => {

  it("should be able to handle one char", () => {
    const tree = PrefixTree.createPrefixTree([["A", 10]])
    expect(tree.lookup(0, 0, "A")).to.deep.equal([0, true, 10])
    expect(tree.lookup(0, 0, "C")).to.be.null
  })

  it("should be able to take null workload", () => {
    const tree = PrefixTree.createPrefixTree(null)
    expect(tree.lookup(0, 0, "C")).to.be.null
  })

  it("should be able to handle two chars", () => {
    const tree = PrefixTree.createPrefixTree([["AB", 20]])
    expect(tree.lookup(0, 0, "A")).to.deep.equal([0, false, null])
    expect(tree.lookup(0, 1, "B")).to.deep.equal([0, true, 20])
  })

  it("should be able to handle two words", () => {
    const tree = PrefixTree.createPrefixTree([["A", 10], ["AB", 20]])
    expect(tree.lookup(0, 0, "A")).to.deep.equal([0, true, 10])
    expect(tree.lookup(0, 1, "B")).to.deep.equal([1, true, 20])
  })

  it("should be able to handle two words desc", () => {
    const tree = PrefixTree.createPrefixTree([["A", 10], ["AB", 20]])
    expect(tree.lookup(0, 0, "A")).to.deep.equal([0, true, 10])
    expect(tree.lookup(0, 1, "B")).to.deep.equal([1, true, 20])
  })

  it("should be able to handle 3 words", () => {
    const tree = PrefixTree.createPrefixTree([["มา", true], ["ตา", true], ["มาตรา", true]])
    let [node_id0, is_final0, payload0] = tree.lookup(0, 0, "ม")
    expect(node_id0).to.be.at.least(0)
    let [node_id1, is_final1, payload1] = tree.lookup(node_id0, 1, "า")
    expect(node_id1).to.be.at.least(0)
    let [node_id2, is_final2, payload2] = tree.lookup(node_id1, 2, "ต")
    expect(node_id2).to.be.at.least(0)
    let [node_id3, is_final3, payload3] = tree.lookup(node_id2, 3, "ร")
    expect(node_id3).to.be.at.least(0)
    let [node_id4, is_final4, payload4] = tree.lookup(node_id3, 4, "า")
    expect(node_id4).to.be.at.least(0)
    expect(is_final4).to.be.true    
  })

})
