/**
 * @module bricksui-metal
 */

import BricksUI from "bricksui-metal/core";
import Stateable from "bricksui-metal/statechart";
import EventManager from "bricksui-metal/event_manager";
/**
 *  Ember.View的创建过程是一个状态机的流转过程,具体如下:
 *  Ember.View.states:
 *    x: _default    默认方法集合,作为其他状态的基类,不作为具体状态使用
 *      preRender   初始化状态,渲染之前
 *      inBuffer    渲染状态,此时正在生成相应的html标签和属性
 *      inDom       已经成为dom节点状态,已经生成并且插入到页面中
 *      hasElement  一切准备就绪,等待接受用户操作
 *      destroying  正在移除中,视图销毁
 *  以上状态是逐个向下的状态
 *
 *  目前用于所使用的标签都是由W3C制定的,存在一定的局限性
 *  Ember Component提供了一种方式来增强自定义标签,增强HTML功能,
 *  而且Ember的这一实现与W3C目前的Custom Elements 工作一致,并且尽可能保持同步
 *  在未来的浏览器版本,一旦Custom Elements普及,则Ember实现的这一套机制本身就与标准看齐,所以可以方便地集成
 *
 *  BricksUI View 要点
 *  1.FSM 分离用户行为和组件行为
 *  2.AOP进行事件切片,以及权限和操作行为控制
 *  3.与W3C Custom Elements (TODO 研究)
 *  TODO:制定组件的生命周期以及使用方式,及与外部交互的基础
 */
//TODO ES6
/**
 * 基类具备状态机管理功能
 * 如何将事件传播到state中,执行对应的action
 * 在模板里面添加states的action-->{{action unfoldmenu target="states"}}
 *
 * mouseDown(click)-> view.states["activeState"]["unfoldmenu"]
 * record.loadingData->record.currentState["loadingData"]
 */

var Em = window.Ember;
/**
 * TODO
 * 1.用Component来实现组件
 * 2.用模板和action结合来实现组件行为
 */
var View = Em.View.extend(Stateable, EventManager, {
    init: function () {
        this._super();
    }
    //TODO

});

export
{
    View
}
;