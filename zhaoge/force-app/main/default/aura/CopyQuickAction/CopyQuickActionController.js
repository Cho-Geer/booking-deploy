({
    doInit: function(component, event, helper) {
        console.log(4);
        console.log('doInit');
        console.log(component.find('form').targetFields);
        console.log(component.get('v.fields'));
        console.log(component.get('v.recordId'));
    }
})