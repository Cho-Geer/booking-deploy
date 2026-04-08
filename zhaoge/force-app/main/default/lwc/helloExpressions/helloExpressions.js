import { api, LightningElement } from 'lwc';
import ICON_ACG from '@salesforce/resourceUrl/UtinityIcons';

export default class HelloExpressions extends LightningElement {
    customOpenSections = [];
    opens = '';
    eventParentId = '';
    svgURL = ICON_ACG + '/utility-sprite/svg/symbols.svg#success';
    outputNameA = '';
    firstNameA = '';
    lastNameA = '';

    outputNameB = '';
    firstNameB = '';
    lastNameB = '';

    link = '';

    handleSectiontoggle(event) {
        const openSections = event.detail.openSections;
        this.customOpenSections = openSections;
        let index = 0;
        if (openSections !== 0) {
            if (this.customOpenSections.length > 1) {
                for (let se in this.customOpenSections) {
                    this.link = '#link' + index++;
                }
            } else {
                this.link = '#link' + 0;
            }
        }
    }

    handleSelectA(event) {
        this.opens = event.detail.value;
        this.eventParentId = event.target.parentNode.dataset.id;
        if (this.opens === 'uppercase') {
            this.handleUppercase(this.eventParentId);
        } else { this.handleLowercase(this.eventParentId); }
    }

    handleSelectB(event) {
        this.opens = event.detail.value;
        const selectBParentId = event.target.parentNode.dataset.id;
        if (this.opens === 'uppercase') {
            this.handleUppercase(selectBParentId);
        } else { this.handleLowercase(selectBParentId); }
    }

    handleFrtA(event) {
        this.firstNameA = event.detail.value;
    }

    handleLstA(event) {
        this.lastNameA = event.detail.value;
    }

    handleFrtNB(event) {
        this.firstNameB = event.detail.value;
    }

    handleLstNB(event) {
        this.lastNameB = event.detail.value;
    }

    handleUppercase(eventParentId) {
        switch (eventParentId) {
            case 'link0':
                this.outputNameA = this.firstNameA !== undefined && this.lastNameA !== undefined ? this.firstNameA.toUpperCase() + '　' + this.lastNameA.toUpperCase() : '';
                break;
            case 'link1':
                this.outputNameB = this.firstNameB !== undefined && this.lastNameB !== undefined ? this.firstNameB.toUpperCase() + '　' + this.lastNameB.toUpperCase() : '';
                break;
            default:
                break;
        };
    }

    handleLowercase(eventParentId) {
        switch (eventParentId) {
            case 'link0':
                this.outputNameA = this.firstNameA !== undefined && this.lastNameA !== undefined ? this.firstNameA.toLowerCase() + '　' + this.lastNameA.toLowerCase() : '';
                break;
            case 'link1':
                this.outputNameB = this.firstNameB !== undefined && this.lastNameB !== undefined ? this.firstNameB.toLowerCase() + '　' + this.lastNameB.toLowerCase() : '';
                break;
            default:
                break;
        }
    }

}