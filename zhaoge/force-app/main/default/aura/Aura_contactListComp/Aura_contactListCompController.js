({
    doInit: function(component, event, helper) {
        let contactList = component.get('v.contactList');
        contactList = [{ objectApiName: 'Contact' }];
        component.set('v.contactList', contactList);
    },

    handleCompEvent: function(component, event, helper) {
        let eventKey = event.getParam('eventKey');
        let eventValue = event.getParam('eventValue');
        switch (eventKey) {
            case 'addRow':
                helper.addRow(component, eventValue);
                break;
            case 'deleteRow':
                helper.deleteRow(component, eventValue);
            default:
                break;
        }
    },

    handleClick: function(component, event, helper) {
        let contactList = component.get('v.contactList');
        let action = component.get('c.saveContacts');
        // console.log('contactList: ' + JSON.stringify(contactList));
        action.setParams({
            'contactList': contactList
        });
        action.setCallback(this, function(response) {
            let returnValue = response.getReturnValue();
            // console.log('saveContacts setCallback');
            let state = response.getState();
            if (state === 'SUCCESS' && returnValue.isSuccess) {
                helper.refreshList(component, returnValue);
            }
            helper.handleShowToast(component, returnValue);
        });
        $A.enqueueAction(action);
    }
})