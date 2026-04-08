import { LightningElement, api, wire } from "lwc";
import getAccountsWithRecordType from "@salesforce/apex/AccountListBox.getAccountsWithRecordType";
import getAccountsWithRecordTypeAndKeywords from "@salesforce/apex/AccountListBox.getAccountsWithRecordTypeAndKeywords";
import { showInfoEvent } from "c/lMSServiceMoudle";
import { loadStyle } from "lightning/platformResourceLoader";
import MultiLineToast from "@salesforce/resourceUrl/MultiLineToast";

export default class ContactTableWrapper extends LightningElement {
    @api contacts;
    fullAccounts = [];
    accounts = [];
    searchFlag = false;

    @wire(getAccountsWithRecordType, {})
    wiredAccounts({data, error}){
        if(error){
            showInfoEvent(this, "error", "getAccountsWithRecordType: \n" + error.body.message, "error");
        }else if(data){
            try {   
                    this.fullAccounts = data;
                    this.accounts = this.fullAccounts.filter((item, index) => {return index < 5});
                } catch (error) {
                    showInfoEvent(this, "error", "getAccountsWithRecordType: \n" + error.body.message, "error");
                }
        }
    }

    connectedCallback() {
        Promise.all([loadStyle(this, MultiLineToast)])
            .then(() => {
                try{}catch(err){
                    showInfoEvent(this, "error", "loadStyle error①: \n" + err.body.message, "error");
                }
            })
            .catch((error) => {
                showInfoEvent(this, "error", "loadStyle error②: \n" + error.body.message, "error");
            });
    }

    handelSearched(event){
        let searchText = event.detail.value;
        let recordIndex = event.detail.index;
        let inputId = event.detail.targetInput;

        if(searchText == null || searchText == ""){
            this.template.querySelectorAll("c-contact-record-create")[recordIndex].markFlag = false;
            this.searchFlag = false;
            this.accounts = this.fullAccounts.filter((item, index) => {return index < 5});
        }else{
            // searchTextにより既存の取引先を検索、searchText文字マークする
            let oldAccountsLength = this.fullAccounts.filter((account, index) => {
                let startIndex = account.accountName.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase());
                if(startIndex != -1)return account;
            }).length;
    
            // account再度取得
            if(oldAccountsLength < 5){
                this.template.querySelectorAll("c-contact-record-create")[recordIndex].markFlag = true;
                this.searchFlag = true;
                this.accounts = this.fullAccounts.filter((item, index) => {
                    return item.accountName.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) != -1});
            }else{
                this.template.querySelectorAll("c-contact-record-create")[recordIndex].markFlag = true;
                this.searchFlag = false;
                this.accounts = this.fullAccounts.filter((item, index) => {
                    return item.accountName.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) != -1;
                }).filter((item, index ) => {return index < 5});
            }
        }
    }
}