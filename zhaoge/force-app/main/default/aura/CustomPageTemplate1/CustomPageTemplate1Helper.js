({
    doChangeMiddleSize: function(component, event) {
        let scrollFlag = component.get("v.scrollFlag");
        if (scrollFlag) {
            this.doSetStaticStyle(component);
            this.doRemoveScaleStyle(component);
        } else {
            this.doRemoveScaleStyle(component);
            this.doSetFixedStyle(component);
            let middleSize = component.get("v.middleSize");
            this.doSetMiddleSizeByLabel(component,middleSize);
        }
    },
    doSetStaticStyle: function(component, event) {
        let middleComp = component.find("middleDiv");
        let middleSizeController = component.find("middleSizeController");
        $A.util.addClass(middleSizeController, "middle");
        $A.util.addClass(middleSizeController, "middleSizeController_static");
        $A.util.addClass(middleComp, "middle");
        $A.util.removeClass(middleSizeController, "middle_fixed");
        $A.util.removeClass(middleComp, "tabBar");
        $A.util.removeClass(middleComp, "middle_fixed");
    },
    doSetMiddleSize: function(component,middleSizeNumber){
        switch (middleSizeNumber) {
            case "7":
                component.set("v.middleSize", "x-small");
                break;
            case "8":
                component.set("v.middleSize", "small");
                break;
            case "9":
                component.set("v.middleSize", "medium");
                break;
            case "10":
                component.set("v.middleSize", "large");
                break;
            case "6":
                component.set("v.middleSize", "close");
                break;
        }
    },
    doSetMiddleSizeByLabel: function(component,middleSize){
        let middleComp = component.find("middleDiv");
        switch (middleSize) {
            case "x-small":
                this.doRemoveScaleStyle(component);
                $A.util.addClass(middleComp, "middle_scale_4");
                break;
            case "small":
                this.doRemoveScaleStyle(component);
                $A.util.addClass(middleComp, "middle_scale_6");
                break;
            case "medium":
                this.doRemoveScaleStyle(component);
                $A.util.addClass(middleComp, "middle_scale_8");
                break;
            case "large":
                this.doRemoveScaleStyle(component);
                $A.util.addClass(middleComp, "middle_scale_10");
                break;
            default:
                this.doRemoveScaleStyle(component);
                $A.util.addClass(middleComp, "middle_scale_1");
                break;
        }
    },
    doSetSizeLabel: function(component, event) {
        let middleSizeBar = component.get("v.middleSizeBar");
        component.set("v.middleSizeBar", middleSizeBar ? false : true);
        middleSizeBar = middleSizeBar ? false : true;
        let midlleSizeInput = component.find("midlleSizeInput");
        let middleSizeController = component.find("middleSizeController");
        let middleComp = component.find("middleDiv");
        switch (middleSizeBar) {
            case false:
                this.doRemoveScaleStyle(component);
                $A.util.addClass(midlleSizeInput, "middleSizeBar");
                $A.util.addClass(middleComp, "middle_scale_1");
                $A.util.addClass(middleSizeController, "middleSizeController_zoom");
                break;
            default:
                let middleSize = component.get("v.middleSize");
                // this.doChangeMiddleSize(component);
                this.doRemoveScaleStyle(component);
                this.doSetFixedStyle(component);
                this.doSetMiddleSizeByLabel(component,middleSize);
                switch (middleSize) {
                    case "x-small":
                        component.set("v.middleSizeNumber", 7);
                        break;
                    case "small":
                        component.set("v.middleSizeNumber", 8);
                        break;
                    case "medium":
                        component.set("v.middleSizeNumber", 9);
                        break;
                    case "large":
                        component.set("v.middleSizeNumber", 10);
                        break;
                    case "close":
                        component.set("v.middleSizeNumber", 6);
                        break;
                }
                let middleSizeNumber = component.get("v.middleSizeNumber");
                this.doSetMiddleSize(component,middleSizeNumber);
                $A.util.removeClass(midlleSizeInput, "middleSizeBar");
                $A.util.removeClass(middleSizeController, "middleSizeController_zoom");
                break;
        }
    },
    doSetFixedStyle: function(component, event) {
        let middleComp = component.find("middleDiv");
        let middleSizeController = component.find("middleSizeController");
        $A.util.addClass(middleSizeController, "middle_fixed");
        $A.util.addClass(middleSizeController, "middleSizeController_fixed");
        $A.util.removeClass(middleSizeController, "middle");
        $A.util.removeClass(middleSizeController, "middleSizeController_static");
        $A.util.addClass(middleComp, "tabBar");
        $A.util.addClass(middleComp, "middle_fixed");
        $A.util.removeClass(middleComp, "middle");
    },
    doRemoveScaleStyle: function(component, event) {
        let middleComp = component.find("middleDiv");
        $A.util.removeClass(middleComp, "middle_scale_1");
        $A.util.removeClass(middleComp, "middle_scale_4");
        $A.util.removeClass(middleComp, "middle_scale_6");
        $A.util.removeClass(middleComp, "middle_scale_8");
        $A.util.removeClass(middleComp, "middle_scale_10");
    }
})