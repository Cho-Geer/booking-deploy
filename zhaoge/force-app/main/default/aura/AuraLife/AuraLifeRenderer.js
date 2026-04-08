({

    render: function(component, helper) {
        var d = this.superRender();
        console.log('render');
        return d;
    },

    afterRender: function(component, helper) {
        var d = this.superAfterRender();
        console.log('afterRender');
        return d;
    },

    rerender: function() {
        var d = this.superRerender();
        console.log('rerender');
        return d;
    }

})