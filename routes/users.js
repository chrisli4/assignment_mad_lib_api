const router = require('express').Router();
const models = require('./../models');
const User = models.User;

const { loggedInOnly, loggedOutOnly } = require('./../helpers/routes_helper');

const onShow = (req, res) => {
	res.render('users/show', { user: req.user, sessionFlash: res.locals.sessionFlash });
};

const onLogout = (req, res) => {
	req.session.destroy();
	req.method = 'GET';
	res.redirect('/login');
};

module.exports = function(passport) {

	router.get('/login', loggedOutOnly, (req, res) => {

			res.render('sessions/new', { sessionFlash: res.locals.sessionFlash });
	});

	router.get('/logout', loggedInOnly, onLogout);

	router.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}));

	router.get('/', loggedInOnly, onShow);
	router.get('/user', loggedInOnly, onShow);

	router.get('/user/new', loggedOutOnly, (req, res) => {
		res.render('users/new', { sessionFlash: res.locals.sessionFlash });
	});

	router.post('/user', loggedOutOnly, (req, res, next) => {

		const email = req.body.user.email.toLowerCase();
		const fname = req.body.user.fname,
			  fnameParsed = fname.charAt(0).toUpperCase() + fname.substring(1);

		const lname = req.body.user.lname,
			  lnameParsed = lname.charAt(0).toUpperCase() + lname.substring(1);

		const password = req.body.user.password;

		const passwordHash = User.generateHash(password);
		const token = User.generateToken(email);

		User.findOrCreate({

			where: {
				email: email
			},
			defaults: {
				fname: fnameParsed,
				lname: lnameParsed,
				email: email,
				password: passwordHash,
				token: token
			}
		})
		.then(([user, created]) => {

			if(created) {
				req.session.sessionFlash = {
					type: 'success',
					message: 'User created! You may now login.'
				};

				res.redirect('/login');
			} else {
				req.session.sessionFlash = {
					type: 'error',
					message: 'Username already taken, use another.'
				};

				res.redirect('/user/new');
			};
		})
		.catch(e => {
			if(e.errors) {
				Object.keys(e.errors).forEach((key) => {
					req.flash('error', `${ e.errors[key].message }`);
					res.redirect(req.session.backUrl);
				});
			} else {
				next(e);
			}
		})
	});

	return router;

}