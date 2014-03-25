var _ = require("underscore")
  , WordcutCore = require("./wordcut_core");
var PathInfoBuilder = {

  /*
    buildByPartAcceptors: function(path, acceptors, i) {
    var 
    var genInfos = partAcceptors.reduce(function(genInfos, acceptor) {
      
    }, []);
    
    return genInfos;
  } 
  */

  buildByAcceptors: function(path, finalAcceptors, i) {
    var self = this;
    var infos = finalAcceptors.map(function(acceptor) {
      var p = i - acceptor.strOffset + 1
        , _info = path[p];            
      
      var info = {p: p, 
                  mw: _info.mw + (acceptor.mw === undefined ? 0 : acceptor.mw),
                  w: acceptor.w + _info.w,
                  unk: (acceptor.unk ? acceptor.unk : 0) + _info.unk, 
                  type: acceptor.type};

      if (acceptor.type == "PART") {
        for(var j = p + 1; j <= i; j++) {
          path[j].merge = p;
        }
        info.merge = p;
      }

      return info;
    });
    return infos.filter(function(info) { return info; });
  },
  
  fallback: function(path, leftBoundary, text, i) {
    var _info = path[leftBoundary];
    if (text[i].match(/[\u0E48-\u0E4E]/)) {
      if (leftBoundary != 0) 
        leftBoundary = path[leftBoundary].p;
      return {p: leftBoundary,
              mw: 0,
              w: 1 + _info.w,
              unk: 1 + _info.unk,
              type: "UNK"};      
/*    } else if(leftBoundary > 0 && path[leftBoundary].type !== "UNK") {
      leftBoundary = path[leftBoundary].p;
      return {p: leftBoundary,
              w: 1 + _info.w,
              unk: 1 + _info.unk,
              type: "UNK"};            */
    } else {      
      return {p: leftBoundary,
              mw: _info.mw,
              w: 1 + _info.w,
              unk: 1 + _info.unk,
              type: "UNK"};
    }
  },
  
  build: function(path, finalAcceptors, i, leftBoundary, text) {
    var basicPathInfos = this.buildByAcceptors(path, finalAcceptors, i);
    if (basicPathInfos.length > 0) {
      return basicPathInfos;
    } else {
      return [this.fallback(path, leftBoundary, text, i)];
    }
  }
};

module.exports = function() {
  return _.clone(PathInfoBuilder);
}
