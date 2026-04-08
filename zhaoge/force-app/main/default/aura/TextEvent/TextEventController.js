({
    handleChange: function(component, event, helper) {
        // let text = component.getEvent('textEvent');
        // let index = component.get('v.text');
        // text.setParams({
        //     'index': index
        // });
        // text.fire();
    },

    handleAppEvent: function(component, event, helper) {
        let appEvent = $A.get('e.c:Fw_AppEvent');
        let comp = component.get('v.appText');
        appEvent.setParams({
            'it': comp
        });
        console.log('TextEvent: ' + comp);
        appEvent.fire();
    }
})