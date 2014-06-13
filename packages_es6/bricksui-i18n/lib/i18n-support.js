import i18n from "./i18n-initialize";

/**
 * @description 向I18N注册模板
 * @param  {object} translation
 */
i18n.registerTranslation = function (translation) {
  Ember.assert('translation must be an object ,you passed ' + translation, typeof translation === 'object');
  Ember.merge(Ember.I18n.translations, translation);
};

/**
 * @description 获取客户端语言
 * @returns {string}
 */
i18n.getLanguage = function () {
  return (window.navigator.language || window.navigator.browserLanguage).toLowerCase();
};

/**
 * @description 将选择的语言类型持久化到cookie中
 * @param lang {string} 语言类型，如'zh-CN'等
 */
i18n.setLanguage = function (lang) {
  Ember.$.cookie('bricksui-lang', lang, { expires: 7 });
};

export default i18n;