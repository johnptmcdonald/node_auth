
module.exports = function(app, passport){
	

	app.get('/', function(req,res){
		if(req.user){
			res.redirect('profile')
		} else {
			res.render('index.ejs')
		}
		
	})

    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    app.post('/login', passport.authenticate('local-login', {
    	successRedirect: '/profile',
    	failureRedirect: '/login',
    	failureFlash: true    	
    }));

    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
    	successRedirect: '/profile',
    	failureRedirect: '/signup',
    	failureFlash: true
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });


    // FACEBOOK ROUTES 
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));


    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

}

// middleware to check if the user is logged in

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}

	res.redirect('/')
}






