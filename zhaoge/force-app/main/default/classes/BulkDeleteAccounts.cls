public with sharing class BulkDeleteAccounts {

    ApexPages.StandardSetController setCon;

    public BulkDeleteAccounts(ApexPages.StandardSetController controller) {
        setCon = controller;
    }

    public String getMySelectedSize(){
        return setCon.getSelected().size() + '';
    }

    public PageReference deleteRecords(){
        delete setCon.getSelected();
        return setCon.cancel();
    }
}