//checkbox组
Ember.Handlebars.registerHelper('checkbox', function (property, options) {
    options = Ember.EasyForm.processOptions(property, options);

    if (options.hash.propertyBinding) {
        options.hash.property = Ember.Handlebars.get(this, options.hash.propertyBinding, options);
    }

    if (options.hash.inputOptionsBinding) {
        options.hash.inputOptions = Ember.Handlebars.get(this, options.hash.inputOptionsBinding, options);
    }

    var modelPath = Ember.Handlebars.get(this, 'formForModelPath', options);
    options.hash.modelPath = modelPath;

    property = options.hash.property;

    var modelPropertyPath = function (property) {
        if (!property) {
            return null;
        }

        var startsWithKeyword = !!options.data.keywords[property.split('.')[0]];

        if (startsWithKeyword) {
            return property;
        }

        if (modelPath) {
            return modelPath + '.' + property;
        } else {
            return property;
        }
    };
    var multiple = false;
    if (options.hash.contentBinding) {
        multiple = true;
    }
    options.hash[(multiple ? "value" : "checked") + "Binding"] = modelPropertyPath(property);

    var context = this;

    options.hash.viewName = 'input-field-' + options.data.view.elementId;

    if (options.hash.inputOptions) {
        var inputOptions = options.hash.inputOptions, optionName;
        for (optionName in inputOptions) {
            if (inputOptions.hasOwnProperty(optionName)) {
                options.hash[optionName] = inputOptions[optionName];
            }
        }
        delete options.hash.inputOptions;
    }

    options.hash.isBlock = !!(options.fn);

    return Ember.Handlebars.helpers.view.call(this, Ember.EasyForm.Checkbox, options);
});