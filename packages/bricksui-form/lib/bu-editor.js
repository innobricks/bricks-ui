var get = Ember.get, set = Ember.set;

/**
 @module bricksui
 @submodule bricksui-form
 */
/**
 基于ember与[百度富文本编辑器umeditor](http://ueditor.baidu.com/website/umeditor.html)
 主要增加了数据绑定的功能，config配置项与umeditor一致
 继承自Ember.Component，用法上与Ember.Component保持一致
 使用方式如:
 ```handlebars
 {{bu-editor value=title valueType="contentTxt"}}
 ```
 @class BuEditor
 @namespace Ember
 @extends Ember.Component
 @uses Ember.TextSupport
 */
var BuEditor = Ember.Component.extend({

  /**
   value类型，分别为content和contentTxt,content包含其中的段落标签,contentTxt则指纯文本内容
   @property valueType
   @type string
   @default "content"
   */
  valueType: "content",

  _valueHandler: {
    content: function (editor) {
      return editor.getContent();
    },
    contentTxt: function (editor) {
      return editor.getContentTxt();
    }
  },


  /**
   用户配置文件
   @property options
   @type object
   */
  options: {},

  /**
   富文本框默认配置文件
   @property defaultSetting
   @type object
   */
  defaultOptions: {
    //这里可以选择自己需要的工具按钮名称
    toolbar: ['fullscreen undo redo bold italic underline'],
    //focus时自动清空初始化时的内容
    autoClearinitialContent: true,
    //关闭字数统计
    wordCount: false,
    //关闭elementPath
    elementPathEnabled: false,
    //默认的编辑区域高度
    initialFrameHeight: 300
    //更多其他参数，请参考umeditor.config.js中的配置项
  },


  /**
   绑定到文本域的字段
   @property value
   @type String
   @default null
   */
  value: "",

  /**
   占位符编号，可根据该编号取得全局唯一编辑器实例
   @property holderId
   @type String
   @default bu-editor+父级ID编号
   */
  holderId: function () {
    return 'bu-editor' + Ember.get(this, 'elementId');
  }.property('elementId'),

  /**
   为UMeditor添加事件监听
   @private
   @method _attachEvent
   @param editor UMeditor实例
   */
  _attachEvent: function (editor) {

    editor.addListener('ready', function () {
      var value = get(this, 'value');
      if (!Ember.isEmpty(value)) editor.setContent(value);

      this.$('.edui-container').css({width: '100%'});

    }.bind(this));

    editor.addListener('contentChange', function () {
      var
        value = get(this, 'value'),
        elementValue = this._valueHandler[this.valueType](this._editor);

      if (value !== elementValue) this._updateValue(elementValue);

    }.bind(this));

  },

  _updateElementValue: Ember.observer('value', function () {
    // We do this check so cursor position doesn't get affected in IE
    var value = get(this, 'value'),
      elementValue = this._valueHandler[this.valueType](this._editor);

    if (elementValue !== value) this._editor.setContent(value);

  }),


  /**
   将textarea转换未UMeditor实例
   @private
   @method _updateDom
   */
  _updateDom: function () {
    var
      options = get(this, 'options'),
      defaultOptions = get(this, 'defaultOptions'),
      editor;

    if (typeof options === 'string') {
      options = JSON.parse(options);
    }
    //TODO toolbar属性合并
    options = $.extend(true, {}, options, defaultOptions);

    editor = this._editor = UM.getEditor(this.get('holderId'), options);

    this._attachEvent(editor);
  }.on('didInsertElement'),


  /**
   在富文本框编辑器内容发生改变时同步value值
   @private
   @method _updateValue
   @param value 富文本编辑器改变后的值
   */
  _updateValue: function (value) {
    set(this, 'value', value);
  },


  /**
   销毁富文本编辑器，销毁组件
   @private
   @method _destroyEditor
   */
  _destroyEditor: function () {
    this._editor.destroy();
    this._editor = null;
  }.on('willDestroyElement')
});

export default BuEditor;
