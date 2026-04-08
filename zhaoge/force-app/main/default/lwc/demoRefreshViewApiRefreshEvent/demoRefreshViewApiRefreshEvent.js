import { LightningElement } from 'lwc';
import { RefreshEvent } from 'lightning/refresh';

export default class DemoRefreshViewApiRefreshEvent extends LightningElement {
  handlerClick(){
        this.dispatchEvent(new RefreshEvent());
    }
}