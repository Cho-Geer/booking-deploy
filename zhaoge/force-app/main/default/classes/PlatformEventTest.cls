@isTest
public class PlatformEventTest {
    @isTest static void test(){
        Cloud_News__e newsEvent = new Cloud_News__e(
            Location__c='Mountain City',
            Urgent__c=true,
            News_Content__c='Test message.'
        );

        Test.startTest();
        System.debug('Start：' + [select Id from Case]);
        Database.SaveResult sr = EventBus.publish(newsEvent);
        System.debug('Stop：' + sr.isSuccess());
        System.debug('Stop：' + [select Id from Case]);
        Test.stopTest();

        system.assertEquals(true,sr.isSuccess());

        List<Case> cases = [Select Id from Case];
        System.debug('テスト中のケース結果：' + [select Id from Case]);
        System.assertEquals(1,cases.size());
    }
}