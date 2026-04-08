public with sharing class AccountSearchController {

    public String ant{set;get;}
    public List<Account> antLst{set;get;}

    public AccountSearchController() {
        this.ant = '';
        this.antLst = new List<Account>();
    }

    public Pagereference doSearch(){
        try{
            if(String.isBlank(this.ant)){
                ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.WARNING,'検索条件欄に入力してください！'));
                return null;
            }

            // クエリ
            String query = 'Select Name,Phone From Account';

            if(!String.isBlank(this.ant)){
                query = query + ' Where Name Like ' + '\'' + String.escapeSingleQuotes('%' + this.ant + '%') + '\'';
                System.debug('クエリ：' + query);
                this.antLst = Database.query(query);
            }
        }catch(Exception e){
            ApexPages.addMessage(New ApexPages.Message(ApexPages.Severity.ERROR,e.getMessage()));
            return null;
        }
        return Page.AccountSearchResultPage;
    }

    public Pagereference doPrevious(){
        return Page.AccountSearchPage;
    }
}