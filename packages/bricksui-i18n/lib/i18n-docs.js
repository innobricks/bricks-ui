/**
 @module bricksui
 @submodule bricksui-i18n
 */

/**

 ####Ember国际化支持
 #####[Ember.I18n更多内容查看...](https://github.com/jamesarosen/ember-i18n)
 在Ember.I18n.translations中存入你所需要的国际化信息键值对，<br/>
 对于值的类型为字符串的键值对，将会通过Ember.I18n.compile编译为模板<br/>
 __*__默认使用Handlebars.compile进行模板编译(在项目中需要引入完整的Handlebars功能,换言之，需引入__Handlebar.js__
 而不是__Handlebar.runtime.js__)

 ####Example
 给定以下的国际化信息

 ```javascript
 Em.I18n.translations = {
    "user.edit.title": "Edit User",
    "user.followers.title.one": "One Follower",
    "user.followers.title.other": "All {{count}} Followers",
    "button.add_user.title": "Add a user",
    "button.add_user.text": "Add",
    "button.add_user.disabled": "Saving..."
  };
 ```
 在模板中只需引入
 ```handlebars
 <h2>{{t "user.edit.title"}}</h2>
 ```

 编译后结果
 ```html
 <h2><span id="i18n-123">Edit User</span></h2>
 ```

 默认情况下，t助手将使用span作为标签作为渲染，如果需要进行标签进行自定义，只需特别声明标签
 ```handlebars
 {{t "user.edit.title" tagName="h2"}}
 ```
 编译后结果
 ```html
 <h2 id="i18n-123">Edit User</h2>
 ```

 #####信息重载
 默认情况下，可为t助手绑定一个count属性，cout属性将在运行时替换I18n信息
 ######EXample

 直接设置count的值
 ```handlebars
 <h2>{{t "user.followers.title" count="2"}}</h2>
 ```

 编译结果为
 ```html
 <h2><span id="i18n-123">All 2 Followers</span></h2>
 ```

 绑定Count的值
 ```handlebars
 <h2>{{t "user.followers.title" count="2"}}</h2>
 ```

 编译结果为
 ```html
 <h2><span id="i18n-123">All 2 Followers</span></h2>
 ```

 ------------------------

 任意对象信息国际化

 Ember.I18n.TranslateableProperties mixin 会转换所有以Translation开头的属性

 ```javascript
 userButton = Em.Object.extend(Em.I18n.TranslateableProperties, {
    labelTranslation: 'button.add_user.title'
  });

 userButton.get('label');  // "Add a user"
 ```

 ------------------------------

 对于html类型标签，可以使用TranslateAttr 助手进行语言字段绑定

 ```handlebars
 <a {{translateAttr title="button.add_user.title" data-disable-with="button.add_user.disabled"}}>
 {{t "button.add_user.text"}}
 </a>
 ```

 编译结果：

 ```html
 <a title="Add a user" data-disable-with="Saving...">
 Add
 </a>
 ```

 --------------------------------------
 复杂类型国际化语法
 Em.I18n.translations同样支持复杂JSON对象的定义

 ```javascript
 Em.I18n.translations = {
    'user': {
      'edit': {
        'title': 'Edit User'
      },
      'followers': {
        'title': {
          'one': 'One Follower',
          'other': 'All {{count}} Followers'
        }
      }
    },
    'button': {
      'add_user': {
        'title': 'Add a user',
        'text': 'Add',
        'disabled': 'Saving...'
      }
    }
  };
 ```

 ```handlebars
 {{t "button.edit.text"}}
 ```

 编译结果：

 ```html
 <span id="i18n-123">Edit User</span>
 ```
 @namespace Ember
 @class I18n
 */