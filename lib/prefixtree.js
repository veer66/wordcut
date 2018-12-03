exports.createPrefixTree = (word_payloads) => {
  let tab = {}

  if (word_payloads) {
    
    word_payloads.forEach(([word, payload], i, arr) => {
      let row_no = 0
      for(let j = 0; j < word.length; j++) {
	const ch = word[j]
	const key = [row_no, j, ch]
	const child = tab[key]
	
	if (child) {
          const child_id = child[0]
          row_no = child_id           
	} else {
          const final = j + 1 == word.length 
          tab[key] = [i, final, (final ? payload : null)]
          row_no = i                
	}
      }      
    })
  }

  return {
    tab: tab,
    lookup(node_id, offset, ch) { 
      const child = this.tab[[node_id, offset, ch]]
      return child ? child : null
    }
  }
}
