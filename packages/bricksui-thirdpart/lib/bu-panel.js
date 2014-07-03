/**
 @module bricksui
 @submodule bricksui-thirdpart
 */
/**
 容器组件,可以配置头部和脚注
 * `heading` 头部说明信息
 * `footer` 脚注说明信息

 ####基本用法
 ```javascript
 {{#bs-panel heading="Simple Panel" footer="Panel Footer"}}
 <p>Panel content goes here...!</p>
 {{/bs-panel}}
 ```

 ####利用bootstrap的样式
 * type=`primary`
 * type=`success`
 * type=`info`
 * type=`warning`
 * type=`danger`

 ```javascript
 {{#bs-panel heading="Primary Panel" type="primary"}}
 <p>Panel content.</p>
 {{/bs-panel}}
 {{#bs-panel heading="Success Panel" type="success"}}
 <p>Panel content.</p>
 {{/bs-panel}}
 {{#bs-panel heading="Info Panel" type="info"}}
 <p>Panel content.</p>
 {{/bs-panel}}
 {{#bs-panel heading="Warning Panel" type="warning"}}
 <p>Panel content.</p>
 {{/bs-panel}}
 {{#bs-panel heading="Danger Panel" type="danger"}}
 <p>Panel content.</p>
 {{/bs-panel}}
 ```

 #### 更多可选配置

 * `dismiss` 设定panel是否可以被关闭,`true` `false`
 * `onClose` 配置`onClose` 会触发响应controller的action
 * `clicked` panel被点击后的action
 * `collapsible` 设置为`true`,panel可以收起和展开
 * `open` 设置为`false`,panel默认为收起状态
 ```javascript
 {{#bs-panel
     heading="Primary Panel"
     type="primary"
     collapsible=true
     open=false
     dismiss=true
     onClose="panelClosed"
     clicked="panelClicked"}}
 <p>Panel content.</p>
 {{/bs-panel}}
 ```

 @namespace BricksUI
 @class BuPanel
 @extends Ember.View
 */