export default Ember.EasyForm.Select.reopen({

  classNames: ['form-control'],
  attributeBindings:['data-placeholder'],

  init:function(){
    this._super();
    this.set('prompt',' ');  //对于chosen组件，需要存在一个为空的promt

    //once elements trigger blur event,the parentView will show validated result,
    //aim to defer validation
    var parentView=this.get('parentView');
    parentView.focusOut=function(){
      parentView.set(parentView.set('hasFocusedOut', true));
    };

  },

  /**
   * @description 在收到通知需进行销毁后，销毁chsen组建
   * @private
   */
  _elementDestroy:function(){
    this.$().chosen('destroy');
  }.on('willDestroyElement'),


  /**
   * @description 在select的context发生变化后，通知chosen进行视图更新
   * @private
   */
  _updateItem:function(){
    Ember.run.scheduleOnce('afterRender',this,function(){
      this.$().trigger('chosen:updated');
    });
  }.observes('content.@each'),

  _doShowFocus:function(){
    this.get('parentView').showValidationError();
  },

  _validation:function(){
    var callback=this._doShowFocus.bind(this);
    this.get('parentView.formForModel').validate().then(callback,callback);
  },

  /**
   * @description 在视图渲染完成后，将select组件转换为chosen组件
   * @private
   */
  _updateDom:function(){

    Ember.run.scheduleOnce('afterRender',this,function(){
      //在select视图渲染成成后，将其转换为chosen下拉框，并监听change事件
      this.$().chosen()
        .on('change chosen:hiding_dropdown',function(){
          //为了取得数组正确的变化，将validate推迟到下一生命周期运行
          Ember.run.next(this,'_validation');
        }.bind(this))
      ;
    });
  }.on('didInsertElement')
});