public with sharing class ContactDataController {

    @AuraEnabled
    public static ReturnValue getAccountForLookup(){
        ReturnValue rt = new ReturnValue();
        try {
            List<Account> accountList = Database.query('Select Id,Name From Account Limit 10');
            rt.isSuccess = true;
            rt.message = '';
            rt.contactList = accountList;
        } catch (Exception e) {
            rt.isSuccess = false;
            rt.message = '取得できません' + e.getMessage();
        }
        return rt;
    }

    @AuraEnabled
    public static ReturnValue getRecordType(){
        ReturnValue rt = new ReturnValue();
        try {
            String contact = 'Contact';
            List<RecordType> recordTypeList = Database.query('Select Id,Name From RecordType Where SobjectType = :contact');
            rt.isSuccess = true;
            rt.message = '';
            rt.contactList = recordTypeList;
        } catch (Exception e) {
            rt.isSuccess = false;
            rt.message = '取得できません' + e.getMessage();
        }
        return rt;
    }
    
    @AuraEnabled
    public static ReturnValue getContactList(){
        ReturnValue returnvalue = new ReturnValue();
        try {
            List<Contact> contactList = Database.query('select Id, LastName,FirstName,HasOptedOutOfEmail, Level__c,LastCUUpdateDate from Contact Order By LastName Desc');
            system.debug(contactList);
            returnvalue.isSuccess = true;
            returnvalue.message = '取得しました';
            returnvalue.contactList = contactList;
        } catch (Exception e) {
            returnvalue.isSuccess = false;
            returnvalue.message = '取得できません' + e.getMessage();
        }
        return returnvalue;
    }

    @AuraEnabled
    public static ReturnValue searchContactList(String searchStr){
        ReturnValue rt = new ReturnValue();
        String query = '';
        switch on searchStr {
            when  '*'{
                query = 'Select LastName, FirstName, HasOptedOutOfEmail, Level__c from Contact';
            }
            when else {
               query = 'Select LastName, FirstName, HasOptedOutOfEmail, Level__c from Contact Where LastName like ' + '\'' + '%' + searchStr + '%' + '\'' + 'Order By LastName DESC'; 
            }
        }
        try {
            // System.debug('query開始: ' + query);
            rt.contactList = Database.query(query);
            // system.debug(rt.contactList.size());
            rt.isSuccess = true;
        } catch (Exception e) {
            rt.isSuccess = false;
            rt.message = e.getMessage();
        }
        return rt;
    }

    @AuraEnabled
    public static ReturnValue saveContacts(List<Contact> contactList){
        ReturnValue returnValue = new ReturnValue();
        System.debug(contactList);
        // System.debug(contactList);
        try {
            for(Contact con : contactList){
                
                con.AccountId = con.AccountId == null ? null : con.AccountId;
            }

            insert contactList;
            returnValue.isSuccess = true;
            returnValue.contactList = contactList;
            returnValue.message = '作成しました！';
            System.debug(returnValue);
        } catch (Exception e) {
            returnValue.isSuccess = false;
            returnValue.message = '失敗原因：' + e.getMessage();
            // System.debug(returnValue);
        }
        return returnValue;
    }

    @AuraEnabled
    public static ReturnValue deleteRow(Id id){
        ReturnValue rv = new ReturnValue();
        try {
            Contact contact = database.query('select Id from Contact where Id = :id');
            delete contact;
            rv.isSuccess = true;
        } catch (Exception e) {
            rv.isSuccess = false;
        }
        return rv;
    }

    @AuraEnabled
    public static ReturnValue updateContactRecord(Id id,Boolean flg){
        ReturnValue rv = new ReturnValue();
        try {
            Contact contact = Database.query('select Id, HasOptedOutOfEmail from Contact Where Id = :id');
            contact.HasOptedOutOfEmail = flg ? false : true;
            update contact;
            rv.isSuccess = true;
        } catch (Exception e) {
            rv.isSuccess = false;
        }
        return rv;
    }

    public class ReturnValue {
        
        @AuraEnabled
        public Boolean isSuccess{set;get;}

        @AuraEnabled
        public String message{set;get;}

        @AuraEnabled
        public List<Object> contactList{set;get;}
    }
}