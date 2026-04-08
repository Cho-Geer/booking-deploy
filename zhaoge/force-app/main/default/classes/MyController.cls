public with sharing class MyController {

    private final Account account;
    // private String aa;
    public MyController() {
        if(account != null)
            account = [select Name from Account Where Id = :ApexPages.currentPage().getParameters().get('id')];
        else account = new Account();
    }

    // public void setAccount(String s){
    //     account.Name = s;
    // }
    // public String getaa(){
    //     return aa;
    // }

    public Account getAccount(){
        return account;
    }

    public Pagereference save(){
        try {
            update account;
            return null;
        } catch (DmlException e) {
            ApexPages.addMessages(e);
            return null;
        }
    }
}