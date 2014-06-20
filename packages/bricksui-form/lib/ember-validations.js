/**
 @module bricksui
 @submodule bricksui-form
 */
/**

 ## 用法 ##

 需要将`Ember.Validations.Mixin`集成到任何你想要添加验证的控制器上

 ```javascript
 var App.UserController = Ember.ObjectController.extend(Ember.Validations.Mixin);
 ```

 需要定义一个validations对象作为控制器的一个属性,用来标识当前模型的验证规则.
 对象的keys要一一映射模型的属性.如果你传入了一个JSON对象作为一个属性的值,则该值将被作为当前属性的验证规则.
 如果你传入了`true`,则该属性将被标记为需要被验证的.如下:

 ```javascript
 App.UserController.reopen({
  validations: {
    firstName: {
      presence: true,
      length: { minimum: 5 }
    },
    age: {
      numericality: true
    },
    profile: true
  }
});
 ```

 ## 校验器 ##

 当前已经支持的校验器如下所示:

 ### Absence ###
 验证属性值是`null`,`undefined` 或者是 `''`.

 #### Options ####
 * `true` - 设置为`true`将激活控制校验并且使用默认提示信息
 * `message` - 错误提示信息,可以如果提供了,将会覆盖默认的提示信息

 ```javascript
 // Examples
 absence: true
 absence: { message: 'must be blank' }
 ```

 ### Acceptance ###
 默认可被接受的值为`'1'`, `1`, and `true`.

 #### Options ####
 * `true` - 设置为`true`将激活控制校验并且使用默认提示信息
 * `message` - 错误提示信息,可以如果提供了,将会覆盖默认的提示信息
 * `accept` - 可被接受的值

 ```javascript
 // Examples
 acceptance: true
 acceptance: { message: 'you must accept', accept: 'yes' }
 ```

 ### Confirmation ###
 相同值校验

 #### Options ####
 * `true` - 设置为`true`将激活控制校验并且使用默认提示信息
 * `message` - 错误提示信息,可以如果提供了,将会覆盖默认的提示信息

 ```javascript
 // Examples
 confirmation: true
 confirmation: { message: 'you must confirm' }
 ```

 ### Exclusion ###
 排除校验

 #### Options ####
 * `message` - 错误提示信息,可以如果提供了,将会覆盖默认的提示信息
 * `allowBlank` - 如果设置为`true`,值为空将跳过校验
 * `in` - 被允许的数组
 * `range` - 区间

 ```javascript
 // Examples
 exclusion: { in: ['Yellow', 'Black', 'Red'] }
 exclusion: { range: [5, 10], allowBlank: true, message: 'cannot be between 5 and 10' }
 ```

 ### Format ###
 正则,格式化校验

 #### Options ####
 * `message` - 错误提示信息,可以如果提供了,将会覆盖默认的提示信息
 * `allowBlank` - 如果设置为`true`,值为空将跳过校验
 * `with` - 正则表达式

 ```javascript
 // Examples
 format: { with: /^([a-zA-Z]|\d)+$/, allowBlank: true, message: 'must be letters and numbers only'  }
 ```

 ### Inclusion ###
 被允许的值
熬过校验
 #### Options ####
 * `message` - 错误提示信息,可以如果提供了,将会覆盖默认的提示信息.
 * `allowBlank` - 如果设置为`true`,值为空将跳过校验
 * `in` - 被允许的数组
 * `range` - 区间

 ```javascript
 // Examples
 inclusion: { in: ['Yellow', 'Black', 'Red'] }
 inclusion: { range: [5, 10], allowBlank: true, message: 'must be between 5 and 10' }
 ```

 ### Length ###
 定义属性的长度

 #### Options ####
 * `number` - 跟`is`作用一样,长度必须时指定值
 * `array` - 数组里面有两个值,第一个元素代表最小值,第二个元素达标最大值,即长度的区间
 * `allowBlank` - 如果设置为`true`,值为空将跳过校验
 * `minimum` - 被允许的最小长度
 * `maximum` - 被允许的最大长度
 * `is` - 跟`number`作用一样,长度必须时指定值
 * `tokenizer` - 校验时执行的自定以函数,返回一个代表长度的对象

 ##### Messages #####
 * `tooShort` - 当不满足最小长度验证规则时,该错误信息将被应用显示,可覆盖默认的提示信息
 * `tooLong` - t当不满足最大长度验证规则时,该错误信息将被应用显示,可覆盖默认的提示信息
 * `wrongLength` - 当校验失败时,该错误信息将被应用显示,可覆盖默认的提示信息

 ```javascript
 // Examples
 length: 5
 length: [3, 5]
 length: { is: 10, allowBlank: true }
 length: { minimum: 3, maximum: 5, messages: { tooShort: 'should be more than 3 characters', tooLong: 'should be less than 5 characters' } }
 length: { is: 5, tokenizer: function(value) { return value.split(''); } }
 ```

 ### Numericality ###
 校验是否是一个数值

 #### Options ####
 * `true` -设置为`true`将激活控制校验并且使用默认提示信息
 * `allowBlank` - 如果设置为`true`,值为空将跳过校验
 * `onlyInteger` - 只能是整数
 * `greaterThan` - 一定要大于指定数
 * `greaterThanOrEqualTo` - 一定要大于等于指定数
 * `equalTo` - 一定要等于指定数
 * `lessThan` - 一定要小于指定数
 * `lessThanOrEqualTo` - 一定要小于等于指定数
 * `odd` - 一定是奇数
 * `even` - 一定是偶数

 ##### Messages #####
 * `greaterThan` -当大于校验失败时,该错误信息将被应用显示,可覆盖默认的提示信息
 * `greaterThanOrEqualTo` - 当大于等于校验失败时,该错误信息将被应用显示,可覆盖默认的提示信息
 * `equalTo` - 当等于校验失败时,该错误信息将被应用显示,可覆盖默认的提示信息
 * `lessThan` - 当小于校验失败时,该错误信息将被应用显示,可覆盖默认的提示信息
 * `lessThanOrEqualTo` - 当小于等于校验失败时,该错误信息将被应用显示,可覆盖默认的提示信息
 * `odd` - 当奇数校验失败时,该错误信息将被应用显示,可覆盖默认的提示信息
 * `even` - 当偶数校验失败时,该错误信息将被应用显示,可覆盖默认的提示信息

 ```javascript
 // Examples
 numericality: true
 numericality: { odd: true, messages: { odd: 'must be an odd number' } }
 numericality: { onlyInteger, greaterThan: 5, lessThanOrEqualTo : 10 }
 ```

 ### Presence ###
 非空校验`null`, `undefined`, or `''`

 #### Options ####
 * `true` - 设置为`true`将激活控制校验并且使用默认提示信息
 * `message` - 错误提示信息,可以如果提供了,将会覆盖默认的提示信息

 ```javascript
 // Examples
 presence: true
 presence: { message: 'must not be blank' }
 ```

 ### Uniqueness ###

 *尚未实现*

 ### URL ##

 校验是否是一个URL.

 #### Options ####
 * `allowBlank` - 如果设置为`true`,值为空将跳过校验
 * `allowIp` - 如果设置为`true`,将使用IP地址进行校验URL,IP地址默认是非法的
 * `allowUserPass` - 如果设置为`true`,将校验URL是否有用户名和密码,默认情况是不允许用户名和密码
 * `allowPort` - 如果设置为`true`,将校验URL是否带有端口号,默认情况是不允许有端口号
 * `domainOnly` - 如果设置为`true`,将校验URL是否时主域名和子域名.
 * `protocols` - 可被接受的协议数组,默认为`http`,`https`

 ```javascript
 // Examples
 url { allowUserPass: true }
 url { allowBlank: true, allowIp: true, allowPort: true, protocols: ['http', 'https', 'ftp'] }
 url { domainOnly: true }
 ```

 ### Conditional Validators ##

 每个校验器都可以带有一个`if` 或者 一个`unless`.条件判断.

 ```javascript
 // function form
 firstName: {
  presence: {
    if: function(object, validator) {
      return true;
    }
  }
}

 // string form
 // if 'canValidate' is a function on the object it will be called
 // if 'canValidate' is a property object.get('canValidate') will be called
 firstName: {
  presence: {
    unless: 'canValidate'
  }
}
 ```

 ## Running Validations

 当对象被创建时,校验器将自动运行,以及每个属性改变时,也将自动校验.
 `isValid` 状态将被冒泡,并且帮助确定直接父级的校验状态
 `isInvalid` 状态同样可以被获取

 如果你想强制校验所有,只要在对象上调用`.validate()`方法.
 `isValid` 将被设置为`true` 或者`false`.所有校验的运行将返回promise,所以不是调用完`validate`方法,就是马上校验完毕的.
 `validate`方法返回一个promise,可以调用`then`方法添加完成后的回调

 ```javascript
 user.validate().then(function() {
  user.get('isValid'); // true
  user.get('isInvalid'); // false
})
 ```

 ## Inspecting Errors ##

 当一个对象集成`Ember.Validations.Mixin`后,该对象将同时拥有一个`errors`对象,所有校验的错误信息
 将被放置在该对象上.

 ```javascript
 App.User = Ember.Object.extend(Ember.Validations.Mixin, {
  validations: {
    firstName: { presence: true }
  }
});

 user = App.User.create();
 user.validate().then(null, function() {
  user.get('isValid'); // false
  user.get('errors.firstName'); // ["can't be blank"]
  user.set('firstName', 'Brian');
  user.validate().then(function() {
    user.get('isValid'); // true
    user.get('errors.firstName'); // []
  })
})

 ```

 ## i18n ##

 国际化I18n默认包含以下的keys

 ```javascript
 Ember.I18n.translations = {
  errors:
    inclusion: "is not included in the list",
    exclusion: "is reserved",
    invalid: "is invalid",
    confirmation: "doesn't match {{attribute}}",
    accepted: "must be accepted",
    empty: "can't be empty",
    blank: "can't be blank",
    present: "must be blank",
    tooLong: "is too long (maximum is {{count}} characters)",
    tooShort: "is too short (minimum is {{count}} characters)",
    wrongLength: "is the wrong length (should be {{count}} characters)",
    notANumber: "is not a number",
    notAnInteger: "must be an integer",
    greaterThan: "must be greater than {{count}}",
    greaterThanOrEqualTo: "must be greater than or equal to {{count}}",
    equalTo: "must be equal to {{count}}",
    lessThan: "must be less than {{count}}",
    lessThanOrEqualTo: "must be less than or equal to {{count}}",
    otherThan: "must be other than {{count}}",
    odd: "must be odd",
    even: "must be even"
}
 ```
 @namespace Ember
 @class Validations
 @extends Ember.Namespace
 */