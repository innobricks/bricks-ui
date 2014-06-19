/**
 @module bricksui
 @submodule bricksui-form
 */
/**
 基于ember与[百度富文本编辑器umeditor](http://ueditor.baidu.com/website/umeditor.html)
 主要增加了数据绑定的功能，config配置项与umeditor一致
 @class Checkbox
 @namespace Ember.EasyForm
 @extends Ember.EasyForm.Input
 */
var Checkbox = Ember.EasyForm.Input.extend({
    init: function () {
        this._super.apply(this, arguments);
        this.set('templateName', this.get('wrapperConfig.checkboxTemplate'));
        this.set('context', this);
        this.set('controller', this);
    },
    /* The property to be used as label */
    labelPath: null,
    /* The model */
    model: null,
    /* The has many property from the model */
    propertyPath: null,
    /* All possible elements, to be selected */
    elements: null,
    elementsOfProperty: function () {
        return this.get('model.' + this.get('propertyPath'));
    }.property()

});

export default
Checkbox;