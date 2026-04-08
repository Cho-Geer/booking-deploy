import { LightningElement, api } from 'lwc';
import { registerRefreshHandler, unregisterRefreshHandler } from 'lightning/refresh';
import LightningAlert from "lightning/alert";

export default class DemoRefreshViewApiRefreshHandler extends LightningElement {
  refreshHandlerID;
  @api recordId;
    connectedCallback(){
        this.refreshHandlerID = registerRefreshHandler(this.template.host, this.registerHandler.bind(this));

    }

    disconnectedCallback(){
        unregisterRefreshHandler(this.refreshHandlerID);
    }

    async registerHandler(){
        await LightningAlert.open({
                  message: `Hello I am DemoRefreshViewApiRefreshHandler Component ${this.recordId}`,
                  theme: "success",
                  label: "Greetings"
      });
        const parent = this.refs.parent;
        parent.hidden = !parent.hidden;
    }
}