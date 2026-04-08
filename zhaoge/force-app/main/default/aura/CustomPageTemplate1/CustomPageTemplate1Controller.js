({
    handleInit: function(component, event, helper) {
        helper.doSetStaticStyle(component);
    },
    handleSlider: function(component, event, helper) {
        let middleSize = event.target.value;
        component.set("v.middleSizeNumber", middleSize);
        helper.doSetMiddleSize(component,middleSize);
    },
    handleCssRerender: function(component, event, helper) {
        component.set("v.middleSizeBar", false);
        component.set("v.middleSize", "x-small");
        component.set("v.middleSizeNumber", 7);
        helper.doSetSizeLabel(component);
        helper.doChangeMiddleSize(component);
    },
    handleMidControllerRerender: function(component, event, helper) {
        helper.doChangeMiddleSize(component);
    },
    handleScroll: function(component, event, helper) {
        let top = component.find("topDiv").getElement();
        let middle = component.find("middleDiv").getElement();
        let scroller = event.target;
        let topMiddleClientHeight = top.clientHeight + (middle.clientHeight * 0.3);
        component.set("v.scrollFlag", scroller.scrollTop > topMiddleClientHeight && $A.get("$Browser.formFactor") == "DESKTOP" ? false : true);
    },
    handleSizeLabel: function(component, event, helper) {
        helper.doSetSizeLabel(component);
    }
})