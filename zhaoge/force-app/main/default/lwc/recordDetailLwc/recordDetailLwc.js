import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class RecordDetailLwc extends LightningElement {
    @api recordId = "";
    @api recordName = "";
    @api pageMode = "";
    @api recordDetailOpenFlag = false;
    modifyFlag = false;

    handleCancel(event) {
        this.recordDetailOpenFlag = false;
        this.dispatchEvent(new CustomEvent("cancel", {
            detail: { recordDetailOpenFlag: this.recordDetailOpenFlag }
        }));
    }
    handleSubmit(event) {
        event.preventDefault();
        console.log(event.detail.fields);
        this.template.querySelector("lightning-record-form").submit(event.detail.fields);
        const evt = new ShowToastEvent({
            title: "変更に成功",
            message: "レコードが保存されました。",
            variant: "success"
        });
        this.dispatchEvent(evt);
        this.modifyFlag = true;
        const fields = {
            id: this.recordId,
            name: event.detail.fields.Name,
            site: event.detail.fields.Site,
            phone: event.detail.fields.Phone
        };
        this.dispatchEvent(new CustomEvent("modified", {
            detail: {
                modifyFlag: this.modifyFlag,
                fields: fields
            }
        }));
        this.recordDetailOpenFlag = false;
        this.dispatchEvent(new CustomEvent("cancel", {
            detail: { recordDetailOpenFlag: this.recordDetailOpenFlag }
        }));
    }
}