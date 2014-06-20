import "bricksui-form/initializer";
import "bricksui-form/form-config";
import "bricksui-form/helpers/checkbox";
import "bricksui-form/helpers/radio";
import "bricksui-form/bu-editor";
import "bricksui-form/chosen-select";
import "bricksui-form/ember-validations";

import Checkbox from "bricksui-form/checkbox";
import Radio from "bricksui-form/radio";
import RadioButton from "bricksui-form/radio-button";

/**
 BricksUI表单支持模块，对Ember-Easy-Form进行功能拓展，整合Validation与I18n
 @module bricksui
 @submodule bricksui-form
 */
Ember.EasyForm.Checkbox = Checkbox;
Ember.EasyForm.Radio = Radio;
Ember.RadioButton = RadioButton;

