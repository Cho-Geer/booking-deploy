public with sharing class MyTokyoRestCallout {
    public String getTokyoRestuser(Integer count, List<Sobject> userList) {
        Http htp = new Http();

        HttpRequest req = new HttpRequest();
        
        try {
        req.setEndpoint('https://bannkocom-dev-ed.my.salesforce.com/services/apexrest/tokyoObjects');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        ReqBodyWrapper reqbody = new ReqBodyWrapper();
        reqbody.count = count;
        reqbody.userList = userList;
        req.setBody(JSON.serialize(reqbody));
            HttpResponse resp = htp.send(req);
            system.debug(resp.getBody());
            return resp.getBody();    
        } catch (Exception e) {
            system.debug(e.getMessage());
            system.debug(e.getStackTraceString());
            return e.getMessage();
        }
        
    }

    public class ReqBodyWrapper{
        private Integer count{set;get;}
        private List<User> userList{set;get;}
    }
}