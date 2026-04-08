({
    doInit: function(component, event, helper) {
        console.log('doInit');
    },

    waiting: function(component, event, helper) {
        console.log('waiting');
    },

    doneWaiting: function(component, event, helper) {
        alert('doneWaiting');
        console.log('doneWaiting');
    }
})