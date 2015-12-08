var initialized = false;
var Firebase = require('firebase');
var FirebaseTokenGenerator = require('firebase-token-generator');
var generator = new FirebaseTokenGenerator(process.env.FIREBASE_SECRET);
var token = generator.createToken({uid: "hubot"});
var client = new Firebase('https://fboard.firebaseio.com/');


module.exports = function(cb){

	if(!initialized){
		client.authWithCustomToken(token, function(err, authData){
			if(!err){
				initialized = true;
				cb(client);
			}
		});
	}else{
		cb(client);
	}
};
