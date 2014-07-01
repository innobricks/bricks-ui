var get = Ember.get, set = Ember.set;
export default Ember.Component.extend({

  tagName: 'ul',

  /**
   * 默认模板
   * @default ''
   * @property defaultTemplate
   * @type function
   */
  defaultTemplate: Ember.Handlebars.compile(''),

  /**
   * 树所绑定的数据
   */
  zNodes: null,

  /**
   * elementId的别名
   * @property treeId
   * @default elementId
   */
  treeId: Ember.computed.alias('elementId'),

  /**
   * ztree配置项
   * @property options
   * @default {}
   * @type object
   */
  options: {},

  /**
   * 如果options是模板中传入的字符串，尝试将字符串转换为options对象
   * @method _parseOptions
   * @private
   */
  _parseOptions: function () {
    var options=get(this,'options');
    if (Ember.typeOf(options) === 'string') {
      try {
        JSON.parse(options);
        set(this, 'options', options);
      } catch (e) {
        throw e;
      }
    }
  },

  /**
   * 返回zTree实例
   * @method getTree
   * @returns {*}
   */
  getTree:function(){
    var treeId=get(this,'treeId');
    return $.fn.zTree.getZTreeObj(treeId);
  },

  /**
   * 在Component销毁时，销毁树的实例
   * @method _destroyElement
   * @private
   */
  _destroyElement: function () {
    var treeId = get(this, 'treeId');

    $.fn.zTree.destroy(treeId);
  }.on('destroyElement'),


  /**
   * 在插入Dom后，生成Tree组件
   * @method _updateDom
   * @private
   */
  _updateDom: function () {
    Ember.run.scheduleOnce('afterRender', this, function () {
      var setting = get(this, 'options'),
        zNodes = get(this, 'zNodes');
      $.fn.zTree.init(this.$(), setting, zNodes);
    });
  }.on('didInsertElement')

});