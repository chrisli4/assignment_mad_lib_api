const express = require('express');
const app = express();
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const morgan = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

mongoose.connect(require('./config/mongo').url);

const exphbs = require('express-handlebars');
const hbs = exphbs.create({
	partialsDir: 'views/',
	defaultLayout: 'main'
});

require('./passport/local')(passport);
require('./passport/bearer')(passport);

app.use((req, res, next) => {
	['query', 'params', 'body'].forEach((key) => {
		if (req[key]) {
			const capKey = key[0].toUpperCase() + key.substr(1);
			const value = JSON.stringify(req[key], null, 2);
			console.log(`${ capKey }: ${ value }`);
		}
	});
	next();
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ 
	store: new MongoStore({ mongooseConnection: mongoose.connection}),
	secret: 'keyboard cat', 
	resave: true, 
	saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes/users')(app, passport);
app.use('/api/v1', require('./routes/madlibs'));


app.listen(4000, 'localhost', () => {
	console.log(`listening on port: 4000`);
});