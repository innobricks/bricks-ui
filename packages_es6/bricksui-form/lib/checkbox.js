var Checkbox = Ember.EasyForm.Input.extend({
    init: function () {
        console.log(this,"================2=======");
        this._super.apply(this, arguments);
        this.set('templateName', this.get('wrapperConfig.checkboxTemplate'));
        this.set('context', this);
        this.set('controller', this);
    },
    /* The property to be used as label */
    labelPath: null,
    /* The model */
    model: null,
    /* The has many property from the model */
    propertyPath: null,
    /* All possible elements, to be selected */
    elements: null,
    elementsOfProperty: function () {
        return this.get('model.' + this.get('propertyPath'));
    }.property()

});

export default
Checkbox;