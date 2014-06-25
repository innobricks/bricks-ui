var get = Ember.get,
  set = Ember.set;
/**
 @module bricksui
 @submodule bricksui-form
 */

/**
 Bootstrap时间日期选择插件，可配置的参数有
 ```javascript
 var options={
         minViewMode:null                //可选值为['months','years']纯月份选择/年选择
         viewMode:null                   //可选值为['months','years']纯月份选择/年选择
         pickDate: true,                 //是否启用日期选择
         pickTime: true,                 //是否启用事件选择
         useMinutes: true,               //是否启用分钟选择
         useSeconds: true,               //是否启用秒钟选择
         useCurrent: true,               //当useCurrent设置为true，该组件将默认选择当前日期
         minuteStepping:1,               //分钟间隔设置(可选择的分钟间隔)
         minDate:`1/1/1900`,             //最小可选择的时间
         maxDate: ,                      //最大的可选择事件(默认为当天 100年后)
         showToday: true,                 //shows the today indicator
         language:'en',                  //设置默认语言区
         defaultDate:"",                 //sets a default date, accepts js dates, strings and moment objects
         disabledDates:[],               //an array of dates that cannot be selected
         enabledDates:[],                //an array of dates that can be selected
         icons = {
                time: 'glyphicon glyphicon-time',
                date: 'glyphicon glyphicon-calendar',
                up:   'glyphicon glyphicon-chevron-up',
                down: 'glyphicon glyphicon-chevron-down'
            }
         useStrict: false,               //use "strict" when validating dates
         sideBySide: false,              //show the date and time picker side by side
         daysOfWeekDisabled:[]          //for example use daysOfWeekDisabled: [0,6] to disable weekends
    }
 ```

 组件使用方式为
 ```handlebars
 {{bu-datepicker value=value}}
 ```
 @class BuDatePicker
 @namespace Ember
 @extends Ember.Component
 */
export default Ember.Component.extend({
  classNames: ['form-control'],
  tagName: 'input',

  /**
   * 外部所绑定的值
   * @property value
   * @type Object
   */
  value: null,

  init: function () {
    this._super.apply(this, arguments);
    this._parseOptions();
    this.attachI18nEvent();
  },

  /**
   * input fix，根据在输入的格式校验失败后，尝试将输入项转换为Date类型，如果成功，则进行格式转换并输出
   * @param {object} event
   */
  error: function (event) {
    var date, elem, format, newFmt , val;
    elem = this.$();
    val = elem.prop('value');
    if (!isNaN((date = new Date(val)).getTime())) {
      elem = this.$();
      format = elem.data('DateTimePicker').format;
      newFmt = moment(date).format(format);
      elem.prop('value', newFmt);
      elem.trigger('change');
    }
  },

  /**
   * 绑定原始值,在输入框内容发生改变时，更新Value的值
   * @method change
   * @private
   */
  change: function () {
    var elem = this.$(),
      picker = elem.data('DateTimePicker');

    set(this, 'value', picker.getDate().toISOString());
  },

  /**
   * 在时间格式校验失败后，进行泛类型时间尝试
   * @private
   */
  _attachEvent: function () {
    this.$().on('dp.error', this.error.bind(this));
    this.$().on('focusout', this.change.bind(this));
  },

  /**
   * 对传入的options参数进行解析，如果传入的参数类型为string，则尝试转换为字符串
   * @method _parseOptions
   * @private
   */
  _parseOptions: function () {
    var options = get(this, 'options');

    if (Ember.typeOf(options) === 'string') {
      try {
        options = JSON.parse(options);
        set(this, 'options', options);
      } catch (e) {
        throw e;
      }
    }
    this.defaultOptions.language = BricksUI.I18n.getLang().language;
  },

  /**
   * 在视图销毁时，清除datepicker Dom 对象
   */
  _destroyElement: function () {
    var elem;
    elem = this.$();
    elem.data('DateTimePicker').destroy();
  }.on('destroyElement'),

  /**
   * 监听全局I18n改变事件，在所选择的语言改变后，重新渲染视图
   * @method attachI18nEvent
   * @private
   */
  attachI18nEvent: function () {
    var datePicker = this;
    Ember.subscribe("i18nChange", {
      after: function (name, timestamp, payload) {
        datePicker._destroyElement();
        datePicker.defaultOptions.language = payload.language;
        datePicker._updateDom();
      }
    });
  },

  /**
   * 默认配置文件，为准确完成日期格式转换，将进行严格日期校验
   * 在所选择语言发生变化后，将进行视图重新渲染
   * @property
   */
  defaultOptions: {
    useStrict: true
  },

  /**
   * 在视图渲染完成后，设置datetimepick组件
   * @method _updateDom
   * @private
   */
  _updateDom: function () {

    Ember.run.scheduleOnce('afterRender', this, function () {
      var options = Ember.$.extend({}, this.defaultOptions, this.get('options'));
      this.$().datetimepicker(options);
      this._attachEvent();
    });
  }.on('didInsertElement')
});