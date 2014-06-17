import BricksUI from "bricksui-metal/core";

var I18n = BricksUI.I18n;
var isBinding = /(.+)Binding$/,
    uniqueElementId = (function () {
        var id = Ember.uuid || 0;
        return function () {
            var elementId = 'i18n-' + id++;
            return elementId;
        };
    })();
var get = Ember.get,
    EmHandlebars = Ember.Handlebars
    ;
export default
function (key, options) {
    var attrs, context, data, elementID, result, tagName, view;
    context = this;
    attrs = options.hash;
    data = options.data;
    view = data.view;
    tagName = attrs.tagName || 'span';
    delete attrs.tagName;
    elementID = uniqueElementId();

    Ember.keys(attrs).forEach(function (property) {
        var bindPath, currentValue, invoker, isBindingMatch, normalized, normalizedPath, observer, propertyName, root, _ref;
        isBindingMatch = property.match(isBinding);

        if (isBindingMatch) {
            propertyName = isBindingMatch[1];
            bindPath = attrs[property];
            currentValue = get(context, bindPath, options);
            attrs[propertyName] = currentValue;
            invoker = null;
            normalized = EmHandlebars.normalizePath(context, bindPath, data);
            _ref = [normalized.root, normalized.path], root = _ref[0], normalizedPath = _ref[1];

            observer = function () {
                var elem, newValue;
                if (view.$() == null) {
                    Ember.removeObserver(root, normalizedPath, invoker);
                    return;
                }
                newValue = get(context, bindPath, options);
                elem = view.$("#" + elementID);
                attrs[propertyName] = newValue;
                return elem.html(I18n.t(key, attrs));
            };
            Ember.subscribe("i18nChange", {
                after: observer
            });

            invoker = function () {
                Ember.run.scheduleOnce('afterRender', observer);
            };

            return Ember.addObserver(root, normalizedPath, invoker);
        }
    });
    var observer = function () {
        var elem;
        elem = view.$("#" + elementID);
        return elem.html(I18n.t(key, attrs));
    };
    Ember.subscribe("i18nChange", {
        after: observer
    });
    result = '<%@ id="%@">%@</%@>'.fmt(tagName, elementID, I18n.t(key, attrs), tagName);
    return new EmHandlebars.SafeString(result);
}