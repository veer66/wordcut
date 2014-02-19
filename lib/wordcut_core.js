var WordcutCore = {
  DICT:1, 
  UNK:2, 
  RULE: 3,
  
  buildPath: function(text) {
    var self = this
      , path = [{p:null, w:0, unk:0, type: 0}]
      , pointers = [this.dict.createAcceptor()]
      , leftBoundary = 0;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i] 
       , pointers__ = pointers
        .map(function(pointer) { return self.dict.transit(pointer, ch); })
       , pointers_ = pointers__.filter(function(pointer) { 
         return pointer; })
       , boundaryPointers = pointers_.filter(function(pointer) {
         return pointer.isFinal;
       })
      , possiblePathInfos = self.pathInfoBuilder.build(path, 
                                                       boundaryPointers,
                                                       i,
                                                       leftBoundary)
      , selectedPath = self.pathSelector.selectPath(possiblePathInfos)
      pointers_.push(self.dict.createAcceptor());
      pointers = pointers_;
      path.push(selectedPath);
      if (selectedPath.type != this.DICT) {
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

module.exports = WordcutCore;
