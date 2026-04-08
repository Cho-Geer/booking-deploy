import { LightningElement, api } from 'lwc';

export default class LwcParentChild extends LightningElement {
    @api who = "Child";
    @api childName = "ChildContent";
}