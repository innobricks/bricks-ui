import formSetup from "./form-setup";

Ember.onLoad("Ember.Application", function (Application) {

    Application.initializer({
        name: "form-controller",
        initialize: formSetup
    });
});