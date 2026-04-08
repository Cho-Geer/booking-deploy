import { LightningElement } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';

const fields = {};
const contactInput = { apiName: CONTACT_OBJECT.objectApiName, fields: fields };
export default class ContactCreateLWC extends LightningElement {
    contactId = undefined;
    lastName = '';
    firstName = '';
    email = '';

    handleChangeLstNm(event) {
        this.lastName = event.target.value;
    }

    handleChangeFstNm(event) {
        this.firstName = event.target.value;
    }

    handleChangeEmail(event) {
        this.email = event.target.value;
    }

    createContact() {
        fields[LASTNAME_FIELD.fieldApiName] = this.lastName;
        fields[FIRSTNAME_FIELD.fieldApiName] = this.firstName;
        fields[EMAIL_FIELD.fieldApiName] = this.email;

        // alert('contactInput: ' + JSON.stringify(contactInput) + '-----------' + 'fields: ' + JSON.stringify(fields));
        createRecord(contactInput)
            .then(contact => {
                this.contactId = contact.id;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'SUCCESS',
                        message: 'Record Id: ' + this.contactId,
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'ERROR',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
}