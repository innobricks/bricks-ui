/**
 @module bricksui
 @submodule bricksui-form
 */
/**
 拓展Ember.EasyForm.Input的CheckBox功能
 提供复选框按钮组的功能
 使用方式如:
 ```handlebars
 {{checkbox something modelBinding="model" propertyPath="something" elementsBinding="fruits" labelPath="name"}}
 ```
 @class Checkbox
 @namespace Ember.EasyForm
 @extends Ember.EasyForm.Input
 */
var Checkbox = Ember.EasyForm.Input.extend({
  /**
   *初始化操作，模仿Ember.Component,将视图上下文设置未自身，并从Ember.EasyForm.Config中获取模板
   *@method init
   */
  init: function () {
    this._super.apply(this, arguments);
    this.set('templateName', this.get('wrapperConfig.checkboxTemplate'));
    this.set('context', this);
    this.set('controller', this);
  },
  /**
   * 标签属性
   * 如 elements为 [{key:1,value:"123"},{key:2,value:"234"}]需要将value值作为label展示，则只需设置labelPath为value
   * @property labelPath
   * @default null
   * @type string
   */
  labelPath: null,

  /**
   * 绑定的Ember Data模型
   * @default null
   * @property model
   * @type object
   */
  model: null,

  /**
   * 绑定模型中的hasMany属性，在elements复选框选中的对象将push到该属性中
   * @property propertyPath
   * @type string
   * @default null
   */
  propertyPath: null,

  /**
   * 复选框的模型，必须为一个数组类型
   * 如 elements为 [{key:1,value:"123"},{key:2,value:"234"}]
   * @property elements
   * @default null
   * @type object
   */
  elements: null,

  /**
   * @private
   */
  elementsOfProperty: function () {
    return this.get('model.' + this.get('propertyPath'));
  }.property()

});

export default
  Checkbox;