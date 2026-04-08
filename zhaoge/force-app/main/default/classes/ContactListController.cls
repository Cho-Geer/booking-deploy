public with sharing class ContactListController {

    private String v1 = '11';

    transient String v2 = '22';

    public static String v3 = '33';

    public Contact condition{set;get;}
    public List<Contact> results{set;get;}

    public ContactListController() {
        this.condition = new Contact();
        this.results = new List<Contact>();
    }

    // リアルボタン処理
    public Pagereference clear(){
        this.condition = new Contact();
        this.results = new List<Contact>();
        return null;
    }

    // 検索ボタン処理
    public Pagereference search(){
        try{
            System.debug('condition:' + condition);

            // 入力チェック
            if(String.isBlank(condition.Email) && String.isBlank(condition.AccountId)){
                apexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'メールまたは取引先名のいずれかを入力してください。'));
            }

            String strSoqlQuery = 'Select Name,AccountId,Phone,Email From Contact Where Id != null';

            // メール
            String strEmail;
            if(!String.isBlank(condition.Email)){
                strEmail = '%' + condition.Email + '%';
                strSoqlQuery = strSoqlQuery + ' And Email like :strEmail';
            }

            // 取引先名
            String strName;
            if(!String.isBlank(condition.Name)){
                strName = '%' + condition.Name + '%';
                strSoqlQuery = strSoqlQuery + ' And Name Like :strName';
            }

            // 対象データを検索する
            System.debug('strSoqlQuery:' + strSoqlQuery);
            this.results = Database.query(strSoqlQuery);
        }catch(Exception e){
            ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,e.getMessage()));
        }
        return null;
    }
}