import "bricksui-i18n/i18n-support";
import i18n from "bricksui-i18n/i18n-initializer";


QUnit.module("i18n-support_test");

test("registerTranslation should work", function () {
  i18n.registerTranslation({"name": "exit"});
  var name = Ember.I18n.translations.name;
  ok('exit' === name, "registerTranslation don't success");
});

test("set and save language", function () {
  i18n.setLanguage('zh-CN', {"name": "exitz"}, true);
  ok('zh-CN' === Ember.$.cookie('bricksui-lang'), 'language persistent fail');
});


test("initial language", function () {
  i18n.initialLanguage(function (lang) {
    ok(lang === i18n.getLanguage(true));
    return {};
  }.bind(this));
});

