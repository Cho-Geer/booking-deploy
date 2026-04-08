({
    doInit: function(component, event, helper) {
        helper.handleInit(component, event);
    },

    handleSearch: function(component, event, helper) {
        let eventKey = event.getParam('eventKey');
        eventKey = typeof eventKey === 'undefined' || eventKey == '' ? '' : eventKey;
        console.log('search開始 :' + eventKey);
        helper.fetchSearch(component, eventKey);
    },

    handleRowAction: function(component, event, helper) {
        let rowAction = event.getParam('action');
        let row = event.getParam('row');
        switch (rowAction.name) {
            case 'show_details':
                helper.showDetails(component, row);
                break;
            case 'delete':
                helper.deleteRow(component, row);
                break;
            case 'unHasOptedOutOfEmail':
                helper.handleUnHasOptedOutOfEmail(component, row);
                break;
            case 'HasOptedOutOfEmail':
                helper.handleHasOptedOutOfEmail(component, row);
                break;
        }
    },

    handleHeaderAction: function(component, event, helper) {
        let actionName = event.getParam('action').name;
        let colDef = event.getParam('columnDefinition');
        let columns = component.get('v.columns');
        let activeFilter = component.get('v.activeFilter');
        // console.log(JSON.stringify(colDef));
        if (actionName !== 'clipText' && actionName !== 'wrapText' && actionName !== activeFilter) {
            let idx = -1;
            columns.some(function(column, i) {
                if (column.fieldName === colDef.fieldName) {
                    idx = i;
                    return true;
                }
            });

            let actions = columns[idx].actions;
            if (actions) {
                actions.forEach(function(action) {
                    action.checked = action.name === actionName;
                });
                component.set('v.activeFilter', actionName);
                helper.updateBooks(component);
                component.set('v.columns', columns);
            }
        }
    }
})