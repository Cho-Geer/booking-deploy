public class MyTokyoUserDao {
    public static Map<Id, User> getUserMapByUsernameList(List<User> userList, String field){
        List<String> usernameList = new List<String>();
        for(User user: userList){
            usernameList.add((String)user.get(field));
        }
        return new Map<Id, User>(
            [Select Username, IsPortalEnabled, LastModifiedDate  From User Where Username in :usernameList]
        );
    }
    
    public static Map<Id, User> getUserMapByIdList(List<Id> idList){
        return new Map<Id, User>(
            [Select UserName, IsPortalEnabled, LastModifiedDate From User Where Id in :idList]
        );
    } 
}