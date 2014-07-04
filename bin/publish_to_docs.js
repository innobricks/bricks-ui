var process = require("child_process");
var fs = require("fs");
var calcVersion = require("../lib/calculate-version");
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
    "rm -rf publish_to_docs",
    "mkdir publish_to_docs",
    "cd publish_to_docs",
    "git init",
    "git remote add origin git@github.com:inno-bricks/inno-bricks.github.io.git",
    "git fetch origin",
    "git reset --hard origin/master",
    "git checkout master",
    "rm -rf docs/*",
    "cp -r ../docs/* docs"
].join("&&");

process.exec(cmds, function () {
    var pushCmds = [
        "cd publish_to_docs",
        "git config user.email '503335889@qq.com'",
        "git config user.name 'inno-bricks'",
        "git add -A",
        "git commit -m 'update'",
        "git push origin master"].join("&&");
    process.exec(pushCmds, function (err, out) {
        console.warn(err);
        console.log(out);
        console.log("publish successfully!");
        process.exec("rm -rf publish_to_docs");
    });
});
