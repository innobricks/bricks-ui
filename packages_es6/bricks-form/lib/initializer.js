import formController from "./form-controller";
import chosen_select from "./chosen-select"

Ember.onLoad("Ember.Application",function(Application){

    Application.initializer({
        name:"form-controller",
        initialize:formController
    });
});