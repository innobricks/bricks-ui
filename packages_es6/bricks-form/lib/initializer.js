import formController from "./form-controller";

Ember.onLoad("Ember.Application",function(Application){

    Application.initializer({
        name:"form-controller",
        initialize:formController
    });
});