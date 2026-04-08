({
    handleInit: function(component, event, helper) {
        let items = component.get("v.items");
        for (let i = 0; i < 100; i++) {
            items.push(i);
        }
        component.set("v.items", items);

        let con = component.get("v.con");
        con = {
            'sobjectType': 'Contact',
            'LastName': '',
            'FirstName': ''
        };
        component.set("v.con", con);
    }
})