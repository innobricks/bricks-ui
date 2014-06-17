import BricksUI from "bricksui-metal/core";

Ember.onLoad("Ember.Application", function (Application) {

    Application.initializer({
        name: "i18n-setup",
        initialize: function (container, application) {
            var modulePrefix = application.modulePrefix,
                langFolderName = "lang",
                parsedName
                ;
            Ember.assert('module prefix must be defined', modulePrefix);
            parsedName = BricksUI.I18n.parseLanguage();
            //global require
            var require = window.require;
            var localeLang = require([modulePrefix, langFolderName, parsedName.language].join("/"));
            var localeName = parsedName.language;
            if (!localeLang) {
                localeLang = require([modulePrefix, langFolderName, parsedName.fullName].join("/"));
                localeName = parsedName.fullName;
            }
            if (localeLang && localeLang['default']) { localeLang = localeLang['default']; }

            var bricksLocale = BricksUI.I18n.lang[localeName];



        }
    });
});