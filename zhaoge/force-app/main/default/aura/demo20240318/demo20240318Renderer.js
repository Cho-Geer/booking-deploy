({
    render: function(cmp, event, helper) {
        let ret = this.superRender();
        let recordId = cmp.get("v.recordId");
        alert("render");
        console.log("render", cmp.find("card"));
        return ret;
    },
    rerender: function(cmp, helper) {
        this.superRerender();
        console.log("rerender", "2");
    },
    afterRender: function(cmp, helper) {
        this.superAfterRender();
        console.log("afterRender", "3");
    },
    unrender: function(cmp, helper) {
        this.superUnrender();
        console.log("unrender", "4");
    }
})