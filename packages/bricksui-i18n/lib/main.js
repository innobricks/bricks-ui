import BricksUI from 'bricksui-metal/core';
import "bricksui-i18n/initializer";

import {
    setLang
    } from "bricksui-i18n/i18n-support";
import i18nValidator from "bricksui-i18n/i18n-validator";

//BEGIN IMPORT LANGUAGE
import en from "bricksui-i18n/lang/en";
import zhCN from "bricksui-i18n/lang/zh-cn";

//END IMPORT LANGUAGE


import {
    translationHelper
    } from "bricksui-i18n/helpers/translation";

/**
 i18n国际化与本地化支持模块
 @module bricksui
 @submodule bricksui-i18n
 */

///**
// * @class I18n
// * @namespace BricksUI
// * @type {{}}
// */
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

I18n.setLang = setLang;

Handlebars.registerHelper("t", translationHelper);

BricksUI.I18n = I18n;


