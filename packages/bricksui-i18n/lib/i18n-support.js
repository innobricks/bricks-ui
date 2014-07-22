import BricksUI from  "bricksui-metal/core";

/**
 @module bricksui
 @submodule bricksui-i18n
 */
var langKey = "bricksui-lang";

//临时保存语言对象
var persistentLang = null;

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

var tryRequire = function (moduleName) {
    var require = window.require,
        result
        ;

    Ember.assert("global function 'require' can not be undefined", require !== undefined);
    try {
        result = require(moduleName);
    } finally {
        return result;
    }

};

/**
 * 根据命名约定，从项目文件中加载语言包
 * @param parsedName
 * @returns {{localeName: ({language: *}|*|set.language|parseLanguage.language|language|string), localeLang: *}}
 */
var requireLang = function (parsedName) {
    var localeLang, moduleMatcher;

    moduleMatcher = {
        shortMatch: [BricksUI.ENV.MODULE_PREFIX, BricksUI.ENV.LANG_FOLDER_NAME, parsedName.language].join("/"),
        longMatch: [BricksUI.ENV.MODULE_PREFIX, BricksUI.ENV.LANG_FOLDER_NAME, parsedName.fullName].join("/")
    };

    if (typeof parsedName === "string") {
        parsedName = {
            language: parsedName
        };
    }

    localeLang = tryRequire(moduleMatcher.shortMatch);

    var localeName = parsedName.language;
    if (!localeLang) {
        localeLang = tryRequire(moduleMatcher.longMatch);
        localeName = parsedName.fullName;
    }
//    Ember.warn("Could not find module " + moduleMatcher.shortMatch + " or " + moduleMatcher.shortMatch, localeLang !== undefined);
    if (localeLang && localeLang["default"]) {
        localeLang = localeLang["default"];
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
    persistentLang = lang;
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
 * @private
 * @method initLang
 * @for BricksUI.I18n
 */
var initLang = function () {
    var parsedName = getLang();
    var locale = requireLang(parsedName);

    if (!locale.localeLang && !BricksUI.I18n.lang[locale.localeName]) {
        locale = requireLang(BricksUI.ENV.DEFAULT_LANG);
    }

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
    var parsedName, locale;

    parsedName = {
        fullName: lang,
        language: lang,
        area: lang
    };

    locale = requireLang(parsedName);

    mergeLang(locale);
    saveLang(parsedName);

    var translations = Ember.I18n.translations;
    for (var prop in translations) {
        if (Ember.canInvoke(translations, prop)) {
            delete translations[prop];
        }
    }
    Ember.instrument("i18nChange", parsedName, function () {
        Ember.Logger.warn("no listener for i18nChange! nothing changed!");
    });
};

/**
 * 获取语言内容，如果开启了Cookie语言持久化功能，则优先从cooie内查找语言对象
 * @returns {*}
 */
var getLang = function () {
    var parsedName;
    if (persistentLang) return persistentLang;

    if (BricksUI.ENV.PERSISTENT_I18N) {
        parsedName = loadLang();
    }
    if (!parsedName) {
        parsedName = parseLanguage();
    }
    return parsedName;
};

export
    {
    initLang,
    setLang,
    getLang
    }
    ;