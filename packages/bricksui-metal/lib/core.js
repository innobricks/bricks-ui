/*globals BricksUI:true */
/**
 * @module bricksui
 * @submodule bricksui-metal
 */

/**
 *  BricksUI ,a widget library on ember.js
 *  @class BricksUI
 *  @statis
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
   * @description 是否将语言选择持久化到cookie中，如果设置为true，则将优先获取cookie设置的语言
   */
  PERSISTENT_I18N: true,
  MODULE_PREFIX:'appkit',
  LANG_FOLDER_NAME:"lang"
}

/**
 * @description Bricks变量配置
 * I18NCOOKIEPERSISTENT : true
 *
 */
if ("undefined" === typeof BricksUI.ENV) {
  BricksUI.ENV = DEFAULT_ENV;
} else {
  Ember.$.extend(true, BricksUI.ENV, DEFAULT_ENV);
}

export default
  BricksUI;