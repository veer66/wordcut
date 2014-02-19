var Acceptors = {
  creators: [],
  current: [],
  tag: {},

  reset: function() {
    this.current = [];
  },

  transit: function(ch) {
    var self = this;
    
    self.creators.forEach(function(creator) {
      self.current.push(creator.createAcceptor(self.tag));
    });
    
    var _current = [];
    self.tag = {};

    for (var i = 0; i < self.current.length; i++) {
      var acceptor = self.current[i];
      if (!acceptor.isError) {
        _current.push(acceptor);
        if (!self.tag[acceptor.tag]) 
          self.tag[acceptor.tag] = [];
        self.tag[acceptor.tag] = acceptor;
      }
    }
    self.current = _current;
  },

  getFinalAcceptors: function() {    
    return this.current.filter(function(acceptor) {
      return acceptor.isFinal;
    });
  }
};

module.exports = Acceptors;
