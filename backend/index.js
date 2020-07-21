// Define our dependencies
var express        = require('express');
var session        = require('express-session');
var passport       = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var request        = require('request');
var handlebars     = require('handlebars');
var cors           = require('cors');
var url            = require('url');
var axios          = require('axios');

var datafile       = require('../data');

// Define our constants, you will change these with your own
const TWITCH_CLIENT_ID = datafile.TWITCHCLIENTID;
const TWITCH_SECRET    = datafile.TWITCHSECRET;
const SESSION_SECRET   = datafile.SESSIONSECRET;
const CALLBACK_URL     = 'https://apps.robertandrei.tk/be';

// Initialize Express and middlewares
var app = express();
app.use(session({secret: SESSION_SECRET, resave: false, saveUninitialized: false}));
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());
app.options('*', cors());
app.use(cors())

let user;

// Override passport profile function to get user profile from Twitch API
OAuth2Strategy.prototype.userProfile = function(accessToken, done) {
  var options = {
    url: 'https://api.twitch.tv/helix/users',
    method: 'GET',
    headers: {
      'Client-ID': TWITCH_CLIENT_ID,
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Authorization': 'Bearer ' + accessToken
    }
  };

  request(options, function (error, response, body) {
    if (response && response.statusCode == 200) {
      done(null, JSON.parse(body));
    } else {
      done(JSON.parse(body));
    }
  });
}

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use('twitch', new OAuth2Strategy({
    authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
    tokenURL: 'https://id.twitch.tv/oauth2/token',
    clientID: TWITCH_CLIENT_ID,
    clientSecret: TWITCH_SECRET,
    callbackURL: CALLBACK_URL,
    state: true
  },
  function(accessToken, refreshToken, profile, done) {
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    done(null, profile);
  }
));

// Set route to start OAuth link, this is where you define scopes to request
app.get('/be/auth/twitch', passport.authenticate('twitch', { scope: 'channel:read:redemptions' }));

// Set route for OAuth redirect
app.get('/be/auth/twitch/callback', passport.authenticate('twitch', { successRedirect: '/', failureRedirect: '/' }));

app.get('/be/user/logedin', function (req, res) {
    if(user)  
      res.send(true);
    else
      res.send(false);
});

app.get('/be/user', function (req, res) {
    res.send(user);
});

// If user has an authenticated session, display it, otherwise display link to authenticate
app.get('/be', function (req, res) {
  let qry = url.parse(req.url,true).query;
  if(qry.code){
    console.log(qry.code);
    axios.post(`https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_SECRET}&code=${qry.code}&grant_type=authorization_code&redirect_uri=${CALLBACK_URL}`)
          .then((reply) => {
            res.cookie('auth_token' , reply);
            res.redirect('https://apps.robertandrei.tk');
          })
          .catch(err => console.log(err));
  }
});

app.listen(3001, function () {
  console.log('Twitch auth sample listening on port 3001!')
});