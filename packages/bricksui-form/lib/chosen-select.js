/**
 @module bricksui
 @submodule bricksui-form
 */

/**
 * 重置Ember.EasyForm下拉组建行为，将下拉框组件行为转换未chosen组建，用户通常无需直接使用该组建，
 * 应通过Ember-EasyForm的方式使用该组件
 * 可选的参数有 data-placeholder，表示下拉组建的占位符
 * 使用方式如
 ```handlebars
 {{#form-for model wrapper="bootstrap"}}
 {{input author
 as='select'
 data-placeholder="请选择作者"
 collection="category"
 optionLabelPath="content.value"
 }}
 {{input tags as='select'
 data-placeholder="请选标签"
 multiple=true
 collection="category"
 optionLabelPath="content.value"
 }}
 {{/form-for}}
 ```
 * @class Select
 * @namespace Ember.EasyForm
 */
var ChosenSelect = Ember.EasyForm.Select.reopen({

  classNames: ['form-control'],
  attributeBindings: ['data-placeholder'],

  init: function () {
    this._super();
    this.set('prompt', ' ');  //对于chosen组件，需要存在一个为空的promt

    //once elements trigger blur event,the parentView will show validated result,
    //aim to defer validation
    var parentView = this.get('parentView');
    parentView.focusOut = function () {
      parentView.set(parentView.set('hasFocusedOut', true));
    };

  },

  /**
   * @private
   * @method _elementDestroy
   * @description 在收到通知需进行销毁后，销毁chsen组建
   */
  _elementDestroy: function () {
    this.$().chosen('destroy');
  }.on('willDestroyElement'),


  /**
   * @private
   * @method _updateItem
   * @description 在select的context发生变化后，通知chosen进行视图更新
   */
  _updateItem: function () {
    Ember.run.scheduleOnce('afterRender', this, function () {
      this.$().trigger('chosen:updated');
    });
  }.observes('content.@each'),

  _doShowFocus: function () {
    this.get('parentView').showValidationError();
  },

  _validation: function () {
    var callback = this._doShowFocus.bind(this);
    this.get('parentView.formForModel').validate().then(callback, callback);
  },

  /**
   * @description 在视图渲染完成后，将select组件转换为chosen组件
   * @method _updateDom
   * @private
   */
  _updateDom: function () {

    Ember.run.scheduleOnce('afterRender', this, function () {
      //在select视图渲染成成后，将其转换为chosen下拉框，并监听change事件
      this.$().chosen()
        .on('change chosen:hiding_dropdown', function () {
          //为了取得数组正确的变化，将validate推迟到下一生命周期运行
          Ember.run.next(this, '_validation');
        }.bind(this))
      ;
    });
  }.on('didInsertElement')
});

export default ChosenSelect;