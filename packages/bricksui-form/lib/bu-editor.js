var get = Ember.get,
    set = Ember.set
    ;

/**
 @module bricksui
 @submodule bricksui-form
 */
/**
 基于ember与[百度富文本编辑器umeditor](http://ueditor.baidu.com/website/umeditor.html)
 主要增加了数据绑定的功能，config配置项与umeditor一致
 继承自Ember.Component，用法上与Ember.Component保持一致
 使用方式如:
 ```handlebars
 {{bu-editor value=title valueType="contentTxt"}}
 ```
 传入的config配置项有
 ```javascript
 toolbar:[
 'source | undo redo | bold italic underline strikethrough | superscript subscript | forecolor backcolor | removeformat |',
 'insertorderedlist insertunorderedlist | selectall cleardoc paragraph | fontfamily fontsize' ,
 '| justifyleft justifycenter justifyright justifyjustify |',
 'link unlink | emotion image video  | map',
 '| horizontal print preview fullscreen', 'drafts', 'formula'
 ]

 //语言配置项,默认是zh-cn。有需要的话也可以使用如下这样的方式来自动多语言切换，当然，前提条件是lang文件夹下存在对应的语言文件：
 //lang值也可以通过自动获取 (navigator.language||navigator.browserLanguage ||navigator.userLanguage).toLowerCase()
 //,lang:"zh-cn"
 //,langPath:URL +"lang/"

 //ie下的链接自动监测
 //,autourldetectinie:false

 //主题配置项,默认是default。有需要的话也可以使用如下这样的方式来自动多主题切换，当然，前提条件是themes文件夹下存在对应的主题文件：
 //现有如下皮肤:default
 //,theme:'default'
 //,themePath:URL +"themes/"



 //针对getAllHtml方法，会在对应的head标签中增加该编码设置。
 //,charset:"utf-8"

 //常用配置项目
 //,isShow : true    //默认显示编辑器

 //,initialContent:'欢迎使用UMEDITOR!'    //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子

 //,initialFrameWidth:500 //初始化编辑器宽度,默认500
 //,initialFrameHeight:500  //初始化编辑器高度,默认500

 //,autoClearinitialContent:true //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了

 //,textarea:'editorValue' // 提交表单时，服务器获取编辑器提交内容的所用的参数，多实例时可以给容器name属性，会将name给定的值最为每个实例的键值，不用每次实例化的时候都设置这个值

 //,focus:false //初始化时，是否让编辑器获得焦点true或false

 //,autoClearEmptyNode : true //getContent时，是否删除空的inlineElement节点（包括嵌套的情况）

 //,fullscreen : false //是否开启初始化时即全屏，默认关闭

 //,readonly : false //编辑器初始化结束后,编辑区域是否是只读的，默认是false

 //,zIndex : 900     //编辑器层级的基数,默认是900

 //如果自定义，最好给p标签如下的行高，要不输入中文时，会有跳动感
 //注意这里添加的样式，最好放在.edui-editor-body .edui-body-container这两个的下边，防止跟页面上css冲突
 //,initialStyle:'.edui-editor-body .edui-body-container p{line-height:1em}'

 //,autoSyncData:true //自动同步编辑器要提交的数据

 //,emotionLocalization:false //是否开启表情本地化，默认关闭。若要开启请确保emotion文件夹下包含官网提供的images表情文件夹

 //,allHtmlEnabled:false //提交到后台的数据是否包含整个html字符串

 //fontfamily
 //字体设置
 //        ,'fontfamily':[
 //              { name: 'songti', val: '宋体,SimSun'},
 //          ]

 //fontsize
 //字号
 //,'fontsize':[10, 11, 12, 14, 16, 18, 20, 24, 36]

 //paragraph
 //段落格式 值留空时支持多语言自动识别，若配置，则以配置值为准
 //,'paragraph':{'p':'', 'h1':'', 'h2':'', 'h3':'', 'h4':'', 'h5':'', 'h6':''}

 //undo
 //可以最多回退的次数,默认20
 //,maxUndoCount:20
 //当输入的字符数超过该值时，保存一次现场
 //,maxInputCount:1

 //imageScaleEnabled
 // 是否允许点击文件拖拽改变大小,默认true
 //,imageScaleEnabled:true

 //dropFileEnabled
 // 是否允许拖放图片到编辑区域，上传并插入,默认true
 //,dropFileEnabled:true

 //pasteImageEnabled
 // 是否允许粘贴QQ截屏，上传并插入,默认true
 //,pasteImageEnabled:true

 //autoHeightEnabled
 // 是否自动长高,默认true
 //,autoHeightEnabled:true

 //autoFloatEnabled
 //是否保持toolbar的位置不动,默认true
 //,autoFloatEnabled:true

 //浮动时工具栏距离浏览器顶部的高度，用于某些具有固定头部的页面
 //,topOffset:30

 //填写过滤规则
 //,filterRules: {}
 ```
 ####warn:某些情况下，如果umeditor基准路径不正确，可以设置 中的 UMEDITOR_HOME_URL参数
 ```javascrript
 //全局编辑器基准路径
 window.UMEDITOR_CONFIG = {

        //为编辑器实例添加一个路径，这个不能被注释
        UMEDITOR_HOME_URL : URL
 }
 ```
 @class BuEditor
 @namespace Ember
 @extends Ember.Component
 @uses Ember.TextSupport
 */
var BuEditor = Ember.Component.extend({

    tagName: 'textarea',

    defaultTemplate: Ember.Handlebars.compile(""),

    /**
     value类型，分别为content和contentTxt,content包含其中的段落标签,contentTxt则指纯文本内容
     @property valueType
     @type string
     @default "content"
     */
    valueType: 'content',

    _valueHandler: {
        content: function (editor) {
            return editor.getContent();
        },
        contentTxt: function (editor) {
            return editor.getContentTxt();
        }
    },


    /**
     用户配置文件
     @property options
     @type object
     */
    options: {},

    /**
     富文本框默认配置文件
     @property defaultSetting
     @type object
     */
    defaultOptions: {
        //这里可以选择自己需要的工具按钮名称
        toolbar: ['fullscreen undo redo bold italic underline'],
        //focus时自动清空初始化时的内容
        autoClearinitialContent: true,
        //关闭字数统计
        wordCount: false,
        //关闭elementPath
        elementPathEnabled: false,
        initialFrameWidth: "100%",
        //默认的编辑区域高度
        initialFrameHeight: 300
        //更多其他参数，请参考umeditor.config.js中的配置项
    },


    init: function () {
        this._super.apply(this, arguments);
        this._parseOptions();
    },

    /**
     绑定到文本域的字段
     @property value
     @type String
     @default null
     */
    value: "",

    /**
     为UMeditor添加事件监听
     @private
     @method _attachEvent
     @param editor UMeditor实例
     */
    _attachEvent: function (editor) {

        editor.addListener('ready', function () {
            var value = get(this, 'value');
            if (!Ember.isEmpty(value)) editor.setContent(value);

            this.$('.edui-container').css({width: '100%'});

        }.bind(this));

        editor.addListener('contentChange', function () {
            var
                value = get(this, 'value'),
                elementValue = this._valueHandler[this.valueType](this._editor);

            if (value !== elementValue) this._updateValue(elementValue);

        }.bind(this));

    },

    _updateElementValue: Ember.observer('value', function () {
        // We do this check so cursor position doesn't get affected in IE
        var value = get(this, 'value'),
            elementValue = this._valueHandler[this.valueType](this._editor);

        if (elementValue !== value) this._editor.setContent(value);

    }),


    _parseOptions: function () {
        var options = get(this, 'options');
        if (typeof options === 'string') {
            try {
                options = JSON.parse(options);
                set(this, 'options', options);
            } catch (e) {

            }
        }
    },


    /**
     将textarea转换为UMeditor实例
     @private
     @method _updateDom
     */
    _updateDom: function () {
        var options = get(this, 'options'),
            defaultOptions = get(this, 'defaultOptions'),
            editor;


        //TODO toolbar属性合并
        options = Ember.$.extend(true, {}, options, defaultOptions);

        editor = this._editor = UM.getEditor(this.get('elementId'), options);

        this._attachEvent(editor);
    }.on('didInsertElement'),


    /**
     在富文本框编辑器内容发生改变时同步value值
     @private
     @method _updateValue
     @param value 富文本编辑器改变后的值
     */
    _updateValue: function (value) {
        set(this, 'value', value);
    },


    /**
     销毁富文本编辑器，销毁组件
     @private
     @method _destroyEditor
     */
    _destroyEditor: function () {
        this._editor.destroy();
        this._editor = null;
    }.on('willDestroyElement')
});

export default BuEditor;
