const router = require('express').Router();
const request = require('request');
const { loggedInOnly, loggedOutOnly } = require('./../helpers/routes_helper');


router.get('/', loggedInOnly, (req, res) => {
	res.render('story', { user: req.user });
});

router.post('/', loggedInOnly, (req, res) => {
	let input = {
		nouns: req.cookies.nouns || [],
		adjectives: req.cookies.adjectives || [],
		adverbs: req.cookies.adverbs || [],
		verbs: req.cookies.verbs || []
	}
	
	const story = req.body.user.story;
	const words = req.body.user.words.split(', ').join(' ');

	request.post(
		{
			url: `http://localhost:4000/api/v1/newstory?access_token=${ req.user.token }`,
			form: {
				words: words,
				story: story
			}
		},
		(err, response, body) => {
			const story = JSON.parse(body);
			res.render('story', { story, input });
		})
});


router.get('/nouns', loggedInOnly, (req, res) => {
	request.get(`http://localhost:4000/api/v1/nouns?access_token=${ req.user.token }`,
		(err, response, body) => {
			const nouns = JSON.parse(body);

			let input = {
				nouns: nouns,
				adjectives: req.cookies.adjectives || [],
				adverbs: req.cookies.adverbs || [],
				verbs: req.cookies.verbs || []
			}

			res.cookie('nouns', nouns);
			res.render('story', { input });
		});
});

router.get('/adjectives', loggedInOnly, (req, res) => {
	request.get(`http://localhost:4000/api/v1/adjectives?access_token=${ req.user.token }`,
		(err, response, body) => {
			const adjectives = JSON.parse(body);

			let input = {
				nouns: req.cookies.nouns || [],
				adjectives: adjectives,
				adverbs: req.cookies.adverbs || [],
				verbs: req.cookies.verbs || []
			}

			res.cookie('adjectives', adjectives);
			res.render('story', { input });
		});
});

router.get('/adverbs', loggedInOnly, (req, res) => {
	request.get(`http://localhost:4000/api/v1/adverbs?access_token=${ req.user.token }`,
		(err, response, body) => {
			const adverbs = JSON.parse(body);

			let input = {
				nouns: req.cookies.nouns || [],
				adjectives: req.cookies.adjectives || [],
				adverbs: adverbs,
				verbs: req.cookies.verbs || []
			}

			res.cookie('adverbs', adverbs);
			res.render('story', { input });
		});
});

router.get('/verbs', loggedInOnly, (req, res) => {
	request.get(`http://localhost:4000/api/v1/verbs?access_token=${ req.user.token }`,
		(err, response, body) => {
			const verbs = JSON.parse(body);

			let input = {
				nouns: req.cookies.nouns || [],
				adjectives: req.cookies.adjectives || [],
				adverbs: req.cookies.adverbs || [],
				verbs: verbs
			}

			res.cookie('verbs', verbs);
			res.render('story', { input });
		});
});






module.exports = router;

