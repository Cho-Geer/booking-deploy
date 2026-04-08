public with sharing class AccountPageRecordIdCatchController {
    public String recordId{get;set;}
    public String crrentPgId{get;set;}

    public AccountPageRecordIdCatchController(ApexPages.StandardController stdController) {
        this.recordId = ((Account)stdController.getRecord()).Id;
        this.crrentPgId = ApexPages.currentPage().getParameters().get('id');
    }
}