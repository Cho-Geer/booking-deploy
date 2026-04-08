({
    myAction: function(component, event, helper) {
        let params = event.getParams();
        component.set('v.str', params.eventKey + JSON.stringify(params.eventValue));
        console.log('AuraMethod myAction: ');
    },

    handleAppEvent: function(component, event, helper) {
        let params = event.getParams();
        component.set('v.str', params.it);
        console.log('AuraMethod handleAppEvent: ');
    }
})