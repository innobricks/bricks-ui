var CheckboxItemController = Ember.ObjectController.extend({
    selected: function () {
        var content = this.get('content');
        var list = this.get('parentController.elementsOfProperty');
        return list.contains(content);
    }.property(),
    label: function () {
        return this.get('model.' + this.get('parentController.labelPath'));
    }.property(),
    selectedChanged: function () {
        var content = this.get('content');
        var list = this.get('parentController.elementsOfProperty');
        if (this.get('selected')) {
            list.pushObject(content);
        } else {
            list.removeObject(content);
        }
        //TODO 暂时处理:调用model计算一边
        //原因:property为数组类型,需要监听数组方法
        var parent = this.get('parentController.model');
        parent.validate();
    }.observes('selected')
});
export default
CheckboxItemController;