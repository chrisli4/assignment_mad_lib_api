const models = require('./../models');
const User = models.User;

const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {

	passport.use(new LocalStrategy({
		usernameField: 'user[email]',
		passwordField: 'user[password]',
		passReqToCallback: true
	},
	function(req, username, password, done) {

		User.findOne({
			where: { email: username }
		})
			.then(user => {
				
				if(!user) {

					req.session.sessionFlash = {
						type: 'error',
						message: 'User Not Found!'
					};

					return done(null, false);
				}

				if(!user.verifyPassword(password)) {

					req.session.sessionFlash = {
						type: 'error',
						message: 'Incorrect Password!'
					};

					return done(null, false);
				}


				req.session.sessionFlash = {
					type: 'success',
					message: 'Welcome!'
				};

				return done(null, user);

			})
			.catch(e => {
				console.log(e.stack);
				return done(null, false);
			});
		}
	));

	return passport;

}