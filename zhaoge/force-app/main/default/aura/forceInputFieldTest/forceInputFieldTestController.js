({
    handleInit: function(component, event, helper) {
        component.find("recordData").getNewRecord(
            "Contact",
            null,
            false
        );
        let options = [{ "label": "new", "value": "new" }, { "label": "old", "value": "old" }];
        component.set("v.options", options);
        console.log("handleInit simpleRecord: " + JSON.stringify(component.get("v.simpleRecord")));
    },
    handleCombobox: function(component, event, helper) {

    },
    handleInputFieldChanged: function(component, event, helper) {

    },
    handleSave: function(component, event, helper) {
        let accountId = component.find("accountId").get("v.value");
        let lastName = component.find("lastName").get("v.value");
        component.set("v.simpleRecord.AccountId", accountId);
        component.set("v.simpleRecord.LastName", lastName);
        let simpleRecord = component.get("v.simpleRecord");
        let contact = component.get("v.contact");
        delete contact.AccountId;
        delete contact.Account;
        delete contact.LastName;
        console.log("contact: " + JSON.stringify(contact));
        console.log("handleSave simpleRecord: " + JSON.stringify(simpleRecord));

        component.find("recordData").saveRecord($A.getCallback(saveResult => {
            if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
                alert("登録");
            } else if (saveResult.state === "INCOMPLETE") {
                alert("INCOMPLETE");
            } else if (saveResult.state === "ERROR") {
                alert('Problem saving record, error: ' +
                    JSON.stringify(saveResult.error));
            } else {
                alert('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
            }
        }));
    },
    handleRecordUpdated: function(component, event, helper) {
        if (event.getParam("changeType") === "CHANGED") {
            let simpleRecord = component.get("v.simpleRecord");
            console.log("new simpleRecord: " + JSON.stringify(simpleRecord));
        }
        // $A.get("e.force:refreshView").fire();
        // let simpleRecord = component.get("v.simpleRecord");
        // let targetRecord = component.get("v.contact");
        // console.log("simpleRecord: " + JSON.stringify(simpleRecord));
        // console.log(" targetRecord: " + JSON.stringify(targetRecord));
    }
})