import { LightningElement, api } from 'lwc';

export default class ExcListItem extends LightningElement {
    @api itemTitle;
    @api itemText;
}