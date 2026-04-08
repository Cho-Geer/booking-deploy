({
    handleRecordUpdated: function(component, event, helper) {
        let changeType = event.getParam("changeType");
        let changedFields = event.getParam("changedFields");
        let simpleRecord = component.find("recordData").get("v.targetFields");
        let record = component.find("recordData").get("v.targetRecord");
        let oldRecord = component.get("v.oldRecord");
        switch (changeType) {
            case "LOADED":
                component.find("recordData").reloadRecord(true, () => {
                    if (oldRecord.Name != simpleRecord.Name || oldRecord.Phone != simpleRecord.Phone) {
                        changeType = "CHANGED";
                        component.set("v.changeType", changeType);
                        $A.get("e.c:Fw_AppEvent").setParams({ it: changeType }).fire();
                    }
                });
                break;
            default:
                component.find("recordData").reloadRecord(false, () => {
                    if (oldRecord.Name != simpleRecord.Name || oldRecord.Phone != simpleRecord.Phone) {
                        // alert("CHANGED: " + JSON.stringify(changedFields));
                        oldRecord.Name = simpleRecord.Name;
                        oldRecord.Phone = simpleRecord.Phone;
                    }
                });
                break;
        }
    }
})