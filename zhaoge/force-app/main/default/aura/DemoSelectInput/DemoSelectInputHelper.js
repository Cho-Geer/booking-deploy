({
    handleBlur : function(cmp, event) {
        const childSelector = cmp.find('childSelector').getElement();
        console.log('childSelector', childSelector);
        cmp.set('v.isShowDropdown', false);
    }
})