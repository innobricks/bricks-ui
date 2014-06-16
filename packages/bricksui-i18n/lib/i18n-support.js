import i18n from "./i18n-initializer";

/**
 * @description 向I18N注册模板
 * @param  {object} translation
 */
i18n.registerTranslation = function (translation) {
  Ember.assert('translation must be an object ,you passed ' + translation, typeof translation === 'object');
  Ember.merge(Ember.I18n.translations, translation);
};

/**
 * @description 获取客户端语言，如果设置isFormCookie为true，则默认优先从cookie中获取语言列表
 * @param isFromCookie {boolean} 是否同时从cookie中获取语言
 * @returns {string} 语言列表
 */
i18n.getLanguage = function (isFromCookie) {
  var lang;
  if (isFromCookie) {
    lang = Ember.$.cookie('bricksui-lang');
  }
  return lang ? lang : (window.navigator.language || window.navigator.browserLanguage).toLowerCase();
};

/**
 * @description 将选择的语言类型持久化到cookie中
 * @param lang {string} 语言类型，如'zh-CN'等
 * @param langObject {object} i18n对象，为键值对形势
 */
i18n.setLanguage = function (lang, langObject, isPersistent) {
  i18n.registerTranslation(langObject);
  if (isPersistent) {
    Ember.$.cookie('bricksui-lang', lang, { expires: 7 });
  }
};

/**
 * @description 根据语言区从i18n.lang语言文件内取出具体文件
 * @param lang {string} 如'zh-CN','en-US'等
 * @param isPersistent {boolean} 是否将所选择的语言保存到cookie
 */
i18n.setByLang = function (lang, isPersistent) {
  i18n.setLanguage(lang, i18n.lang[lang], isPersistent);
  var translations = Ember.I18n.translations;
  for (var prop in translations) {
    if (Ember.canInvoke(translations, prop)) {
      delete translations[prop];
    }
  }
  Ember.instrument("i18nChange");
};

/**
 * @description 初始化i18n
 * 传入一个回调函数，方法将会将语言代码传入回调函数中，回调函数需返回对应语言代码的语言对象
 * @param getLangObject {function}
 */
i18n.initialLanguage = function (getLangObject) {
  var langObject,
    lang = i18n.getLanguage(true);

  langObject = getLangObject(lang);
  i18n.setLanguage(lang, langObject, false);

};
