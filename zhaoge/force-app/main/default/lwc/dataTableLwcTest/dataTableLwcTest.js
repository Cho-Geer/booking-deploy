import { LightningElement, wire } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';

const actions = [
    { label: '編集', name: 'Modify' },
    { label: '削除', name: 'Delete' }
];

const columns = [
    { label: "Name", fieldName: 'Name' },
    { label: "Site", fieldName: 'Site', type: 'url' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions }
    }
];

export default class DataTableLwcTest extends LightningElement {
    columns = columns;
    rowOffset = 0;
    @wire(getListUi, { objectApiName: ACCOUNT_OBJECT, listViewApiName: 'AllAccounts' }) accounts;

    get data() {
        console.log("data");
        const accountsJson = this.accounts.data.records.records.map(record => {
            return {
                id: record.fields.Id.value,
                Name: record.fields.Name.value,
                Site: record.fields.Site.value,
                Phone: record.fields.Phone.value
            };
        });
        return accountsJson;
    }

    handleRowAction(event) {
        alert("handleRowAction");
    }
}