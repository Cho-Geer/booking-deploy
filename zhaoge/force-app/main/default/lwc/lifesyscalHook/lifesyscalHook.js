import { LightningElement, api } from 'lwc';

export default class LifesyscalHook extends LightningElement {
    @api name = "";
    title = "";

    constructor() {
        super();
        this.name = "tzx";
        this.title = "ライフサイクル"
        console.log("constructor  " + this.name);
    }

    connectedCallback() {
        console.log("connectedCallback  " + this.name);
    }

    renderedCallback() {
        console.log("renderedCallback  " + this.name);
    }

    errorCallback() {
        console.log("errorCallback  " + this.name);
    }

    disconnectedCallback() {
        console.log("disconnectedCallback  " + this.name);
    }

    handleBlured(event) {
        this.name = event.target.value;
        this.dispatchEvent("lifehook", {
            detail: {
                value: this.name
            }
        });
    }
}