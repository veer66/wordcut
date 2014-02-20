var sys = require("sys")
  , WordcutDict = require("./dict")
  , WordcutCore = require("./wordcut_core")
  , PathInfoBuilder = require("./path_info_builder")
  , PathSelector = require("./path_selector")
  , Acceptors = require("./acceptors")
  , latinRules = require("./latin_rules");

var Wordcut = Object.create(WordcutCore);
Wordcut.defaultPathInfoBuilder = PathInfoBuilder;
Wordcut.defaultPathSelector = PathSelector;
Wordcut.defaultAcceptors = Acceptors;
Wordcut.defaultLatinRules = latinRules;
Wordcut.defaultDict = WordcutDict;

Wordcut.initNoDict = function(dict_path) {
  var self = this;
  Wordcut.pathInfoBuilder = Object.create(self.defaultPathInfoBuilder);
  Wordcut.pathSelector = Object.create(self.defaultPathSelector);
  self.acceptors = Object.create(self.defaultAcceptors);
  self.defaultLatinRules.forEach(function(rule) {
    self.acceptors.creators.push(rule);
  });
};

Wordcut.init = function(dict_path) {
  this.initNoDict();
  var dict = Object.create(this.defaultDict);
  dict.init(dict_path);  
  this.acceptors.creators.push(dict);    
};

module.exports = Wordcut;