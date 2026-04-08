import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import SUBJECT_FIELD from '@salesforce/schema/Case.Subject';
import STATUS_FIELD from '@salesforce/schema/Case.Status';

const fieldsss = [SUBJECT_FIELD, STATUS_FIELD];
export default class WireTest extends LightningElement {
    @api recordId;
    // data = false;
    // error;

    // @wire(getRecord, { recordId: '$recordId', fields: fields })
    // wiredCase({ data, error }) {
    //     if (data) {
    //         this.data = data;
    //         this.error = undefined;
    //     } else if (error) {
    //         this.data = undefined;
    //         this.error = error;
    //     }
    // };

    @wire(getRecord, { recordId: '$recordId', fields: fieldsss })
    sdata;

}