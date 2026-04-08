import { LightningElement, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
export default class ContactCreateAndListView_LWC extends LightningElement {

    objectInfo = {};
    checkboxChecked = false;
    get contactList() {
        return [{ index: 0, contact: { objectApiName: "Contact" } }, { index: 1, contact: { objectApiName: "Contact" } }];
    }

    @wire(getObjectInfo, { objectApiName: CONTACT_OBJECT }) wiredObjectInfo({ data, error }) {
        if (data) {
            this.objectInfo = {
                lastNameLabel: data.fields.LastName.label,
                firstNameLabel: data.fields.FirstName.label,
                accountLabel: data.fields.AccountId.label,
                recordTypeLabel: data.fields.RecordTypeId.label
            };
        }
        if (error) { alert(error); }
    }
    handleCheckbox(event) {
        let value = this.template.querySelector("lightning-input[data-id=inputCheckbox]").checked;
        this.checkboxChecked = value;
        alert(this.checkboxChecked);
    }
    handleButtonSelect(event) {
        alert("utility:setting");
    }
    handleBulkCommit(event) {
        alert("一括登録");

    }
}