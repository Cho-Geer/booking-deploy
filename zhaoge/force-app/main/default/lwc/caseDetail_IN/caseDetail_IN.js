import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import SUPPLIEDEMAIL_FIELD from '@salesforce/schema/Case.SuppliedEmail';
import CONTACTEMAIL_FIELD from '@salesforce/schema/Case.ContactEmail';
import SUPPLIEDPHONE_FIELD from '@salesforce/schema/Case.SuppliedPhone';
import CONTACTPHONE_FIELD from '@salesforce/schema/Case.ContactPhone';
import IN_TEST_FIELD from '@salesforce/schema/Case.IN_Test__c';

export default class CaseDetail_IN extends LightningElement {
    @api recordId;
    @api objectApiName;

    fields = [SUPPLIEDEMAIL_FIELD, CONTACTEMAIL_FIELD, SUPPLIEDPHONE_FIELD, CONTACTPHONE_FIELD, IN_TEST_FIELD];

    handleSubmit(event) {
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