var PathInfoBuilder = {
  buildByDict: function(path, boundaryPointers, i) {
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
  
  fallback: function(path, leftBoundary) {
    var _info = path[leftBoundary];
    return {p: leftBoundary,
            w: 1 + _info.w,
            unk: 1 + _info.unk,
            type: this.UNK};
  },
  
  build: function(path, boundaryPointers, i, leftBoundary) {
    var basicPathInfos = this.buildByDict(path, boundaryPointers, i);
    if (basicPathInfos.length > 0) {
      return basicPathInfos;
    } else {
      return [this.fallback(path, leftBoundary)];
    }
  }
};

module.exports = PathInfoBuilder;