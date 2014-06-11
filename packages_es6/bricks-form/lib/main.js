import "bricks-form/initializer";
import "bricks-form/form-config";
import "bricks-form/helpers/checkbox";
import "bricks-form/helpers/radio";
import "bricks-form/bu-editor";
import "bricks-form/chosen-select";


import Checkbox from "bricks-form/checkbox";
import Radio from "bricks-form/radio";
import RadioButton from "bricks-form/radio-button";

Ember.EasyForm.Checkbox = Checkbox;
Ember.EasyForm.Radio = Radio;
Ember.RadioButton = RadioButton;


//-- Bootstrap 3 Class Names --------------------------------------------
//-- https://github.com/dockyard/ember-easyForm/issues/47
Ember.TextSupport.reopen({
  classNames: ['form-control']
});

Ember.EasyForm.Config.registerWrapper('default', {
  labelClass: 'control-label',
  inputClass: 'form-group',
  buttonClass: 'btn btn-primary',
  fieldErrorClass: 'has-error',
  errorClass: 'help-block'
});

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
  Ember.assert('translation must be object ,you passed ' + translation, typeof translation === 'object');
  Ember.merge(Ember.I18n.translations, translation);
};