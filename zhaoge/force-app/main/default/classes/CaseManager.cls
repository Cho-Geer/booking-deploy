@RestResource(urlMapping='/Cases/v1/*')
global with sharing class CaseManager {

    @HttpGet
    global static List<Case> getCaseById(){
        RestRequest request = RestContext.request;
        String caseId = request.params.get('id');
        List<Case> cases = Database.query('Select Subject From Case Where Id = ' + caseId);
        // SObjectAccessDecision securityDecision = Security.stripInaccessible(AccessType.READABLE,cases);
        // return securityDecision.getRecords();
        return cases;
    }

    @HttpPost
    global static Id createCase(String subject, String status, String origin, String priority){
        List<Case> cases = New List<Case>{
            new Case(
                Subject = subject,
                Status = status,
                Origin = origin,
                Priority = priority)
        };

        SObjectAccessDecision securityDecision = Security.stripInaccessible(AccessType.CREATABLE,cases);
        insert securityDecision.getRecords();
        return securityDecision.getRecords()[0].Id;
    }

    @HttpDelete
    global static Id deleteCase(){
        RestRequest request = RestContext.request;
        String caseId = request.params.get('id');
        List<Case> cases = Database.query('Select Id From Case Where Id = ' + caseId);
        SObjectAccessDecision securityDecision = Security.stripInaccessible(AccessType.UPDATABLE, cases);
        delete securityDecision.getRecords();
        return securityDecision.getRecords()[0].Id;
    }

    @HttpPut
    global static List<Case> pusertCases(String id){
        SObjectAccessDecision securityDecision = Security.stripInaccessible(AccessType.UPSERTABLE, Database.query(
            'Select Id From Case Where Id = ' + id 
        ));

        upsert securityDecision.getRecords();
        return securityDecision.getRecords();
    }
}