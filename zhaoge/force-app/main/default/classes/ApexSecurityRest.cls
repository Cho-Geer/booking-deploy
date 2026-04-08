@RestResource(urlMapping='/apexSecurityRest')
global with sharing class ApexSecurityRest {
    @HttpGet
    global static Contact doGet() {
        Id recordId = RestContext.request.params?.get('id');
        Contact result;
        List<Contact> results = [SELECT id, Name, Title, Top_Secret__c, Account.Name FROM Contact WHERE Id = :recordId];
        SObjectAccessDecision securityDecision = Security.stripInaccessible(AccessType.READABLE, results);
        if (!securityDecision.getRecords().isEmpty()) {
            result = results[0];
            SObjectAccessDecision decision = Security.stripInaccessible(AccessType.UPDATABLE, results);
            if(decision.getRemovedFields().values()[0].contains('Description')){
                result.Description = result.Account?.Name;
            }
        }
        return result;
    }
    public class FunctionalException extends Exception{}
    public class SecurityException extends Exception{}
}