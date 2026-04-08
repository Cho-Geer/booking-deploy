import { LightningElement, api } from "lwc";
import LightningAlert from "lightning/alert";
import { registerRefreshHandler, unregisterRefreshHandler } from 'lightning/refresh';
export default class Child extends LightningElement {
      refreshHandlerID;
      connectedCallback(){
            this.refreshHandlerID = registerRefreshHandler(this.template.host, this.sayHi.bind(this));
      }
      disconnectedCallback(){
            unregisterRefreshHandler(this.refreshHandlerID);
      }
      
      @api
      async sayHi(param) {
            await LightningAlert.open({
                  message: `Hello I am Child Component ${param}`,
                  theme: "success",
                  label: "Greetings"
      });  
      console.log("Alert modal has been closed");
     }
}