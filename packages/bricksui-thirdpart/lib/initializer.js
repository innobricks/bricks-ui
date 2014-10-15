import BricksUI from "bricksui-metal/core";
import {BuPagination} from "./bu-pagination";

var swapHelpers = BricksUI.swapHelpers;
swapHelpers({
    "bs-alert": "bu-alert",
    "bs-bind-popover": "bu-bind-popover",
    "bs-bind-tooltip": "bu-bind-tooltip",
    "bs-btn-group": "bu-btn-group",
    "bs-btn-toolbar": "bu-btn-toolbar",
    "bs-button": "bu-button",
    "bs-growl-notifications": "bu-growl-notifications",
    "bs-list-group": "bu-list-group",
    "bs-notifications": "bu-notifications",
    "bs-panel": "bu-panel",
    "bs-pills": "bu-pills",
    "bs-popover": "bu-popover",
    "bs-progress": "bu-progress",
    "bs-progressbar": "bu-progressbar",
    "bs-tabs": "bu-tabs",
    "bs-tabs-panes": "bu-tabs-panes",
    "bs-tooltip": "bu-tooltip",
    "bs-wizard": "bu-wizard",
    "table-component": "bu-table"
});

Ember.onLoad("Ember.Application", function (Application) {

    Application.initializer({
        name: 'pagination-pager',

        initialize: function (container, application) {
            container.register('component:bu-pagination', BuPagination);
            application.inject('component:bu-pagination', "store", "store:main");
        }
    });
});