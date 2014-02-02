wordcut
=======

Thai word breaker for Node.js


Installation
------------

```
npm install wordcut
```


Usage
-----

```javascript
var wordcut = require("wordcut");
var fs = require("fs");

wordcut.init();
console.log(wordcut.cut("กากา"));
```
