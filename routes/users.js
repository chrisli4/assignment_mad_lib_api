module.exports = function(app, passport) {

	const models = require('./../models');
	const User = models.User;

	const {
		loggedOutOnly,
		loggedInOnly
	} = require('./../helpers/session');

	const onShow = (req, res) => {
		res.render('users/show', { user: req.user });
	};

	const onLogout = (req, res) => {
		req.session.destroy();
		req.method = 'GET';
		res.redirect('/login');
	};

	app.get('/login', loggedOutOnly, (req, res) => {

		res.render('sessions/new', { messages: req.flash() });
	});

	app.get('/logout', loggedInOnly, onLogout);

	app.post('/sessions', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.get('/', loggedInOnly, onShow);
	app.get('/user', loggedInOnly, onShow);

	app.get('/users/new', loggedOutOnly, (req, res) => {
		res.render('users/new');
	});

	app.post('/users', loggedOutOnly, (req, res, next) => {

		const passwordHash = User.generateHash(req.body.user.password);
		const token = User.generateToken(req.body.user.email);

		console.log(token);

		User.create({
			fname: req.body.user.fname,
			lname: req.body.user.lname,
			email: req.body.user.email,
			password: passwordHash,
			token: token
		})
			.then(user => {
				req.flash('info', 'User created! You may now login.');
				res.redirect('/');
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

	return app;

}