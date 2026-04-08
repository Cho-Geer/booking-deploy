import { LightningElement, api, wire } from 'lwc';
import getRelatedContacts from '@salesforce/apex/ContactController.getContacts';
import { reduceErrors } from 'c/ldsUtils';
const columns = [
    {label: "姓", fieldName: "LastName", type: "text"},
    {label: "名", fieldName: "FirstName", type: "text"}
];
export default class ContactList extends LightningElement {
    columns = columns;
    _recordId;
    set recordId(val = ""){
        this._recordId = val;
    }
    @api get recordId(){
        return this._recordId;
    }
    @wire(getRelatedContacts, {recordId : '$recordId'})contacts;

    get errors(){
        return reduceErrors(this.contacts.error);
    }

}