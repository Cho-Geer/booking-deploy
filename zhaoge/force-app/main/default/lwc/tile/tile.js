import { LightningElement, api } from 'lwc';

export default class Tile extends LightningElement {
    @api product;

    tileClick() {
        const evt = new CustomEvent('tileclick', {
            detail: this.product
        });
        this.dispatchEvent(evt);
    }
}