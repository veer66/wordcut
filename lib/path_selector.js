var _ = require("underscore");


var PathSelector = {
  selectPath: function(paths) {
    var path = paths.reduce(function(selectedPath, path) {
      if (selectedPath == null) {        
        return path;
      } else {
        if (path.unk < selectedPath.unk) 
          return path;        
        if (path.unk == selectedPath.unk) {
          if (path.mw < selectedPath.mw)
            return path
          if (path.mw == selectedPath.mw) {
            if (path.w < selectedPath.w) 
              return path;
          }
        }
        return selectedPath;
      }
    }, null);
    return path;
  },
  
  createPath: function() {
    return [{p:null, w:0, unk:0, type: "INIT", mw:0}];
  }
};

module.exports = function() {
  return _.clone(PathSelector);
};
