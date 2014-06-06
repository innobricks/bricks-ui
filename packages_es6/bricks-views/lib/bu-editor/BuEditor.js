/**
 基于ember与[百度富文本编辑器umeditor](http://ueditor.baidu.com/website/umeditor.html)
 主要增加了数据绑定的功能，config配置项与umeditor一致
 @class BuEditor
 @namespace Ember
 @extends Ember.Component
 @uses Ember.TextSupport
 */
var BuEditor=Ember.Component.extend({
  tagName:'textarea',
  _updateDom:function(){

  }.on('didInsertElement')

})
