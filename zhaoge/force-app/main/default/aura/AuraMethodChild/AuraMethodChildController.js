({
    handleStr: function(component, event, helper) {
        let evt = component.getEvent('fireCompEvent');
        let params = event.getParam('arguments');
        if (params) {
            let eventKey = params.eventKey;
            let eventValue = params.eventValue;
            component.set('v.str', JSON.stringify(eventValue));
            evt.setParams({
                eventKey: eventKey,
                eventValue: eventValue
            });
            evt.fire();
            console.log('AuraMethodChild: ');
        }
    },
    handleAppEvent: function(component, event, helper) {
        let params = event.getParam('arguments');
        let evt = $A.get('e.c:Fw_AppEvent');
        if (params) {
            let it = params.it;
            component.set('v.str', it);
            evt.setParams({
                it: it
            });
            evt.fire();
        }
    },
    handleServerAction: function(component, event, helper) {
        let params = event.getParam('arguments');
        if (params) {
            let comp = params.comp;
            let actionParams = params.actionParams;
            let callback = params.callback;
            let actionName = params.actionName;
            let action = comp.get(actionName);
            action.setParams(actionParams);
            action.setCallback(this, (response) => {
                let returnValue = response.getReturnValue();
                let state = response.getState();
                if (state === 'SUCCESS') {
                    callback(returnValue);
                } else {}
            });
        }
    }
})