@IsTest
public with sharing class DataFormatterTest {
    @IsTest
    public static void testGetFormattedDate(){
        DataHelper helper = (DataHelper)MockUtil.createMock(DataHelper.class);
        DataFormatter df = new DataFormatter();
        
        System.assertEquals('Today\'s date is 8/8/2016', df.getFormattedDate(helper));
    }

    @IsTest
    public static void test2() {
        DataHelper helper = (DataHelper)MockUtil.createMock(DataHelper.class);
        DataFormatter df = new DataFormatter();
        
        System.assertEquals('Today\'s date is 8/8/2016', df.getFormattedDate(new DataHelper()));
    }
}