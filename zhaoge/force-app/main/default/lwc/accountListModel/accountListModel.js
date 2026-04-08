import { LightningElement, api, track, wire } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import { deleteRecord } from 'lightning/uiRecordApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

const actions = [
    { label: "編集", name: "modify" },
    { label: "削除", name: "delete" }
];
const columns = [
    { label: "取引先名", fieldName: "Name" },
    { label: "取引先 部門", fieldName: "Site", type: "text" },
    { label: "電話", fieldName: "Phone", type: "phone" },
    { label: "取引先 所有者名(別名)", fieldName: "OwnerId" },
    {
        type: "action",
        typeAttributes: {
            rowactions: actions
        }
    }
];
export default class AccountListModel extends NavigationMixin(LightningElement) {
    @api searchAccounts = [];
    @api searchText = "";
    @api modifyFlag = false;
    @track recordDetailOpenFlag = false;
    columns = columns;
    @track rowOffset = 0;
    @wire(getListUi, { objectApiName: ACCOUNT_OBJECT, listViewApiName: "MyAccounts" }) allAccounts;
    modalOpenFlag = false;

    renderedCallback() {
        if (this.modifyFlag) {
            this.modifyFlag = false;
            this.dispatchEvent(new CustomEvent("modified", { detail: { modifyFlag: this.modifyFlag } }));
        }
    }
    get searchCount() {
        return this.searchAccounts.length;
    }
    handleSearchText(event) {
        this.searchText = event.target.value;
        const isEnterKey = event.keyCode === 13;
        const tempAccounts = [];

        if (isEnterKey && this.searchText && this.searchText != "*") {
            this.searchAccounts = [];
            this.allAccounts.data.records.records
                .filter(element => { return element.fields.Name.value.toLocaleLowerCase().indexOf(this.searchText.toLocaleLowerCase()) != -1; })
                .forEach((element, index) => {
                    tempAccounts.push({
                        id: element.id,
                        Name: element.fields.Name.value,
                        Site: element.fields.Site.value,
                        Phone: element.fields.Phone.value,
                        OwnerId: element.fields.Owner.value.fields.Alias.value
                    });
                });
        } else if (this.searchText == "*") {
            this.searchAccounts = [];
            this.allAccounts.data.records.records
                .forEach((element, index) => {
                    tempAccounts.push({
                        id: element.id,
                        Name: element.fields.Name.value,
                        Site: element.fields.Site.value,
                        Phone: element.fields.Phone.value,
                        Owner: element.fields.Owner.value.fields.Alias.value
                    });
                });
        }
        this.searchAccounts = tempAccounts;
        this.searchCount = tempAccounts.length;
    }

    handleAccountLink(event) {
        const detail = this.searchAccounts.find(element => { return element.id == event.target.dataset.value });
        this.dispatchEvent(new CustomEvent("accountlink", {
            detail: detail
        }));
    }
    handleButtonItemSelect(event) {
        const recordDataForModify = this.template.querySelector("lightning-button-menu").dataset;
        const recordId = recordDataForModify.id;
        const recordName = recordDataForModify.name;
        switch (event.detail.value) {
            case "modify":
                this.dispatchEvent(new CustomEvent("recorddetailfocus", {
                    detail: {
                        recordId: recordId,
                        recordName: recordName,
                        pageMode: event.detail.value,
                        recordDetailOpenFlag: true
                    }
                }));
                break;
            case "delete":
                deleteRecord(recordId).
                then(() => {
                        this.dispatchEvent(new ShowToastEvent({
                            title: "Success",
                            message: "レコードが削除されました。",
                            variant: "success"
                        }));
                        this[NavigationMixin.Navigate]({
                            type: "standard__objectPage",
                            attributes: {
                                objectApiName: "Account",
                                actionName: "home"
                            }
                        });
                    })
                    .catch(error => {
                        this.dispatchEvent(new ShowToastEvent({
                            title: "Error",
                            message: "レコードの削除に失敗しました：" + error,
                            variant: "error"
                        }));
                    });
            default:
                alert("copy");
                break;
        }

    }
    handleCancel(event) {
        this.dispatchEvent(new CustomEvent("cancel", { detail: { modalOpenFlag: false } }));
    }
    handleRowAction(event) {

    }
    handleLoadMore(event) {
        this.rowOffset += 50;
    }
}