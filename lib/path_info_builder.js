var PathInfoBuilder = {
  buildByAcceptors: function(path, finalAcceptors, i) {
    var self = this;
    var infos = finalAcceptors.map(function(acceptor) {
      var p = i - acceptor.strOffset + 1
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
  
  build: function(path, finalAcceptors, i, leftBoundary) {
    var basicPathInfos = this.buildByAcceptors(path, finalAcceptors, i);
    if (basicPathInfos.length > 0) {
      return basicPathInfos;
    } else {
      return [this.fallback(path, leftBoundary)];
    }
  }
};

module.exports = PathInfoBuilder;
