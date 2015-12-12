var GoogleSpreadsheet = require('google-spreadsheet');
var Q = require('q');
var sheet = new GoogleSpreadsheet(process.env.SLIDES_SPREADSHEET);
var creds = JSON.parse(unescape(process.env.GOOGLE_AUTH_SECRET));
var getSlides = function(){
	return Q.ninvoke(sheet, 'useServiceAccountAuth', creds)
	.then(function(err){ return Q.ninvoke(sheet, 'getRows', 1)})
	.then(function(rows){
		return rows.map(function(row){
			return {
				title: row.title,
				body: row.body,
				issuedAt: row.issuedat,
				expiredAt: row.expiredat
			};
		});});
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


