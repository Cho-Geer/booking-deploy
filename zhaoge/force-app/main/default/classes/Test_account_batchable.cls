@isTest
public class Test_account_batchable {

    @isTest static void testBatchable(){
        List<Account> accs = [Select Name From Account Where Name Like 'Test_account_batchable__%'];
        
        Test.startTest();
        Account_batchable ab = new Account_batchable();
        Id batchId = Database.executeBatch(ab, 200);
        Test.stopTest();
        
        List<Account> accRes = [Select Name From Account Where Name Like '%_ACC_'];
        System.assertEquals(200, accRes.size());
    }
    
    @testSetup static void testDataSetup(){
        List<Account> accounts = new List<Account>();
        for(Integer i = 0; i < 10; i++){
            accounts.add(new Account(Name = 'Test_account_batchable__' + i, Heroku_Connect__c = String.valueOf(i)));
        }
        insert accounts;
    }
}