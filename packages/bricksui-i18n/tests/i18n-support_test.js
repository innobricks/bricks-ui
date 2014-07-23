import {initLang,setLang} from "bricksui-i18n/i18n-support";


window.define("appkit/lang/en",
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

window.define("appkit/lang/zh-CN",
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
        Ember.set(BricksUI, "ENV.MODULE_PREFIX", "appkit");
        Ember.set(BricksUI, "ENV.LANG_FOLDER_NAME", "lang");
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


