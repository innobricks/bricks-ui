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


function defeatureifyConfig(options) {
  var stripDebug = false;
  var options = options || {};
  var configJson = JSON.parse(fs.readFileSync("features.json").toString());

  if (configJson.hasOwnProperty('stripDebug')) {
    stripDebug = configJson.stripDebug;
  }
  if (options.hasOwnProperty('stripDebug')) {
    stripDebug = options.stripDebug;
  }

  return {
    enabled: options.features || configJson.features,
    debugStatements: options.debugStatements || configJson.debugStatements,
    namespace: options.namespace || configJson.namespace,
    enableStripDebug: stripDebug
  };
}

function vendoredPackage(packageName) {
  var libTree = pickFiles('packages/' + packageName + '/lib', {
    files: ['main.js'],
    srcDir: '/',
    destDir: '/' + packageName
  });

  return  moveFile(libTree, {
    srcFile: packageName + '/main.js',
    destFile: '/' + packageName + '.js'
  });
};

function concatES6(sourceTrees, options) {
  var loader = vendoredPackages['loader'];
  var inputFiles = options.inputFiles;
  var destFile = options.destFile;

  if (util.isArray(sourceTrees)) {
    sourceTrees = mergeTrees(sourceTrees, {overwrite: true});
  }

  sourceTrees = transpileES6(sourceTrees, {
    moduleName: true
  });

  if (!disableDefeatureify) {
    sourceTrees = defeatureify(sourceTrees, defeatureifyConfig(options.defeatureifyOptions));
  }
  //TODO 暂时将模板拼接在源码文件后面
  var concatTrees = [loader, 'generators', iifeStart, iifeStop, sourceTrees, templates];
  if (options.includeLoader === true) {
    inputFiles.unshift('loader.js');
  }

  if (options.bootstrapModule) {
    var bootstrapTree = writeFile('bootstrap', 'requireModule("' + options.bootstrapModule + '");\n');
    concatTrees.push(bootstrapTree);
    inputFiles.push('bootstrap');
  }

  // do not modify inputFiles after here (otherwise IIFE will be messed up)
  if (options.wrapInIIFE !== false) {
    inputFiles.unshift('iife-start');
    inputFiles.push('iife-stop');
  }

  if (options.includeLicense !== false) {
    inputFiles.unshift('license.js');
  }

  if (options.vendorTrees) {
    concatTrees.push(options.vendorTrees);
  }

  return concat(mergeTrees(concatTrees), {
    wrapInEval: options.wrapInEval,
    inputFiles: inputFiles,
    outputFile: destFile
  });
}

var yuidocCompiler = require('broccoli-yuidoc');

var yuidocTree = yuidocCompiler('./packages/', {
  srcDir: '/',
  destDir: 'docs',
  yuidoc: {
    // .. yuidoc option overrides
    exclude: "assets",
    paths: [
      "packages/bricksui/lib",
      "packages/bricksui-metal/lib",
      "packages/bricksui-form/lib",
      "packages/bricksui-i18n/lib",
      "packages/bricksui-thirdpart/lib"
    ],
    "themedir": "vendor/yuidoc-theme-blue"
  }
});


var testConfig = pickFiles('tests', {
  srcDir: '/',
  files: ['**/*.*'],
  destDir: '/tests'
});

testConfig = replace(testConfig, {
  files: [ 'tests/ember_configuration.js' ],
  patterns: [
    { match: /\{\{FEATURES\}\}/g, replacement: JSON.stringify(defeatureifyConfig().enabled) }
  ]
});

var bowerFiles = [
  pickFiles('vendor/qunit/qunit', {
    srcDir: '/',
    destDir: '/qunit'
  }),

  pickFiles('vendor/jquery', {
    files: ['jquery.js'],
    srcDir: '/',
    destDir: '/jquery'
  }),
  pickFiles('vendor/ember', {
    files: ['ember.js'],
    srcDir: '/',
    destDir: '/ember'
  }),

  pickFiles('vendor/handlebars', {
    files: ['handlebars.js'],
    srcDir: '/',
    destDir: '/handlebars'
  }),
];

bowerFiles = mergeTrees(bowerFiles);

var iifeStart = writeFile('iife-start', '(function() {');
var iifeStop = writeFile('iife-stop', '})();');

var vendoredPackages = {
  'loader': vendoredPackage('loader')
};


var packages = require('./lib/packages');

//precompile template *.hbs *.handlebars
var sourceTree = pickFiles("packages", {
  srcDir: "/",
  files: ["**/*.hbs"],
  destDir: '/'
});
var templates = pickFiles(sourceTree, {
  srcDir: "/",
  destDir: '/templates'
})
templates = templateCompiler(templates);

function es6Package(packageName) {
  var pkg = packages[packageName],
    libTree;

  if (pkg['trees']) {
    return pkg['trees'];
  }

  var dependencyTrees = packageDependencyTree(packageName);
  var vendorTrees = packages[packageName].vendorTrees;

  libTree = pickFiles('packages/' + packageName + '/lib', {
    srcDir: '/',
    destDir: packageName
  });


  libTree = moveFile(libTree, {
    srcFile: packageName + '/main.js',
    destFile: packageName + '.js'
  });

  //libTree = mergeTrees([libTree, templateCompilerTree]);
  //libTree = inlineTemplatePrecompiler(libTree);
  /*libTree = removeFile(libTree, {
   srcFile: 'ember-template-compiler.js'
   });
   */
  var libJSHintTree = jshintTree(libTree, {
    destFile: '/' + packageName + '/tests/lib-jshint.js'
  });

  var testTree = pickFiles('packages/' + packageName + '/tests', {
    srcDir: '/',
    destDir: '/' + packageName + '/tests'
  });

  var testJSHintTree = jshintTree(testTree, {
    destFile: '/' + packageName + '/tests/tests-jshint.js'
  });

  var testTrees;
  if (disableJSHint) {
    testTrees = testTree;
  } else {
    testTrees = mergeTrees([testTree, libJSHintTree, testJSHintTree]);
  }

  var compiledLib = concatES6([dependencyTrees, libTree], {
    includeLoader: true,
    vendorTrees: vendorTrees,
    inputFiles: [packageName + '/**/*.js', packageName + '.js'],
    destFile: '/packages/' + packageName + '.js'
  })
  var compiledTrees = [compiledLib];

  var compiledTest = concatES6(testTrees, {
    includeLoader: false,
    inputFiles: ['**/*.js'],
    destFile: '/packages/' + packageName + '-tests.js'
  })
  if (!pkg.skipTests) {
    compiledTrees.push(compiledTest);
  }

  compiledTrees = mergeTrees(compiledTrees);

  pkg['trees'] = {lib: libTree, compiledTree: compiledTrees, vendorTrees: vendorTrees};
  if (!pkg.skipTests) {
    pkg['trees'].tests = testTrees;
  }

  return pkg.trees;
}

function packageDependencyTree(packageName) {
  var dependencyTrees = packages[packageName]['dependencyTrees'];

  if (dependencyTrees) {
    return dependencyTrees;
  } else {
    dependencyTrees = [];
  }

  var requiredDependencies = packages[packageName]['requirements'] || [];
  var vendoredDependencies = packages[packageName]['vendorRequirements'] || [];
  var libTrees = [];
  var vendorTrees = [];

  vendoredDependencies.forEach(function (dependency) {
    vendorTrees.push(vendoredPackages[dependency]);
  });

  requiredDependencies.forEach(function (dependency) {
    libTrees.concat(packageDependencyTree(dependency));
    libTrees.push(es6Package(dependency).lib);
  }, this);

  packages[packageName]['vendorTrees'] = mergeTrees(vendorTrees, {overwrite: true});
  return packages[packageName]['dependencyTrees'] = mergeTrees(libTrees, {overwrite: true});
}

var vendorTrees = [];
var sourceTrees = [];
var testTrees = [];
var compiledPackageTrees = [];

for (var packageName in packages) {
  es6Package(packageName);
  var currentPackage = packages[packageName];
  var packagesTrees = currentPackage['trees'];

  if (currentPackage['vendorRequirements']) {
    currentPackage['vendorRequirements'].forEach(function (dependency) {
      vendorTrees.push(vendoredPackages[dependency]);
    });
  }

  if (packagesTrees.lib) {
    sourceTrees.push(packagesTrees.lib);
  }

  if (packagesTrees.compiledTree) {
    compiledPackageTrees.push(packagesTrees.compiledTree);
  }

  if (packagesTrees.tests) {
    testTrees.push(packagesTrees.tests);
  }
}

compiledPackageTrees = mergeTrees(compiledPackageTrees);
vendorTrees = mergeTrees(vendorTrees);
sourceTrees = mergeTrees(sourceTrees);
testTrees = mergeTrees(testTrees);


var compiledSource = concatES6(sourceTrees, {
  includeLoader: true,
  bootstrapModule: 'bricksui',
  vendorTrees: vendorTrees,
  inputFiles: ['**/*.js'],
  destFile: '/bricksui.js'
});
var debugSource = concatES6(sourceTrees, {
  includeLoader: true,
  bootstrapModule: 'bricksui',
  vendorTrees: vendorTrees,
  inputFiles: ['**/*.js'],
  destFile: '/bricksui-debug.js'
});
// debug 版本
var prodCompiledSource = removeFile(debugSource, {
  srcFile: 'bricksui-debug.js',
});

prodCompiledSource = concatES6(prodCompiledSource, {
  includeLoader: true,
  bootstrapModule: 'bricksui',
  vendorTrees: vendorTrees,
  inputFiles: ['**/*.js'],
  destFile: '/bricksui.prod.js',
  defeatureifyOptions: {stripDebug: true}
});

var minCompiledSource = moveFile(prodCompiledSource, {
  srcFile: 'bricksui.prod.js',
  destFile: 'bricksui.min.js',
});
minCompiledSource = uglifyJavaScript(minCompiledSource);
//单元测试
var compiledTests = concatES6(testTrees, {
  includeLoader: true,
  inputFiles: ['**/*.js'],
  destFile: '/bricksui-tests.js'
});


var distTrees = [templates, compiledSource, compiledTests, testConfig, bowerFiles];

if (env !== 'test') {
  distTrees.push(prodCompiledSource);
  distTrees.push(minCompiledSource);
  //distTrees.push(compiledPackageTrees);
}

distTrees = mergeTrees(distTrees);

var vendorsOptions = require('./lib/vendors');
var VenderCompiler=require('./lib/vendorCompiler');
var compiledTree=new VenderCompiler(vendorsOptions,'./vendor').exec();



var distExportTree = exportTree(distTrees, {
  destDir: 'live-dist'
});

module.exports = mergeTrees([compiledTree]);
