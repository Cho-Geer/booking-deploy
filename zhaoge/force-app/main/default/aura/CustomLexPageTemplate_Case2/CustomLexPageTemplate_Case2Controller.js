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
        component.set("v.middleSizeBar", true);
        component.set("v.middleSize", "large");
        component.set("v.middleSizeNumber", 10);
        helper.doChangeMiddleSize(component);
        let middle2 = component.find("middleDiv2");
        if (!component.get("v.scrollFlag")) {
                component.find("bottom_left").getElement().scrollIntoView(true);
                window.setTimeout($A.getCallback(() => {
                    $A.util.removeClass(middle2, "slds-hide"); 
                }),2000);
        }
        if (!component.get("v.scrollFlag")) helper.doSetSizeLabel(component);
    },
    handleMidControllerRerender: function(component, event, helper) {
        helper.doChangeMiddleSize(component);
    },
    handleScroll: function (component, event, helper) {
        window.setTimeout($A.getCallback(() => {
            let top = component.find("topDiv").getElement();
            let middle = component.find("middleDiv").getElement();
            let scroller = event.target.scrollTop;
            let topMiddleClientHeight = top.clientHeight + (middle.clientHeight * 0.3);
            let middle2 = component.find("middleDiv2");
            if (scroller > topMiddleClientHeight && $A.get("$Browser.formFactor") == "DESKTOP")component.set("v.scrollFlag", false);
            else {if (scroller <= 15)component.set("v.scrollFlag",true);}
            if (component.get("v.scrollFlag") && !$A.util.hasClass(middle2, "slds-hide")) $A.util.addClass(middle2, "slds-hide");
            if ($A.util.hasClass(component.find("middleDiv"), "middle_fixed")) {
                $A.util.addClass(component.find("middleDiv"), "middleClientWidth_fixed");
            } else {$A.util.removeClass(component.find("middleDiv"), "middleClientWidth_fixed");}
            console.log(scroller);
            if(!component.get("v.scrollFlag") && scroller >　15 && scroller <= 100)component.find("bottom_left").getElement().scrollIntoView(true);    
        }),600);
    },
    handleSizeLabel: function(component, event, helper) {
        helper.doSetSizeLabel(component);
    }
})