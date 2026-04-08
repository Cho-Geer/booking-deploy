({
    addRow: function(component, event) {
        event.setParams({
            'eventKey': 'addRow',
            'eventValue': {
                objectApiName: 'Contact'
            }
        });
        event.fire();
    },

    deleteRow: function(component, event) {
        event.setParams({
            'eventKey': 'deleteRow',
            'eventValue': { index: component.get('v.rowIndex') }
        });
        event.fire();
    }
})