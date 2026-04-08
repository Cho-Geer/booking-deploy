import { LightningElement, api } from 'lwc';
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import NAME_FIELD from "@salesforce/schema/Account.Name";
import DESCRIPTION_FIELD from "@salesforce/schema/Account.Description";

const fields = [NAME_FIELD, DESCRIPTION_FIELD];
// const fields = ["Account.Name", "Account.Description"];
export default class AccountStudyLwc extends LightningElement {
    @api recordId = "";
    @api objectApiName = "";
    footerText = "取引先";
    fields = fields;
    handleSet(event) {
        setTimeout((event) => { alert(event.target.eventName) }, 1000);
    }
    handleSubmit(event) {
        alert("handleSubmit");
    }
}