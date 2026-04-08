/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 05-08-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class LoginTestCtrl {
    public String firstName {get;set;}
    public String lastName {get;set;}
    public String email {get;set;}

    public id intiWin(){
        String recordId = UserInfo.getUserId();
        return [Select Id, Name From User Where Id = :recordId].Id; 
    }

    @RemoteAction
    public static PageReference registerUser(String firstName, String lastName, String email){
        System.debug(firstName + ' ' + lastName + ' ' + email);
        return null;
    }
}