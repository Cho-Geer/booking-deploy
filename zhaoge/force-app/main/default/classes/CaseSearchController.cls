public with sharing class CaseSearchController {
    
    public Case cs{set;get;}
    public List<Case> caseLst{set;get;}

    public CaseSearchController() {
        this.cs = new Case();
        this.caseLst = new List<Case>();
    }

    // クリア
    public Pagereference clear(){
        this.cs = new Case();
        this.caseLst = new List<Case>();
        return null;
    }

    // 検索
    public Pagereference Search(){
        try{
            // 検証
            if(String.isBlank(cs.Subject) && String.isBlank(cs.Status) && String.isBlank(cs.Priority)){
                ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.WARNING,'条件を選択してください！'));
                return null;
            }

            // SOQLのquery文字列
            String query = 'Select Subject,ContactId,Status,Priority from Case where CaseNumber != null ';

            // 件名
            String strSubject;
            if(!String.isBlank(cs.Subject)){
                strSubject = '%' + cs.Subject + '%';
                query = query + 'And Subject Like ' + '\'' + String.escapeSingleQuotes(strSubject) + '\'';
            }

            // 状況
            String strStatus;
            if(!String.isBlank(cs.Status)){
                strStatus = '%' + cs.Status + '%';
                query = query + ' And Status Like ' + '\''+ String.escapeSingleQuotes(strStatus) + '\''; 
            }

            // 優先度
            String strPriority;
            if(!String.isBlank(cs.Priority)){
                strPriority = '%' + cs.Priority + '%';
                query = query + ' And Priority Like ' + '\'' + String.escapeSingleQuotes(strPriority) + '\'';
            }

            // 実行
            System.debug('query：' + query);
            caseLst = Database.query(query);
            System.debug('件数：' + caseLst.size());
        }catch(Exception e){
            ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,e.getMessage()));
        }
        return null;
    }
}