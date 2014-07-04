/**
 @module bricksui
 @submodule bricksui-thirdpart
 */
/**
 BuGrowlNotifications是一种标准的通知组件实现，可以实现信息提示的功能
 基本用法:在application Template中放入以下的占位符
 ```handlebars
 {{bu-growl-notifications}}
 ```
 在代码中调用Bootstrap.GNM.push()功能，传入相关的参数，即可实现消息的推送
 ```javascript
 Showcase.ShowComponentsGrowlNotifController = Ember.Controller.extend({
      pushInfo: function() {
        Bootstrap.GNM.push('INFO!', 'Hello, this is just an info message.', 'info');
      },
      pushSuccess: function() {
        Bootstrap.GNM.push('SUCCESS!', 'Successfully performed operation!', 'success');
      },
      pushWarn: function() {
        Bootstrap.GNM.push('WARN!', 'Could not perform operation!', 'warning');
      },
      pushDanger: function() {
        Bootstrap.GNM.push('Danger!', 'System is halting!', 'danger');
      }
    });
 ```

 ----------------------
 可选参数有

 ```html
 showTime {number} 秒   信息提示显示的时间
 ```

 @namespace BricksUI
 @class BuGrowlNotifications
 @extends Ember.View
 */
