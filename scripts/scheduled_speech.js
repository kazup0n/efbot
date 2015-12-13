var CronJob = require('cron').CronJob;
var Q = require('q');

var pushMessage = function(msg){
	var firebase = require('../lib/firebase.js');
	firebase(function(client){
		client.child('messages').push({message: msg, postedAt: Date.now()});
	});
};


var getScheduledMessages = function(){
	var getRows = require('../lib/spreadsheet');
	return getRows(2).then(function(rows){
		return rows.map(function(row){
			return {
				crontab: row.crontab,
				message: row.message,
				type: 'cron'
			};
		});
	});
};

module.exports = function(robot){
	var jobs = [];

	var updateScheduledMessages = function(){
		var defer = Q.defer();
		getScheduledMessages().done(function(messages){
			jobs.forEach(function(job){ job.stop(); delete job;});
			jobs = [];
			jobs = messages.map(function(msg){
				return new CronJob(msg.crontab, function(){
					robot.send({room: 'general'}, msg.message);
					pushMessage(msg.message);
				}, null, true, 'Asia/Tokyo');
			});
			defer.resolve();
		});
		return defer.promise;
	};

	robot.respond(/cron update/i, function(res){
		res.send("Just a moment plz, I'm checking messages");
		updateScheduledMessages().then(function(){
			res.send('Messages has been updated.');
		});
	});
};

