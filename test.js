var timeStart = new Date("Mon Jan 01 2007 11:00:00 GMT+0530").getTime();
var timeEnd = new Date("Mon Jan 01 2007 11:30:00 GMT+0530").getTime();
var hourDiff = timeEnd - timeStart; //in ms
var secDiff = hourDiff / 1000; //in s
var minDiff = hourDiff / 60 / 1000; //in minutes
var hDiff = hourDiff / 3600 / 1000; //in hours
var humanReadable = {};
humanReadable.hours = Math.floor(hDiff);
humanReadable.minutes = minDiff - 60 * humanReadable.hours;
console.log(humanReadable); //{hours: 0, minutes: 30}

/*var today = new Date();
var Christmas = new Date("12-25-2012");
var diffMs = (Christmas - today); // milliseconds between now & Christmas
var diffDays = Math.floor(diffMs / 86400000); // days
var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
var diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000); // minutes
console.log(diffDays + " days, " + diffHrs + " hours, " + diffMins + " minutes until Christmas 2009 =)");
*/