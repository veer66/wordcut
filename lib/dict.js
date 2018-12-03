var fs = require("fs");
var LEFT = 0;
var RIGHT = 1;
var path = require("path");
var glob = require("glob");
var createPrefixTree = require("./prefixtree").createPrefixTree;
var WordcutDict = {


  init: function (dictPathFile, withDefault, words) {
    withDefault = withDefault || false
    defaultDict = path.normalize(__dirname + "/..") + "/data/tdict-*.txt";
    this.dict=[]
    var dictPathIsDefined = dictPathFile !== undefined
    var dictPath = (withDefault || !dictPathIsDefined) ? [defaultDict]: [];
    var dictPathFile = dictPathFile || defaultDict

    if(dictPathIsDefined){
      if (Array.isArray(dictPathFile)) {
        dictPath.concat.apply(dictPath, dictPathFile);
      } else {
        dictPath.push(dictPathFile)
      }
    }

    this.addFiles(dictPath, false)

    if(words!==undefined){
      this.addWords(words, false)
    }
    this.finalizeDict();
  },

  addWords: function(words, finalize){
    finalize = finalize===undefined || finalize;
    this.dict.push.apply(this.dict, words)
    if(finalize){
      this.finalizeDict();
    }
  },

  finalizeDict: function(){
    this.dict = this.sortuniq(this.dict);
    this.tree = createPrefixTree(this.dict.map(w => [w, null]))
  },

  addFiles: function(files, finalize){
    finalize = finalize===undefined || finalize;
    files = this.sortuniq(this.flatten(files.map(function(x){return glob.sync(x)})))
    for (var i = 0; i < files.length; i++) {
      words = fs.readFileSync(files[i], {
                  encoding: "UTF-8"
              })
              .split(/[\r\n]+/)
              .filter(function (w) {
                return w.length > 1;
              })
      this.addWords(words, false)
    }
    if(finalize){
      this.finalizeDict();
    }
  },

  dictSeek: function (l, r, ch, strOffset, pos) {
    var ans = null;
    while (l <= r) {
      var m = Math.floor((l + r) / 2),
        dict_item = this.dict[m],
        len = dict_item.length;
      if (len <= strOffset) {
        l = m + 1;
      } else {
        var ch_ = dict_item[strOffset];
        if (ch_ < ch) {
          l = m + 1;
        } else if (ch_ > ch) {
          r = m - 1;
        } else {
          ans = m;
          if (pos == LEFT) {
            r = m - 1;
          } else {
            l = m + 1;
          }
        }
      }
    }
    return ans;
  },

  isFinal: function (acceptor) {
    return this.dict[acceptor.l].length == acceptor.strOffset;
  },

  createAcceptor: function () {
    let dict = this;
    return {
      nodeId: 0,
      strOffset: 0,
      isFinal: false,
      isError: false,
      tag: "DICT",
      w: 1,
      type: "DICT",
      dict: dict,

      transit(ch) {
	return this.dict.transit(this, ch)
      }
    };
  },

  transit: function (acceptor, ch) {
    let child = this.tree.lookup(acceptor.nodeId, acceptor.strOffset, ch)
    if (child !== null) {

      let [nodeId, isFinal, payload] = child
      acceptor.nodeId = nodeId
      acceptor.strOffset++
      acceptor.isFinal = isFinal
    } else {
      acceptor.isError = true;
    }
    return acceptor;
  },

  sortuniq: function(a){
    return a.sort().filter(function(item, pos, arr){
      return !pos || item != arr[pos - 1];
    })
  },

  flatten: function(a){
    //[[1,2],[3]] -> [1,2,3]
    return [].concat.apply([], a);
  }
};
module.exports = WordcutDict;
