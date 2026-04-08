public with sharing class ContactDAO {
    public ContactDAO() {}

    public static List<Contact> getContactList(){
        
        return [Select
                Id
                ,LastName
                ,FirstName
                ,Phone
                ,Email
                From Contact
                Order By CreatedDate Desc
                limit 100];
    }
}