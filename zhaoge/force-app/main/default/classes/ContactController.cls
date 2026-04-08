public with sharing class ContactController {
    public ContactController() {}

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(){
        List<Contact> contacts;
        try {
            contacts = [Select Id, LastName, FirstName From Contact LIMIT 10];
            return contacts;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}