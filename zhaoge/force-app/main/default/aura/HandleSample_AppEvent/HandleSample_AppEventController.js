({
    myAction: function(component, event, helper) {
        let eventParams = event.getParams();
        console.log('appEvent handle: ' + event.getName());
        component.set('v.textBody', eventParams.it);
    },

    handleTextHeader: function(component, event, helper) {
        helper.handleAppEvent(component, event);
    },

    subHandleTextBody: function(component, event, helper) {
        helper.subHandleAppEvent(component, event);
    }
})