var path = require("path");
var TextMessage = require('hubot/src/message').TextMessage;
var Robot = require('hubot/src/robot');

describe("Eddie the shipboard computer", function() {
    var robot;
    var user;
    var adapter;

	beforeEach(function(done){
		// create new robot, without http, using the mock adapter
		robot = new Robot(null, "mock-adapter", false, "Eddie");

		require('../scripts/simple-greeting')(robot);

		robot.adapter.on("connected", function() {
			// create a user
			user = robot.brain.userForId("1", {
				name: "jasmine",
				room: "#jasmine"
			});

			adapter = robot.adapter;
			done();
		});

		robot.run();
	});


   afterEach(function() {
        robot.shutdown();
    });
    
	it("responds when greeted", function(done) {
        // here's where the magic happens!
        adapter.on("reply", function(envelope, strings) {
            expect(strings[0]).toMatch("Why hello there");
            
            done();
        });
        
        adapter.receive(new TextMessage(user, "Computer!"));
    });
});
