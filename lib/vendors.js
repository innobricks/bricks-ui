/**
 * 第三方插件配置
 * 配置项包括
 * config: exclusion-需要排除在打包程序的第三方插件
 * vendors: 各插件的具体配置信息，配置内容包括
 *          1.basePath 对应第三方插件的文件夹名称，如果不存在则以对应key为basePath
 *          2.scripts  对应所需引用的脚本
 *          3.styles   对应所需引用的样式文件
 *          4.vendor   对应所需引入的图片，字体等文件
 *          5.dependencies 依赖的第三方插件
 *          6.fullCopy 对于有着强引用关系的复杂第三方插件，如百度文本编辑器等，建议直接将资源文件完整复制复制
 */
module.exports = {
    config: {
        exclusion:['cldr']
    },
    vendors: {
        "moment": {
            basePath: "momentjs",
            scripts: ["moment.js","min/moment-with-langs.js"]
        },

        "cldr": {
            scripts: ["plurals.js"]
        },

        "ember-i18n": {
            basePath: "ember-i18n",
            scripts: ["lib/i18n.js"]
        },

        "ember-validations": {
            scripts: ["index.js"],
            dependencies: ["ember-i18n"]
        },

        "ember-easyForm": {
            scripts: ["index.js"],
            dependencies: ["ember-i18n", "ember-validations"]
        },

        "jquery-cookie": {
            scripts: ["jquery.cookie.js"]
        },

        "bootstrap3-datetimepicker": {
            basePath:"bootstrap3-datetimepicker",
            scripts: ["src/js/bootstrap-datetimepicker.js"],
            styles:["build/css/bootstrap-datetimepicker.css"],
            dependencies: ["moment","bootstrap"]
        },

        "bootstrap-for-ember": {
            scripts: ["dist/js/bs-ui.max.js"]
        },

        "bootstrap-daterangepicker": {
            basePath:"bootstrap-daterangepicker",
            scripts: ["daterangepicker.js"],
            styles: ["daterangepicker-bs3.css"],
            dependencies: ["moment","bootstrap"]
        },

        "ztree_v3": {
            scripts: ["js/jquery.ztree.all-3.5.js"],
            styles: ["css/zTreeStyle/zTreeStyle.css"],
            vendor: ["css/zTreeStyle/img/**/*.*"]
        },

        "chosen": {
            basePath: "chosen",
            scripts: ["chosen.jquery.js"],
            styles: ["chosen.css"],
            vendor: ["chosen-sprite.png", "chosen-sprite@2x.png"]
        },

        "bootstrap": {
            basePath: "bootstrap",
            scripts: ["dist/js/bootstrap.js"],
            styles: ["dist/css/bootstrap.css"],
            vendor: ["/fonts/**/*.*"]
        },

        "ember-table": {
            basePath: "ember-table",
            scripts: ["dist/ember-table.js"],
            styles: ["dist/ember-table.css"],
            dependencies:["jquery-mousewheel","jquery-ui","antiscroll"]
        },

        "jquery-mousewheel":{
            scripts: ["jquery.mousewheel.js"]
        },

        "jquery-ui":{
            scripts: ["ui/jquery-ui.custom.js"]
        },

        "antiscroll":{
            scripts:["antiscroll.js"],
            styles:["antiscroll.css"]
        },

        "umeditor":{
            basePath:"umeditor",
            scripts:["umeditor.config.js","umeditor.js","/lang/en/en.js","lang/zh-cn/zh-cn.js"],
            styles:["themes/default/css/umeditor.css"],
            vendor:['themes/**/*.png'],
            fullCopy:true
        },
      "select2": {
        basePath:"select2",
        scripts: ["select2.js","select2_locale_zh-CN.js","select2_locale_en.js.template"],
        styles:["select2.css","select2-bootstrap.css"],
        vendor: ["select2.png", "select2-spinner.gif","select2x2.png"]
      }
    }
}
