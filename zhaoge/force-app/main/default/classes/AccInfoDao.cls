public with sharing class AccInfoDao {
    public AccInfoDao() {}

    // ユーザ別に該当取引先リストを取得
    public static List<Account> getAccountsByUserId(ID userId){
        try{
            return [Select Id, Name, RecordTypeId From Account Where RecordTypeId <> null And OwnerId = :userId];
        }catch(Exception e){
            throw e;
        }
    }

    // ユーザ別、かつ特定文字列を含む取引先リストを取得
    public static List<Account> getAccountsByUserIdAndKeywords(ID userId, String searchText){
        try {
            List<Account> accounts = new List<Account>();
            String query = 'Select Id, Name, RecordTypeId From Account Where RecordTypeId <> null And ';
            query += 'OwnerId = ' + '\'' + userId + '\'';
            query += ' And Name Like ' + '\'' + '%' + searchText + '%' + '\'';
            accounts = Database.query(query);
            return accounts;
        } catch(Exception e) {
            throw e;
        }
    }
}