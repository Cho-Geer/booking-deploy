({

    // Your renderer method overrides go here
    rerender: function(component, helper) {
        this.superRerender();
        let rerenderKey = component.get('v.rerenderKey');
        switch (rerenderKey) {
            case 'handleSearch':
                let searchStr = component.get('v.searchStr');
                let searchFlg = component.get('v.searchFlg');
                let searchData = component.get('v.searchData');
                let rowData = component.get('v.rowData');
                let searchedData = [];
                console.log('rerender rowData: ' + rowData.length + '   rerender searchData: ' + searchData.length);
                searchedData = searchData;
                console.log('rerender searchData サイズ: ' + searchData.length);
                if (searchStr) {
                    searchedData = searchData.filter((data => { return data.LastName.includes(searchStr) }));
                    searchFlg = true;
                }
                console.log('rerender searchedData サイズ: ' + searchedData.length);
                component.set('v.searchFlg', searchFlg);
                component.set('v.searchData', searchedData);
                component.set('v.data', searchedData);
                component.set('v.rowData', rowData);
                break;
            default:
                break;
        }
        component.set('v.rerenderKey', '');
    }
})