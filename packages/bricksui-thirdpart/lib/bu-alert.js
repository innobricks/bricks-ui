/**
 @module bricksui
 @submodule bricksui-thirdpart
 */
/**
 对应Bootstrap alert组件，对Bootstrap alert进行轻量级封装


 ####基本用法
 ```handlebars
 {{bu-alert message="A warning alert with simple message." type="warning"}}
 ```

 ####利用bootstrap的样式
 * type=`primary`
 * type=`success`
 * type=`info`
 * type=`warning`
 * type=`danger`

 ```javascript
 {{#bu-alert message="Primary alert" type="primary"}}
 <p>Panel content.</p>
 {{/bu-alert}}
 {{#bu-alert message="Success alert" type="success"}}
 <p>Panel content.</p>
 {{/bu-alert}}
 {{#bu-alert message="Info alert" type="info"}}
 <p>Panel content.</p>
 {{/bu-alert}}
 {{#bu-alert message="Warning alert" type="warning"}}
 <p>Panel content.</p>
 {{/bu-alert}}
 {{#bu-alert message="Danger alert" type="danger"}}
 <p>Panel content.</p>
 {{/bu-alert}}
 ```

 #### 更多可选配置
 * `message` alert内显示的信息
 * `dismiss` 设定panel是否可以被关闭,`true` `false`
 * `dismissAfter` 配置`dismissAfter` alert会在多少秒后消失 `number`
 * `fade` 配置`fade` ,则在关闭时，会显示淡出动画
 * `close` 在关闭时触发控制器对应的方法
 * `closed` 在关闭完成后触发控制器对应的方法（在淡出动画完成后）
 ```javascript
 {{#bu-alert type="danger"}}
 <h4 class="alert-heading">Oh snap! You got an error!</h4>
 <p>Alert can also be used in a <strong>block form</strong>.</p>
 <p>
 <button class="btn btn-danger" {{action "submit"}}>Take this action</button> <a class="btn btn-default">Or do this</a>
 </p>
 {{/bu-alert}}
 ```

 @namespace BricksUI
 @class BuAlert
 @extends Ember.View
 */