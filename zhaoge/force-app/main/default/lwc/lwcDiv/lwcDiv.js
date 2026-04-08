import { LightningElement, api } from 'lwc';

export default class LwcDiv extends LightningElement {
    @api lwcDivInput = "";
    @api inputText = "inputText";

    connectedCallback(event) {
        alert("child connectedCallback");
    }
    renderedCallback(event) {
        alert("child renderedCallback");
    }

    @api handleinputchange(event) {
        this.lwcDivInput = event.target.value;
        this.dispatchEvent(new CustomEvent("handleinputchange", {
            detail: {
                value: this.lwcDivInput,
                callback: () => {
                    alert(this.lwcDivInput);
                }
            }
        }));
    }
}