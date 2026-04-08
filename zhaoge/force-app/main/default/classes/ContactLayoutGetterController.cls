public with sharing class ContactLayoutGetterController {

    private final Contact con;
    public String layoutName{get;set;}
    public String theLayoutId{get;set;}
    public String theRecordTypeId{get{return con.RecordTypeId;}set;}

    public ContactLayoutGetterController(Apexpages.StandardController controller) {
        this.con = (Contact)controller.getRecord();
    }

    public void getLayoutName(){

    }

}