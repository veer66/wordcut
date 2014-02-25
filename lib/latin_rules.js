var WordRule = {
  createAcceptor: function(tag) {
    if (tag["WORD_RULE"])
      return null;

    return {strOffset: 0,
            isFinal: false,
            transit: function(ch) {
              var lch = ch.toLowerCase();
              if (lch >= "a" && lch <= "z") {
                this.isFinal = true;
                this.strOffset++;
              } else {
                this.isError = true;
              }
              return this;
            },
            isError: false,
            tag: "WORD_RULE",
            type: "WORD_RULE", 
            w: 1};                        
  }
};

var SpaceRule = {
  tag: "SPACE_RULE",
  createAcceptor: function(tag) {

    if (tag["SPACE_RULE"])
      return null;

    return {strOffset: 0,
            isFinal: false,
            transit: function(ch) {
              if (ch == " " || ch == "\t" || ch == "\r" || ch == "\n") {
                this.isFinal = true;
                this.strOffset++;
              } else {
                this.isError = true;
              }
              return this;
            },
            isError: false,
            tag: SpaceRule.tag,
            w: 1,
            type: "SPACE_RULE"};                        
  }
}

var SingleSymbolRule = {
  tag: "SINSYM",
  createAcceptor: function(tag) {
    return {strOffset: 0,
            isFinal: false,
            transit: function(ch) {
              if (this.strOffset == 0 && ch.match(/^[\(\)\/\-]$/)) {
                this.isFinal = true;
                this.strOffset++;
              } else {
                this.isError = true;
              }
              return this;
            },
            isError: false,
            tag: "SINSYM",
            w: 1,
            type: "SINSYM"};                        
  }
}


var LatinRules = [WordRule, SpaceRule, SingleSymbolRule];

module.exports = LatinRules;
