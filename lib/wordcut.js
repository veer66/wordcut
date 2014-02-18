var _ = require("underscore")
  , WordcutDict = require("./dict")
  , DICT = 1
  , UNK  = 2
  , RULE = 3;



var WordcutCore = {
  buildPathInfosBasic: function(path, boundaryPointers, i) {
    var self = this;
    var infos = boundaryPointers.map(function(pointer) {
      var p = i - pointer.strOffset + 1
        , _info = path[p];
      return {p: p, 
              w: 1 + _info.w,
              unk: _info.unk, 
              type: DICT};
    });
    return infos.filter(function(info) { return info; });
  },

  buildPathInfoUnk: function(path, leftBoundary) {
    var _info = path[leftBoundary];
    return {p: leftBoundary,
            w: 1 + _info.w,
            unk: 1 + _info.unk,
            type: UNK};
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
            type: RULE};
  },

  buildPath: function(text) {
    var self = this
      , path = [{p:null, w:0, unk:0, type: 0}]
      , pointers = [this.dict.createPointer()]
      , leftBoundary = 0;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i] 
       , pointers__ = pointers
        .map(function(pointer) { return self.dict.walk(pointer, ch); })
       , pointers_ = pointers__.filter(function(pointer) { 
         return pointer; })
       , boundaryPointers = pointers_.filter(function(pointer) {
         return self.dict.isBoundary(pointer);
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
      pointers_.push(self.dict.createPointer());
      pointers = pointers_;
      path.push(selectedPath);
      if (selectedPath.type != DICT) {
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
  },

  cutIntoRanges: function(text) {
    var path = this.buildPath(text)
      , ranges = this.pathToRanges(path);
    ranges.forEach(function(r) {
      r.text = text.substring(r.s, r.e);
    });
    return ranges;
  }
};

var Wordcut = {
  init: function(dict_path) {
    this.dict = _.clone(WordcutDict);
    this.dict.init(dict_path);
  }
}

_.extend(Wordcut, WordcutCore);

module.exports = Wordcut;