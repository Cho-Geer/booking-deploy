public with sharing class AccountController {
    public AccountController(){}

    @AuraEnabled(cacheable=true)
    public static List<Contact> getRelatedContacts(Id recordId){
        List<Contact> contacts;
        try {
            contacts = [Select Id, LastName, FirstName From Contact Where AccountId = :recordId];
            System.debug(contacts);
            return contacts;
        } catch (Exception e) {
            throw new MyException(e.getMessage());
        }
    }

    public class MyException extends Exception{}
}