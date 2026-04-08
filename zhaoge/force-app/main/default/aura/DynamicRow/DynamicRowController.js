({
    doInit: function(component, event, helper) {
        let contactList = component.get('v.contactList');
        contactList.push({
            objectApiName: 'Contact'
        });
        component.set('v.contactList', contactList);

        component.set('v.columns', [
            { label: '姓', fieldName: 'LastName', type: 'text' },
            { label: '名', fieldName: 'FirstName', type: 'text' },
            { label: 'メール', fieldName: 'Email', type: 'email' },
            { label: '携帯', fieldName: 'Phone', type: 'phone' }
        ]);

        let action = component.get('c.getContactList');
        action.setParams({
            'searchName': component.get('v.searchName')
        });
        action.setCallback(this, function(res) {
            let state = res.getState();
            if (state === 'SUCCESS') {
                component.set('v.data', res.getReturnValue().contactList);
                // console.log("Data: " + JSON.stringify(res.getReturnValue().contactList));
            } else {
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);
    },

    handleSubmit: function(component, event, helper) {
        let contactList = component.get('v.contactList');
        let action = component.get('c.createContactList');
        action.setParams({
            'contactList': contactList
        });
        action.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS' && response.getReturnValue().isSuccess === true) {
                component.set('v.contactList', response.getReturnValue().message);
                component.find('notify').showToast({
                    'title': 'SUCCESS',
                    'message': '保存しました。',
                    'variant': 'SUCCESS'
                });
                component.set('v.contactList', [{ objectApiName: 'Contact' }]);
            } else {
                component.find('notify').showToast({
                    'title': '保存に失敗しました。',
                    'message': response.getReturnValue().message,
                    'variant': 'ERROR'
                });
            }
        });
        $A.enqueueAction(action);
    },

    handleCompEvent: function(component, event, helper) {
        let eventKey = event.getParam('eventKey');
        let eventValue = event.getParam('eventValue');
        // console.log('compEvent handler: ' + 'eventKey: ' + eventKey + ', eventValue: ' + JSON.stringify(eventValue));
        let contactList = component.get('v.contactList');
        switch (eventKey) {
            case 'add':
                contactList.push(eventValue);
                component.set('v.contactList', contactList);
                // console.log('add contactList: ' + JSON.stringify(contactList) + 'index: ' + contactList.length);
                break;

            case 'delete':
                contactList.splice(eventValue, 1);
                component.set('v.contactList', contactList);
                // console.log('delete contactList: ' + JSON.stringify(contactList) + 'index: ' + contactList.length);
                break;
            default:
                break;
        }
        console.log('contactList: ' + contactList);
    },

    handleSearch: function(component, event, help) {
        let searchName = component.get('v.searchName');
        let action = component.get('c.getContactList');
        console.log('searchName: ' + searchName);
        action.setParams({
            'searchName': searchName
        });
        action.setCallback(this, function(response) {
            let state = response.getState();
            console.log('state: ' + state);
            if (state === 'SUCCESS') {
                let data = response.getReturnValue().contactList;
                component.set('v.data', response.getReturnValue().contactList);
                console.log('data サイズ: ' + data);
                if (data == undefined || data.length == 0) {
                    console.log('data: ' + data);
                    component.find('notify').showToast({
                        title: 'warning',
                        message: '見つかりません',
                        variant: 'warning'
                    });
                }
            } else {
                component.find('notify').showToast({
                    title: 'error',
                    message: 'エラー',
                    variant: 'error'
                });
            }
        });
        $A.enqueueAction(action);
    }

})