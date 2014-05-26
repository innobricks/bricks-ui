define("bricks-metal/core",
  ["exports"],
  function(__exports__) {
    "use strict";
    /**
     * @module bricks
     * @submodule bricks-metal
     */
    
    /**
     *  Brics ,a widget library on ember.js
     *  @class Bricks
     *  @statis
     *  @version VERSION_STRING_PLACEHOLDER
     */
    if ("undefined" === typeof Bricks) {
        Bricks = Ember.Namespace.create();
    }
    /**
     @property VERSION
     @type String
     @default 'VERSION_STRING_PLACEHOLDER'
     @static
     */
    Bricks.VERSION = 'VERSION_STRING_PLACEHOLDER';
    
    __exports__["default"] = Bricks;
  });
define("bricks-metal/event_manager",
  ["bricks-metal/core","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Bricks = __dependency1__["default"];
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
                    emberEvent:"keyDown";
                    break;
                case "keypress":
                    emberEvent = "keyPress";
                    break;
            }
            var handler = emberEvent ? this.get(emberEvent) : null;
            if (handler) {
                return !handler.call(Bricks.keyResponderStack.current(), event, Bricks.keyResponderStack.current())
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
    var KeyBindings = Bricks.KeyBindings = {
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
    var ModifiedKeyBindings = Bricks.ModifiedKeyBindings = {
        8: 'deleteForward',
        9: 'insertBacktab',
        37: 'moveLeftAndModifySelection',
        38: 'moveUpAndModifySelection',
        39: 'moveRightAndModifySelection',
        40: 'moveDownAndModifySelection'
    };


    Ember.mixin(Bricks, {
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
                    if (view.set && !view.isDestroyed) view.set('isFocused', true)
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
                    Bricks.keyResponderStack.replace(this);
                } else {
                    Bricks.keyResponderStack.push(this);
                }
            } else {
                var parent = this.get('parentView');
                if (parent && parent.becomeKeyResponder) {
                    return parent.becomeKeyResponder(replace);
                }
            }
        },

        resignKeyResponder: function () {
            Bricks.keyResponderStack.pop();
        }
    };
    Bricks.ALLOW_BROWSER_DEFAULT_HANDLING = {};
    /**
     * 分开维护
     * @type {{}}
     */
    EventManager["eventManager"] = {
        mouseDown: function (event, view) {
            view.becomeKeyResponder();  // Becoming a key responder is independent of mouseDown handling
            Bricks.set('mouseResponderView', undefined);
            var handlingView = this._dispatch('mouseDown', event, view);
            if (handlingView) {
                Bricks.set('mouseResponderView', handlingView);
            }
            return !handlingView;
        },

        mouseUp: function (event, view) {
            if (Bricks.get('mouseResponderView') !== undefined) {
                view = Bricks.get('mouseResponderView');
                Bricks.set('mouseResponderView', undefined);
            }
            return !this._dispatch('mouseUp', event, view);
        },

        mouseMove: function (event, view) {
            if (Bricks.get('mouseResponderView') !== undefined) {
                view = Bricks.get('mouseResponderView');
            }
            return !this._dispatch('mouseMove', event, view);
        },

        doubleClick: function (event, view) {
            if (Bricks.get('mouseResponderView') !== undefined) {
                view = Bricks.get('mouseResponderView');
            }
            return !this._dispatch('doubleClick', event, view);
        },

        keyDown: function (event) {
            if (Bricks.keyResponderStack.current() !== undefined && Bricks.keyResponderStack.current().get('isVisible')) {
                return Bricks.keyResponderStack.current().handleKeyEvent(event, Bricks.keyResponderStack.current());
            }
            return true;
        },

        keyPress: function (event) {
            if (Bricks.keyResponderStack.current() !== undefined && Bricks.keyResponderStack.current().get('isVisible')) {
                return Bricks.keyResponderStack.current().handleKeyEvent(event, Bricks.keyResponderStack.current());
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
                if (result === Bricks.ALLOW_BROWSER_DEFAULT_HANDLING) return false;
                else if (result) return view;
            }
            var parentView = view.get('parentView');
            if (parentView) return this._dispatch(eventName, event, parentView);
            else return false;
        }
    };

    __exports__["default"] = EventManager;
  });
define("bricks-metal",
  [],
  function() {
    "use strict";
    /**
     * Created by jiangwy on 5/14/14.
     */
    function main(){

    }
  });
define("bricks-metal/state_handler",
  ["exports"],
  function(__exports__) {
    "use strict";
    /**
     * 状态处理器
     * 在extend时将states属性移到_states属性,
     * 继承该接口,可以实现states在子父类间继承
     *
     *  App.DemoView=Bricks.View.extend({
     *      states:{
     *
     *      }
     *  });
     *
     *  App.DemoView=Bricks.View.extend({
     *      states:function(){
     *          return {
     *
     *          };
     *      }
     *  });
     *  TODO
     *  1.状态继承需要处理
     */
    var merge = Ember.merge,
        Mixin = Ember.Mixin,
        get = Ember.get,
        typeOf = Ember.typeOf
        ;
    /**
     * @class StateHandler
     * @namespace Bricks
     */
    var StateHandler = Mixin.create({
        mergedProperties: ["_states"],

        willMergeMixin: function (props) {
            //TODO 处理 super 方法
            var hashName;
            if (!props._states) {
                if (typeof (props.states) === "function") {
                    props.states = props.states();
                }
                if (typeof (props.states) === "object") {
                    hashName = "states";
                }
                if (hashName) {
                    props._states = Ember.merge(props._states || {}, props[hashName]);
                }
                //这里处理了states属性,后续就不再需要处理,所以删除
                delete props[hashName];
            }
        }
        /*
         send:function(actionName){
         //TODO
         }
         */
    });
    /**
     * TODO
     * 1.从Event入手
     * 2.从Action入手,Action也是有Event入手,但是不用管理Event
     *      需要在模板里面显示指定action
     *      模板也是组件的内部属性,所以模板操作state是合理的
     *  Ember target 有两个内置关键字:controller和 view
     *  现在多加一个内置关键字:states,让用户可以从模板触发
     *  {{action unfold target="states"}}
     */

    __exports__["default"] = StateHandler;
  });
define("bricks-metal/stateable",
  ["exports"],
  function(__exports__) {
    "use strict";
    /**
     * 有限状态机(Finite State Machine)
     *   有限状态机对行为建模
     *      1、事件：程序对事件进行响应
     *      2、状态：程序在事件间的状态
     *      3、转移：对应于事件，状态间的转移
     *      4、动作：转移过程中采取动作
     *      5、变量：变量保存事件间的动作所需的值
     *   状态设计要点：
     *      1、在该状态下，该事件是否可能发生
     *      2、采取什么动作来处理事件
     *      3、事件过后转移到什么状态
     *      4、在事件之间需要记录什么变量（数据）
     *
     */
    var get = Ember.get,
        set = Ember.set
        ;
    /**
     *
     * @type {void|*}
     */
    var Stateable = Em.Mixin.create({
        /**
         * 初始状态
         */
        initialState: null,
        /**
         * 公有属性,用户需要以此获得当前状态
         * 当前状态,
         */
        activeState: null,
        /**
         *  触发状态上的事件
         * @param name
         * @param context
         * @returns {*}
         */
        send: function (name, context) {
            var currentState = get(this, 'currentState');
            if (!currentState[name]) {
                this._unhandledEvent(currentState, name, context);
            }
            return currentState[name](this, context);
        },
        /**
         * 状态过度方法
         * @param name
         */
        transitionTo: function (name) {
            var pivotName = name.split(".", 1),
                currentState = get(this, 'currentState'),
                state = currentState;
            do {
                if (state.exit) {
                    state.exit(this);
                }
                state = state.parentState;
            } while (!state.hasOwnProperty(pivotName));
    
            var path = name.split(".");
            var setups = [], enters = [], i, l;
            for (var i = 0, l = path.length; i < l; i++) {
                state = state[path[i]];
                if (state.enter) {
                    enters.push(state);
                }
                if (state.setup) {
                    setups.push(state);
                }
            }
    
            for (i = 0, l = enters.length; i < l; i++) {
                enters[i].enter(this);
            }
            set(this, 'currentState', state);
            for (i = 0, l = setups.length; i < l; i++) {
                setups[i].setup(this);
            }
        },
        /**
         * 当前状态没有对应事件，则直接抛出异常
         * @param state
         * @param name
         * @param context
         * @private
         */
        _unhandleEvent: function (state, name, context) {
            var errorMessage = "Attempted to handle event `" + name + "` ";
            errorMessage += "on " + String(this) + " while in state ";
            errorMessage += state.stateName + ". ";
    
            if (context !== undefined) {
                errorMessage += "Called with " + Ember.inspect(context) + ".";
            }
    
            throw new Ember.Error(errorMessage);
        }
    });
    /**
     * 根据指定对象，扩展，类似于具备功能的接口扩展
     * 非深度
     * @param original
     * @param hash
     * @returns {*}
     */
    function mixin(original, hash) {
        for (var prop in hash) {
            original[prop] = hash[prop];
        }
        return original;
    }
    /**
     * 由于状态机不止组件可以使用,其他可以拆分为各种状态的都可以使用,所以该方法需要是公开的API
     * 装配状态
     * 每个状态都添加parentState的引用
     * 每个状态都增加全状态路径名称
     * root
     *     empty    -->root.empty
     *     deleted  -->root.deleted
     */
    function wireState(object, parent, name) {
        object = mixin(parent ? Em.create(parent) : {}, object);
        object.parentState = parent;
        object.stateName = name;
    
        for (var prop in object) {
            if (!object.hasOwnProperty(prop) || prop === "parentState" || prop === "stateName") {
                continue;
            }
            if (typeof object[prop] === "object") {
                object[prop] = wireState(object[prop], object, name + "." + prop);
            }
        }
    }
    
    
    __exports__.Stateable = Stateable;
    __exports__.wireState = wireState;
  });
define("bricks-metal/view",
  ["bricks-metal/core","bricks-metal/statechart","bricks-metal/event_manager","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Bricks = __dependency1__["default"];
    var Stateable = __dependency2__["default"];
    var EventManager = __dependency3__["default"];
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
     */
    //TODO ES6
    /**
     * 基类具备状态机管理功能
     * 如何将事件传播到state中,执行对应的action
     * 在模板里面添加states的action-->{{action unfoldmenu target="states"}}
     * mouseDown(click)-> view.states["activeState"]["unfoldmenu"]
     * record.loadingData->record.currentState["loadingData"]
     */
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

    __exports__.View = View;
  });