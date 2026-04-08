@RestResource(urlMapping='/jestrest')
global with sharing class AngularNestOne {
  @HttpPost
  global static void doPost(){
    RestRequest req = RestContext.request;
    RestResponse res = RestContext.response;

    String body = req.requestBody.toString();

    res.addHeader('Content-Type', 'application/json');
    res.responseBody = Blob.valueOf('Success!');
    res.statusCode = 200;
    return;
  }
}