trigger CloudNewsTrigger on Cloud_News__e (after insert) {
    List<Case> cases = new List<Case>();

    List<Group> queues = [select Id from Group];
	System.debug('queuesのサイズ：' + queues.size());
    for(Cloud_News__e event : Trigger.new){
        if(event.Urgent__c == true){
            System.debug('トリガが開始--');
            Case cs = new Case();
            cs.Priority = 'High';
            cs.Subject = 'News team dispatch to ' +
                event.Location__c;
            cs.OwnerId = queues[0].Id;
            cases.add(cs);
            System.debug('ケースのリスト中身：'+ cases);
        }
    }
    insert cases;
    System.debug('インサート後の結果：'+[Select Id from Case]);
}