import CheckboxItemController from './controllers/checkbox_item';
import RadioItemController from './controllers/radio_item';
import BuEditor from './bu-editor';

export default
function initFormController(container, application) {
    container.register('controller:checkboxItem', CheckboxItemController);
    container.register('controller:radioItem', RadioItemController);
    container.register('component:bu-editor',BuEditor);
}