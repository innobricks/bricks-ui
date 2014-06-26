var get = Ember.get,
  set = Ember.set;

/**
 @module bricksui
 @submodule bricksui-form
 */

/**
 Bootstrap时间日期选择插件，可配置的参数有
 ```javascript
 $('input[name="daterange"]').daterangepicker(
 {
   format: 'YYYY-MM-DD',
   startDate: '2013-01-01',
   endDate: '2013-12-31'
 },
 function(start, end, label) {
          alert('A date range was chosen: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
        }
 );
 //第一个参数为DateRange组件的配置项，第二个参数为值改变后的回调函数，可利用该回调函数进行dom操作等
 ```
 可选的options参数有
 ```html
 startDate: (Date object, moment object or string) 起始日期，值可以为一个Date类型对象或moment类型对象
 
 endDate: (Date object, moment object or string) 结束日期，值可以为一个Date类型对象或moment类型对象
 
 minDate: (Date object, moment object or string) 可供选择的最小日期，值可以为一个Date类型对象或moment类型对象
 
 maxDate: (Date object, moment object or string) 可供选择的最大日期，值可以为一个Date类型对象或moment类型对象
 
 dateLimit: (object) 起始到结束最大的日期区间，(moment时间区间)
 
 showDropdowns: (boolean) Show year and month select boxes above calendars to jump to a specific month and year
 
 showWeekNumbers: (boolean) Show week numbers at the start of each week on the calendars
 
 timePicker: (boolean) 是否允许具体时间选择
 
 timePickerIncrement: (number) Increment of the minutes selection list for times (i.e. 30 to allow only selection of times ending in 0 or 30)
 
 timePicker12Hour: (boolean) Use 12-hour instead of 24-hour times, adding an AM/PM select box
 
 ranges: (object) Set predefined date ranges the user can select from. Each key is the label for the range, and its value an array with two dates representing the bounds of the range
 
 opens: (string: 'left'/'right') Whether the picker appears aligned to the left or to the right of the HTML element it's attached to
 
 buttonClasses: (array) CSS class names that will be added to all buttons in the picker
 
 applyClass: (string) CSS class string that will be added to the apply button
 
 cancelClass: (string) CSS class string that will be added to the cancel button
 
 format: (string) Date/time format string used by moment when parsing or displaying the selected dates
 
 separator: (string) Separator string to display between the start and end date when populating a text input the picker is attached to
 
 locale: (object) Allows you to provide localized strings for buttons and labels, and the first day of week for the calendars
 
 singleDatePicker: (boolean) Show only a single calendar to choose one date, instead of a range picker with two calendars; the start and end dates provided to your callback will be the same single date chosen
 
 parentEl: (string) jQuery selector of the parent element that the date range picker will be added to, if not provided this will be 'body'
 ```

 组件使用方式为
 ```handlebars
 {{bu-daterange startDate=startDate endDate=endDate}}
 ```
 @class BuDateRange
 @namespace Ember
 @extends Ember.Component
 */
export default Ember.Component.extend({

  tagName:'input',

  /**
   * 开始日期
   * @type string
   * @default null
   * @property startDate
   */
  startDate:null,

  /**
   * 结束日期
   * @type string
   * @default null
   * @property endDate
   */
  endDate:null,

  init: function () {
    this._super.apply(this, arguments);
    this._parseOptions();
    this._prepareDate();
  },

  /**
   * 如果已经设置了开始日期和结束日期，则将值设置入options中
   * @method _prepareDate
   * @private
   */
  _prepareDate:function(){
    var dateRange,options;

    options=get(this,'options');
    dateRange=Ember.getProperties(this,'startDate','endDate');

    if(dateRange.startDate){
      set(options,'startDate',moment(dateRange.startDate));
    }
    if(dateRange.endDate){
      set(options,'endDate',moment(dateRange.endDate));
    }
  },

  /**
   * 如果options是模板中传入的字符串，尝试将字符串转换为options对象
   * @method _parseOptions
   * @private
   */
  _parseOptions: function () {
    var options = get(this, 'options');

    if(options === undefined){
      set(this,'options',{});
      return;
    }

    if (Ember.typeOf(options) === 'string') {
      try {
        JSON.parse(options);
        set(this, 'options', options);
      } catch (e) {
        throw e;
      }
    }
  },

  /**
   * 在对象发生改变时，设置开始日期与结束日期
   * @method change
   * @private
   */
  change:function(){
    var dateRange,
        elem=this.$();
    dateRange=elem.data('daterangepicker');

    Ember.setProperties(this,{
      "startDate":dateRange.startDate,
      "endDate":dateRange.startDate
    });

  },

  /**
   * 添加事件监听
   * @method _attachEvent
   * @private
   */
  _attachEvent:function(){
    this.$().on('change.daterangepicker',this.change.bind(this));
  },

  /**
   * 在视图渲染完成后将对象转换为DateRange组件
   * @method _updateDom
   * @private
   */
  _updateDom: function () {
    Ember.run.scheduleOnce('afterRender', this, function () {
      var options = get(this, 'options');
      this.$().daterangepicker(options);
    });
  }.on('didInsertElement')
});