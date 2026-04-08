public with sharing class AccountBean {
    public AccountBean() {}

    @AuraEnabled
    public String accountId;

    @AuraEnabled
    public String accountName;

    @AuraEnabled
    public String accountRecordTypeId;

    @AuraEnabled
    public String accountRecordTypeLabel;

    public void setAccountId(String accountId){
        this.accountId = accountId;
    }

    public String getAccountId(){
        return this.accountId;
    }

    public void setAccountName(String accountName){
        this.accountName = accountName;
    }

    public String getAccountName(){
        return this.accountName;
    }

    public void setAccountRecordTypeId(String accountRecordTypeId){
        this.accountRecordTypeId = accountRecordTypeId;
    }

    public String getAccountRecordTypeId(){
        return this.accountRecordTypeId;
    }

    public void setAccountRecordTypeLabel(String accountRecordTypeLabel){
        this.accountRecordTypeLabel = accountRecordTypeLabel;
    }

    public String getAccountRecordTypeLabel(){
        return this.accountRecordTypeLabel;
    }
}