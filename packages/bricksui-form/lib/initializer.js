import formSetup from "./form-setup";
import BricksUI from "bricksui-metal/core";

var swapHelpers = BricksUI.swapHelpers;
Ember.onLoad("Ember.Application", function (Application) {

    Application.initializer({
        name: "form-controller",
        initialize: formSetup
    });

    Application.initializer({
      name: "swap-form-helper",
      initialize: function (container, application) {
        swapHelpers({
          "input": "bu-input",
          "error-field": "bu-error-field",
          "form-for": "bu-form-for",
          "hint-field": "bu-hint-field",
          "input-field": "bu-input-field",
          "label-field": "bu-label-field",
          "submit": "bu-submit"
        });
      }
    });
});