import { LightningElement, api } from 'lwc';

export default class ContactAccount extends LightningElement {
    @api account = {};
    @api markFlag = false;
    @api searchText = "";

    renderedCallback(){
        if(this.markFlag && (this.searchText != null || this.searchText != "")){
            let text = this.searchText.toLocaleLowerCase();
            let startIndex = this.account.accountName.toLocaleLowerCase().indexOf(text);
            let output = "";
            if(startIndex == 0){
                output = "<mark>" + this.account.accountName.substr(startIndex,text.length) + "</mark>" + this.account.accountName.substr(text.length);
            }else{
                output = this.account.accountName.substr(0,startIndex) + "<mark>" + this.account.accountName.substr(startIndex,text.length) + "</mark>" + this.account.accountName.substr(text.length + startIndex);
            }
            this.template.querySelector("[class='slds-listbox__option-text slds-listbox__option-text_entity']").innerHTML = output;
        }else if(!this.markFlag && (this.searchText == "" || this.searchText == null)){
            this.template.querySelector("[class='slds-listbox__option-text slds-listbox__option-text_entity']").innerHTML = this.account.accountName;
        }
    }
}