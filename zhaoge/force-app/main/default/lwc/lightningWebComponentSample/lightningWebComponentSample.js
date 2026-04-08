import { LightningElement } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import jQuery from '@salesforce/resourceUrl/jQueryForVforce';
export default class LightningWebComponentSample extends LightningElement {
    renderedCallback() {
        loadScript(this, jQuery);
    }

    title = '';
    input1 = '';
    output1 = '';
    input2 = '';

    handleChange(event) {
        this.title = event.target.value;
        this.input1 = event.target.value;
        this.input2 = event.target.value;
        this.output1 = event.target.value;
    }
}