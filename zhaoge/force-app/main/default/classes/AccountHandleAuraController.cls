public with sharing class AccountHandleAuraController {
    public AccountHandleAuraController() {

    }

    @AuraEnabled
    public static String getAccount(String accId){
        try {
            return [select Name from Account where Id = :accId].Name;
        } catch (Exception e) {
            String exMsg = '間違いました。';
            AuraHandledException ex = new AuraHandledException(exMsg);
            ex.setMessage(exMsg);
            throw ex;
        }
    }
}