/**
 @module bricksui
 @submodule bricksui-i18n
 @description 国际化支持
 @constructor
 */
/**
 * @class I18nableValidationMixin
 * @extends Ember.Validations.Mixin
 * @namespace BricksUI.I18n
 * @description 继承自Ember-Validations,拓展语言切换支持。通过该方法可做到即时的语言切换，缺点在于很难与默认的t.i18n进行交互
 * 该方法订阅 'i18nChange' 事件，在事件触发后，调用自身 validate方法
 * 使用方法为在需要使用校验的对象中参入I18nableValidationMixin
 * 如：
 ```javascript
 var Post=DS.Model.extend(BricksUI.I18n.I18nableValidationMixin,{
    title:DS.attr('string')
    validations: {
      title:{
        presence: true,
        length: { minimum: 5 }
      }
    }
 })
 ```
 */
var I18nableValidationMixin = Ember.Mixin.create(Ember.Validations.Mixin, {
    init: function () {
        this._super();

        var validatorMixin = this;
        Ember.subscribe("i18nChange", {
            after: function (name, timestamp, payload) {
                validatorMixin.validate();
            }
        });
    }
});
export default I18nableValidationMixin;