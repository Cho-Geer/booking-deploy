import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import COUNT_UPDATED_CHANNEL from "@salesforce/messageChannel/Count_Updated__c";

export default class Counts extends LightningElement {
    @wire(MessageContext)messageContext;
    priorCount = 0;
    counter = 0;

    subscribeToMessageChannel(){
        subscribe(this.messageContext, COUNT_UPDATED_CHANNEL, (message) => {
            this.priorCount = this.counter;
            if(message.operator == "add")this.counter += message.constant;
            else if(message.operator == "subtract")this.counter -= message.constant;
            else this.counter *= message.constant;
        });
    }

    connectedCallback(){
        this.subscribeToMessageChannel();
    }
}