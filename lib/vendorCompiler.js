var path = require('path');
var concat = require('broccoli-concat');
var replace = require('broccoli-replace');
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');
var flatten = require('broccoli-flatten');


function Complier(options, vendorPath) {
  this.options = options.vendors;
  this.config = options.config;
  this.styleTree = [];
  this.scriptTree = [];
  this.vendorTree = [];
  this.vendorPath = vendorPath;
  this.reified = {};
}


Complier.prototype.reify = function (key) {
  var dep, basePath, options = this.options[key], deps;

  if (this.reified.hasOwnProperty(key)) return;

  if (!options) {
    throw new Error("Could not find module " + JSON.stringify(key)
    );
  }

  deps = options.dependencies;

  basePath = options.basePath || key;

  if (Array.isArray(deps)) {
    for (var i = 0, l = deps.length; i < l; i++) {
      dep = deps[i];
      this.reify(dep);
    }
  }
  this.processResource(key, basePath, options);
  this.reified[key] = true;


};

Complier.prototype.parseOptions = function () {
  var config = this.config, compiler = this;
  if (Array.isArray(config.exclusion)) {
    config.exclusion.forEach(function (item) {
      if (compiler.options[item]) {
        compiler.options[item].exclude = true;
      }
    });
  }
};


Complier.prototype.exec = function () {
  var key, vendors = this.options;

  this.parseOptions();

  for (key in vendors) {
    if (vendors[key].exclude) continue;
    this.reify(key);
  }
  console.log(this.scriptTree);
  return mergeTrees([this.processScript(), this.processStyle() , this.processVendor()]);
};


Complier.prototype.processResource = function (key, basePath, options) {
  var opc;
  if (Array.isArray(options.scripts)) {
    opc = options.scripts.slice().map(function (item) {
      return path.join(basePath, item);
    });
    this.scriptTree.push({vendor: key, path: opc});
  }

  if (Array.isArray(options.styles)) {
    opc = options.styles.slice().map(function (item) {
      return path.join(basePath, item);
    });
    this.styleTree.push({vendor: key, path: opc});
  }

  if (Array.isArray(options.vendor)) {
    opc = options.vendor.slice().map(function (item) {
      return path.join(basePath, item);
    });
    this.vendorTree.push({vendor: key, path: opc});
  }
};


Complier.prototype.processScript = function () {
  var scriptPath = this.scriptTree.map(function (item) {
    return item.path;
  }).reduce(function (pre, curr) {
    return pre.concat(curr);
  });

  return concat(this.vendorPath, {
    inputFiles: scriptPath,
    outputFile: '/bricks/all.js',
    separator: '\n'
  });
};

Complier.prototype.processStyle = function () {
  var compiler = this, resultTree;
  resultTree = this.styleTree.map(function (item) {
    var styleTree = pickFiles(compiler.vendorPath, {
      srcDir: '/',
      files: item.path,
      destDir: 'assets/' + item.vendor
    });

    return replace(styleTree, {
      files: ['**/*.css'],
      patterns: [
        {
          match: /url\((.*?)\)/img,
          replacement: function (fullMatch, group) {
            group = group.replace(/['"]/img, '');
            return "url(\"assets/" + item.vendor + '/' + path.basename(group) + "\")";
          }
        }
      ]
    });
  });

  resultTree = concat(mergeTrees(resultTree), {
    inputFiles: ['**/*.css'],
    outputFile: '/bricks/all.css',
    separator: '\n'
  });

  return resultTree;
};


Complier.prototype.processVendor = function () {
  var compiler = this;
  return mergeTrees(this.vendorTree.map(function (item) {
    var vendorTree = pickFiles(compiler.vendorPath, {
      srcDir: '/',
      files: item.path,
      destDir: 'assets/' + item.vendor
    });
    return flatten(vendorTree, {destDir: 'bricks/assets/' + item.vendor});
  }));
};

module.exports = Complier;
