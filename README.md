# node_auth
This repo is an example of node auth with passport strategies. 

You'll need to run ```npm i``` to resolve the dependencies, and add an ```auth.js``` and ```database.js``` file in the config folder in this format:

```
module.exports = {
	'url': 'mongodb://<username>:<password>@jello.modulusmongo.net:27017/<mongodbID>'
}
```