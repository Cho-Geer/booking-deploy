trigger OrderEventTrigger on Order_Event__e (after insert) {

    List<Task> tks = new List<Task>();

    for(Order_Event__e event : trigger.New){
        if(event.Has_Shipped__c == true){
            Task tk = new Task();
            tk.Priority = 'Medium';
            tk.Subject = 'Follow up on shipped order ' + event.Order_Number__c;
            tk.OwnerId = event.CreatedById;
            tks.add(tk);
        }
    }
    insert tks;
}