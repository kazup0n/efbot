var GoogleSpreadsheet = require('google-spreadsheet');
var Q = require('q');
var sheet = new GoogleSpreadsheet(process.env.SLIDES_SPREADSHEET);
var creds = JSON.parse(process.env.GOOGLE_AUTH_SECRET);


module.exports = function(slideIndex){
	return Q.ninvoke(sheet, 'useServiceAccountAuth', creds)
	.then(function(err){ return Q.ninvoke(sheet, 'getRows', slideIndex)});
};
