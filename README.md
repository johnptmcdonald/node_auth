# node_auth
This repo is an example of node auth with passport strategies. 

You'll need to run ```npm i``` to resolve the dependencies, and add your supersecret keys in the ```auth.js``` and ```database.js``` file in the config folder.

##Reflections on setting up the project:
The User model is key to all of this, obv. So we set up the schema so that each user has sub-objects for local, facebook, twitter, etc.

Configuring the passport object is done in a very deliberate way in the server.js file. We first get hold of it by simply requiring it, then we pass it to the config/passport.js file for configuring, and then we pass it to the app/routes.js file to be used in the routes.

So, most of the magic really happens in config/passport.


##Reflections on local login and sign-up:
In the config/passport we require the LocalStrategy, and attach it to the passport object with the correct name (either 'local-signup' or 'local-login'). 

// Because we're using email instead of the default name, we have to tell passport that it should use the user's email as their name

We pass the request back into the callback so that we can add a flash to the request

Finally, we tell the app when to run these chunks of passport code in the routes using passport.authenticate('local-signup') or passport.authenticate('whatever_I_called_it_in_the_config') at thr appropriate routes, telling it where to go if successful of unsuccessful. 

##Reflections on facebook authentication:
We basically do the same thing as before, but with facebook. There are a couple of gotchas like this:

```
// if you want the user's email, you have to ask for it when you authenticate!

passport.authenticate('facebook', { scope : ['email'] })
```

and like this:
```
// when you config passport to use the facebook strategy, you have to add a profileFields section to get what you want

	passport.use('facebook', new FacebookStrategy({
		clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'displayName', 'photos', 'email']

	}, ... //then the actual function to do when facebook sends the good stuff back... 
```


It seems that once facebook authenticates a user, it automatically sends a user back to /auth/callback, you don't need to add this as the callback url when setting up your app with facebook.




