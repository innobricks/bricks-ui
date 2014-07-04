/**
 * @module bricksui
 * @submodule bricksui-metal
 */

import BricksUI from "bricksui-metal/core";
var Em = window.Ember;
/**
 * Ember.View 本身的实现过程就是一个状态机的流转过程
 * Ember 事件绑定流程:
 *  Application.eventDispatcher
 *  Application.setupEventDispatcher
 *      -->eventDispatcher.setup
 *      -->eventDispatcher.setupHandler     //统一绑定在rootElement下
 *
 *  Ember事件触发流程:
 *  jQuery.event.dispatch
 *      -->Ember setupHandler
 *      -->eventDispatcher._findNearestEventManager
 *  在findNearestEventManager会查找视图是否具有事件管理器
 *  属性名称为:eventManager
 *      yes--> 事件统一交给事件管理器可处理的事件处理
 *      no --> 逐级冒泡事件
 *  为了统一管理事件,以及提供使用者统一的事件编码和调用,以及语义化事件变成
 *  将在View上新增eventManager属性,用于统一管理
 */

var eventHandlers = {
    interpreKeyEvents: function (event) {
        //TODO 将mapping写成用户可以扩展的形式
        var mapping = event.shiftKey ? ModifiedKeyBindings : KeyBindings;
        var eventName = mapping[event.keyCode];
        if (eventName && this[eventName]) {
            var handler = this[eventName];
            if (Ember.typeOf(handler) === "function") {
                return handler.call(this, event, this);
            }
            return false;
        }
    },
    handleKeyEvent: function (event, view) {
        var emberEvent = null;
        switch (event.type) {
            case "keydown":
                emberEvent = "keyDown";
                break;
            case "keypress":
                emberEvent = "keyPress";
                break;
        }
        var handler = emberEvent ? this.get(emberEvent) : null;
        if (handler) {
            return !handler.call(BricksUI.keyResponderStack.current(), event, BricksUI.keyResponderStack.current());
        } else if (emberEvent === "keyDown" && this.interpreKeyEvents(event)) {
            return false;
        } else if (this.get("parentView")) {
            return this.get("parentView").handleKeyEvent(event, view);
        }
    }
};
//TODO 需要仔细研究Ember内部这个的相关机制,才好扩展,
Ember.View.reopen(eventHandlers);
Ember.TextSupport.reopen(eventHandlers);

/**
 * 用户可进行扩展和修改
 * @type
 */
var KeyBindings = BricksUI.KeyBindings = {
    8: 'deleteBackward',
    9: 'insertTab',
    13: 'insertNewline',
    27: 'cancel',
    32: 'insertSpace',
    37: 'moveLeft',
    38: 'moveUp',
    39: 'moveRight',
    40: 'moveDown',
    46: 'deleteForward'
};
/**
 * 辅助键配合其他按键的修改操作
 * @type
 */
var ModifiedKeyBindings = BricksUI.ModifiedKeyBindings = {
    8: 'deleteForward',
    9: 'insertBacktab',
    37: 'moveLeftAndModifySelection',
    38: 'moveUpAndModifySelection',
    39: 'moveRightAndModifySelection',
    40: 'moveDownAndModifySelection'
};


Ember.mixin(BricksUI, {
    mouseResponderView: null,
    keyResponderStack: Em.Object.extend({
        /**
         * 当前构造器是匿名的,直接创建对象,所以这里直接属性是引用类型不会有影响
         * 如果不是,则引用类型不应该放在这里,而应该直接实例化
         */
        _stack: [],
        currentKeyResponder: function () {
            return this.current();
        }.property().volatile(),
        current: function () {
            var length = this._stack.get('length');
            return length > 0 ? this._stack.objectAt(length - 1) : null;
        },
        push: function (view) {
            if (!Ember.none(view)) {
                if (view.willBecomeKeyResponder) view.willBecomKeyResponder();
                //TODO 需要兼容旧版本浏览器才用这种方式添加样式
                if (view.set && !view.isDestroyed) view.set('isFocused', true);
                this._stack.push(view);
                if (view.didBecomeKeyResponder) view.didBecomeKeyResponder();
                this.propertyDidChange('currentKeyResponder');
            }
            return view;
        },
        pop: function () {
            if (this._stack.get('length') > 0) {
                var current = this.current();
                if (current && current.willLoseKeyResponder) current.willLoseKeyResponder();
                var view = this._stack.pop();

                if (view.set && !view.isDestroyed) view.set('isFocused', false);
                if (view.didLoseKeyResponder) view.didLoseKeyResponder();
                this.propertyDidChange('currentKeyResponder');
                return view;
            }
            else return null;
        },

        replace: function (view) {
            if (this.current() !== view) {
                this.pop();
                return this.push(view);
            }
        }
    }).create()
});


var EventManager = {
    acceptKeyResponder: false,

    becomeKeyResponder: function (replace) {
        if (this.get('acceptsKeyResponder') !== false && !this.get('isDisabled')) {
            if (replace === undefined || replace === true) {
                BricksUI.keyResponderStack.replace(this);
            } else {
                BricksUI.keyResponderStack.push(this);
            }
        } else {
            var parent = this.get('parentView');
            if (parent && parent.becomeKeyResponder) {
                return parent.becomeKeyResponder(replace);
            }
        }
    },

    resignKeyResponder: function () {
        BricksUI.keyResponderStack.pop();
    }
};
BricksUI.ALLOW_BROWSER_DEFAULT_HANDLING = {};
/**
 * 分开维护
 * @type {{}}
 */
EventManager["eventManager"] = {
    mouseDown: function (event, view) {
        view.becomeKeyResponder();  // Becoming a key responder is independent of mouseDown handling
        BricksUI.set('mouseResponderView', undefined);
        var handlingView = this._dispatch('mouseDown', event, view);
        if (handlingView) {
            BricksUI.set('mouseResponderView', handlingView);
        }
        return !handlingView;
    },

    mouseUp: function (event, view) {
        if (BricksUI.get('mouseResponderView') !== undefined) {
            view = BricksUI.get('mouseResponderView');
            BricksUI.set('mouseResponderView', undefined);
        }
        return !this._dispatch('mouseUp', event, view);
    },

    mouseMove: function (event, view) {
        if (BricksUI.get('mouseResponderView') !== undefined) {
            view = BricksUI.get('mouseResponderView');
        }
        return !this._dispatch('mouseMove', event, view);
    },

    doubleClick: function (event, view) {
        if (BricksUI.get('mouseResponderView') !== undefined) {
            view = BricksUI.get('mouseResponderView');
        }
        return !this._dispatch('doubleClick', event, view);
    },

    keyDown: function (event) {
        if (BricksUI.keyResponderStack.current() !== undefined && BricksUI.keyResponderStack.current().get('isVisible')) {
            return BricksUI.keyResponderStack.current().handleKeyEvent(event, BricksUI.keyResponderStack.current());
        }
        return true;
    },

    keyPress: function (event) {
        if (BricksUI.keyResponderStack.current() !== undefined && BricksUI.keyResponderStack.current().get('isVisible')) {
            return BricksUI.keyResponderStack.current().handleKeyEvent(event, BricksUI.keyResponderStack.current());
        }
        return true;
    },

    // For the passed in view, calls the method with the name of the event, if defined. If that method
    // returns true, returns the view. If the method returns false, recurses on the parent view. If no
    // view handles the event, returns false.
    _dispatch: function (eventName, event, view) {
        var handler = view.get(eventName);
        if (handler) {
            var result = handler.call(view, event, view);
            //TODO
            if (result === BricksUI.ALLOW_BROWSER_DEFAULT_HANDLING) return false;
            else if (result) return view;
        }
        var parentView = view.get('parentView');
        if (parentView) return this._dispatch(eventName, event, parentView);
        else return false;
    }
};

export default
    EventManager;