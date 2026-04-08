import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import DESCRIPTION_FIELD from '@salesforce/schema/Case.Description';
import COMMENTS_FIELD from '@salesforce/schema/Case.Comments';
import CREATEDDATE_FIELD from '@salesforce/schema/Case.CreatedDate';
import CLOSEDDATE_FIELD from '@salesforce/schema/Case.ClosedDate';
import ORIGIN_FIELD from '@salesforce/schema/Case.Origin';
import STATUS_FIELD from '@salesforce/schema/Case.Status';
import OUT_TEST_FIELD from '@salesforce/schema/Case.OUT_Test__c';

export default class CaseDetail_OUT extends LightningElement {
    @api recordId;
    @api objectApiName;

    // fields = [DESCRIPTION_FIELD, COMMENTS_FIELD, ORIGIN_FIELD, CREATEDDATE_FIELD, CLOSEDDATE_FIELD];
    fields = [DESCRIPTION_FIELD, COMMENTS_FIELD, ORIGIN_FIELD, CREATEDDATE_FIELD, CLOSEDDATE_FIELD, STATUS_FIELD, OUT_TEST_FIELD];

    handleSubmit(event) {
        // handleSuccess(event);
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