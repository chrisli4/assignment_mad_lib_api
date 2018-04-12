const models = require('./../models');
const User = models.User;

const BearerStrategy = require('passport-http-bearer').Strategy;

module.exports = function(passport) {

	passport.use(new BearerStrategy((token, done) => {

		User.findOne({
			where: { token: token }
		})
			.then(user => {
				return done(null, user || false);
			})
			.catch(e => {
				console.log(e.stack);
				done(null, false);
			});
	}));

	return passport;
};