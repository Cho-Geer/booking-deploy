import { LightningElement, wire, track } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';

export default class ContactCreate_LWC extends LightningElement {
    key;
    @track listboxSearchText = "";
    @track selectedFlag = false;
    @track modalOpenFlag = false;
    @track listAccounts = [];
    @wire(getListUi, { objectApiName: ACCOUNT_OBJECT, listViewApiName: "MyAccounts" }) accounts;
    @track recordId = "";
    @track recordName = "";
    @track pageMode = "";
    @track recordDetailOpenFlag = false;
    @track modifyFlag = false;

    get listboxForAccounts() {
        let listboxAccount = [];
        if (this.accounts.data) {
            let n = 0;
            this.accounts.data.records.records.forEach(element => {
                if (n < 5) {
                    if (this.listboxSearchText == undefined || this.listboxSearchText == "") {
                        listboxAccount.push({ id: element.id, name: element.fields.Name.value });
                        n += 1;
                    } else {
                        if (element.fields.Name.value.toLocaleLowerCase().indexOf(this.listboxSearchText.toLocaleLowerCase()) != -1) {
                            listboxAccount.push({ id: element.id, name: element.fields.Name.value });
                            n += 1;
                        }
                    }
                }
            });
        }
        if (this.accounts.error) console.log("失敗: " + JSON.stringify(this.accounts.error));
        return listboxAccount;
    }

    renderedCallback() {
        let targetElement = this.template.querySelector("c-account-list-model");
        let contactCreateByLWCChildForAccountListbox = this.template.querySelectorAll("c-contact-create-by-l-w-c-child-for-account-listbox");
        if (targetElement) targetElement.searchText = this.listboxSearchText;
        this.selectedFlag = contactCreateByLWCChildForAccountListbox && contactCreateByLWCChildForAccountListbox.length < 5 ? true : false;
        if (this.modifyFlag) {
            // refreshApex(this.accounts);
            this.modifyFlag = false;
        }
    }

    handleMyAccountListShow(event) {
        let targetElement = event.target;
        if (!targetElement.hasAttribute("readonly")) this.template.querySelector("[data-id=comboboxWrapper]").classList.add("slds-is-open");
    }
    handleMyAccountListHide() {
        this.template.querySelector("[data-id=comboboxWrapper]").classList.remove("slds-is-open");
    }
    handleAccountSearch(event) {
        this.listboxSearchText = event.target.value;
    }
    handleListboxOptionSelected(event) {
        this.listboxSearchText = event.detail.account.name;
        let targetElement = this.template.querySelector("[data-id=combobox-id-1]");
        let inputIconSearch = this.template.querySelector("[data-id=inputIconSearch]");
        let inputIconContact = this.template.querySelector("[data-id=inputIconContact]");
        let inputIconClose = this.template.querySelector("[data-id=inputIconClose]");
        let comboboxWrapper = this.template.querySelector("[data-id=comboboxWrapper]");
        // targetElement.value = event.detail.account.name;
        targetElement.setAttribute("readonly", "readonly");
        targetElement.classList.add("slds-combobox__input-value");
        inputIconSearch.classList.add("slds-hide");
        inputIconContact.classList.remove("slds-hide");
        inputIconClose.classList.remove("slds-hide");
        comboboxWrapper.classList.remove("slds-is-open");
        targetElement.focus();
    }
    handleSelectedContactClear() {
        let targetElement = this.template.querySelector("[data-id=combobox-id-1]");
        let inputIconSearch = this.template.querySelector("[data-id=inputIconSearch]");
        let inputIconContact = this.template.querySelector("[data-id=inputIconContact]");
        let inputIconClose = this.template.querySelector("[data-id=inputIconClose]");
        this.listboxSearchText = "";
        targetElement.value = "";
        targetElement.removeAttribute("readonly");
        targetElement.classList.remove("slds-combobox__input-value");
        inputIconSearch.classList.remove("slds-hide");
        inputIconContact.classList.add("slds-hide");
        inputIconClose.classList.add("slds-hide");
        targetElement.focus();
        this.template.querySelector("[data-id=comboboxWrapper]").classList.add("slds-is-open");
        let n = 0;
        this.template.querySelectorAll("c-contact-create-by-l-w-c-child-for-account-listbox").forEach((element) => {
            element.handleMarkKey(this.listboxSearchText, (result) => {
                if (!result) n++;
            });
        });
        if (n < 5) this.selectedFlag = true;
        else this.selectedFlag = false;
    }
    handleModalOpend(event) {
        this.modalOpenFlag = true;
        let searchAccounts = [];
        this.accounts.data.records.records
            .filter(element => { return element.fields.Name.value.toLocaleLowerCase().indexOf(this.listboxSearchText.toLocaleLowerCase()) != -1; })
            .forEach((element, index) => {
                searchAccounts.push({
                    index: index + 1,
                    id: element.id,
                    Name: element.fields.Name.value,
                    Site: element.fields.Site.value,
                    Phone: element.fields.Phone.value,
                    Owner: element.fields.Owner.displayValue
                });
            });
        this.listAccounts = searchAccounts;
    }

    handleCancel(event) {
        this.modalOpenFlag = event.detail.modalOpenFlag;
    }
    handleAccountLink(event) {
        this.listboxSearchText = event.detail.Name;
        let targetElement = this.template.querySelector("[data-id=combobox-id-1]");
        let inputIconSearch = this.template.querySelector("[data-id=inputIconSearch]");
        let inputIconContact = this.template.querySelector("[data-id=inputIconContact]");
        let inputIconClose = this.template.querySelector("[data-id=inputIconClose]");
        let comboboxWrapper = this.template.querySelector("[data-id=comboboxWrapper]");
        targetElement.setAttribute("readonly", "readonly");
        targetElement.classList.add("slds-combobox__input-value");
        inputIconSearch.classList.add("slds-hide");
        inputIconContact.classList.remove("slds-hide");
        inputIconClose.classList.remove("slds-hide");
        comboboxWrapper.classList.remove("slds-is-open");
        this.modalOpenFlag = false;
        targetElement.focus();
    }
    handleRecorddetailfocus(event) {
        this.recordId = event.detail.recordId;
        this.recordName = event.detail.recordName;
        this.pageMode = event.detail.pageMode;
        this.recordDetailOpenFlag = event.detail.recordDetailOpenFlag;
    }
    handleRecordDetailCancel(event) {
        this.recordDetailOpenFlag = event.detail.recordDetailOpenFlag;
    }
    handleModified(event) {
        try {
            this.modifyFlag = event.detail.modifyFlag;
            this.listAccounts.forEach((element) => {
                if (element.id == event.detail.fields.id) {
                    ((name, site, phone, owner) => {
                        if (name) element.Name = name;
                        if (site) element.Site = site;
                        if (phone) element.Phone = phone;
                        if (owner) element.Owner = owner;
                    }).call(this, event.detail.fields.name, event.detail.fields.site, event.detail.fields.phone, event.detail.fields.owner);
                }
            });
        } catch (err) {}
    }
}