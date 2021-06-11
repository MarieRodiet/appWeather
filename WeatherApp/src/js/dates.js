// returns a JS date object based on a unix timestamp and the timezone offset
export function getDate(unixTimestamp, timezoneOffset) {
    return new Date((unixTimestamp - timezoneOffset) * 1000);
}

export function getWeekday(date) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    //getDay(); returns the day of the week from 0 to 6 (0 being Sunday)
    const weekday = date.getDay();
    return dayNames[weekday];
}

export function getShortDate(date) {
    //month is index 0 based
    const month = (1 + date.getMonth()).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return month + "/" + day + "/" + year;
}
