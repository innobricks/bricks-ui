import I18n from "./i18n-initialize"

/**
 * @description 向I18N注册模板
 * @param  {object} translation
 */
I18n.registerTranslation = function (translation) {
  Ember.assert('translation must be an object ,you passed ' + translation, typeof translation === 'object');
  Ember.merge(Ember.I18n.translations, translation);
};

I18n.getLanguage = function () {
  return (navigator.language || navigator.browserLanguage).toLowerCase();
};

I18n.setLanguage = function (lang) {
  Ember.$.cookie('bricksui-lang', lang, { expires: 7 });
};