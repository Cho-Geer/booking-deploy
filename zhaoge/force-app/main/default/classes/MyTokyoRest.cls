@RestResource(urlMapping='/tokyoObjects/*')
global with sharing class MyTokyoRest {
	
    // use to response 
    global class ResponseMessage{
        String functionId{get { return  ConstantManager.MYTOKYOREST_FUNCTION_ID;}}
        String statusCd{get;set;}
        Map<String, List<String>> messages{get;set;}
    }
    /*  
     * do post method
     */
    @HttpPost
    global static ResponseMessage doPost33(Integer count, List<Sobject> userList) {
      // 処理開始日時
      DateTime executedDateTime = DateTime.now();
	  // response object instance
      ResponseMessage result = new ResponseMessage();
      result.messages = new Map<string, List<string>>();
      // if empty return error
      if(userList.isEmpty()){
        result.statusCd = '4001';
        result.messages.put('業務エラー', null);
        return result;
      }

      // get userMap by soql at first
      Map<Id,User> firstUserMap = MyTokyoUserDao.getUserMapByUsernameList(userList, 'name');

      // ログ登録用パラメータのインスタンス
      Map<User, Database.Error> sobErrMap = new Map<User, Database.Error>();

      RestRequest req = RestContext.request;
      RestResponse res = RestContext.response;
      res.addHeader('Content-Type', 'application/json;charset=utf-8');

      // change request parameter to map
      Map<String, Boolean> requestUserMap = new Map<String, Boolean>();

      try {
        List<User> maybeUpdateList = new List<User>();
        for(User user : firstUserMap.values()){
          user.isPortalEnabled = true;
          maybeUpdateList.add(user);
        }

        // get userMap by soql before update
        Map<Id,User> executeUserMap = MyTokyoUserDao.getUserMapByUsernameList(maybeUpdateList, 'name');
            
        // 排他制御
        Map<Boolean , Map<Id , sobject>> exclusiveResultMap = ExclusiveControlUtil.getExculusiveFlag(firstUserMap, executeUserMap);

        // 一部は排他制御のためupdate対象から外す
        if(!exclusiveResultMap.containsKey(true)){
          result.statusCd = '5000';
          result.messages.put('排他制御', new List<Id>(firstUserMap.keySet()));
          return result;
        }else if(exclusiveResultMap.containsKey(true) && exclusiveResultMap.containsKey(false)){
          result.statusCd = '5000';
          result.messages.put('排他制御', new List<Id>(exclusiveResultMap.get(false).keySet()));
        }

        List<User> updateList = new List<User>();
        for(sObject user : exclusiveResultMap.get(true).values()){
            // 更新データを用意
          ((User)user).put('IsPortalEnabled', true);
          updateList.add((User)user);
        }
          
        // データベースに更新DML
        Database.SaveResult[] updateResult = Database.update(updateList, false);
            
        // 結果処理
        List<String> successIdList = new List<String>();
        List<String> faildIdList = new List<String>();
        for(Database.SaveResult ds: updateResult){
          if(ds.isSuccess()){
            successIdList.add(ds.getId());
          }else{
            result.statusCd = '0001';
            for(Database.Error err : ds.getErrors()) {
                faildIdList.add(ds.getId());
            }
              // ログ処理
       		  User u = MyTokyoUserDao.getUserMapByIdList(new List<Id>{ds.getId()}).get(ds.getId());
              sobErrMap.put(u, ds.getErrors()[0]);
          }
        }
        result.statusCd = result.statusCd == '5000' ?
           '5000' : result.statusCd == '0001' ? 
            '0001' : '0000';
        switch on result.statusCd {
          when '0001' {
            if(!successIdList.isEmpty())result.messages.put('成功部分', successIdList);            
            result.messages.put('失敗部分', faildIdList);
          }
          when else {
            result.messages.put('正常完了', successIdList);
          }
        }
        return result;
      } catch (Exception err) {
        // response処理
        result.statusCd = '9999';
        result.messages.put('システムエラー', null);
        return result;
      }
    }   
}