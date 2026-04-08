({
    doCompEvent: function(component, event) {
        let eventKey = event.getParam("eventKey");
        let eventValue = event.getParam("eventValue");
        let contactList = component.get("v.contactList");
        if (eventKey === "addRow") {
            contactList.push({ sobjectType: "Contact" });
        }
        if (eventKey === "deleteRow") {
            contactList.splice(eventValue.index, 1);
            component.set("v.contactList", contactList);
            this.doAddContact(component, contactList.length);
        }
        if (eventKey === "CheckRow") {
            let checkedIndexList = component.get("v.checkedIndexList");
            switch (eventValue.checked) {
                case true:
                    checkedIndexList.push(eventValue.index);
                    // console.log(JSON.stringify(checkedIndexList) + " eventValue.index: " + eventValue.index);
                    break;
                default:
                    checkedIndexList.splice(checkedIndexList.indexOf(eventValue.index), 1);
                    break;
            }
            component.set("v.checkedIndexList", checkedIndexList);
        }
    },
    doAddContact: function(component, length) {
        if (length === 0) component.set("v.contactList", [{ sobjectType: "Contact" }]);
    }
})