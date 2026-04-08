@isTest
private class Test_account_sample_one {

    @isTest static void testStart(){
        List<Account> accounts = [Select Name From Account Where Name Like 'Test_account_sample_one%'];
        List<Id> accountIds = new List<Id>();
        for(Account acc : accounts){
            accountIds.add(acc.Id);
        }
        
        Test.startTest();
        Account_sample_one.updateAccounts(accountIds);
        Test.stopTest();
        
        for(Account acc : [Select Name From Account Where Name Like 'Test_account_sample_one%']){
            system.debug(acc);
        	boolean result = acc.Name.contains('_ACC_');
            system.assertEquals(result, true);
        }
    }
    
    @testSetup static void setupTest(){
        List<Account> accounts = new List<Account>();
        for(Integer i = 0; i < 10; i++){
            accounts.add(new Account(Name = 'Test_account_sample_one__' + i, Heroku_Connect__c = String.valueOf(i)));
        }
        insert accounts;
    }
}