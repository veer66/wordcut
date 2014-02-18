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
  }  
};

module.exports = PathSelector;