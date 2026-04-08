({
    fireAppEvent: function(component, event) {
        let evt = $A.get('e.c:Fw_AppEvent');
        let textHeader = component.get('v.textHeader');
        evt.setParams({
            it: textHeader
        });
        evt.fire();
    }
})