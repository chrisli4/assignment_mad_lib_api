const WordPOS = require('wordpos');
const wordpos = new WordPOS();



wordpos.randNoun({count: 5})
		.then(obj => {
			console.log(obj);
		})
		.catch(e => {
			console.log(e.stack);
		});