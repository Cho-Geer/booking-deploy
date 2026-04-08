public with sharing class DataServiceController {
    // public class CustomBusinessLogicException extends Exception{}

    @AuraEnabled
    public static ReturnValue getContactList(String searchName){
        ReturnValue rt = new ReturnValue();
        String query = '';
        try {
            rt.isSuccess = true;
            rt.message = '';
            if(String.isEmpty(searchName) || searchName == '*'){  
                query = 'select LastName, FirstName, Email, Phone from Contact';          
                rt.contactList = Database.query(query);
            }else {
                query = 'select LastName, FirstName, Email, Phone from Contact where LastName Like ' + '\'' + String.escapeSingleQuotes(searchName + '%') + '\'';
                System.debug('開始: ' + query);
                rt.contactList = Database.query(query);
                System.debug(rt.contactList);
            }
        } catch (Exception e) {
            rt.isSuccess = false;
            rt.message = 'システムエラーが発生しました。' + e.getMessage();
        }
        return rt;
    }

    @AuraEnabled
    public static ReturnValue createContactList(List<Contact> contactList){
        ReturnValue returnValue = new ReturnValue();
        try {
            for(Contact con : contactList){
                con.Account = null;
            }
            System.debug(contactList);
            insert contactList;
            returnValue.isSuccess = true;
        } catch (Exception e) {
            returnValue.isSuccess = false;
            returnValue.message = 'システムエラーが発生しました。' + e.getMessage();
        }
        return returnValue;
    }

    public class ReturnValue{
        @AuraEnabled
        public Boolean isSuccess{set; get;}

        @AuraEnabled
        public string message{get; set;}

        @AuraEnabled
        public List<Contact> contactList{set; get;}
    }
}