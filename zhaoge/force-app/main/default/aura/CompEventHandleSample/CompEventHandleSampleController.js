({
    myAction: function(component, event, helper) {
        let textBody = component.get('v.textBody');
        let evt = component.getEvent('compEvent');
        evt.setParams({
            eventKey: textBody,
            eventValue: null
        });
        console.log('event register: ' + evt.getParams());
        evt.fire();
    }
})