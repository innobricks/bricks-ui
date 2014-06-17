import BricksUI from "bricksui-metal/core";
import {initLang} from "./i18n-support";

Ember.onLoad("Ember.Application", function (Application) {

    Application.initializer({
        name: "i18n-setup",
        initialize: function (container, application) {
            BricksUI.ENV.MODULE_PREFIX = application.modulePrefix;
            initLang();
        }
    });
});