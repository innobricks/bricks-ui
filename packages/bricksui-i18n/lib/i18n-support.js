import BricksUI from  "bricksui-metal/core";

/**
 @module bricksui
 @submodule bricksui-i18n
 */
var langKey = "bricksui-lang";

/**
 * 从cookie中获取已保留的语言选择情况
 * @returns {*} 如果语言选择已经保存在cookie中，则返回已保存的语言结构，如果不存在则返回空
 */
var loadLang = function () {
    try {
        return JSON.parse(Ember.$.cookie(langKey));
    } catch (e) {
        return null;
    }
};

/**
 * 获取并解析客户端语言
 * @returns {{fullName: *, language, area}}
 */
var parseLanguage = function () {
    var language = (window.navigator.language || window.navigator.browserLanguage).toLowerCase(),
        match
        ;
    match = language.match(/(.*)-(.*)/);
    return {
        fullName: match[0],
        language: match[1],
        area: match[2]
    };
};
/**
 * 根据命名约定，从项目文件中加载语言包
 * @param parsedName
 * @returns {{localeName: ({language: *}|*|set.language|parseLanguage.language|language|string), localeLang: *}}
 */
var requireLang = function (parsedName) {
    var require = window.require;
    if (typeof parsedName === "string") {
        parsedName = {
            language: parsedName
        };
    }
    var localeLang = require([BricksUI.ENV.MODULE_PREFIX, BricksUI.ENV.LANG_FOLDER_NAME, parsedName.language].join("/"));
    var localeName = parsedName.language;
    if (!localeLang) {
        localeLang = require([BricksUI.ENV.MODULE_PREFIX, BricksUI.ENV.LANG_FOLDER_NAME, parsedName.fullName].join("/"));
        localeName = parsedName.fullName;
    }
    if (localeLang && localeLang['default']) {
        localeLang = localeLang['default'];
    }

    return {
        localeName: localeName,
        localeLang: localeLang
    };
};

/**
 * 持久化用户所保存的语言选择
 * @param {object} lang
 */
var saveLang = function (lang) {
    if (BricksUI.ENV.PERSISTENT_I18N) {
        Ember.$.cookie(langKey, JSON.stringify(lang), { expires: 7 });
    }
};

/**
 * 将语言对象合并到BricksUI.I18n.lang Hash下，并同步到Ember.I18n.translations对象下
 * @param {object} locale
 */
var mergeLang = function (locale) {
    var localeName = locale.localeName;
    var localeLang = locale.localeLang;
    var bricksLocale = BricksUI.I18n.lang[localeName];
    Ember.$.extend(true, bricksLocale, localeLang);
    Ember.$.extend(true, Ember.I18n.translations, bricksLocale);
};

/**
 * 在项目载入时进行I18n的选择，并根据是否开启语言选择持久化，保存语言选择
 * @method initLang
 * @for BricksUI.I18n
 */
var initLang = function () {
    var parsedName;
    if (BricksUI.ENV.PERSISTENT_I18N) {
        parsedName = loadLang() || parseLanguage();
    }
    var locale = requireLang(parsedName);
    mergeLang(locale);
    saveLang(parsedName);
};
/**
 * 语言切换,用户可以通过传入的语言标识符进行语言切换
 * 需要在对应的项目下有对应的语言包
 * app
 *      lang
 *          en.js
 *          zh-cn.js
 *  传入的标识符即为lang下的对应的文件名
 * @method setLang
 * @for BricksUI.I18n
 * @param {String} lang language string ,"en" "zh-cn"
 */
var setLang = function (lang) {
    var locale = requireLang(lang);
    mergeLang(locale);
    saveLang({
        fullName: lang,
        language: lang,
        area: lang
    });

    var translations = Ember.I18n.translations;
    for (var prop in translations) {
        if (Ember.canInvoke(translations, prop)) {
            delete translations[prop];
        }
    }
    Ember.instrument("i18nChange");
};

export
{
    initLang,
    setLang
}
;