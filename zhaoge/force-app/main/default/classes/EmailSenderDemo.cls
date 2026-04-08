public class EmailSenderDemo {
    
    public static void sendEmailWithTemplate() {
        // 获取邮件模板
        EmailTemplate template = [SELECT Id, Subject, Body FROM EmailTemplate WHERE Name = 'classicメールテンプレートDemo1' LIMIT 1];
        
        // 创建单个邮件消息
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        
        // 设置收件人
        User u = [Select Id, Name, Email, CompanyName From User Where Id = :UserInfo.getUserId()];
        System.debug(u);
        // mail.setToAddresses(new List<String>{u.Email});
        mail.setTemplateId(template.Id);
        // 设置目标对象ID（如果模板中使用了合并字段）
        mail.setTargetObjectId('003J2000004eAuZIAU'); // 联系人或用户的ID
        mail.setSaveAsActivity(false);
        // 设置WhatId（如果模板中使用了相关对象的合并字段）
        mail.setWhatId('0015h00001PZolXAAT'); // 例如，机会的ID

        User u1 = [Select Id, Name, Email, CompanyName From User Where Username = 'insightssecurity@00d5h000000hdr9eak.com'];
        System.debug(u1);
        Messaging.SingleEmailMessage mail1 = new Messaging.SingleEmailMessage();
        // mail1.setToAddresses(new List<String>{u1.Email});
        mail1.setTemplateId(template.Id);
        mail1.setTargetObjectId('003J2000007Y23FIAS');
        mail1.setWhatId('0015h00000LOdjNAAT');
        mail1.setSaveAsActivity(false);
        // 发送邮件
        try {
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail, mail1});
            System.debug('邮件发送成功');
        } catch (Exception e) {
            System.debug('邮件发送失败: ' + e.getMessage());
        }
    }
}