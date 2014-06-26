/**
 @module bricksui
 @submodule bricksui-form
 */
/**
 一个`tab-pane`代表一个tab页签
 `bu-tabs-panes` 需要有一个`contentBinding` 属性,用来生成所有的tab标签页,
 `bu-tabs-panes`与`bu-tabs`是配套使用的,`bu-tabs`生成tab组件页签头,`bu-tabs-panes`生成内容,
 所以两者需要有一个关联,这就是`items-id`.

 ``` html
 <div class="bs-example">
 {{bu-tabs id="tabs1" contentBinding="tabsMeta" default="Foo"}}
 {{bu-tabs-panes items-id="tabs1" contentBinding="tabsMeta"}}
 </div>
 ```

 * `bu-tas`需要配置一个`id`属性
 * `bu-tabs-panes`根据content生成各个内容标签
 * `items-id` 必须要跟`bu-tabs`的id挂钩
 * `default`可以设置tab组件的默认标签页

 配置项如下:

 ``` javascript
 SomeController = Ember.Controller.extend({
    tabsMeta: Ember.A([
            Ember.Object.create({ title: 'Foo', template: 'tabs/foo-tabpane', controller: 'ShowcaseComponentsTabsFoo'}),
            Ember.Object.create({ title: 'Bar', template: 'tabs/bar-tabpane'})
    ]);
});

 `template` 指定tab内容页的模板
 `controller` 可以指定tabs标签页的控制器

 ```

 @namespace BricksUI
 @class BuTabs
 @extends Ember.Namespace
 */