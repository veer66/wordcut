var _ = require("underscore");
var PathSelector = {
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
  
  createPath: function() {
    return [{p:null, w:0, unk:0, type: "INIT"}];
  }
};

module.exports = function() {
  return _.clone(PathSelector);
};
