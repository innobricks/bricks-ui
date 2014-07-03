var fs = require('fs');
var util = require('util');
var path = require('path');
var pickFiles = require('broccoli-static-compiler');
var transpileES6 = require('broccoli-es6-module-transpiler');
var mergeTrees = require('broccoli-merge-trees');
var defeatureify = require('broccoli-defeatureify');
var concat = require('broccoli-concat');
var uglifyJavaScript = require('broccoli-uglify-js');
var writeFile = require('broccoli-file-creator');
var moveFile = require('broccoli-file-mover');
var removeFile = require('broccoli-file-remover');
var exportTree = require('broccoli-export-tree');
var jshintTree = require('broccoli-jshint');
var replace = require('broccoli-replace');
var templateCompiler = require('broccoli-ember-hbs-template-compiler');
var compileLess = require('broccoli-less-single');
var calculateVersion = require('./lib/calculate-version');
var path = require("path");
//relativePath is '/' ,compatible windows
path.sep = "/";
var env = process.env.BROCCOLI_ENV || 'test';
var disableJSHint = !!process.env.NO_JSHINT || false;
var disableDefeatureify = !!process.env.NO_DEFEATUREIFY || env === 'test' || false;


var vendorsOptions = require('./lib/vendors');
var VenderCompiler=require('./lib/vendorCompiler');
var compiledTree=new VenderCompiler(vendorsOptions,'./vendor').exec();



module.exports = mergeTrees([compiledTree]);
