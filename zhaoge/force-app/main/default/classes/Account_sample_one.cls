public without sharing class Account_sample_one {

    @future
    public static void updateAccounts(List<Id> accountIds){
        List<Account> accounts = [Select Id, Name From Account Where Id In :accountIds];
        for(Account acc : accounts){
            acc.Name += '_ACC_';
        }
        
        update accounts;
    }
}