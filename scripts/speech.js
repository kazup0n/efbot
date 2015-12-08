var pushMessage = function(msg){
	var firebase = require('../lib/firebase.js');
	firebase(function(client){
		client.child('messages').push({message: msg, postedAt: Date.now()});
	});
};

module.exports = function(robot){
	robot.respond(/speech (.*)$/i, function(res){
		pushMessage(res.match[1]);
	});

	if(!robot || !robot.adapter || !robot.adapter.client){
		return;
	}
	robot.adapter.client.on('raw_message', function(msg){

		if(msg.type !== 'message' || messge.subtype !== 'bot_message' || msg.user_name === 'efbot'){
			return;
		}

		if(!msg.attachements){
			return;
		}

		var match = msg.attachements[0].fallback.match(/speech (.*)$/i);

		if(!match){
			return;
		}

		pushMessage(match[1]);

	});

};
