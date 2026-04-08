import { LightningElement } from 'lwc';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';

export default class EmpApiLwc extends LightningElement {

    channelName = 'event/Test__e';
    isSubscribeDisabled = false;
    isUnsubscribeDisabled = !this.isSubscribeDisabled;

    subscribetion = {};

    connectedCallback() {
        this.PriviewError();
    }

    handleChannelName(event) {
        this.channelName = event.target.value;
    }

    handleSubscribe() {
        const messageCallback = function(response) {
            console.log();
        };

        subscribe(this.channelName, -1, messageCallback)
            .then(
                response => {
                    console.log('Subscription request sent to: ', JSON.stringify(response.channel));
                    this.subscribetion = response;
                    this.subscribeChange(true);
                }
            );
    }

    handleUnsubscribe() {
        this.subscribeChange(false);

        unsubscribe(this.subscribetion, response => {
            console.log('unsubscribe() response: ', JSON.stringify(response));
        });
    }

    subscribeChange(s) {
        this.isSubscribeDisabled = s;
        this.isUnsubscribeDisabled = !s;
    }

    PriviewError() {
        onError(error => {
            console.log('Received error from server: ', JSON.stringify(error));
        });
    }
}