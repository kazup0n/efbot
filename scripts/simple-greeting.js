// Description
// 魔法の言葉でポポポポーン
module.exports = function(robot) {
    robot.hear(/おはよう/, function(msg) {
        msg.reply("やっほー。");
    });
};
