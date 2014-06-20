/*globals BricksUI:true */
/**
 * @module bricksui
 * @submodule bricksui-metal
 */

/**
 *  BricksUI ,a widget library on ember.js
 *  @class BricksUI
 *  @static
 *  @version VERSION_STRING_PLACEHOLDER
 */
if ("undefined" === typeof BricksUI) {
    BricksUI = Ember.Namespace.create();
}
/**
 @property VERSION
 @type String
 @default 'VERSION_STRING_PLACEHOLDER'
 @static
 */
BricksUI.VERSION = 'VERSION_STRING_PLACEHOLDER';

var DEFAULT_ENV = {
    /**
     * 是否将语言选择持久化到cookie中，如果设置为true，则将优先获取cookie设置的语言
     * @property PERSISTENT_I18N
     * @for BricksUI.ENV
     * @type Boolean
     * @default true
     */
    PERSISTENT_I18N: true,
    /**
     * 应用前缀
     * @property MODULE_PREFIX
     * @for BricksUI.ENV
     * @type String
     * @default appkit
     */
    MODULE_PREFIX: 'appkit',
    /**
     * 语言包存放路径
     * @property LANG_FOLDER_NAME
     * @for BricksUI.ENV
     * @type String
     * @default lang
     */
    LANG_FOLDER_NAME: "lang"
};

/**
 *  @description Bricks变量配置
 *  @class ENV
 *  @namespace BricksUI
 *  @type Hash
 */
if ("undefined" === typeof BricksUI.ENV) {
    BricksUI.ENV = DEFAULT_ENV;
} else {
    Ember.$.extend(true, BricksUI.ENV, DEFAULT_ENV);
}

export default
    BricksUI;