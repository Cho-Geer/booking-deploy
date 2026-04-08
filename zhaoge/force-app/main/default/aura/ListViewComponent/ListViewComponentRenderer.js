({
    render: function(component, helper) {
        let ret = this.superRender();
        let scrollFlg = component.get("v.scrollFlg");
        let scroller = component.find("scroller");
        // alert("scrollTop: " + scroller.scrollTop + " div offsetTop: " + document.getElementById("<globalId>_footer").offsetTop);
        // let bottom = scroller.scrollTop + scroller.clientHeight;
        // if(scrollFlg){

        // }
        return ret;
    },
    rerender: function(component, helper) {
        this.superRerender();
    }
})