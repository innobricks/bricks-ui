require("bricks-metal");
define("bricks-views/dropdown",
  ["bricks-metal/core","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Bricks = __dependency1__["default"];
    var View = __dependency1__["default"];
    /**
     *
     * @type {{}}
     */
    var states = {
        fold: {

        },
        unfold: {

        },
        highlight: {

        }
    };

    var DropDownView = View.extend({
        initialState: states.fold,
        /**
         * 移交给内部,然后调用
         */
        states: states


    });

    __exports__.DropDownView = DropDownView;
  });