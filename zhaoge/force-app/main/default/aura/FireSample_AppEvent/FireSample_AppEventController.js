({
    myAction: function(component, event, helper) {
        let textBody = component.get('v.textBody');
        let evt = $A.get('e.c:Fw_AppEvent');
        evt.setParams({
            it: textBody
        });
        console.log('appEvent register: ' + evt.getName());
        evt.fire();
    },

    handleTextHeader: function(component, event, helper) {
        helper.fireAppEvent(component, event);
    }
})