
/**
 * Module dependencies.
 */

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

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
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

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/challenge/:id_number', routes.challenge.challenge);
app.post('/challenge/:id_number/submit', routes.challenge.submit);

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
