// app.js

// express ====================================================================
const express = require('express');
const app 	  = express();

// body parser ================================================================
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// mongoose ===================================================================
const mongoose = require('mongoose');
mongoose.connect(require('./config/mongo').url);

// sessions/cookies ===========================================================
const cookieParser = require('cookie-parser');
const session 	   = require('express-session');
const MongoStore   = require('connect-mongo')(session);

app.use(cookieParser());
app.use(session({ 
	store: new MongoStore({ mongooseConnection: mongoose.connection}),
	secret: 'keyboard cat', 
	resave: true, 
	saveUninitialized: true 
}));

// public =====================================================================
app.use(express.static(`${__dirname}/public`));

// logging ====================================================================
const morgan = require('morgan');
const morganToolkit = require('morgan-toolkit')(morgan);
app.use(morganToolkit());

// express-handlebars =========================================================
const exphbs = require('express-handlebars');
const helpers = require('./helpers');
const hbs = exphbs.create({
	helpers: helpers,
	partialsDir: 'views/',
	defaultLayout: 'main'
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// models
const models = require('./models');
const User   = models.User;

// passport ===================================================================
const passport = require('passport');
require('./passport/bearer')(passport);
require('./passport/local')(passport);

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id).then(function(user) {
		done(null, user);
	}).catch(function(err) {
		if (err) {
			throw err;
		}
	});
});

app.use(passport.initialize());
app.use(passport.session());

// flash messages =============================================================
const flash = require('connect-flash');
app.use(flash());

app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

// routes =====================================================================

const usersRouter = require('./routes/users')(passport);
const apiRouter   = require('./routes/madlibs')(passport);
const storyRouter = require('./routes/story');

app.use('/', usersRouter);
app.use('/api/v1', apiRouter);
app.use('/story', storyRouter);

// server =====================================================================
app.listen(4000, 'localhost', () => {
	console.log(`listening on port: 4000`);
});












