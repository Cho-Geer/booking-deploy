@RestResource(urlMapping='/RestApiAccountTest')
global with sharing class RestApiAccountTest {
    global class BodyWrapper{
        String id{get; set;}
        String name{get; set;}
    }

    @HttpPost
    global static BodyWrapper postTest(String name, String id, String wbee) {
        System.debug('HttpPost　Start**');
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;

        for(String a : res.headers.keyset()){
            System.debug('res header key: ' + a);
        }
        
        // System.debug(htt.getHeader('Authorization'));
        System.debug(req.headers.containsKey('Authorization'));
        // for(String a : req.headers.keyset()){
        //     System.debug('req header key: ' + a);
        // }
        
        // for(String a : req.headers.values()){
        //     System.debug('req header value: ' + a);
        // }
        Map<String, String> token = new Map<String, String>();
        System.debug(name + ' ' + id + ' ' + wbee);
        BodyWrapper resp = new BodyWrapper();
        resp.id = 'aaa';
        resp.name = 'bbb';  
        return resp;
    }

    @HttpGet
    global static String getTest(){
        System.debug('HttpGet Start**');
        RestRequest req = RestContext.request;
        RestResponse res = RestContext.response;

        System.debug(req);
        System.debug(res);
        return 'HttpGet End';
    }
}