/**
 * 排他制御
 */
public class ExclusiveControlUtil {
    
    public static Map<Boolean,Map<Id,sObject>> getExculusiveFlag(Map<Id,sObject> firstMap, Map<Id,sObject> willexecuteMap){
        Map<Boolean,Map<Id,sObject>> resultMap = new Map<Boolean,Map<Id,sObject>>();
        // equals
        if(firstMap.equals(willexecuteMap)){
            resultMap.put(true,firstMap);
        	return resultMap;
        }else{
            Map<Id , sObject> sameMap = new Map<Id , sObject>();
            Map<Id , sObject> diffMap = new Map<Id , sobject>();
            for(sObject user : firstMap.values()){
                if(willexecuteMap.containsKey(user.id) && 
					((DateTime)willexecuteMap.get(user.id).get('LastModifiedDate')).isSameDay((DateTime)(user.get('LastModifiedDate'))))
                	sameMap.put(user.id, user);
                else 
					diffMap.put(user.id, user);
            }
            if(!sameMap.isEmpty())resultMap.put(true, sameMap);
            if(!diffMap.isEmpty())resultMap.put(false, diffMap);
            return resultMap;
        }
    }
}