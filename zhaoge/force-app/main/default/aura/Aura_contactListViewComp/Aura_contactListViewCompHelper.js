({
    handleInit: function(component) {
        let rowActions = this.getRowActions.bind(this, component);
        this.refreshHeaderActions(component, rowActions);
        this.fetchData(component);
    },
    fetchData: function(component, renderer, rerenderKey) {
        let action = {};
        action = component.get('c.getContactList');
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === 'SUCCESS' && response.getReturnValue().isSuccess) {
                let contactList = response.getReturnValue().contactList;
                component.set('v.data', contactList);
                component.set('v.rowData', contactList);
                component.set('v.searchData', contactList);
                console.log('action rowData: ' + contactList.length + '  action searchData: ' + contactList.length);
                if (rerenderKey) {
                    component.set('v.rerenderKey', rerenderKey);
                    renderer.rerender(component);
                }
            } else {
                component.find('notifyb').showToast({
                    title: 'WARNING',
                    message: response.getMessage().length > 0 ? response.getMessage()[0] : 'データ取得しない',
                    variant: 'warning'
                });
            }
        });
        $A.enqueueAction(action);
    },
    fetchSearch: function(component, eventKey) {
        let rowActions = this.getRowActions.bind(this, component);
        this.refreshHeaderActions(component, rowActions);
        if (eventKey) {
            this.fetchData(component, 'handleSearch');
        } else {
            component.set('v.rerenderKey', 'handleSearch');
        }
    },
    refreshHeaderActions: function(component, rowActions) {
        let headerActions = [{
                'label': 'All',
                'checked': true,
                'name': 'all'
            },
            {
                'label': 'unHasOptedOutOfEmail',
                'checked': false,
                'name': 'unHasOptedOutOfEmail'
            },
            {
                'label': 'HasOptedOutOfEmail',
                'checked': false,
                'name': 'HasOptedOutOfEmail'
            }
        ];
        component.set('v.columns', [
            { label: 'LastName', fieldName: "LastName", type: 'text' },
            { label: 'FirstName', fieldName: 'FirstName', type: 'text' },
            { label: 'メール除外', fieldName: 'HasOptedOutOfEmail', type: 'checkbox', actions: headerActions },
            { label: 'レベル', fieldName: 'Level__c', type: 'text' },
            { type: 'action', typeAttributes: { rowActions: rowActions } }
        ]);
    },
    getRowActions: function(cmp, row, donCallback) {
        var actions = [{
            'label': 'Show Details',
            'iconName': 'utility:zoomin',
            'name': 'show_details'
        }];
        var deleteAction = {
            'label': 'Delete',
            'iconName': 'utility:delete',
            'name': 'delete'
        };
        if (row.HasOptedOutOfEmail) {
            actions.push({
                'label': 'unHasOptedOutOfEmail',
                'iconName': 'utility:ban',
                'name': 'unHasOptedOutOfEmail'
            });
            deleteAction.disabled = 'true';
        } else {
            actions.push({
                'label': 'HasOptedOutOfEmail',
                'iconName': 'utility:approval',
                'name': 'HasOptedOutOfEmail'
            });
        }
        actions.push(deleteAction);
        setTimeout($A.getCallback(() => { donCallback(actions) }), 200);
    },
    updateBooks: function(component, event) {
        let rows = component.get('v.rowData');
        let searchRows = component.get('v.searchData');
        console.log('rowData サイズ: ' + rows.length + '  data サイズ: ' + searchRows.length);
        let activeFilter = component.get('v.activeFilter');
        let filteredRows = searchRows;

        if (activeFilter !== 'all' && typeof activeFilter !== 'undefined') {
            filteredRows = searchRows.filter(function(row) {
                return (activeFilter === 'unHasOptedOutOfEmail' && !row.HasOptedOutOfEmail) ||
                    (activeFilter === 'HasOptedOutOfEmail' && row.HasOptedOutOfEmail);
            });
        }
        component.set('v.data', filteredRows);
    },
    getRowIndex: function(rows, row) {
        let rowIndex = -1;
        rows.some((data, index) => {
            if (data.Id === row.Id) {
                rowIndex = index;
                return true;
            }
        });
        return rowIndex;
    },
    deleteRow: function(component, row) {
        let action = component.get('c.deleteRow');
        action.setParams({
            id: row.Id
        });
        action.setCallback(this, function(response) {
            let state = response.getState();
            let rv = response.getReturnValue();
            let rows = component.get('v.rowData');
            let data = component.get('v.data');
            let searchData = component.get('v.searchData');
            if (state === 'SUCCESS' && rv.isSuccess) {
                let index = this.getRowIndex(rows, row);
                rows.splice(index, 1);
                data.splice(this.getRowIndex(data, row), 1);
                searchData.splice(this.getRowIndex(searchData, row), 1);
                component.set('v.rowData', rows);
                component.set('v.data', data);
                component.set('v.searchData', searchData);
                this.updateBooks(component);
                component.find('notifyb').showToast({
                    title: 'SUCCESS',
                    message: '削除されました',
                    variant: 'success'
                });
            } else {
                component.find('notifyb').showToast({
                    title: 'ERROR',
                    message: '削除できない。原因: ' + response.getMessage()[0],
                    variant: 'error'
                });
            }
        });
        $A.enqueueAction(action);
    },
    showDetails: function(component, row) {
        let navEvt = $A.get('e.force:navigateToSObject');
        navEvt.setParams({
            recordId: row.Id,
            slideDevName: 'detail'
        });
        navEvt.fire();
    },
    handleUnHasOptedOutOfEmail: function(component, row) {
        let action = component.get('c.updateContactRecord');
        action.setParams({
            id: row.Id,
            flg: false
        });
        action.setCallback(this, (response) => {
            let state = response.getState();
            let rv = response.getReturnValue();
            if (state === 'SUCCESS' && rv.isSuccess) {
                // rows[this.getRowIndex(rows, row)].HasOptedOutOfEmail = false;
                row.HasOptedOutOfEmail = false;
                this.updateBooks(component);
            } else {}
        });
        $A.enqueueAction(action);
    },
    handleHasOptedOutOfEmail: function(component, row) {
        let action = component.get('c.updateContactRecord');
        action.setParams({
            id: row.Id,
            flg: true
        });
        action.setCallback(this, (response) => {
            let state = response.getState();
            let rv = response.getReturnValue();
            if (state === 'SUCCESS' && rv.isSuccess) {
                row.HasOptedOutOfEmail = true;
                this.updateBooks(component);
            } else {}
        });
        $A.enqueueAction(action);
    }
})