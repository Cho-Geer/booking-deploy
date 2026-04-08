@IsTest
public with sharing class RsGetActiveUserInfoTest {

    @IsTest
    private static void name() {
        Test.startTest();
        List<Contact> uList = new List<Contact>();
        for(Integer i=0; i<5000; i++){
            Contact con = new Contact(LastName = 'ConTest' + i);
            uList.add(con);
        }
        Test.stopTest();

        System.assertEquals(5000, uList.size());
    }
}