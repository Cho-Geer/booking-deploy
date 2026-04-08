({
    doSetStaticStyle: function (component, event) {
        let middle = component.find("middleDiv");
        let middleSlider = component.find("middleSlider");
        $A.util.addClass(middleSlider,"slds-hide");
        $A.util.addClass(middleSlider, "slds-theme_info");
        $A.util.addClass(middle, "middle");
        $A.util.removeClass(middle, "middle_fixed2");
        $A.util.removeClass(middle, "splitMiddle");
    },
    doSetMiddleStyle: function (component, event) {
        let middle = component.find("middleDiv");
        let middleSlider = component.find("middleSlider");
        let scrollFlag = component.get("v.scrollFlag");
        if (!scrollFlag) {
            $A.util.removeClass(middle, "middle");
            $A.util.addClass(middle, "middle_fixed2");
            $A.util.removeClass(middleSlider,"slds-hide");
            this.doSetMiddleWidthByClick(component);
        } else {
            $A.util.addClass(middle, "middle");
            $A.util.addClass(middleSlider,"slds-hide");
            $A.util.removeClass(middle, "middle_fixed2");
            $A.util.removeClass(middle, "splitMiddle");
        }
    },
    doSetmiddleSliderStyle: function (component, event) {
        let isMiddleLabelOpen = component.get("v.isMiddleLabelOpen");
        let middleSlider = component.find("middleSlider");
        $A.util.addClass(middleSlider, isMiddleLabelOpen == "非表示" ? "slds-theme_info" : "slds-theme_inverse");
        $A.util.removeClass(middleSlider, isMiddleLabelOpen == "非表示" ? "slds-theme_inverse" : "slds-theme_info");
    },
    doSetMiddleHideOrShow: function (component, event) {
        let middle = component.find("middleDiv");
        let isMiddleLabelOpen = component.get("v.isMiddleLabelOpen");
        if (isMiddleLabelOpen == "表　示") $A.util.addClass(middle, "slds-hide");
        else $A.util.removeClass(middle, "slds-hide");
    },
    doSetMiddleWidthByClick: function (component, event) {
        let sideBarOpened = component.get("v.sideBarOpened");
        let middle = component.find("middleDiv");
        if (sideBarOpened) $A.util.addClass(middle, "splitMiddle");
        else $A.util.removeClass(middle, "splitMiddle");
    },
    doSetScrollFlag: function (component, event) {
        let middle = component.find("middleDiv").getElement();
        let bottom = component.find("bottom_left").getElement();
        let middleSlider = component.find("middleSlider");
        let middleBottomToTop = 0;
        let bottomTopToTop = 0;
        let middleBottomToMiddleTop = 0;
        let middleSliderTop = 0;
        try{
            jQuery(window).scroll(() => {
                middleBottomToTop = parseInt(middle.getBoundingClientRect().bottom);
                bottomTopToTop = parseInt(bottom.getBoundingClientRect().top);
                middleBottomToMiddleTop = parseInt(middle.getBoundingClientRect().bottom - middle.getBoundingClientRect().top);
                component.set("v.scrollFlag", bottomTopToTop < middleBottomToMiddleTop * 0.5 && $A.get("$Browser.formFactor") == "DESKTOP" ? false : true);
                if (!component.get("v.scrollFlag") && bottomTopToTop >= 130 && (middleBottomToMiddleTop == 0 || (middleBottomToMiddleTop > 0 && middleBottomToTop > bottomTopToTop)))
                    component.set("v.scrollFlag", true);
                if(middleSlider != undefined){
                    let middleSliderElement = middleSlider.getElement();
                    middleSliderTop = parseInt(middleSliderElement.getBoundingClientRect().top);
                    if(!$A.util.hasClass(middleSlider,"slds-hide")){
                        jQuery("[data-id=middleDiv]").css("top",middleSliderTop);
                    }else{
                        jQuery("[data-id=middleDiv]").css("top","");
                    }
                }
            });
        }catch(error){
            if(error.message.split(" ").includes("jQuery")){
                window.onscroll = () => {
                    middleBottomToTop = parseInt(middle.getBoundingClientRect().bottom);
                    bottomTopToTop = parseInt(bottom.getBoundingClientRect().top);
                    middleBottomToMiddleTop = parseInt(middle.getBoundingClientRect().bottom - middle.getBoundingClientRect().top);
                    component.set("v.scrollFlag", bottomTopToTop < middleBottomToMiddleTop * 0.5 && $A.get("$Browser.formFactor") == "DESKTOP" ? false : true);
                    if (!component.get("v.scrollFlag") && bottomTopToTop >= 130 && (middleBottomToMiddleTop == 0 || (middleBottomToMiddleTop > 0 && middleBottomToTop > bottomTopToTop)))
                        component.set("v.scrollFlag", true);
                };
            }
        }
    },
    doSetHasSubTab: function (component, event) {
        let workspaceApi = component.find("workspace");
        workspaceApi.getFocusedTabInfo()
            .then(res => {
                if (res.subtabs != null && res.subtabs.length > 0) component.set("v.hasSubTab", true);
            });
    },
    doSetMiddleFixedWidth: function (component, event) {
        let top = component.find("topDiv");
        let thisMiddleWidth = top.getElement().clientWidth;
        let windowWidth = window.innerWidth;
        if (thisMiddleWidth != null && thisMiddleWidth != 0) {
            if (thisMiddleWidth > windowWidth * 0.8) component.set("v.sideBarOpened", false);
            else component.set("v.sideBarOpened", true);
        }
    }
})