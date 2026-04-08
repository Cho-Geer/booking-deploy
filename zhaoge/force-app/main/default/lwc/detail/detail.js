import { LightningElement, api } from 'lwc';
import { bikes } from 'c/data';


export default class Detail extends LightningElement {
    @api product;
    // _productId = undefined;

    // set productId(value) {
    //     alert(value);
    //     this._productId = value;
    //     this.product = bikes.find(bike => bike.fields.Id.value === value);
    // }

    // @api get productId() {
    //     return this._productId;
    // }
}