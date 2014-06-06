import CheckboxItemController from './controllers/checkbox_item';
import RadioItemController from './controllers/radio_item';

export default function initFormController(container,application){
    container.register('controller:checkboxItem', CheckboxItemController);
    container.register('controller:radioItem',RadioItemController);
}