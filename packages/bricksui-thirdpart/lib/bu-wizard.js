/**
 @module bricksui
 @submodule bricksui-thirdpart
 */
/**
 Bootstrap 向导组件，对向导功能提供封装


 ####基本用法
 ```handlebars
 {{bu-wizard contentBinding="steps"}}
 ```
 对应控制器
 ```javascript
 Showcase.ShowComponentsWizardController = Ember.Controller.extend({
      init: function() {
        this._super();
        this.set('steps', Ember.A([
          Ember.Object.create({title: 'Foo', template: 'tabu/foo-tabpane'}),
          Ember.Object.create({title: 'Bar', template: 'tabu/bar-tabpane'}),
          Ember.Object.create({title: 'Baz', template: 'tabu/baz-tabpane'})
        ]));
      }
    });
 ```

 ------------------
 ###禁用Step选择功能
 有些时候，需要特定步骤的Wizard，则可以指定 disabled=true ，禁止Step选择，只允许通过代码改变Step
 ```handlebars
 {{bu-wizard prevAllowed=false contentBinding="stepsNoPrev"}}
 ```

 ```javascript
 Showcase.ShowComponentsWizardController = Ember.Controller.extend({
      init: function() {
        this._super();
        this.set('steps', Ember.A([
          Ember.Object.create({title: 'Step1', template: 'tabu/foo-tabpane', disabled="true"}),
          Ember.Object.create({title: 'Step2', template: 'tabu/bar-tabpane', disabled="true"}),
          Ember.Object.create({title: 'Step3', template: 'tabu/baz-tabpane', disabled="true"})
        ]));
      }
    });
 ```

 ------------------------------
 #####通过编程方式，创建Wizard视图
 ```handlebars
 {{bu-button title="Start Wizard" type="primary" clicked="createWizard"}}
 ```

 ```javascript
 Showcase.ShowComponentsWizardController = Ember.Controller.extend({
      actions: {
        createWizard: function() {
          var body;
          body = Bootstrap.buWizardComponent.extend({
            content: [
              Ember.Object.create({title: 'Step1', template: 'wizard/step1', disabled: true}),
              Ember.Object.create({title: 'Step2', template: 'wizard/step2', disabled: true}),
              Ember.Object.create({title: 'Step3', template: 'wizard/step3', disabled: true})
            ],
            targetObject: this,
            onNext: "onNext",
            onPrev: "onPrev",
            onFinish: 'onFinish'
          });
          Bootstrap.ModalManager.open('manualModal', 'Wizard Title...', body, null, this);
        },
        onNext: function() {
          return console.log('NEXT');
        },
        onPrev: function() {
          return console.log('PREV');
        },
        onFinish: function() {
          Bootstrap.ModalManager.close('manualModal');
          return Bootstrap.NM.push('Wizard completed!');
        }
      }
    });
 ```


 @namespace BricksUI
 @class BuWizard
 @extends Ember.View
 */