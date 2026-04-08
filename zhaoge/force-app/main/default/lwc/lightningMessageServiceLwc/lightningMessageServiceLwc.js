import { LightningElement } from 'lwc';

export default class LightningMessageServiceLwc extends LightningElement {

    get contacts() {
        return [{ index: 1, contact: { objectApiName: "Contact" } }];
    }
    handleBulkCreate() {
        alert("aaaa");
    }
}