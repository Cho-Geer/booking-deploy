import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord } from 'lightning/uiRecordApi';
import ACCOUNTID_FIELD from '@salesforce/schema/Case.AccountId';
import TYPE_FIELD from '@salesforce/schema/Case.Type';
import SUBJECT_FIELD from '@salesforce/schema/Case.Subject';
import PRIORTIY_FIELD from '@salesforce/schema/Case.Priority';
import STATUS_FIELD from '@salesforce/schema/Case.Status';
import COMMON_TEST_FIELD from '@salesforce/schema/Case.Common_Test__c';

// const fields = [ACCOUNTID_FIELD, TYPE_FIELD, SUBJECT_FIELD, PRIORTIY_FIELD, STATUS_FIELD];
export default class CaseDetail_Common extends LightningElement {
    @api recordId;
    @api objectApiName;
    // data;
    // error;

    // @api fields = [ACCOUNTID_FIELD, TYPE_FIELD, SUBJECT_FIELD, PRIORTIY_FIELD];
    // @wire(getRecord, { recordId: '$recordId', fields: fields })
    // wiredCase({ data, error }) {
    //     if (data) {
    //         this.data = data;
    //         this.error = undefined;
    //     } else {
    //         this.data = undefined;
    //         this.error = error;
    //     }
    // }
    fields = [ACCOUNTID_FIELD, TYPE_FIELD, SUBJECT_FIELD, PRIORTIY_FIELD, STATUS_FIELD, COMMON_TEST_FIELD];
    @wire(getRecord, { recordId: '$recordId', fields: [ACCOUNTID_FIELD, TYPE_FIELD, SUBJECT_FIELD, PRIORTIY_FIELD, STATUS_FIELD] }) caseData;

    handleError(event) {
        const er = new ShowToastEvent({
            title: '必須項目に入力してください',
            message: 'ERROR: ' + event.target,
            variant: 'error'
        });
        this.dispatchEvent(er);
    }

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