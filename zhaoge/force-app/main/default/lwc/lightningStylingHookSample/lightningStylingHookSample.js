import { LightningElement, api } from "lwc";

export default class LightningStylingHookSample extends LightningElement {
  @api apiName;
  @api listViewApiName;
  itemselected() {
    this.dispatchEvent(new CustomEvent("itemselected"));
  }
}