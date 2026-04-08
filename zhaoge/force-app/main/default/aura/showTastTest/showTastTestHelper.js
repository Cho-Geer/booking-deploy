({
    showToast: function(str, event) {
        let toastEvent = $A.get('e.force:showToast');
        toastEvent.setParams({
            "title": 'WARNING',
            "message": str,
            "type": 'warning'
        });

        toastEvent.fire();
    }
})