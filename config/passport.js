var configAuth = require('./auth')

var LocalStrategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy

var User = require('../app/models/User')

module.exports = function(passport){


	// ******* START SERIALIZE/DESERIALIZE ******** // 
	// this takes the user.id and puts it into the session
	passport.serializeUser(function(user, done){
		// this 'done' function is an internal function of passport 
		// that takes the user.id and adds it to the req
		done(null, user.id)
	})

	// this takes the id from the session and brings us back the user
	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user)
		})
	})
	// ******* END SERIALIZE/DESERIALIZE ******** // 


	// ******* START FACEBOOK STRATEGY ******** // 
	passport.use('facebook', new FacebookStrategy({
		clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'displayName', 'photos', 'email']

	},
	// facebook sends back the token and the profile
	function(token, refreshToken, profile, done){
		process.nextTick(function(){
			User.findOne({'facebook.id': profile.id}, function(err, user){
				if(err){
					return done(err)
				}
				if(user){
					// we found the user, log them in
					return done(null, user)
				} else {
					// we haven't found the user, create them!
					console.log(profile)
					var newUser = new User()
					newUser.facebook.id = profile.id
					newUser.facebook.token = token
					newUser.facebook.name = profile.displayName
					newUser.facebook.email = profile.emails[0].value
					newUser.facebook.photo = profile.photos[0].value

					newUser.save(function(err){
						if(err){
							throw err
						}
						return done(null, newUser)
					})
				}
			})
		})
	}
	))
	// ******* END FACEBOOK STRATEGY ******** // 

	// ******* START LOCAL STRATEGY ******** // 
	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true 	// allows us to pass back the entire request to the callback
	},
	function(req, email, password, done){
		process.nextTick(function(){
			User.findOne({'local.email': email}, function(err, user){
				if(err){
					return done(err)
				}
				if(user){
					return done(null, false, req.flash('signupMessage', 'email already taken'))
				} else {
					var newUser = new User()
					newUser.local.email = email,
					newUser.local.password = newUser.generateHash(password)
					
					newUser.save(function(err){
						if(err){
							throw err
						}
						return done(null, newUser)
					})
				}

			})
		})
	}))

	passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));
	// ******* END LOCAL STRATEGY ******** // 
}






