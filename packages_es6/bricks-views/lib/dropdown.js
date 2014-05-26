import Bricks from "bricks-metal/core";
import View from "bricks-metal/core";
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

export
{
    DropDownView
}
;