import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class LwcLinkForLightning extends NavigationMixin(LightningElement) {

    handleLinkClicked(event) {
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
                url: "https://www.baidu.com"
            }
        }, false );
    }
}