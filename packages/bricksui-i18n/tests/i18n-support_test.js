import {initLang,setLang} from "bricksui-i18n/i18n-support";

/***
 * JUST FOR TESTING
 */


/* jshint ignore:start */
var define, requireModule, require, requirejs;

(function () {
  var registry = {}, seen = {}, state = {};
  var FAILED = false;

  define = function (name, deps, callback) {
    registry[name] = {
      deps: deps,
      callback: callback
    };
  };

  function reify(deps, name, seen) {
    var length = deps.length;
    var reified = new Array(length);
    var dep;
    var exports;

    for (var i = 0, l = length; i < l; i++) {
      dep = deps[i];
      if (dep === 'exports') {
        exports = reified[i] = seen;
      } else {
        reified[i] = require(resolve(dep, name));
      }
    }

    return {
      deps: reified,
      exports: exports
    };
  }

  requirejs = require = requireModule = function (name) {
    if (state[name] !== FAILED &&
      seen.hasOwnProperty(name)) {
      return seen[name];
    }

    if (!registry[name]) {
      throw new Error('Could not find module ' + name);
    }

    var mod = registry[name];
    var reified;
    var module;
    var loaded = false;

    seen[name] = { }; // placeholder for run-time cycles

    try {
      reified = reify(mod.deps, name, seen[name]);
      module = mod.callback.apply(this, reified.deps);
      loaded = true;
    } finally {
      if (!loaded) {
        state[name] = FAILED;
      }
    }

    return reified.exports ? seen[name] : (seen[name] = module);
  };

  function resolve(child, name) {
    if (child.charAt(0) !== '.') {
      return child;
    }

    var parts = child.split('/');
    var nameParts = name.split('/');
    var parentBase;

    if (nameParts.length === 1) {
      parentBase = nameParts;
    } else {
      parentBase = nameParts.slice(0, -1);
    }

    for (var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];

      if (part === '..') {
        parentBase.pop();
      }
      else if (part === '.') {
        continue;
      }
      else {
        parentBase.push(part);
      }
    }

    return parentBase.join('/');
  }

  requirejs.entries = requirejs._eak_seen = registry;
  requirejs.clear = function () {
    requirejs.entries = requirejs._eak_seen = registry = {};
    seen = state = {};
  };
})();

window.define = define;
window.requireModule = requireModule;
window.require = require;
window.requirejs = requirejs;
/* jshint ignore:end */
/***
 * END
 */

define("appkit/lang/en",
  ["exports"],
  function (__exports__) {
    "use strict";
    __exports__["default"] = {
      "foo": "bar",
      errors: {
        "foo": "bar",
        foo1: {
          "foo2": "bar"
        }
      }
    };
  });

define("appkit/lang/zh-CN",
  ["exports"],
  function (__exports__) {
    "use strict";
    __exports__["default"] = {
      "foo": "变量",
      errors: {
        "foo": "变量",
        foo1: {
          "foo2": "变量"
        }
      }
    };
  });


QUnit.module("i18n-support_test", {
  setup: function () {
    Ember.set(BricksUI,"ENV.MODULE_PREFIX","appkit");
    Ember.set(BricksUI,"ENV.LANG_FOLDER_NAME","lang");
  },
  teardown: function () {
    // 在每个测试之后运行
  }
});


test("set Lang Test", function () {
  setLang("en");
  ok(Ember.I18n.translations.foo === "bar", "deep one success");
  ok(Ember.I18n.translations.errors.foo === "bar", "deep one success");
  ok(Ember.I18n.translations.errors.foo1.foo2 === "bar", "deep one success");
});


test("initial Lang Test", function () {
  initLang();
  ok(Ember.I18n.translations.foo === "bar", "deep one success");
  ok(Ember.I18n.translations.errors.foo === "bar", "deep one success");
  ok(Ember.I18n.translations.errors.foo1.foo2 === "bar", "deep one success");
});


