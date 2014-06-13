import defaultsI18N from "./lang/en";

/**
 * 因为Ember-Validation代码判断当引入Ember-I18库时，将不会使用Validation自身的i18n模板
 * 这段代码为Validation提供默认的错误提示
 */
Ember.merge(Ember.I18n.translations, defaultsI18N);

/**
 * @description 向I18N注册模板
 * @param  {object} translation
 */
Ember.I18n.registerTranslation = function (translation) {
  Ember.assert('translation must be an object ,you passed ' + translation, typeof translation === 'object');
  Ember.merge(Ember.I18n.translations, translation);
};

Ember.I18n.getLanguage = function () {
  return window.navigator.language;
};

//Ember.I18n.mergeLanguage=function(langZone,lang){
//  Ember.I18n.lang
//}

Ember.I18n.setLanguage = function (lang) {
  //TODO 加载language文件
  Ember.$.cookie('bricksui-lang', lang, { expires: 7 });
};