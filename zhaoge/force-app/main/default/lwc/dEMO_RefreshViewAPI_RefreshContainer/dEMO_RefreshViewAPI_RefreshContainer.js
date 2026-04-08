import { LightningElement, api } from 'lwc';
import { registerRefreshContainer, unregisterRefreshContainer, REFRESH_COMPLETE, REFRESH_COMPLETE_WITH_ERRORS, REFRESH_ERROR } from 'lightning/refresh';
import Toast from 'lightning/toast';

export default class DEMO_RefreshViewAPI_RefreshContainer extends LightningElement {
    refreshContainerID;
    @api recordId;

    connectedCallback(){
        this.refreshContainerID = registerRefreshContainer(this.template.host, this.registerContainer.bind(this));
        Toast.show({
                label: `${this.recordId}`,
                mode: 'sticky',
                variant: 'success'
        }, this);
    }

    disconnectedCallback(){
        unregisterRefreshContainer(this.refreshContainerID);
    }

    registerContainer(refreshPromise){
        return refreshPromise
            .then((status) => {
                if(status === REFRESH_COMPLETE){
                    Toast.show({
                        label: 'REFRESH_COMPLETE',
                        mode: 'sticky',
                        variant: 'success'
                    }, this);
                }else if(status === REFRESH_COMPLETE_WITH_ERRORS){
                    Toast.show({
                        label: 'REFRESH_COMPLETE_WITH_ERRORS',
                        mode: 'sticky',
                        variant: 'warning'
                    }, this);
                }else if(status === REFRESH_ERROR){
                    Toast.show({
                        label: 'REFRESH_ERROR',
                        mode: 'sticky',
                        variant: 'error'
                    }, this);
                }
            })
    }
}