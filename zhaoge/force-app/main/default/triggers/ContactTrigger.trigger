trigger ContactTrigger on Aobject__c (before insert, before update) {
    Id userId = UserInfo.getUserId();
    System.debug('userId: ' + userId);
    List<PermissionSetAssignment> permissionsets = [SELECT Assignee.Id, PermissionSet.Id, PermissionSet.isOwnedByProfile
    FROM PermissionSetAssignment
    WHERE PermissionSetId
    IN (SELECT ParentId
    FROM ObjectPermissions
    WHERE SObjectType = 'Aobject__c' AND PermissionsCreate = true) And Assignee.Id = :userId];

    if(Trigger.isInsert && Trigger.isBefore){
        System.debug(permissionsets);
        boolean permissionSetFlag = false;
        for(PermissionSetAssignment pstt : permissionsets){
            permissionSetFlag = true;
            break;
        }
        if(permissionSetFlag){
            for(Aobject__c ab: Trigger.new){
                ab.addError('PAC　作成できません。');
            }
        }
    }
    else if(Trigger.isUndelete && Trigger.isBefore){

    }
}