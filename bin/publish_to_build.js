var fs = require("fs");
var path = require("path");
//TODO will change
var upyun = require("node-upyun-sdk");
var EasyZip = require('easy-zip').EasyZip;
var RSVP = require("rsvp");
var chalk = require("chalk");
var date = new Date().toISOString().replace(/-/g, '').replace();

/**
 * Step:
 * 1.export env
 *  1. BUCKET_NAME
 *  2. ACCESS_KEY
 *  3. ACCESS_KEY_SECRET
 * 2.zip
 * 3.upload
 * @param options
 * @constructor
 */
function Publisher(options) {
    options = options || {};

    if (!options["EXT_NAME"]) {
        options["EXT_NAME"] = "zip";
    }

    this.setOption(options, "BUCKET_NAME");
    this.setOption(options, "TRAVIS_BRANCH", "CURRENT_BRANCH");
    this.setOption(options, "TRAVIS_TAG", "TAG");
    this.setOption(options, "TRAVIS_COMMIT", "CURRENT_REVISION");
    this.setOption(options, "ACCESS_KEY");
    this.setOption(options, "ACCESS_KEY_SECRET");
    this.setOption(options, "EXT_NAME")

    if (!options.project) {
        throw new Error("You must specify a project config to use");
    }
    this.project = options.project;

    if (!this.BUCKET_NAME || !this.ACCESS_KEY || !this.ACCESS_KEY_SECRET) {
        throw new Error("No creadentials exist");
    }
    this.service = upyun(this.BUCKET_NAME, this.ACCESS_KEY, this.ACCESS_KEY_SECRET);
}
Publisher.prototype.setOption = function (options, defaultPropName, setPropName) {
    if (!setPropName) {
        setPropName = defaultPropName;
    }

    if (options.hasOwnProperty(setPropName)) {
        this[setPropName] = options[setPropName];
    } else {
        this[setPropName] = process.env[setPropName];
    }
}

Publisher.prototype.currentBranch = function () {
    return {
        "master": "canary",
        "beta": "beta",
        "stable": "release",
        "release": "release"
    }[this.CURRENT_BRANCH] || process.env.BUILD_TYPE;
}

var calcVersion = require("../lib/calculate-version");

Publisher.prototype.compress = function () {
    return new RSVP.Promise(function (resolve, reject) {
        var zip = new EasyZip();
        var zipName = [publisher.project, calcVersion(), publisher.EXT_NAME];
        zipName = zipName.join(".");
        var filePath="dist/"+zipName;
        zip.zipFolder("dist/bricksui", function (err) {
            if (err) {
                reject(err);
            }
            if(!fs.existsSync(filePath)) {
                throw new Error("FilePath: '" + filePath + "' doesn't exist!");
            }
            zip.writeToFile(filePath, function (err) {
                err ? reject(err) : resolve(zipName)
            });
        });
    });
}

Publisher.prototype.publish = function () {
    var publisher = this;
    this.compress().then(function (zipName) {
        publisher.service.upload("/builds/" + zipName, "dist/" + zipName);
    }, function (reason) {
        console.log(chalk.red(reason));
    });
}
var publisher = new Publisher({
    project: "bricksui"
});
publisher.publish();

