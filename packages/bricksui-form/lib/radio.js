import Checkbox from "./checkbox";

/**
 @module bricksui
 @submodule bricksui-form
 */
/**
 拓展Ember.EasyForm.Input的Radio功能
 提供单选按钮组的功能
 ```handlebars
 {{radio something modelBinding="model" propertyPath="something" elementsBinding="fruits" labelPath="name"}}
 ```
 @class Radio
 @namespace Ember.EasyForm
 @extends Ember.EasyForm.Checkbox
 */
var Radio = Checkbox.extend({
    init: function () {
        this._super.apply(this, arguments);
        this.set('templateName', this.get('wrapperConfig.radioTemplate'));
    }
});

export default
    Radio;