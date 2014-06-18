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
    "rm -rf ../publish_to_build",
    "mkdir ../publish_to_build",
    "cd ../publish_to_build",
    "git init",
    "git remote add origin git@github.com:inno-bricks/inno-bricks.github.io.git",
    "git fetch origin",
    "git reset --hard origin/master",
    "git checkout master",
    "rm -rf docs/*"
].join("&&")
process.exec(cmds, function () {
    process.exec("cp -r docs/* ../publish_to_build/docs", function () {
        process.exec("cd ../publish_to_build", function (err,out) {
            console.log(err);
            console.log(out);
            var pushCmds = [
                "cd ../publish_to_build",
                "git config user.email '294358991@qq.com'",
                "git config user.name 'inno-bricks'",
                "git add -A",
                "git commit -m 'Update for bricksui-docs SHA: https://github.com/inno-bricks/inno-bricks.github.io",
                "GIT_SSH=./bin/git_wrapper",
                "git push origin master"].join("&&");
            process.exec(pushCmds), function (err,out) {
                console.log(err);
                console.log(out);
                console.log("publish successfully!");
            };
        });
    });

});