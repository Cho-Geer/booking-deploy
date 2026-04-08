({
    addRow: function(component, eventValue) {
        let contactList = component.get('v.contactList');
        contactList.push(eventValue);
        component.set('v.contactList', contactList);
    },

    deleteRow: function(component, eventValue) {
        let contactList = component.get('v.contactList');
        // console.log('contactList before deleted: ' + JSON.stringify(contactList));
        contactList.splice(eventValue.index, 1);
        // console.log('contactList after deleted: ' + JSON.stringify(contactList));
        component.set('v.contactList', contactList);
    },

    handleShowToast: function(component, returnValue) {
        let title = returnValue.isSuccess ? 'SUCCESS' : 'ERROR';
        let message = returnValue.message;
        let variant = title.toLowerCase();
        console.log('showToast: ' + title + '  ' + message + '  ' + variant);
        component.find('notifLib').showToast({
            title: title,
            message: message,
            variant: variant
        });
    },

    refreshList: function(component, returnValue) {
        let event = $A.get('e.c:Fw_auraAppEvent');
        console.log('appEvent: ' + JSON.stringify(event));
        event.setParams({
            eventKey: 'refreshList',
            eventValue: returnValue.contactList
        });
        event.fire();
    }
})