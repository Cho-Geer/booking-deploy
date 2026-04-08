public with sharing class Test001{
	String changeType{ set; get; }

	@AuraEnabled(cacheable = true)
	public static String methodName(String changeType){
		try{

		} catch (Exception e){
			throw new AuraHandledException(e.getMessage());
		}
		return changeType;
	}
}