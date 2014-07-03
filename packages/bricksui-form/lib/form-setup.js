import CheckboxItemController from './controllers/checkbox_item';
import RadioItemController from './controllers/radio_item';
import BuEditor from './bu-editor';
import BuDatePicker from './bu-datepicker';
import BuDateRange from './bu-daterange';
import BuTree from './bu-tree';
/**
 * 向模板中注册
 *  控制器
 *    checkboxItem
 *    radioItem
 *  组件
 *    bu-editor
 *    bu-datepicker
 *    bu-daterange
 *    bu-tree
 */
export default
    function initFormController(container, application) {
        container.register('controller:checkboxItem', CheckboxItemController);
        container.register('controller:radioItem', RadioItemController);
        container.register('component:bu-editor', BuEditor);
        container.register('component:bu-datepicker', BuDatePicker);
        container.register('component:bu-daterange', BuDateRange);
        container.register('component:bu-tree', BuTree);
    }