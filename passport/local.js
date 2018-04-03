'use strict';

const models = require('./../models');
const User = models.User;

const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		console.log(user.id);
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id).then(function(user) {
			console.log('deserializing user:', user);
			done(null, user);
		}).catch(function(err) {
			if (err) {
				throw err;
			}
		});
	});

	passport.use(new LocalStrategy({
		usernameField: 'user[email]',
		passwordField: 'user[password]',
		passReqToCallback: true
	},
	function(req, username, password, done) {

		console.log(`login user: ${ username }`);
		console.log(`login pass: ${ password }`);

		User.findOne({
			where: { email: username }
		})
			.then(user => {
				
				if(!user)
					return done(null, false, req.flash('error', 'no user found'));
				if(!user.verifyPassword(password))
					return done(null, false, req.flash('error', 'incorrect password'));

				return done(null, user, req.flash('success', 'welcome'));

			})
			.catch(e => {
				console.log(e.stack);
				return done(null, false);
			});
		}
	));

	return passport;

}