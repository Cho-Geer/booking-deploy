import { LightningElement, api, track } from "lwc";
import jQuery from "@salesforce/resourceUrl/jQuery";
import { loadScript } from "lightning/platformResourceLoader";
import { showInfoEvent } from "c/lMSServiceMoudle";
import { NavigationMixin } from "lightning/navigation";

export default class ContactRecordCreate extends NavigationMixin(LightningElement) {
    @api contact = {};
    @api index = 0;
    @api accounts = [];
    @api searchFlag = false;
    @api markFlag = false;

    connectedCallback() {
        Promise.all([
                loadScript(this, jQuery)
            ])
            .then(() => {})
            .catch((error) => {
                showInfoEvent(this,"Error","jQueryロードに失敗しました。\n原因：" + error,"error");
            });
    }

    _expanded0 = false;
    set expanded(val) {
        this._expanded0 = val;
    }
    get expanded() {
        return this._expanded0;
    }
    _expanded1 = false;
    set expanded1(val) {
        this._expanded1 = val;
    }
    get expanded1() {
        return this._expanded1;
    }
    get _index() {
        return this.index + 1;
    }

    @track accSearchTxt = "";
    @track accountCreateFlag = false;
    @track accountCreate2Flag = false;
    accountRecordTypeId = "";

    renderedCallback() {
        let combobox = this.template.querySelector("[data-id=combobox]");
        let combobox1 = this.template.querySelector("[data-id=combobox1]");
        // Account listbox展開制御
        if (this.expanded) combobox.classList.add("slds-is-open");
        else combobox.classList.remove("slds-is-open");
        // RecordType listbox展開制御
        if (this.expanded1) combobox1.classList.add("slds-is-open");
        else combobox1.classList.remove("slds-is-open");
    }

    handleFocused(event) {
        // Account inputがfocusの場合、account listbox制御フラグ設定
        this.expanded = true;
    }
    handleBlur(event) {
        // Account inputが焦点外しの場合、account listbox制御フラグ設定
        this.expanded = false;
    }
    handleFocused1(event) {
        // RecordType inputがfocusの場合、listbox制御フラグ設定
        this.expanded1 = true;
    }
    handleBlur1(event) {
        // RecordType inputが焦点外しの場合、listbox制御フラグ設定
        this.expanded1 = false;
    }
    handleInputed(event){
        let targetInput = event.target.dataset.id;
        if(targetInput == "comboboxInput1"){
            this.accSearchTxt = event.target.value;
            this.dispatchEvent(new CustomEvent("searchtext", {
                detail: {index: this.index, input: targetInput, value: this.accSearchTxt}
            }));
        }
    }
    handleCreateAccount(event){
        this.accountCreateFlag = true;
    }
    handleModalClosed(event){
        this.accountCreateFlag = event.detail.closeFlag;
    }
    handleCreateModal(event){
        this.accountCreate2Flag = event.detail.createFlag;
        this.accountCreateFlag = event.detail.closeFlag;
        this.accountRecordTypeId = event.detail.selectedRecordTypeId;
    }
}