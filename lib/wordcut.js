var sys = require("sys")
  , WordcutDict = require("./dict")
  , WordcutCore = require("./wordcut_core")
  , PathInfoBuilder = require("./path_info_builder")
  , PathSelector = require("./path_selector")
  , Acceptors = require("./acceptors")
  , latinRules = require("./latin_rules");

  
var Wordcut = Object.create(WordcutCore);

Wordcut.pathInfoBuilder = PathInfoBuilder;
Wordcut.pathSelector = PathSelector;

Wordcut.init = function(dict_path) {
  var self = this;
  var dict = Object.create(WordcutDict);  
  dict.init(dict_path);
  this.acceptors = Object.create(Acceptors);
  this.acceptors.creators.push(dict);  
  latinRules.forEach(function(rule) {
    self.acceptors.creators.push(rule);
  });
}

module.exports = Wordcut;
