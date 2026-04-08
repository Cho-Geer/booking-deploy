trigger CaseTrigger on Case (before insert, after insert, before update, after update, before delete, after delete){
  // debug
  System.debug('new start: ');
  System.debug(Trigger.new);
  System.debug('new finish');

  // debug
  System.debug('old start: ');
  System.debug(Trigger.old);
  System.debug('old finish');
}