({
    handleInit: function (component, event, helper) {
        helper.doSetStaticStyle(component);
    },
    handleCssRerender: function (component, event, helper) {
        let isMiddleLabelOpen = component.get("v.isMiddleLabelOpen");
        isMiddleLabelOpen = event.getParam("value") ? "非表示" : "表　示";
        component.set("v.isMiddleLabelOpen", isMiddleLabelOpen);
        helper.doSetMiddleHideOrShow(component);
        helper.doSetMiddleStyle(component);
    },
    handleSizeLabel: function (component, event, helper) {
        let middleSliderText = event.target.innerText;
        let isMiddleLabelOpen = "";
        let scrollFlag = component.get("v.scrollFlag");
        switch (middleSliderText) {
            case "表　示": isMiddleLabelOpen = "非表示"; break;
            case "非表示": isMiddleLabelOpen = scrollFlag ? "非表示" : "表　示"; break;
        }
        component.set("v.isMiddleLabelOpen", isMiddleLabelOpen);
        helper.doSetMiddleHideOrShow(component);
        if(isMiddleLabelOpen in ["非表示","表　示"])helper.doSetMiddleWidthByClick(component);
    },
    handleIsMiddleLabelOpen: function (component, event, helper) {
        helper.doSetmiddleSliderStyle(component, event);
    },
    handleMiddleFixedWidth: function (component, event, helper) {
        if (!component.get("v.scrollFlag"))helper.doSetMiddleWidthByClick(component);
    },
    handleRender: function (component, event, helper) {
        helper.doSetScrollFlag(component);
        helper.doSetMiddleFixedWidth(component);
    },
    handleTabFocused: function (component, event, helper) {
        helper.doSetHasSubTab(component);
        component.find("workspace").getFocusedTabInfo().then(res => {
            if(res.pageReference.attributes.objectApiName == "Bank_Inquiry__c" && res.pageReference.attributes.actionName == "view"){
                let middle = component.find("middleDiv");
                component.set("v.isMiddleLabelOpen", "非表示");
                component.set("v.scrollFlag", true);
                $A.util.removeClass(middle, "slds-hide");
                $A.util.removeClass(middle, "splitMiddle");
                helper.doSetStaticStyle(component);
            }
        });
    }
})