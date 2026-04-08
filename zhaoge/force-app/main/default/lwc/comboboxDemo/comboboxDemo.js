import { LightningElement } from 'lwc';

export default class ComboboxDemo extends LightningElement {
    value = '5';

    get options() {
        return [
            { label: '5', value: 'aa' },
            { label: '10', value: 'bb' },
            { label: '15', value: 'cc' },
        ];
    }

    handleChange(event) {
        this.value = event.detail.value;
    }

}