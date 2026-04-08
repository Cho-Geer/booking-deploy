({
    handleCmpStr: function(component, event, helper) {
        let cmpStr = component.get('v.cmpStr');
        let eventValue = { label: 'AuraMethodSample02' }
        component.find('AuraMethodSample02').compEvent(cmpStr, eventValue);
    },
    handleAppStr: function(component, event, helper) {
        let appStr = component.get('v.appStr');
        component.find('AuraMethodSample02').appEvent(appStr);
    }
})