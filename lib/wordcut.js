var sys = require("sys")
  , WordcutDict = require("./dict")
  , WordcutCore = require("./wordcut_core")
  , PathInfoBuilder = require("./path_info_builder")
  , PathSelector = require("./path_selector")
  , Acceptors = require("./acceptors")
  , latinRules = require("./latin_rules");

var Wordcut = Object.create(WordcutCore);

Wordcut.initNoDict = function(dict_path) {
  var self = this;
  Wordcut.pathInfoBuilder = Object.create(PathInfoBuilder);
  Wordcut.pathSelector = Object.create(PathSelector);
  this.acceptors = Object.create(Acceptors);
  latinRules.forEach(function(rule) {
    self.acceptors.creators.push(rule);
  });
};


Wordcut.init = function(dict_path) {
  this.initNoDict();
  var dict = Object.create(WordcutDict);
  dict.init(dict_path);  
  this.acceptors.creators.push(dict);    
};

module.exports = Wordcut;
