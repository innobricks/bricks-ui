/**
 @module bricksui
 @submodule bricksui-metal
 */
/**
 重命名已有的helper

 ```javascript
 // Examples
 BricksUI.swapHelpers("bs-tabs","bu-tabs");
 BricksUI.swapHelper({
    "bs-tabs":"bu-tabs",
    "bs-tas-panes":"bu-tabs-panes"
 });
 ```

 @for BricksUI
 @method swapHelpers
 @param hash {Object}
 */
export default function swapHelpers(hash)
{
    if (typeof hash === "string") {
        var value = arguments[1];
        Ember.assert("must provide the corresponding helper to replace the older one", value && typeof value === "string");
        var clone = {};
        clone[hash] = value;
        hash = clone;
    }
    var helpers = Ember.Handlebars.helpers;
    for (var helper in hash) {
        var tmp = helpers[helper];
        Ember.assert("helper:" + helper + " does not exist !", tmp);
        delete helpers[helper];
        helpers[hash[helper]] = tmp;
    }
}