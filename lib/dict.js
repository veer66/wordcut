var fs = require("fs")
  , LEFT = 0
  , RIGHT = 1;

var WordcutDict = {
  init: function(dictPath) {
    if (dictPath === undefined) {
      dictPath = __dirname + "/../data/tdict-std.txt";
    }

    this.dict = fs
      .readFileSync(dictPath, {encoding: "UTF-8"})
      .split(/[\r\n]+/)
      .filter(function(w) { return w.length > 0; });    
  },
  
  dictSeek: function(l, r, ch, strOffset, pos) {
    var ans = null;
    while (l <= r) {
      var m = Math.floor((l + r) / 2)
       , dict_item = this.dict[m]
       , len = dict_item.length;
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
          }  else {
            l = m + 1;
          }
        }
      }
    }
    return ans;
  },

  isBoundary: function(pointer) {
    return this.dict[pointer.l].length == pointer.strOffset;
  },

  createPointer: function() {
    return {p: 0, l: 0, r: this.dict.length - 1, strOffset: 0}; 
  },

  walk: function(pointer, ch) {
    var l = this.dictSeek(pointer.l, 
                          pointer.r, 
                          ch, 
                          pointer.strOffset, 
                          LEFT);
    if (l !== null) {
      var r = this.dictSeek(l,
                            pointer.r, 
                            ch,
                            pointer.strOffset,
                            RIGHT);
      return {l: l, r: r, strOffset: pointer.strOffset + 1};    
    } else {
      return null;
    }
  }  
};

module.exports = WordcutDict;