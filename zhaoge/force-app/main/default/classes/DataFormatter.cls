public with sharing class DataFormatter {
    public String getFormattedDate(DataHelper helper) {
        return 'Today\'s date is ' + helper.getTodaysDate();
    }
}