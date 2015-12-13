//  Description:
//	  Updates slide pages from Google spread sheet and push them to firebase.
//  Dependencies:
// 	 "firebase": "^2.3.1"
// 	 "firebase-token-generator": "^2.0.0"
// 	 "google-spreadsheet": "^1.0.1"
// 	 "q": "^1.4.1"
//  Configuration:
//  	GOOGLE_AUTH_SECRET private sercret of google api's service account
//  	SLIDES_SPREADSHEET id of spreadsheet
//  Commands:
//  	hubot slides update - Get slides from google spreadsheets and post them to firebase
//  Author:
//   kazup0n(https://github.com/kazup0n)
//
var Q = require('q');

var getSlides = function(){
	var getRows = require('../lib/spreadsheet');
	return getRows(1).then(function(rows){
		return rows.map(function(row){
			return {
				title: row.title,
				body: row.body,
				issuedAt: row.issuedat,
				expiredAt: row.expiredat
			};
		});
	});
};

var postSlides = function(slides){
	var firebase = require('../lib/firebase.js');
	var defer = Q.defer();
	firebase(function(client){
		client.child('slides').remove(function(){
			slides.forEach(function(slide){
				client.child('slides').push(slide);
			});
			defer.resolve();
		});
	});
	return defer.promise;
};

module.exports = function(robot){
	robot.respond(/slides update/i, function(res){
		res.send("Just a moment plz, I'm checking slides");
		getSlides().then(function(slides){
			res.send('well, I got ' + slides.length + ' slides.');
			return postSlides(slides);
		}).done(function(){
			res.send("ok, update done.");
		});
	});
};


