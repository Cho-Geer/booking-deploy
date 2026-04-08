({
    myAction: function(component, event, helper) {

        let eventParams = event.getParams();
        let eventName = event.getName();
        console.log('event handle: ' + eventParams.eventKey);
        component.set('v.textBody', eventParams.eventKey);
    }
})