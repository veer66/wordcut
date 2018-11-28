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
  
})
