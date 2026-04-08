public with sharing class ContactsListWithController {

    private final Contact contact;

    private String sortOrder = 'LastName';

    public ContactsListWithController(ApexPages.StandardsetController controller){
        contact = (Contact)controller.getRecord();
    }

    public Apexpages.StandardSetController contactRecords{set;get{
        if(contactRecords == null){
            contactRecords = new ApexPages.StandardSetController(Database.getQueryLocator('Select Id, FirstName, LastName, Phone From Contact '+
        'Order By '+sortOrder+' ASC Limit 1000'));
        }
        return contactRecords;
    }}

    
    // public Apexpages.StandardSetController getcontacts(){ 
    //     // return Database.query('Select Id, FirstName, LastName, Phone From Contact '+
    //     // 'Order By '+ sortOrder +' ASC '+'Limit 1000');
    //     return contactRecords;
    // }

    public void sortByFirstName(){
        sortOrder = 'FirstName';
    }

    public void sortByLastName(){
        sortOrder = 'LastName';
    }

    public String str{set;get;}
    private String txt;
    public String strView{set;get;}
    public List<SelectOption> strviews{set;get{
        List<SelectOption> lst = new List<SelectOption>();
        lst.add(new SelectOption('AA','AA'));
        lst.add(new SelectOption('BB','BB'));
        lst.add(new SelectOption('CC','CC'));
        return lst;
    }}
    // private String outputText;
    
    // public String gettext(){
    //     return text;
    // }
    // public void settext(String s){
    //         text = s;
    // }
    // public String getoutputText(){
    //     return 'sehe';
    // }
    // // public void setoutputText(String s){
    // //     outputText = s;
    // }
    
    Transient public String text{get;set;}

    public String outputText{get;set;}

    public void doOut(){
        outputText = text;
    }

}