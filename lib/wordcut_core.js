var WordcutCore = {

  buildPath: function(text) {
    var self = this
      , path = self.pathSelector.createPath()
      , leftBoundary = 0;
    self.acceptors.reset();
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      self.acceptors.transit(ch);

      var possiblePathInfos = self
        .pathInfoBuilder
        .build(path,
               self.acceptors.getFinalAcceptors(),
               i,
               leftBoundary,
               text);
      var selectedPath = self.pathSelector.selectPath(possiblePathInfos)

      path.push(selectedPath);
      if (selectedPath.type !== "UNK") {
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

      if (info.merge !== undefined && ranges.length > 0) {
        var r = ranges[ranges.length - 1];
        r.s = info.merge;
        s = r.s;
      } else {
        ranges.push({s:s, e:e});
      }
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

  cutIntoRanges: function(text, noText) {
    var path = this.buildPath(text)
      , ranges = this.pathToRanges(path);

    if (!noText) {
      ranges.forEach(function(r) {
        r.text = text.substring(r.s, r.e);
      });
    }
    return ranges;
  },

  cutIntoArray: function(text) {
    var path = this.buildPath(text)
      , ranges = this.pathToRanges(path);
    
    return ranges.map(function(r) {
      return text.substring(r.s, r.e)
    });
  }
};

module.exports = WordcutCore;
