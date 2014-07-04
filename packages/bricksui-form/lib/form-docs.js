/**
 @module bricksui
 @submodule bricksui-form
 */

/**
 #####[EMBER-EASYFORM](https://github.com/dockyard/ember-easyForm)
 Ember-EasyForm提供对基础表单的封装，同时提供I18n以及字段校验的功能

 #####formFor助手用法
 ```handlebars
 {{#form-for model}}
 {{input firstName}}
 {{input lastName}}
 {{input bio as="text"}}
 {{input country as='select'
      collection="App.countries"
      selection="country"
      optionValuePath="content.id"
      optionLabelPath="content.name"
      prompt="Select Country"
 }}
 {{/form-for}}
 ```
 编译结果

 ```html
 <form>
 <div class="input string">
 <label for="ember1">First name</label>
 <input id="ember1" type="text"/>
 <span class="error"></span>
 </div>
 <div class="input string">
 <label for="ember2">Last name</label>
 <input id="ember2" type="text"/>
 <span class="error"></span>
 </div>
 <div class="input string">
 <label for="ember3">Bio</label>
 <textarea id="ember3"></textarea>
 <span class="error"></span>
 </div>
 <div class="input string">
 <label for="ember4">Country</label>
 <select id="ember4">
 xxx
 </select>
 <span class="error"></span>
 </div>
 </form>
 ```
 --------------------------------------
 Ember.EasyForm 允许通过设置input的as属性改变input组件的行为
 ```handlebars
 {{input secret as="hidden"}}
 ```
 ----------------------------------------
 Ember.EasyForm 可以根据传入的字段名称判断组件的行为，该行为可被as覆盖

 ```handlebars
 {{input email}}
 {{input password}}
 <em>第一个输入框type=email 第二个输入框type=password</em>
 ```
 ------------------------------------------
 传入label属性可以设置对象属性的名称
 ```handlebars
 {{input email label="电子邮箱..."}}
 ```

 label也可以为一个绑定属性
 ```handlebars
 {{input email labelBinding="emailLabel"}}
 ```

 placeholder设置文本框的占位符
 ```handlebars
 {{input firstName placeholder="Enter your first name"}}
 <em>placeholder也可以是一个绑定属性</em>
 ```

 也可在input中设置hint的属性，该属性将在input校验失败时，进行友好的校验提示
 ```handlebars
 {{input firstName hint="Enter your first name"}}
 <em>hint也可以是一个绑定属性</em>
 ```

 ------------------------------------------
 对于复杂的表单属性，也可以将input作为Block Helper使用,其中input-field指代html- input标签
 ```handlebars
 {{#input firstName}}
 {{input-field firstName}}{{label-field firstName}}
 <br/>
 {{error-field firstName}}
 {{/input}}
 ```

 Ember.EasyForm.InputField允许传入一个text作为input的Label

 ```handlebars
 {{label-field firstName text="Your first name"}}
 ```

 input-field也可以制定as字段，as字段的可选值有
 + text  -- textArea
 + email -- type=email
 + password -- type=password
 + url
 + color
 + tel
 + search
 + hidden
 + checkbox

 ```handlebars
 {{input-field bio as="text"}}
 {{input-field email}}
 ```

 ----------------------------

 #####error-field
 error-field指代校验失败后校验的信息
 ```handlebars
 {{error-field firstName}}
 ```

 ---------------------------------
 #####hint-field
 hint-field指代在表单校验失败后出现的用户提示信息（如：“用户名不能未空...”）
 ```handlebars
 {{hint-field firstName text="Your first name"}}
 ```


 ----------------------------------
 #####表单验证
 默认情况下，在表单元素触发了focus-out时，将触发表单的校验

 ----------------------------------
 #####i18n集成
 对于需要进行i18n的表单元素，Ember.EasyForm提供Translation后缀，进行表单国际化的工作

 ```handlebars
 {{input firstName placeholderTranslation="users.attributes.firstname"}}
 {{input firstName labelTranslation="users.attributes.firstname"}}
 {{input firstName hintTranslation="users.hints.firstname"}}
 {{input-field firstName placeholderTranslation="users.attributes.firstname"}}
 {{label-field firstName textTranslation="users.attributes.firstname"}}
 {{hint-field firstName textTranslation="users.hints.firstname"}}
 ```
 __更多I18n内容，见Ember.I18n文档__


 @namespace Ember
 @class EasyForm
 */



/**
 Ember.EasyForm配置项，可以向Config内注册自定义组件，注册自定义模板等
 @class Config
 @namespace Ember.EasyForm
 */

/**
 ###Wrapper
 Wrapper定义了EasyForm渲染视图时的样式与模板

 可定制项包括:
 + fieldErrorClass - class used by the field containing errors
 + formClass - class used by the form
 + inputClass - class used by the div containing all elements of the input (label, input, error and hint)
 + errorClass - class used by the error message
 + hintClass - class used by the hint message
 + labelClass - class used by the label
 + inputTemplate - template used by {{input}}
 + labelTemplate - template used by {{label-field}}
 + errorTemplate - template used by {{error-field}}
 + hintTemplate - template used by {{hint-field}}

 ####默认Wrapper配置情况
 + formClass - "" (empty)
 + fieldErrorClass - "fieldWithErrors"
 + inputClass - "input"
 + errorClass - "error"
 + hintClass - "hint"
 + labelClass - "" (empty)
 + inputTemplate - "easyForm/input"
 + labelTemplate - "easyForm/label"
 + errorTemplate - "easyForm/error"
 + hintTemplate - "easyForm/hint"

 @property Wrapper
 @memberOf Ember.EasyForm
 */




/**
 向Ember.EasyForm Wrapper中注册一个Wraper
 ```javascript
 Ember.EasyForm.Config.registerWrapper('my-wrapper', {
  formClass: 'my-form',
  errorClass: 'my-error',
  hintClass: 'my-hint',
  labelClass: 'my-label'
});
 ```

 ```handlebars
 {{#form-for model wrapper="my-wrapper"}}
 {{input firstName}}
 {{input lastName}}
 {{/form-for}}
 ```
 编译结果为
 ```html
 <form class="my-form">
 <div class="input string">
 <label for="ember1">First name</label>
 <input id="ember1" type="text"/>
 <span class="error"></span>
 </div>
 <div class="input string">
 <label for="ember2" class="my-label">Last name</label>
 <input id="ember2" type="text"/>
 <span class="error my-error"></span>
 </div>
 </form>
 ```

 ----------------------------------------
 Ember.EasyForm也支持向Wrapper中注册模板
 ```javascript
 Ember.EasyForm.Config.registerWrapper('twitter-bootstrap', {
      // Define the custom template
      inputTemplate: 'bootstrap-input',

      // Define a custom config used by the template
      controlsWrapperClass: 'controls',

      // Define the classes for the form, label, error...
      formClass: 'form-horizontal',
      fieldErrorClass: 'error',
      errorClass: 'help-inline',
      hintClass: 'help-block',
      labelClass: 'control-label',
      inputClass: 'control-group'
    });
 ```
 bootstrap-input模板
 ```handlebars
 {{label-field propertyBinding="view.property" textBinding="view.label"}}
 <div class="{{unbound view.wrapperConfig.controlsWrapperClass}}">
 {{partial "easyForm/inputControls"}}
 </div>
 ```



 @method registerWrapper
 @for Ember.EasyForm.Config
 */
