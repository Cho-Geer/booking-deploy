import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class LwcRenderedCallbackTest extends NavigationMixin(LightningElement) {
    inputText = "";

    connectedCallback() {
        // alert("parent connectedCallback");
    }
    renderedCallback() {
        // alert("parent renderedCallback");
    }

    handleInputText(event) {
        this.inputText = event.target.value;
    }
    handleNavigate(event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: '5005h000000UIpRAAW',
                objectApiName: 'Case', // objectApiName is optional
                actionName: 'view'
            }
        });
        alert("handleNavigate");
    }
}