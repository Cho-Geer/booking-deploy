import { LightningElement } from 'lwc';

export default class LightningWebEvent extends LightningElement {
    previousHandler(){
        this.dispatchEvent(new CustomEvent('previous'));
    }
}