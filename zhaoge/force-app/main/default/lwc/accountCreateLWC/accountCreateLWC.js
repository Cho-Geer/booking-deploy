import { LightningElement,api, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import { showInfoEvent } from "c/lMSServiceMoudle";

export default class AccountCreateLWC extends LightningElement {

    @api closeFlag = false;
    @api createFlag = false;
    recordTypeOptions = [];

    @wire(getObjectInfo,{objectApiName: ACCOUNT_OBJECT})
    wiredAccountRecordType({data,error}){
        if(error){
            console.log("error", error.body.message);
        }else if(data){
            try {
                Object.values(data.recordTypeInfos).forEach((element, index) => {
                    if(!element.master){
                        this.recordTypeOptions.push({label: element.name, value: element.recordTypeId});
                    }
                });
            } catch (error) {
                showInfoEvent(this,"Error",error.body.message,"error");
            }
        }
    }
    handleCancel(event){
        this.closeFlag = false;
        this.dispatchEvent(new CustomEvent("modalclosed",{
            detail: {closeFlag : this.closeFlag}
        }));
    }
    handleChanged(event){
        let selectedRecordTypeId = this.template.querySelector("lightning-radio-group").value;
        this.createFlag = true;
        this.closeFlag = false;
        this.dispatchEvent(new CustomEvent("modalcreate", {
            detail: {selectedRecordTypeId: selectedRecordTypeId, createFlag: this.createFlag, closeFlag: this.closeFlag}
        }));
    }
}