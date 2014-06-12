var defaultsI18N = {
  errors: {
    inclusion: "is not included in the list",
    exclusion: "is reserved",
    invalid: "is invalid",
    confirmation: "doesn't match {{attribute}}",
    accepted: "must be accepted",
    empty: "can't be empty",
    blank: "can't be blank",
    present: "must be blank",
    tooLong: "is too long (maximum is {{count}} characters)",
    tooShort: "is too short (minimum is {{count}} characters)",
    wrongLength: "is the wrong length (should be {{count}} characters)",
    notANumber: "is not a number",
    notAnInteger: "must be an integer",
    greaterThan: "must be greater than {{count}}",
    greaterThanOrEqualTo: "must be greater than or equal to {{count}}",
    equalTo: "must be equal to {{count}}",
    lessThan: "must be less than {{count}}",
    lessThanOrEqualTo: "must be less than or equal to {{count}}",
    otherThan: "must be other than {{count}}",
    odd: "must be odd",
    even: "must be even",
    url: "is not a valid URL"
  }
};

/**
 * 因为Ember-Validation代码判断当引入Ember-I18库时，将不会使用Validation自身的i18n模板
 * 这段代码为Validation提供默认的错误提示
 */
Ember.merge(Ember.I18n.translations, defaultsI18N);

/**
 * @description 向I18N注册模板
 * @param  {object} translation
 */
Ember.I18n.registerTranslation = function (translation) {
  Ember.assert('translation must be an object ,you passed ' + translation, typeof translation === 'object');
  Ember.merge(Ember.I18n.translations, translation);
};


Ember.I18n.getLanguage=function(){
  return window.navigator.language;
};

Ember.I18n.setLanguage=function(lang){
  //TODO 加载language文件
  Ember.$.cookie('bricks-lang',lang, { expires: 7 });
};