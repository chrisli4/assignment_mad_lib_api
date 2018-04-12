const router = require('express').Router();

const WordPos = require("wordpos");
const wordpos = new WordPos();
const Sentencer = require('sentencer');

let predefinedStory = [
"Mary had a little {{noun}}, little {{noun}}, little {{noun}}, Mary had a little {{noun}}, it`s fleece was {{adjective}} as snow.",
"Jack and Jill {{verb}} up the hill to {{verb}} a {{adverb}} of water, Jack fell {{adjective}}, {{verb}} his {{noun}} and Jill came tumbling {{adverb}}",
"Baa baa {{adjective}} sheep, {{verb}} you any {{noun}}? Yes sir, yes sir, three {{noun}} {{adjective}}.",
"Twinkle, twinkle, {{adjective}} star, how I {{verb}} what you are, up above the {{noun}} so {{adverb}}, like a {{adjective}} {{noun}} in the sky.",
"Humpty Dumpty {{verb}} on a {{noun}}, Humpty Dumpty had a {{adjective}} fall. All the {{noun}} men could not put Humpty together again."
];
let predefinedWords = ["huge", "thief", "quickly", "dog", "baby", "cry", "ran", "fast", "red"];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = function(passport) {

	router.get(
		'/nouns', 
		passport.authenticate('bearer', { session: false }), 
		(req, res) => {
			const count = req.query.count || 5;
			wordpos.randNoun({ count })
				   .then(nouns => {
					res.status(200).json(nouns);
				});
	});

	router.get(
		'/verbs', 
		passport.authenticate('bearer', { session: false }), 
		(req, res) => {
			const count = req.query.count || 5;
			wordpos.randVerb({ count })
				   .then(verbs => {
				   	res.status(200).json(verbs);
				   });
	});

	router.get(
		'/adverbs', 
		passport.authenticate('bearer', { session: false }), 
		(req, res) => {
			const count = req.query.count || 5;
			wordpos.randAdverb({ count })
				   .then(adverbs => {
					res.status(200).json(adverbs);
				});
	});

	router.get(
		'/adjectives', 
		passport.authenticate('bearer', { session: false }), 
		(req, res) => {
			const count = req.query.count || 5;
			wordpos.randAdjective({ count })
				   .then(adjectives => {
					res.status(200).json(adjectives);
				});
	});


router.post(
	"/newstory", 
	passport.authenticate("bearer", { session: false }),
	(req, res) => {

		if(req.body.words)
			words = req.body.words.split(" ");
		else
			words = predefinedWords;

		if(req.body.story)
			story = req.body.story;
		else
			story = predefinedStory[getRandomInt(0,4)];

		wordpos.getPOS(words)
				.then(obj => {

					let nouns = obj.nouns.length ? obj.nouns : ['boy'],
						adjectives = obj.adjectives.length ? obj.adjectives : ['big'],
						verbs = obj.verbs.length ? obj.verbs : ['run', 'jump'],
						adverbs = obj.adverbs.length ? obj.adverbs : ['accidentally', 'beautifully']

					Sentencer.configure({
						nounList: nouns,
						adjectiveList: adjectives,
						actions: {
							verb: function() {
								return verbs[getRandomInt(0,verbs.length - 1)];
							},
							adverb: function() {
								return adverbs[getRandomInt(0,adverbs.length - 1)];
							}
						}

					});

					res.status(200).json(Sentencer.make(story));

				});
	});	

	return router;
}







