import i18n from "./i18n-initializer";


/**
 * @description 继承自Ember-Validations,拓展语言切换支持。通过该方法可做到即时的语言切换，缺点在于很难与默认的t.i18n进行交互
 * 该方法订阅 'i18nChange' 事件，在事件触发后，调用自身 validate方法
 */
var I18nableValidationMixin = Ember.Mixin.create(Ember.Validations.Mixin,{
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
i18n.I18nableValidationMixin = I18nableValidationMixin;
export default I18nableValidationMixin;