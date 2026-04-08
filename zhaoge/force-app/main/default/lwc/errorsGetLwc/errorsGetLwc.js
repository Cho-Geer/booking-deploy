import { LightningElement, api, wire } from 'lwc';
import { CustomError } from "./ldsUtils";
import getRelatedContacts from "@salesforce/apex/AccountController.getRelatedContacts";
const columns = [
    { label: "LastName", fieldName: "LastName", type: "text" },
    { label: "FirstName", fieldName: "FirstName", type: "text" }
];

export default class ErrorsGetLwc extends LightningElement {
    columns = columns;
    contacts = [];
    error;
    @api recordId;
    @wire(getRelatedContacts, { recordId: '$recordId' })
    wiredContacts({data, error}){
        if(error)this.error = new CustomError(error).reduceError();
        else if(data){
            try {
                console.log("contacts", data);
                this.contacts = data;
            } catch (error) {
                this.error = new CustomError(error).reduceError();
            }
        }
    }
}