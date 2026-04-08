public with sharing class ChildRemoteController {

    @RemoteAction
    public static String sayHello(String helloTo){
        return 'Hello ' + helloTo + ' from the Grandparent.';
    }

    @RemoteAction
    public static List<SObject> queryData(String query){
        return Database.query(query);
    }

    @RemoteAction
    public static String goodbye(){
        return '';
    }
}