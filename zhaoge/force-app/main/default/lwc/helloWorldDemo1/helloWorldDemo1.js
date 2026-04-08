import { LightningElement, api } from 'lwc';

export default class HelloWorldDemo1 extends LightningElement {
    @api strTitle = 'Welcom in Salesforce';
    @api showImage = false;
    @api imgUrl = '';
    @api firstName = 'Amit';
}