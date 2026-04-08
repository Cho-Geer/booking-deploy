import { LightningElement, api } from 'lwc';

export default class AccountRecordCreateLwc extends LightningElement {
    @api createFlag = false;
    @api recordTypeId = "";

    handleReset(event){
        const inputFields = this.template.querySelectorAll("lightning-input-field");
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
        this.createFlag = false;
        this.dispatchEvent(new CustomEvent("modelclosed", {
            detail: {createFlag: this.createFlag}
        }));
    }
}