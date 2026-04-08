@RestResource(urlMapping='/RsGetUserAuthInfo')
global with sharing class RsGetUserAuthInfo {
    @HttpPost
    global static String getUserAuthInfo(String userId){
        RestRequest req = RestContext.request;
        RestResponse resp = RestContext.response;
        AuthUserInfo result = new AuthUserInfo();
        result.resultCd = '0000';
        result.ErrorContents_abc = 'sasa';
        System.debug(RsGetUserAuthInfo.AuthUserInfo.class);
        JSONGenerator gen = JSON.createGenerator(false);
        gen.writeStartObject();
        gen.writeStringField('ErrorContents__c', result.ErrorContents_abc);
        gen.writeStringField('resultCd', result.resultCd);
        gen.writeEndObject();
        // resp.responseBody = Blob.valueOf(gen.getAsString());
        // resp.responseBody = Blob.valueOf(JSON.serialize(result));
        return gen.getAsString();
    }

    global class AuthUserInfo{
        private String resultCd {get; set;}
        private String ErrorContents_abc {get; set;}
    }
}