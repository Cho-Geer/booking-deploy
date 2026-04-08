({
    handleAppEvent: function(component, event) {
        let textHeader = event.getParams().it;
        component.set('v.textHeader', textHeader);
    },

    subHandleAppEvent: function(component, event) {
        let subTextBody = event.getParam('it');
        subTextBody = subTextBody + 'サブハンドル';
        component.set('v.subTextHeader', subTextBody);
    }
})