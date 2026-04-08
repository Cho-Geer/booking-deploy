({
    myAction: function(component, event, helper) {
        // console.log('AuraMethodSample myAction: ');
        let compEvent = component.find('AuraMethodSample');
        let eventKey = component.get('v.str');
        let eventValue = { label: 'Name', name: 'FirstName' };
        compEvent.compEvent(eventKey, eventValue);
    },
    doAppEvent: function(component, event, helper) {
        // console.log('AuraMethodSample doAppEvent: ');
        component.find('AuraMethodSample').appEvent(component.get('v.appStr'));
    }
})