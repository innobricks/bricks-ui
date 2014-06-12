import formController from "./form-setup";

Ember.onLoad("Ember.Application", function (Application) {

    Application.initializer({
        name: "form-controller",
        initialize: formController
    });
});