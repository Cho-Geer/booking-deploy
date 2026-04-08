public with sharing class AccountListBox {
    private static ID userId = System.UserInfo.getUserId();
    public AccountListBox() {}

    @AuraEnabled(cacheable=true)
    public static List<AccountBean> getAccountsWithRecordType(){
        // 当ユーザのaccountリスト格納先
        List<AccountBean> accs = new List<AccountBean>(); 
        try {
            // 当ユーザのレコードリストを取得する
            for(Account account: AccInfoDao.getAccountsByUserId(userId)){
                AccountBean acc = new AccountBean();
                acc.accountId = account.Id;
                acc.accountName = account.Name;
                acc.accountRecordTypeId = account.RecordTypeId;

                // レコードタイプのlabelを取得
                Schema.DescribeSObjectResult sr = Schema.SObjectType.Account;
                acc.accountRecordTypeLabel = sr.getRecordTypeInfosById().get(account.RecordTypeId).getName();
                accs.add(acc);
            }
            return accs;
        } catch (Exception e) {
            throw new MyException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<AccountBean> getAccountsWithRecordTypeAndKeywords(String searchText){
        try {
            List<AccountBean> accounts = new List<AccountBean>();
            for(Account account: AccInfoDao.getAccountsByUserIdAndKeywords(userId, searchText)){
                AccountBean acc = new AccountBean();
                acc.accountId = account.Id;
                acc.accountName = account.Name;
                acc.accountRecordTypeId = account.RecordTypeId;

                // レコードタイプのlabelを取得
                Schema.DescribeSObjectResult sr = Schema.SObjectType.Account;
                acc.accountRecordTypeLabel = sr.getRecordTypeInfosById().get(account.RecordTypeId).getName();
                accounts.add(acc);
            }
            return accounts;
        } catch (Exception e) {
            throw new MyException(e.getMessage());
        }
    }

    public class MyException extends Exception {}
}