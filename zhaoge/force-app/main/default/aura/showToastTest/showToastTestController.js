({
    myAction: function(component, event, helper) {
        let text = component.get('v.text');
        component.find('notifLib').showToast({
            title: 'SUCCESS',
            message: text,
            variant: 'success'
        });
    }
})