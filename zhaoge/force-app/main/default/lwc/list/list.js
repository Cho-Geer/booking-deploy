import { LightningElement, api } from 'lwc';
import { bikes } from 'c/data';

export default class List extends LightningElement {
    bikes = bikes;

    handleTileClick(event) {
        const evt = new CustomEvent('productselected', {
            detail: event.detail
        });
        this.dispatchEvent(evt);
    }
}