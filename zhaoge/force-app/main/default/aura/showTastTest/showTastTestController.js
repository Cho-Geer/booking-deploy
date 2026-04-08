({
    myAction: function(component, event, helper) {
        let str = component.get('v.str');
        console.log('str: ' + str + 1);
        if (str != 'showToast') {
            helper.showToast(str, event);
        }
    }
})