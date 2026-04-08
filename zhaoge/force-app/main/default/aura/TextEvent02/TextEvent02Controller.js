({
    doInit: function(component, event, helper) {},

    handleAppEvent: function(component, event, helper) {
        let appText = event.getParam('it');
        console.log('handler: ' + appText);
        component.set('v.appText', appText + 'HANDLE');
        console.log('it: ' + appText);
    }
})