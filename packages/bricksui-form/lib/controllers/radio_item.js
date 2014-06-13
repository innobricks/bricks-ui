import CheckboxItemController from './checkbox_item';
var RadioItemController = CheckboxItemController.extend({
    selected: function () {
        return this.get('content') === this.get('parentController.elementsOfProperty');
    }.property(),
    selectedChanged: function () {
        var content = this.get('content');
        var parent = this.get('parentController');
        var model = this.get('parentController.model');
        model.set(parent.get('propertyPath'), content);
        model.validate();
    }.observes('selected')
});

export default
RadioItemController;