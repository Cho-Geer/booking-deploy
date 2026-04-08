({
    // doInit: function(component, event, helper) {
    //     component.set('v.contactInstance', { objectApiName: 'Contact' });
    // },

    handleAddRow: function(component, event, helper) {
        let evt = component.getEvent('compEvent');
        evt.setParams({
            'eventKey': 'add',
            'eventValue': component.get('v.contactInstance')
        });
        console.log('addRow registerEvent: ' + JSON.stringify(evt));
        evt.fire();
    },

    handleDeleteRow: function(component, event, helper) {
        let evt = component.getEvent('compEvent');
        let indexVar = component.get('v.indexRow');
        evt.setParams({
            'eventKey': 'delete',
            'eventValue': indexVar
        });
        console.log('deleteRow registerEvent: ' + JSON.stringify(evt));
        evt.fire();
    }
})