/**
 * @module bricksui
 * @submodule bricksui-metal
 */

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
 *  现代的UI组件大都是具有可交互性的,不再简单的支持输入输出,总是有内在的状态转换
 *  事件触发,执行动作和行为转换
 *  组件通常都是粗粒度的,有自己内部机制,组合机制等等,BricksUI采用FSM分离行为,作为默认的组合机制
 *  当设计组件时,切面能够帮助有效地帮助切分组件的功能以及帮助开发者精心考虑组件的重用的可能性
 */
var get = Ember.get,
    set = Ember.set
    ;
/**
 *
 * @type {void|*}
 */
var Stateable = Ember.Mixin.create({
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
        for (i = 0, l = path.length; i < l; i++) {
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
    object = mixin(parent ? Ember.create(parent) : {}, object);
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


export
{
    Stateable,
        wireState
}
;