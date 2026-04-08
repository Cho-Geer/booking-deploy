import { LightningElement, wire } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CASE_OBJECT from '@salesforce/schema/Case';
import SUBJECT_FIELD from '@salesforce/schema/Case.Subject';
import STATUS_FIELD from '@salesforce/schema/Case.Status';
import ORIGIN_FIELD from '@salesforce/schema/Case.Origin';
import COMMON_TEST_FIELD from '@salesforce/schema/Case.Common_Test__c';
import IN_TEST_FIELD from '@salesforce/schema/Case.IN_Test__c';
import OUT_TEST_FIELD from '@salesforce/schema/Case.OUT_Test__c';

const fields = {};
const recordInput = { apiName: CASE_OBJECT.objectApiName };
export default class CaseCreateLWC extends LightningElement {
    caseId = undefined;
    caseName = '';
    caseStatus = '';
    statusOptions = [
        { label: 'New', value: 'New' },
        { label: 'Working', value: 'Working' },
        { label: 'Escalated', value: 'Escalated' },
        { label: 'Closed', value: 'Closed' }
    ];
    caseOrigin = '';
    caseOriginOptions = [
        { label: 'Phone', value: 'Phone' },
        { label: 'Email', value: 'Email' },
        { label: 'Web', value: 'Web' }
    ];
    caseCommon = '';
    caseIn = '';
    caseOut = '';

    handleNameChange(event) {
        this.caseName = event.target.value;
        fields[SUBJECT_FIELD.fieldApiName] = this.caseName;
    }

    handleStatusChange(event) {
        this.caseStatus = event.target.value;
        fields[STATUS_FIELD.fieldApiName] = this.caseStatus;
    }

    handleOriginChange(event) {
        this.caseOrigin = event.target.value;
        fields[ORIGIN_FIELD.fieldApiName] = this.caseOrigin;
    }

    handleCommonChange(event) {
        this.caseCommon = event.target.value;
        fields[COMMON_TEST_FIELD.fieldApiName] = this.caseCommon;
    }

    handleInChange(event) {
        this.caseIn = event.target.value;
        fields[IN_TEST_FIELD.fieldApiName] = this.caseIn;
    }

    handleOutChange(event) {
        this.caseOut = event.target.value;
        fields[OUT_TEST_FIELD.fieldApiName] = this.caseOut;
    }

    handleCreate(event) {
        recordInput['fields'] = fields;
        alert('recordInput: ' + JSON.stringify(recordInput));
        createRecord(recordInput)
            .then(cs => {
                this.caseId = cs.id;
                this.dispatchEvent(new ShowToastEvent({
                    title: 'SUCCESS',
                    message: 'Record Id: ' + this.caseId,
                    variant: 'success'
                }));
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'ERROR',
                    message: error.body.message,
                    variant: 'error'
                }));
            })
    }

    caId = undefined;
    subject = '';

    @wire(getRecord, { recordId: '$caseId', fields: [SUBJECT_FIELD] })
    wiredCase({ data, error }) {
        if (data) {
            this.subject = data.fields.Subject.value;
            this.caId = this.caseId;
            this.error = undefined;
        } else if (error) {
            this.subject = undefined;
            this.error = error;
        }
    }
}