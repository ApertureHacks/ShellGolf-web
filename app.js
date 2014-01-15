var express = require('express')
  , path = require('path')
  , flash = require('connect-flash')
  , http = require('http');

var config = require('./config')
  , db = require('./lib/db')
  , passport = require('./lib/passport')
  , logger = require('./lib/logger')
  , requireLogin =  require('./lib/helpers').requireLogin
  , requireAdmin =  require('./lib/helpers').requireAdmin
  , requireAuthor = require('./lib/helpers').requireAuthor
  , routes = require('./routes');

var app = express();

// Configure app
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Define middleware
app.use(express.favicon(path.join(__dirname, 'public/favicon.ico')));
app.use(express.logger(logger.dev));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.session({ secret: config.session_secret }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(app.router);

// development only middleware
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

// values we want in every template
app.locals({ title: config.title || 'Shell Golf' });

app.use(function(req, res, next) {
  res.locals({ user: req.user
             , warnings: req.flash('warnings')
             , errors: req.flash('errors') });
  next();
});

app.get('/', routes.index);

// challenge routes
app.get('/challenge/:id_number', routes.challenge.challenge);
app.post('/challenge/:id_number/submit', routes.challenge.submit);

// passport auth routes
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { successRedirect: '/',
                                       failureRedirect: '/' }));
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
