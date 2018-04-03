const loggedInOnly = (req, res, next) => {
	return req.user ? next() : res.redirect('/login');
};

const loggedOutOnly = (req, res, next) => {
	return !req.user ? next() : res.redirect('/login');
}

module.exports = {
	loggedOutOnly,
	loggedInOnly
}