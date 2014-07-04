var get = Ember.get,
    set = Ember.set,
    forEach = Ember.EnumerableUtils.forEach,
    slice = Array.prototype.slice
    ;


/**
 @module bricksui
 @submodule bricksui-form
 */

/**
 树组件，对Jquery Ztree进行简单的封装

 使用方式
 ```handlebars
 {{bu-tree options=view.treeOptions zNodes=view.zNodes}}
 ```
 对应的View文件为
 ```javascript
 Tree View
 export default Ember.View.extend({

    init: function () {
      this._super.apply(this,arguments);
      this.set('treeOptions', {
        onClick:function(component, event, treeId, treeNode, clickFlag){
          //your code
        }
      });
      this.set('zNodes', [
          { name: "父节点1 - 展开", open: true,
            children: [
              { name: "父节点11 - 折叠",
                children: [
                  { name: "叶子节点111"},
                  { name: "叶子节点112"},
                  { name: "叶子节点113"},
                  { name: "叶子节点114"}
                ]},
              { name: "父节点12 - 折叠",
                children: [
                  { name: "叶子节点121"},
                  { name: "叶子节点122"},
                  { name: "叶子节点123"},
                  { name: "叶子节点124"}
                ]},
              { name: "父节点13 - 没有子节点", isParent: true}
            ]},
          { name: "父节点2 - 折叠",
            children: [
              { name: "父节点21 - 展开", open: true,
                children: [
                  { name: "叶子节点211"},
                  { name: "叶子节点212"},
                  { name: "叶子节点213"},
                  { name: "叶子节点214"}
                ]},
              { name: "父节点22 - 折叠",
                children: [
                  { name: "叶子节点221"},
                  { name: "叶子节点222"},
                  { name: "叶子节点223"},
                  { name: "叶子节点224"}
                ]},
              { name: "父节点23 - 折叠",
                children: [
                  { name: "叶子节点231"},
                  { name: "叶子节点232"},
                  { name: "叶子节点233"},
                  { name: "叶子节点234"}
                ]}
            ]},
          { name: "父节点3 - 没有子节点", isParent: true}
        ]
      );
    }
  });
 ```

 ```html
 Warning: *组件重写了callback函数方法，加入了一层代理功能，第一个参数为component实例，用于与Ember交互，其他参数与zTree一致
 ```

 ###详细API DEMO 见 [Ztree查看更多...](http://www.ztree.me/v3/main.php#_zTreeInfo)

 @class BuTree
 @namespace Ember
 @extends Ember.Component
 */
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
     * @property zNodes
     * @type object
     * @default null
     */
    zNodes: null,


    classNames: ['ztree'],

    /**
     * elementId的别名
     * @property treeId
     * @default elementId
     * @type string
     */
    treeId: Ember.computed.alias('elementId'),

    /**
     * ztree配置项
     * @property options
     * @default {}
     * @type object
     */
    options: {},


    init: function () {
        this._super.apply(this, arguments);
        this._parseOptions();
    },


    /**
     * 如果options是模板中传入的字符串，尝试将字符串转换为options对象
     * @method _parseOptions
     * @private
     */
    _parseOptions: function () {
        var options = get(this, 'options');
        if (Ember.typeOf(options) === 'string') {
            try {
                JSON.parse(options);
                set(this, 'options', options);
            } catch (e) {
                throw e;
            }
        }
        this._parseCallback(options);
    },

    /**
     * 对传入的callbacks进行切面，织入当前Compoennt对象，作为回调函数的第一个参数，
     * warn: this作用域保留为z-Tree插件作用域，如果需要获取当前的component作为回调函数的作用域，在回调函数中获取第一个参数进行操作
     * @param options
     * @private
     */
    _parseCallback: function (options) {
        var k,
            callbacks = options.callback;

        if (!callbacks) return;

        function curriedProxy(param, fn) {
            param = [param];
            return function () {
                fn.apply(this, param.concat(slice.apply(arguments)));
            };
        }

        for (k in callbacks) {
            if (callbacks.hasOwnProperty(k)) {
                callbacks[k] = curriedProxy(this, callbacks[k]);
            }
        }
    },

    /**
     * 返回zTree实例
     * @method getTree
     * @returns {*}
     */
    getTree: function () {
        var treeId = get(this, 'treeId');
        return Ember.$.fn.zTree.getZTreeObj(treeId);
    },

    /**
     * 在Component销毁时，销毁树的实例
     * @method _destroyElement
     * @private
     */
    _destroyElement: function () {
        var treeId = get(this, 'treeId');

        Ember.$.fn.zTree.destroy(treeId);
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
            Ember.$.fn.zTree.init(this.$(), setting, zNodes);
        });
    }.on('didInsertElement')

});