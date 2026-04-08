({
    doInit: function(component, event, helper) {
        // setTimeout(handleChange);
    },

    handleChange: function(component, event, helper) {
        let str = component.get('v.str');
        component.find('notifLib').showToast({
            title: 'WARNING',
            message: str,
            variant: 'WARNING'
        });
    }
})