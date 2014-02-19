var Acceptors = {
  creators: [],
  current: [],

  reset: function() {
    this.current = [];
  },

  transit: function(ch) {
    var self = this;
    self.creators.forEach(function(creator) {
      self.current.push(creator.createAcceptor());
    });
    self.current = self.current.filter(function(acceptor) {
      return !acceptor.isError;
    });
  },

  getFinalAcceptors: function() {    
    return this.current.filter(function(acceptor) {
      return acceptor.isFinal;
    });
  }
};

module.exports = Acceptors;
