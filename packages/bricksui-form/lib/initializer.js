import formSetup from "./form-setup";

Ember.onLoad("Ember.Application", function (Application) {

    Application.initializer({
        name: "form-controller",
        initialize: formSetup
    });

    Application.initializer({
        name: "bu-editor-url-fixed",
        initialize: function(){
            //覆盖默认URL地址的设定
            window.UMEDITOR_CONFIG.UMEDITOR_HOME_URL = "assets/assets/umeditor/";
        }
    });
});