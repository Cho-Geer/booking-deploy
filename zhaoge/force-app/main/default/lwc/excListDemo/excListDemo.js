import { LightningElement } from 'lwc';
const STR = 'This is No.';
export default class ExcListDemo extends LightningElement {
    itemCount = 50;
    start = 1;
    end = 5;
    page = 5;
    lifeName = 'aaa';
    get items() {
        let str = STR;
        let _items = [];
        for (let i = this.start; i <= this.end; i++) {
            _items.push({ id: i, text: str + i, title: str + i });
        }
        return _items;
    }

    getpagenumber(event) {
        this.start = event.detail.start,
            this.end = event.detail.end;
        this.page = event.detail.pageCount;
    }

    handleItemsSum() {
        this.itemCount = this.template.querySelector('[data-id=sum]').value;
        this.template.querySelector('c-exc-list-util').reSetup(this.itemCount);
    }

    handleLifeHook(event) {
        this.lifeName = event.detail.title;
    }

    // handleBlured(event) {
    //     this.lifeName = event.target.value;
    // }

    constructor() {
        super();
        console.log("親 constructor " + this.lifeName);
    }

    connectedCallback() {
        console.log("親 connectedCallback " + this.lifeName);
    }

    renderedCallback() {
        console.log("親 renderedCallback " + this.lifeName);
    }

    errorCallback() {
        console.log("親 errorCallback " + this.lifeName);
    }

    disconnectedCallback() {
        console.log("親 disconnectedCallback " + this.lifeName);
    }
}