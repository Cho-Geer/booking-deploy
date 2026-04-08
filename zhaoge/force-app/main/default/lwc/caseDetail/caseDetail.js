import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import ACCOUNTID_FIELD from '@salesforce/schema/Case.AccountId';
import TYPE_FIELD from '@salesforce/schema/Case.Type';
import SUBJECT_FIELD from '@salesforce/schema/Case.Subject';
import PRIORTIY_FIELD from '@salesforce/schema/Case.Priority';
// import STATUS_FIELD from '@salesforce/Schema/Case.Status';

export default class CaseDetail extends LightningElement {
    @api recordId;
    @api objectApiName;

    fields = [ACCOUNTID_FIELD, TYPE_FIELD, SUBJECT_FIELD, PRIORTIY_FIELD];

    handleSubmit(event) {
        this.handleSuccess(event);
        event.preventDefault();
        const fields = event.detail.fields;
        this.template.querySelector('lightning-record-form').submit(fields);
    }

    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: "保存しました。",
            message: "Record ID: " + this.recordId,
            variant: "success"
        });
        this.dispatchEvent(evt);
    }
}