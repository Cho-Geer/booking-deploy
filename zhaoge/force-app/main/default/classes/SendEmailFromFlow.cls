public with sharing class SendEmailFromFlow {
    
    @InvocableMethod(label='メール送信' description = 'aa')
    public static List<String> sendMail(List<String> ids){
        System.debug('-------------処理開始①-----------------');
        System.debug(ids);
        List<String> results = new List<String>();
        List<Messaging.SingleEmailMessage> mslst = new List<Messaging.SingleEmailMessage>();
        List<Messaging.SendEmailResult> msResults = new List<Messaging.SendEmailResult>();
        Map<String, List<String>> caseContentDocumentIds = new Map<String, List<String>>();
        Map<String, List<ContentVersion>> caseContentVersions = new Map<String, List<ContentVersion>>();
        Map<String, CaseDetail__c> caseMap = new Map<String, CaseDetail__c>();
        Integer n = 0;
        try {
            caseMap.putAll([Select Id, CaseId__c From CaseDetail__c Where Id IN :ids]);
            System.debug('-------------処理開始②-----------------');
            System.debug(caseMap);
            // ContentVersionとContentDocumentLink
            // ' List<ContentDocumentLink> cdl = [Select ContentDocumentId, LinkedEntityId From ContentDocumentLink Where LinkedEntityId IN :ids];
            // ' System.debug('cdl: ' + cdl);
            // ' if (!cdl.isEmpty()) {
            // '     for (ContentDocumentLink va : cdl) {
            // '         if (caseContentDocumentIds.containsKey(va.LinkedEntityId)) {
            // '             caseContentDocumentIds.get(va.LinkedEntityId).add(va.ContentDocumentId);
            // '         }else {
            // '             caseContentDocumentIds.put(va.LinkedEntityId, new List<String>{va.ContentDocumentId});
            // '         }
            // '     }
            // '     List<String> documentIds = new List<String>();
            // '     for(List<String> contentIds : caseContentDocumentIds.values()){
            // '         documentIds.addAll(contentIds);
            // '     }
            // '     List<ContentVersion> cvsns = [Select Title, FileType, VersionData, PathOnClient, ContentDocumentId From ContentVersion Where ContentDocumentId IN : documentIds];
            // '     for (String caseId : caseContentDocumentIds.keySet()) {
            // '         caseContentVersions.put(caseId, new List<ContentVersion>());
            // '         for (String documentId : caseContentDocumentIds.get(caseId)) {
            // '             for (ContentVersion version : cvsns) {
            // '                 if (documentId.equals(version.ContentDocumentId)) {
            // '                     caseContentVersions.get(caseId).add(version);
            // '                 }
            // '             }
            // '         }
            // '     }
                
            // ' }

            // ' System.debug('caseContentDocumentIds: ' + caseContentDocumentIds);
            // ' System.debug('caseContentVersions: ' + caseContentVersions);
            for (String id : ids) {
                Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                mail.setSubject('salesforce メール送信テスト');
                mail.setPlainTextBody('bbb');
                mail.setToAddresses(new List<String>{'zhaoge.tzx@gmail.com'});
                mail.setWhatId(caseMap.get(id).CaseId__c);
                // mail.setSaveAsActivity(true);
                List<String> versionIds = new List<String>();
                // for (ContentVersion var : caseContentVersions.get(id)) {
                //    versionIds.add(var.Id);
                //     mail.setEntityAttachments(versionIds);
                // }
                n++;
                mslst.add(mail);
            }
            if (!mslst.isEmpty()) {
                msResults = Messaging.sendEmail(mslst, false);
            }
            System.debug('------------メール送信結果---------------');
            System.debug(msResults);
            
        } catch (Exception e) {
            System.debug('------------error------------------');
            System.debug(e.getMessage());
            System.debug(e.getLineNumber());
            results.add('失敗');
        }
        for (Messaging.SendEmailResult msr : msResults) {
            if (msr.isSuccess()) {
                results.add('成功');
            }else {
                results.add('失敗');
            }
        }
        System.debug('-------------結果----------------');
        System.debug(results);
        return results;
    }
}