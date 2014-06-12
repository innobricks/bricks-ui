var process = require("child_process");
var fs = require("fs");
var calcVersion = require("./lib/calculate-version");
var execCmd = function (cmds, callback) {
    var execNext = function () {
        process.exec(cmds.shift(), function (error) {
            if (error) {
                console.warn(error);
            } else {
                if (cmds.length) {
                    execNext();
                } else {
                    if (callback)callback("command exec successfully ! published!");
                }
            }
        });
    }
    execNext();
}

var cmds = [
    "rm -rf ../publish_to_bower",
    "mkdir ../publish_to_bower",
    "cd ../publish_to_bower",
    "git init",
    "git remote add origin git@github.com:innobower/bricksui.git",
    "git fetch origin",
    "git reset --hard origin/master",
    "git checkout master"
].join("&&")
process.exec(cmds, function () {
    var file = "../publish_to_bower/bower.json";
    var content = fs.readFileSync(file, "utf-8");
    var json = JSON.parse(content);
    json.version = calcVersion();
    fs.writeFileSync(file, JSON.stringify(json, null, 4));

    process.exec("cp -r dist/bricks/* ../publish_to_bower", function () {
        process.exec("cd ../publish_to_bower", function () {
            var pushCmds = [
                "cd ../publish_to_bower",
                "git config user.email '294358991@qq.com'",
                "git config user.name 'enshjiang'",
                "git add -A",
                    "git commit -m 'Update for bricks-ui SHA: https://github.com/innoarch/bricks-ui/" + json.version + "'",
                "GIT_SSH=./bin/git_wrapper",
                "git push origin master"].join("&&");
            process.exec(pushCmds), function () {
                console.log("publish successfully!");
            };
        });
    });

});