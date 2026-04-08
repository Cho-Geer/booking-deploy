({
    doInit: function(component, event, helper) {},

    handleToggle: function(component, event, helper) {
        let checked = event.getParams();
        component.set('v.contactInstance.HasOptedOutOfEmail', checked.checked);
        let toggle = component.get('v.contactInstance.HasOptedOutOfEmail');
        // console.log('checked: ' + JSON.stringify(checked));
        // console.log('toggle: ' + toggle);
    },

    handleSelected: function(component, event, helper) {
        let val = event.getParam('value');
        // console.log('select: ' + val);
        component.set('v.contactInstance.Level__c', val);
    },

    handleAddRow: function(component, event, helper) {
        let addRowEvent = component.getEvent('compEvent');
        helper.addRow(component, addRowEvent);
    },

    handleDeleteRow: function(component, event, helper) {
        let deleteRowEvent = component.getEvent('compEvent');
        // console.log('deleteRowIndex: ' + component.get('v.rowIndex'));
        helper.deleteRow(component, deleteRowEvent);
    }
})