({

// Your renderer method overrides go here
render : function(cmp, helper) {
    var ret = this.superRender();
    // do custom rendering here
    const isInit = cmp.get('v.isInit');
    let inputField = cmp.find('selector').getElement();
    console.log(inputField);
    if(isInit === 0){
        inputField.addEventListener('blur', helper.handleBlur.bind(this));
        cmp.set('v.isInit', 1);
    }
    return ret;
 }

})