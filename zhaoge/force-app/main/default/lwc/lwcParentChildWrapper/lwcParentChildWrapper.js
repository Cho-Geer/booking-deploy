import { LightningElement } from 'lwc';

export default class LwcParentChild extends LightningElement {
    who = "Parent";
    childName = "Parent";
    inputText = "ssss";

    handleInputChange(event) {
        this.inputText = event.detail.value;
        event.detail.callback;
    }
}