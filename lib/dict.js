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
      .filter(function(w) { return w.length > 1; });    
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

  isFinal: function(acceptor) {
    return this.dict[acceptor.l].length == acceptor.strOffset;
  },

  createAcceptor: function() {
    return {l: 0, 
            r: this.dict.length - 1, 
            strOffset: 0,
            isFinal: false,
            dict: this,
            transit: function(ch) {
              return this.dict.transit(this, ch);
            },
            isError: false,
            tag: "DICT",
            w: 1,
            type: "DICT"
           }; 
  },

  transit: function(acceptor, ch) {
    var l = this.dictSeek(acceptor.l, 
                          acceptor.r, 
                          ch, 
                          acceptor.strOffset, 
                          LEFT);
    if (l !== null) {
      var r = this.dictSeek(l,
                            acceptor.r, 
                            ch,
                            acceptor.strOffset,
                            RIGHT);
      acceptor.l = l;
      acceptor.r = r;
      acceptor.strOffset ++;
      acceptor.isFinal = this.isFinal(acceptor);
    } else {
      acceptor.isError = true;
    }
    return acceptor;
  }  
};
module.exports = WordcutDict;
