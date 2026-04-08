/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
import { LightningElement, wire, api } from 'lwc';
import { getRecord, updateRecord, notifyRecordUpdateAvailable } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from "@salesforce/apex";

const FIELDS = ["Contact.Name", "Contact.Phone"];
export default class DEMO_RefreshViewAPI extends LightningElement {
    @api recordId;
    contact;
    name;
    phone;
    showPopup = false;
    firstName = '';
    lastName = '';
    currentPhone = '';
    wireContact;

    @wire(getRecord, { recordId: "$recordId", fields: FIELDS })
    wiredData(value){
        this.wireContact = value;
        const {error, data} = value;
        if (error) {
            let msg = "Unknown Error";
            if(Array.isArray(error.body)){
                msg = error.body.map(e => e.message).join(", ");
            }else if(typeof error.body.message === "string"){
                msg = error.body.message;
            }
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Error Loading Contact",
                    message: msg,
                    variant: "error"
                })
            );
        } else if(data){
            this.contact = data;
            this.name = this.contact.fields.Name.value;
            this.phone = this.contact.fields.Phone.value;
            console.log(this.contact);
        }
    }

    handleUpdate(){
        this.showPopup = !this.showPopup;
    }

    handleOkay(){
        updateRecord(
            {
                "fields" : {
                    "Id": this.recordId,
                    "FirstName": this.firstName,
                    "LastName": this.lastName,
                    "Phone": this.currentPhone
                }
            }
        ).then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                  title: "Success",
                  message: "Contact updated",
                  variant: "success",
                }),
              );
              this.showPopup = false;
              // Display fresh data in the form
            //   return refreshApex(this.wireContact);
            notifyRecordUpdateAvailable([{
                recordId: this.recordId,
            }]);
        })
        .catch(error => {
            this.showPopup = false;
            this.dispatchEvent(
                new ShowToastEvent({
                  title: "Error creating record",
                  message: error.body.message,
                  variant: "error",
                }),
              );
            });
    }

    handleChange(event){
        switch (event.target.label) {
            case 'firstName':
                this.firstName = event.target.value;
                break;
            case 'lastName':
                this.lastName = event.target.value;
                break;        
            default:
                this.currentPhone = event.target.value;
                break;
        }
    }
}