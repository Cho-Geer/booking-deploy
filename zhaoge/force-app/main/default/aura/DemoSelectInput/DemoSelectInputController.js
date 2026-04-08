({
    doInit : function(cmp, event, helper){
        const data = [
            {label: '取引先:個人', value: '取引先:個人'},
            {label: '取引先:メールアドレス', value: '取引先:メールアドレス'},
            {label: '取引先:製品名', value: '取引先:製品名'},
            {label: '取引先:法人', value: '取引先:法人'},
            {label: 'AAA', value: 'AAA'},
            {label: 'BBB', value: 'BBB'},
            {label: 'CCC', value: 'CCC'}
        ];
        cmp.set('v.data', data);
        cmp.set('v.changedData', data);
    },

    showDropdown : function(cmp, event, helper) {
        cmp.set('v.isShowDropdown', true);
    },

    hideDropdown : function(cmp, event, helper) {
        cmp.set('v.isShowDropdown', false);
    },

    getKeywords : function(cmp, event, helper){
        const data = cmp.get('v.data');
        const changeValue = event.target.value;
        cmp.set('v.changeValue', changeValue);
        let changedData = [];
        data.forEach(ele => {
            if(ele.value.toUpperCase().includes(changeValue.toUpperCase())) changedData.push(ele);
        });
        cmp.set('v.changedData', changedData);
    }
})