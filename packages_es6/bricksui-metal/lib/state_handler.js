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

export default
StateHandler;
