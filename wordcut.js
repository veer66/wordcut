var fs = require("fs");

var LEFT = 0
  , RIGHT = 1;

module.exports = {
  init: function(dictPath) {
    if (dictPath === undefined) {
      dictPath = __dirname + "/data/tdict-std.txt";
    }

    this.DICT = 1;
    this.UNK  = 2;
    this.RULE = 3;
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

  buildPathInfosBasic: function(path, boundaryPointers, i) {
    var self = this;
    var infos = boundaryPointers.map(function(pointer) {
      var p = i - pointer.strOffset + 1
        , _info = path[p];
      return {p: p, 
              w: 1 + _info.w,
              unk: _info.unk, 
              type: self.DICT};
    });
    return infos.filter(function(info) { return info; });
  },

  buildPathInfoUnk: function(path, leftBoundary) {
    var _info = path[leftBoundary];
    return {p: leftBoundary,
            w: 1 + _info.w,
            unk: 1 + _info.unk,
            type: this.UNK};
  },

  buildPathInfos: function(path, boundaryPointers, i, leftBoundary) {
    var basicPathInfos = this.buildPathInfosBasic(path, boundaryPointers, i);
    if (basicPathInfos.length > 0) {
      return basicPathInfos;
    } else {
      return [this.buildPathInfoUnk(path, leftBoundary)];
    }
  },

  selectPath: function(paths) {
    var path = paths.reduce(function(selectedPath, path) {
      if (selectedPath == null) {
        return path;
      } else if (path.unk < selectedPath.unk 
                 || (path.unk == selectedPath.unk 
                     && path.w < selectedPath.w)) {
        return path;        
      } else {
        return selectedPath;
      }
    }, null);
    return path;
  },

  doesRulesMatch: function(text, leftBoundary, i) {
    return text.substring(leftBoundary, i).match(/^[A-Za-z\d]+$/);
  },

  buildPathInfoByRules: function(path, leftBoundary, i) {
    var _info = path[leftBoundary];
    return {p: leftBoundary,
            w: 1 + _info.w,
            unk: 0 + _info.unk,
            type: this.RULE};
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
  },

  buildPath: function(text) {
    var self = this
      , path = [{p:null, w:0, unk:0, type: 0}]
      , pointers = [this.createPointer()]
      , leftBoundary = 0;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i] 
       , pointers__ = pointers
        .map(function(pointer) { return self.walk(pointer, ch); })
       , pointers_ = pointers__.filter(function(pointer) { 
         return pointer; })
       , boundaryPointers = pointers_.filter(function(pointer) {
         return self.isBoundary(pointer);
       })
      , possiblePathInfos = self.buildPathInfos(path, 
                                                boundaryPointers,
                                                i,
                                                leftBoundary)
      , _selectedPath = self.selectPath(possiblePathInfos)
      , selectedPath = ((_selectedPath.type == self.UNK 
                         && self.doesRulesMatch(text, leftBoundary, i))
                         ? self.buildPathInfoByRules(path, 
                                                     leftBoundary, 
                                                     i) 
                        : _selectedPath);
      pointers_.push(self.createPointer());
      pointers = pointers_;
      path.push(selectedPath);
      if (selectedPath.type != self.DICT) {
        leftBoundary = i;
      }
    }
    return path;
  },

  pathToRanges: function(path) {
    var e = path.length - 1
     , ranges = [];
    
    while (e > 0) {
      var info = path[e]
       , s = info.p;
      ranges.push({s:s, e:e});
      e = s;
    }
    return ranges.reverse();
  },

  rangesToText: function(text, ranges, delimiter) {
    return ranges.map(function(r) {
      return text.substring(r.s, r.e);
    }).join(delimiter);
  },

  cut: function(text, delimiter) {
    var path = this.buildPath(text)
      , ranges = this.pathToRanges(path);
    return this
      .rangesToText(text, ranges, 
                    (delimiter === undefined ? "|" : delimiter));
  }
};
