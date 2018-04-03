var WordPos = require("wordpos");
var wordpos = new WordPos();

const router = require('express').Router();
const passport = require('./../passport/bearer')(require('passport'));

router.get('/nouns', passport.authenticate('bearer', { session: false }), (req, res) => {

	const count = req.query.count || 5;

	wordpos.randNoun({ count })
			.then(nouns => {
				res.status(200).json(nouns)
			})
});

module.exports = router;