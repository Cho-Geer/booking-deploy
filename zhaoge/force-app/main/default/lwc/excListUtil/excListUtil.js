import { LightningElement, api } from 'lwc';

const ELLIPSIS = '...';
const OPTIONS = [
    { label: '5', value: '5' },
    { label: '10', value: '10' },
    { label: '15', value: '15' },
    { label: '20', value: '20' },
    { label: '25', value: '25' },
    { label: '50', value: '50' }
];
const END_INITIAL = 5;
const START_INITIAL = 1;
const CURRENT_PAGE_INITIAL = 1;
const CURRENT_PAGE_INITIAL_4 = 4;
const PAGE_INITIAL = 5;
const PAGE_SUM_DEFAULT_9 = 9;
const PAGE_SUM_DEFAULT_7 = 7;
const PAGE_INDEX_0 = 0;
const PAGE_INDEX_2 = 2;
const PAGE_INDEX_6 = 6;
const PAGE_INDEX_8 = 8;
const CUSTOM_EVENT_NAME = 'pagenavigate';

export default class ExcListUtil extends LightningElement {
    @api itemCount = 0;
    value = '5';
    options = OPTIONS;
    start = START_INITIAL;
    end = END_INITIAL;
    count = [];
    currentPage = CURRENT_PAGE_INITIAL;
    page = PAGE_INITIAL;

    // 要素量によるページ数の算出
    get pageSum() {
        let mod = this.itemCount % this.page;
        if (mod == 0) return this.itemCount / this.page;
        else return Math.floor(this.itemCount / this.page) + 1;
    }

    connectedCallback() {
        this.pageSetup();
    }

    renderedCallback() {
        // 選択されたリンク要素のHightLight設定
        this.linkFocusSetup();
    }

    doClick(event) {
        let pageSetupFlag = [];
        this.currentPage = Number(event.target.text);
        this.linkFocusSetup();
        this.previousSetup();
        this.nextSetup();
        this.pageItemsSetup();
        if (this.count.length === PAGE_SUM_DEFAULT_9) pageSetupFlag = this.count.filter((ele, index) => ele.item === this.currentPage && (index === PAGE_INDEX_2 || index === PAGE_INDEX_6 || index === PAGE_INDEX_0 || index === PAGE_INDEX_8));
        else if (this.count.length === PAGE_SUM_DEFAULT_7) this.pageSetup();
        if (pageSetupFlag.length != 0) this.pageSetup();
        const detail = {
            pageNumber: this.currentPage,
            pageCount: this.page,
            start: this.start,
            end: this.end
        }
        this.eventPublisher(detail);
    }

    handlePageNumber(event) {
        this.value = event.detail.value;
        this.page = Number(this.value);
        this.reSetup(this.itemCount);
        const detail = {
            pageNumber: this.currentPage,
            pageCount: this.page,
            start: this.start,
            end: this.end
        }
        this.eventPublisher(detail);
    }

    gotoPrevious(event) {
        if (this.currentPage != CURRENT_PAGE_INITIAL)
            this.doClick({ target: { text: String(this.currentPage - 1) } });
    }

    gotoNext(event) {
        if (this.currentPage != this.pageSum)
            this.doClick({ target: { text: String(this.currentPage + 1) } });
    }

    linkFocusSetup() {
        this.template.querySelectorAll('.link').forEach(ele => {
            if (ele.text === String(this.currentPage)) {
                ele.classList.add('link-focus');
            } else {
                ele.classList.remove('link-focus');
            }
        });
    }

    pageSetup() {
        this.count = [];
        if (this.pageSum >= PAGE_SUM_DEFAULT_7) {
            if (this.currentPage <= CURRENT_PAGE_INITIAL_4) {
                for (let i = 1; i <= 5; i++) {
                    this.count.push({ linkFlag: false, item: i });
                }
                this.count.push({ linkFlag: true, item: ELLIPSIS });
                this.count.push({ linkFlag: false, item: this.pageSum });
            } else if (this.currentPage >= (this.pageSum - 2)) {
                this.count.push({ linkFlag: false, item: 1 });
                this.count.push({ linkFlag: true, item: ELLIPSIS });
                for (let i = (this.pageSum - CURRENT_PAGE_INITIAL_4); i <= this.pageSum; i++) {
                    this.count.push({ linkFlag: false, item: i });
                }
            } else {
                this.count.push({ linkFlag: false, item: 1 });
                this.count.push({ linkFlag: true, item: ELLIPSIS });
                for (let i = (this.currentPage - 2); i <= (this.currentPage + 2); i++) {
                    this.count.push({ linkFlag: false, item: i });
                }
                this.count.push({ linkFlag: true, item: ELLIPSIS });
                this.count.push({ linkFlag: false, item: this.pageSum });
            }
        } else if (this.pageSum < PAGE_SUM_DEFAULT_7) {
            for (let i = 1; i <= this.pageSum; i++) {
                this.count.push({ linkFlag: false, item: i });
            }
        }
    }

    pageItemsSetup() {
        if ((this.currentPage * this.page) <= this.itemCount) {
            this.start = (this.currentPage - 1) * this.page + 1;
            this.end = this.start + this.page - 1;
        } else if ((this.currentPage * this.page) > this.itemCount) {
            this.start = this.itemCount - (this.itemCount % this.page) + 1;
            this.end = this.itemCount;
        }
    }

    previousSetup() {
        let previous = this.template.querySelector('[data-id=previous]');
        if (this.currentPage === CURRENT_PAGE_INITIAL) previous.disabled = true;
        else previous.disabled = false;
    }

    nextSetup() {
        let next = this.template.querySelector('[data-id=next]');
        if (this.currentPage === this.pageSum) next.disabled = true;
        else next.disabled = false;
    }

    @api reSetup(itemsCount) {
        this.itemCount = itemsCount;
        this.currentPage = CURRENT_PAGE_INITIAL;
        this.linkFocusSetup();
        this.previousSetup();
        this.nextSetup();
        this.pageItemsSetup();
        this.pageSetup();
        const detail = {
            pageNumber: this.currentPage,
            pageCount: this.page,
            start: this.start,
            end: this.end
        }
        this.eventPublisher(detail);
    }

    eventPublisher(detail) {
        this.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME, { detail: detail }));
    }
}