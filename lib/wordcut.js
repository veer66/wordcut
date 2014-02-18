var sys = require("sys")
  , WordcutDict = require("./dict")
  , WordcutCore = require("./wordcut_core")
  , PathInfoBuilder = require("./path_info_builder")
  , PathSelector = require("./path_selector");

  
var Wordcut = Object.create(WordcutCore);

Wordcut.pathInfoBuilder = PathInfoBuilder;
Wordcut.pathSelector = PathSelector;
Wordcut.dict = Object.create(WordcutDict);

Wordcut.init = function(dict_path) {
  this.dict.init(dict_path);
}

module.exports = Wordcut;