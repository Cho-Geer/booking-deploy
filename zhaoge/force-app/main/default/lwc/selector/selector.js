import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import Id from '@salesforce/user/Id';
import NAME_FIELD from '@salesforce/schema/User.Name';

export default class Selector extends LightningElement {
    // selectedProductId;
    selectedProduct;
    userId = Id;
    name = undefined;
    error;

    @wire(getRecord, { recordId: '$userId', fields: [NAME_FIELD] }) wiredUser({ data, error }) {
        if (data) {
            this.name = data.fields.Name.value;
            this.error = undefined;
        } else if (error) {
            this.data = undefined;
            this.error = error;
        }
    }

    handleProductSelected(event) {
        // alert(event.detail);
        // this.selectedProductId = event.detail;
        this.selectedProduct = event.detail;
    }
}