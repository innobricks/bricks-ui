var get = Ember.get,
  set = Ember.set;
export default Ember.Component.extend({

  tagName:'input',

  init: function () {
    this._super.apply(this, arguments);
    this._parseOptions();
  },

  _parseOptions: function () {
    var options = get(this, 'options');
    if (Ember.typeOf(options) === 'string') {
      try {
        JSON.parse(options);
        set(this, 'options', options);
      } catch (e) {
        throw e;
      }
    }
  },

  _updateDom: function () {
    Ember.run.scheduleOnce('afterRender', this, function () {
      var options = get(this, 'options');
      this.$().daterangepicker(options);
    });
  }.on('didInsertElement')
});