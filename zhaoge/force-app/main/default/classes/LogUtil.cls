/**
 * ログ保持
 */
public class LogUtil {

    public static void setLogs(
        String processResult, 
        String funcID, 
        DateTime funcCalledDateTime,
        String funcType,
        Map<sObject, Database.Error> sobErrMap){
          List<Log__c> logResults = new List<Log__c>();
          try{
            for(sObject sob: sobErrMap.keySet()){
              logResults.add(new Log__c(
                ProcessResult__c = processResult,
                IFName__c = (ConstantManager.FUNCTION_ID_NAME_MAPPER).get(funcID),
                IFCalledDateTime__c = funcCalledDateTime,
                IFType__c = funcType,
                Request__c = JSON.serialize(sob),
                Response__c = String.join(sobErrMap.get(sob).getFields(), ''),
                ErrorContents__c = sobErrMap.get(sob).getMessage()
                ));
            }
              update logResults;
          }catch(Exception err){
            System.debug('The following error has occurred.');                    
            System.debug(err.getMessage());
          }
    }
}