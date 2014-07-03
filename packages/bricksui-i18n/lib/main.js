import BricksUI from 'bricksui-metal/core';
import "bricksui-i18n/initializer";

import {
    setLang,getLang
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
 @module bricksui
 @submodule bricksui-i18n
 @description 国际化支持
 */
/**
 * @class I18n
 * @namespace BricksUI
 * @type {Object}
 * @static
 */
var I18n = {};
/**
 * I18n语言包Hash.
 * ```javascript
 * en :en-us en-hk en-au
 * de :de-dk de-ch de-lu
 * zh-cn : zh-cn
 * zh-tw : zh-tw
 * ```
 * @static
 * @class lang
 * @namespace BricksUI.I18n
 * @type {Object}
 * @default zh-cn
 */
I18n.lang = {};

/**
 *  @property en
 *  @type Hash
 */
I18n.lang['en'] = en;
/**
 * @property zh-cn
 * @type Hash
 */
I18n.lang['zh-cn'] = zhCN;

I18n.I18nableValidationMixin = i18nValidator;

I18n.setLang = setLang;
I18n.getLang = getLang;
Handlebars.registerHelper("t", translationHelper);


BricksUI.I18n = I18n;


