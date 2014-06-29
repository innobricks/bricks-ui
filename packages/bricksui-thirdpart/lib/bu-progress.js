/**
 @module bricksui
 @submodule bricksui-thirdpart
 */
/**
 对应Bootstrap progress组件，对Bootstrap progress组件进行轻量级封装


 ####基本用法
 ```handlebars
 {{bu-progress progress=60}}
 ```

 ------------------
 ###type
 ```handlebars
     {{!--可根据type的类型，指定progress的呈现行为--}}
     {{bu-progress progress=40 type="success"}}
     {{bu-progress progress=20 type="info"}}
     {{bu-progress progress=60 type="warning"}}
     {{bu-progress progress=80 type="danger"}}
 ```

 ------------------------------

 ###binding

 ```handlebars
 {{bu-progress progressBinding="prog"}}
 {{bu-button clicked="increment" content="Increment!"}}
 ```

 也可以以对progress进行值的绑定
 ```javascript
     Showcase.ShowComponentsProgressbarController = Ember.Controller.extend({
      prog: 0,
      incrementBy: 20,
      increment: function() {
        if (this.prog < 100) {
          return this.incrementProperty("prog", this.incrementBy);
        } else {
          return this.set("prog", this.incrementBy);
        }
      }
    });
 ```
 ---------------------------

 progressbar 堆叠

 ```handlebars
     {{#bu-progress}}
     {{bu-progressbar type="success" progress="35"}}
     {{bu-progressbar type="warning" progress="20"}}
     {{bu-progressbar type="danger" progress="10"}}
     {{/bu-progress}}
 ```


 ------------------------------------

 ```html
 可选的参数有
 + stripped 添加斜线样式 {boolean}
 + animated 是否添加CSS3样式 {boolean}
 ```

 @namespace BricksUI
 @class BuProgress
 @extends Ember.View
 */