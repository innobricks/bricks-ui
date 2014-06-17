import BricksUI from 'bricksui-metal/core';
import "bricksui-i18n/initializer";

import {
    registerTranslation,
    getLanguage,
    setLanguage,
    setByLang,
    initialLanguage,
    parseLanguage
    } from "bricksui-i18n/i18n-support";
import i18nValidator from "bricksui-i18n/i18n-validator";

//BEGIN IMPORT LANGUAGE
import en from "bricksui-i18n/lang/en";
import zhCN from "bricksui-i18n/lang/zh-cn";

//END IMPORT LANGUAGE
/**
 @module BricksUI
 @submodule BricksUI-I18n
 @description 国际化支持
 */

var I18n = {};

I18n.lang = {};

/**
 * en :en-us en-hk en-au
 * de :de-dk de-ch de-lu
 * zh-cn : zh-cn
 * zh-tw : zh-tw
 */
I18n.lang['en'] = en;
I18n.lang['zh-cn'] = zhCN;

I18n.I18nableValidationMixin = i18nValidator;

I18n.registerTranslation = registerTranslation;
I18n.getLanguage = getLanguage;
I18n.setLanguage = setLanguage;
I18n.setByLang = setByLang;
I18n.initialLanguage = initialLanguage;
I18n.parseLanguage = parseLanguage;


BricksUI.I18n = I18n;


