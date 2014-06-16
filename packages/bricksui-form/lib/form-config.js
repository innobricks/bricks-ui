/**
 * @description bootstrap横排样式
 * 布局分隔为100%撑满，
 * Label在input左方，验证信息在input下方
 */
Ember.EasyForm.Config.registerWrapper('bootstrap-horizontal', {
    inputTemplate: 'bootstrap-input',
    checkboxTemplate: "bootstrap-checkbox",
    radioTemplate: "bootstrap-radio",
    controlsWrapperClass: 'col-sm-6',
    formClass: 'form-horizontal form-bordered',
    fieldErrorClass: 'has-error',
    errorClass: 'text-danger',
    hintClass: 'help-block',
    labelClass: 'col-sm-3 control-label',
    inputClass: 'form-group',
    buttonClass: 'btn btn-primary',
    validationLayout:'bootstrap-validation-input'
});

/**
 * @description bootstrap默认样式
 * 布局分隔为100%撑满，
 * Label在input上方，验证信息在input下方
 */
Ember.EasyForm.Config.registerWrapper('bootstrap', {
  checkboxTemplate: "bootstrap-checkbox",
  radioTemplate: "bootstrap-radio",
  labelClass: 'control-label',
  inputClass: 'form-group',
  buttonClass: 'btn btn-primary',
  fieldErrorClass: 'has-error',
  errorClass: 'help-block',
  validationLayout:'validation-layout'
});


//禁用submit 按钮的默认disabled属性
//TODO 改用样式控制
Ember.EasyForm.Submit.reopen({
    disabled: function () {
        return false;
    }.property('formForModel.isValid')
});
//所有组件扩展validate方法,方便form表单submit时统一调度
Ember.EasyForm.Input.reopen({
    validate: function () {
        this.focusOut();
    }
});
//在默认form的submit方法调用完成后,统一调用各个组件的验证方法,先后顺序有待验证
Ember.EasyForm.Form.reopen({
    submit: function () {
        this._super.apply(this, arguments);
        this.forEachChildView(function (subview) {
            if (subview.validate) {
                subview.validate();
            }
        });
    }
});
//TODO 这里需要根据控件进行修改
Ember.EasyForm.TextField.reopen({
    classNames: ["form-control"]
});
Ember.EasyForm.TextArea.reopen({
    classNames: ["form-control"]
});

/**
 * @description 拓展校验字段
 */
Ember.EasyForm.Input.reopen({
  init:function(){
    this._super();
    if(this.isBlock && this.get('withValidation')){
      this.set('layoutName',this.get('wrapperConfig.validationLayout'));
    }
  }
});