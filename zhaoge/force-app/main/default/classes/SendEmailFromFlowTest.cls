@isTest
private class SendEmailFromFlowTest {
    @isTest
    static void testSendEmailFailure() {
        // 创建测试数据
        Case testCase = new Case(
            Subject = 'Test Case',
            Common_Test__c = 'sew', 
            OUT_Test__c = 'qds');
        insert testCase;

        Test.startTest();
        // 设置模拟的邮件发送结果
        Test.setMock(HttpCalloutMock.class, new EmailMock(false));
        
        // 调用被测试的方法
        List<String> sendResults = SendEmailFromFlow.sendMail(new List<String>{testCase.Id});
        Test.stopTest();

        // 验证结果
        System.assertEquals(1, sendResults.size(), 'Should have one result');
        System.assertEquals('失敗', sendResults[0], 'Should return failure status');
    }

    // 模拟Messaging.sendEmail方法的实现
    public class EmailMock implements HttpCalloutMock {
        private Boolean isSuccess;

        public EmailMock(Boolean isSuccess) {
            this.isSuccess = isSuccess;
        }

        public HTTPResponse respond(HTTPRequest req) {
            System.debug('-----HTTPrequest start------');
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            if (isSuccess) {
                res.setBody('{"success":true}');
            } else {
                res.setBody('{"success":false,"errors":[{"message":"Test error message","statusCode":"INVALID_EMAIL_ADDRESS"}]}');
            }
            res.setStatusCode(200);
            return res;
        }
    }
}