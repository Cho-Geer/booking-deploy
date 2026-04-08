({
    handleChange: function(component, event, helper) {
        // let text = event.getParam('index');
        // component.set('v.text', Number(text) + 1);
        // let compt = component.get('v.text');
        // console.log('text: ' + compt);
    },

    handleAppEvent: function(component, event, helper) {
        let appText = event.getParam('it');
        console.log('appText: ' + appText);
        component.set('v.appText', appText + 'HANDLE');
    }
})