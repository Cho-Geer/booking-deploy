({
    handleInit: function(component, event, helper) {
        console.log("AuraCollectionAttributeTest 初期化");
        let values = [];
        for (let i = 0; i < 4; i++) {
            values.push(i);
        };
        component.set("v.values", values);
        console.log("AuraCollectionAttributeTest: " + component.get("v.values"));
    }
})