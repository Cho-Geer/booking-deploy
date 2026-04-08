({
    doInit: function(cmp, event, helper) {
        let recordId = cmp.get("v.recordId");
        alert("doInit");
        console.log("doInit", cmp);
        cmp.set("v.param1", recordId);
    }

})