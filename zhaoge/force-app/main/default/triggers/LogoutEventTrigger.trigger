trigger LogoutEventTrigger on LogoutEventStream (after insert) {
  // debug
  System.debug('Trigger.new start: ');
  System.debug(trigger.new);
  System.debug('Trigger.new finish: ');

  // debug
  System.debug('Trigger.old start: ');
  System.debug(trigger.old);
  System.debug('Trigger.old finish: ');
}