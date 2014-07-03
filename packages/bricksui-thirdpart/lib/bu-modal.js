/**
 @module bricksui
 @submodule bricksui-thirdpart
 */
/**
 对应Bootstrap modal组件，对Bootstrap modal进行轻量级封装


 ####基本用法
 ```handlebars
 {{bu-button title="Show Modal" clicked="show"}}
 {{#bu-modal name="myModal" fade=true footerButtonsBinding="myModalButtons" title="My Modal"}}
 <p>Modal content!</p>
 {{/bu-modal}}
 ```

 对应控制器
 ```javascript
 Showcase.ShowComponentsModalController = Ember.Controller.extend({
      myModalButtons: [
          Ember.Object.create({title: 'Submit', clicked:"submit"})
          Ember.Object.create({title: 'Cancel', clicked:"cancel", dismiss: 'modal'})
      ],

      actions: {
        //Submit the modal
        submit: function() {
          Bootstrap.NM.push('Successfully submitted modal', 'success');
          return Bootstrap.ModalManager.hide('myModal');
        },

        //Cancel the modal, we don't need to hide the model manually because we set {..., dismiss: 'modal'} on the button meta data
        cancel: function() {
          return Bootstrap.NM.push('Modal was cancelled', 'info');
        },

        //Show the modal
        show: function() {
          return Bootstrap.ModalManager.show('myModal');
        }
      }
    });
 ```

 ------------------
 #####确认型modal
 ```handlebars
 {{bu-button title="Delete" clicked="confirm"}}
 ```
 对应控制器
 ```javascript
 Showcase.ShowComponentsModalController = Ember.Controller.extend({
    confirm: {
        confirm: {
            Bootstrap.ModalManager.confirm(@);
 },
 //invoked when user press "confirm"
 modalConfirmed: {
            Bootstrap.NM.push('Confirmed!', 'success')
        },
 //invoked when user press "cancel"
 modalCanceled: {
            Bootstrap.NM.push('Cancelled!', 'info')
        }
 }
 })
 ```

 Bootstrap.ModalManager.confirm可接受的参数有

 ```html
 controller 对应的控制器，可手动指定
 title        modal窗口标题
 message    model的内容
 confirmButtonTitle    确定按钮的文本描述
 cancelButtonTitle    取消按钮的文本描述
 ```

 ------------------------------
 #####通过编程方式调用modal

 ```handlebars
 //we only render a button which will programatically create the modal
 {{bu-button title="Create Modal" clicked="createModalProgramatically"}}
 ```

 对应控制器

 ```javascript
 Showcase.ShowComponentsModalController = Ember.Controller.extend({
      manualButtons: [
          Ember.Object.create({title: 'Submit', clicked:"submitManual"})
          Ember.Object.create({title: 'Cancel', dismiss: 'modal'})
      ],

      actions: {
        submitManual: function() {
          Bootstrap.NM.push('Modal destroyed!', 'success');
          return Bootstrap.ModalManager.close('manualModal');
        },
        createModalProgramatically: function() {
             //@property {string} The name of the modal, required later to close the modal (see submitManual function above)
 //@property {string} The title of the modal.
 //@property {string} The template name to render within the modal body, a View class may also be specified.
 //@property {array} Array of Button meta data
 //@property {object} The controller instance that instantiate the modal.
 Bootstrap.ModalManager.open('manualModal', 'Hello', 'demo-template', this.manualButtons, this);
 }
 }
 });
 ```



 @namespace BricksUI
 @class BuModal
 @extends Ember.View
 */