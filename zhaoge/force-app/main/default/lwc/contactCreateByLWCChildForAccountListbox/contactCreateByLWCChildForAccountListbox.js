import { LightningElement, api, track } from 'lwc';

export default class ContactCreateByLWCChildForAccountListbox extends LightningElement {
    @api key = "";
    @api index = 0;
    @api account = {};
    @api searchText = "";

    renderedCallback() {
        let accountName = this.account.name.toLocaleLowerCase();
        const valIndex = accountName.indexOf(this.searchText.toLocaleLowerCase());
        let string = "";
        if (valIndex != -1) {
            this.account.name.split('').forEach((element, index) => {
                if (index >= valIndex && index < (valIndex + this.searchText.length)) {
                    string += "<mark>" + element + "</mark>";
                } else {
                    string += element;
                }
            });
        } else string = this.account.name;
        this.template.querySelector("[data-id=optionText]").innerHTML = string;
    }

    handleListboxOptionSelected(event) {
        event.preventDefault();
        const clickEvent = new CustomEvent("listboxoptionselected", { detail: { key: this.key, account: this.account } });
        this.dispatchEvent(clickEvent);
    }
}