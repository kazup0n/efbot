module.exports = function(robot) {
    robot.hear(/Computer!/, function(msg) {
        msg.reply("Why hello there! (ticker tape, ticker tape)");
    });
};
