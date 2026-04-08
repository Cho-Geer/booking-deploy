public without sharing class Account_batchable implements Database.Batchable<sobject> {
    public Integer updateSize = 0; 
    public Database.QueryLocator start(Database.BatchableContext dbc){
    	return Database.getQueryLocator('Select Name From Account Limit 200');    
    }
    
    public void execute(Database.BatchableContext dbc, List<Account> accounts){
        List<Account> accs = new List<Account>();
        for(Account acc : accounts){
            acc.Name += '_ACC_';
            accs.add(acc);
        }
        update accs;
        updateSize = accs.size();
    }
    
    public void finish(Database.BatchableContext dbc){
        system.debug('batch finished: ' + updateSize);
    }
}